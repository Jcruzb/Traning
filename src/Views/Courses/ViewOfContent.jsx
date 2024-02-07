import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useState, useEffect } from 'react';
import { Box, Card } from '@mui/material';
import CourseTest from '../../Components/CourseTest/CourseTest';
import { updateProgress, updateTest } from '../../Services/UsersService';
import { useAuthContext } from '../../Contexts/AuthContext';
import CorrectAnswers from '../../Components/CourseTest/CorrectAnswers';
import ErrorBoundary from '../../Components/ErrorBoundary/ErrorBoundary';
import TextFormatToShowInCourseContent from '../../Components/TextFormat/TextFormatToShowInCourseContent';


const ViewOfContent = ({ content, test, courseId }) => {
    const [page, setPage] = useState(1);
    const [contentArray, setContentArray] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [testResult, setTestResult] = useState();
    const { user: currentUser } = useAuthContext();
    const [progress, setProgress] = useState({
        courseId: courseId,
        courseLength: 0,
        courseProgress: 0,
        courseProgressPercent: 0

    });

    const handleChange = (event, value) => {
        const currentProgress = currentUser.courses.find((course) => course.course.id === courseId)?.progress.courseProgress;
    
        setProgress((prev) => ({
            ...prev,
            courseProgress:
                currentProgress > value ? currentProgress : value,
            courseProgressPercent: Number(((currentProgress / prev.courseLength) * 100).toFixed(2)),
        }));
    
        updateProgress(currentUser.id, {
            courseId: courseId,
            courseProgress: currentProgress > value ? currentProgress : value,
            courseProgressPercent: Number(((currentProgress / progress.courseLength) * 100).toFixed(2)),
        }).then(() => {
            setPage(value);
        }).catch((error) => {
            console.log(error);
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const newArray = [];
                content?.forEach((contentItem) => {
                    const matchingTest = test.find((testItem) => contentItem.title === testItem.title);
                    if (matchingTest) {
                        newArray.push(contentItem);
                        newArray.push(matchingTest);
                    } else {
                        newArray.push(contentItem);
                    }
                });
    
                if (newArray.length > 0) {
                    setContentArray(newArray);
    
                    // Update progress only if it hasn't been set yet
                    if (progress.courseLength === 0) {
                        setProgress((prev) => ({
                            ...prev,
                            courseLength: newArray.length,
                        }));
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchData();
    }, [content, test, progress.courseLength]);
    

    const handleToggle = (questionId, optionId) => () => {

        setSelectedOptions((prevSelected) => ({
            ...prevSelected,
            [questionId]: optionId,
        }));
        result();

    };


    const result = () => {
        let total = 0;
        contentArray[page - 1].questions.forEach((question) => {
            const matchingOption = question.options.find((option) => option._id === selectedOptions[question._id]);
            if (matchingOption) {
                if (matchingOption.isCorrect) {
                    total += 1;
                }
            }
        });
        setTestResult(total);

    }

    const handleTestSubmit = (event) => {
        event.preventDefault();
        result();
        const body = {
            id: courseId,
            testsResults: {
                courseId: courseId,
                testId: contentArray[page - 1]._id,
                responses: Object.entries(selectedOptions).map(([question, response]) => ({
                    question,
                    response
                })),
                score: testResult
            }
        };

        updateTest(currentUser.id, body).then((data) => {
            console.log(data);
            window.location.reload();
        }
        ).catch((error) => {
            console.log(error);
        });
    };

    const existingTest = (testEvaluate) => {
        for (const course of currentUser.courses) {
            for (const test of course.testsResults) {
                if (test.testId === testEvaluate._id) {
                    return true;
                }
            }
        }
        return false;
    };

    const findScore = (testEvaluate) => {
        for (const course of currentUser.courses) {
            for (const test of course.testsResults) {
                if (test.testId === testEvaluate._id) {
                    return `${(test.score / test.responses.length * 100).toFixed(1)}%`;
                }
            }
        }
        return false;
    }

    if (!contentArray || contentArray.length === 0) {
        return (
            <div>
                <h1>No hay contenido o está cargando</h1>
                <p>Si el problema persiste contacte con su administrador</p>
            </div>
        );
    } else {
        return (
            <Stack spacing={2}>
                <Box>
                    {contentArray[page - 1].questions ? (

                        existingTest(contentArray[page - 1]) ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginY: 2 }}>
                                <Typography variant='h5'>Ya has realizado este test</Typography>
                                <Typography variant='body'>Tu puntuación fue de: {findScore(contentArray[page - 1])}</Typography>
                                <Typography variant='body2'>a continuación se muestran las respuestas</Typography>
                                <Box>
                                    <ErrorBoundary>
                                        <CorrectAnswers
                                            questions={contentArray[page - 1].questions}
                                        />
                                    </ErrorBoundary>
                                </Box>
                            </Box>

                        ) : (
                            <CourseTest
                                contentArray={contentArray}
                                page={page}
                                handleToggle={handleToggle}
                                selectedOptions={selectedOptions}
                                handleTestSubmit={handleTestSubmit}
                            />
                        )) : (
                        <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginY: 2 }}>
                            <Typography>{contentArray[page - 1].title}</Typography>
                            <Box sx={{height:'100vh', marginY: 2, display:'flex', justifyContent:'center'}}>
                            {/* no distorcionar la imágen */}
                                <img src={contentArray[page - 1].image} alt={contentArray[page - 1].title} style={{maxHeight:'45%', maxWidth:'45%'}} />
                            
                            <TextFormatToShowInCourseContent htmlContent={contentArray[page - 1].description} />
                            </Box>
                        </Card>
                    )}
                </Box>
                <Pagination count={contentArray.length} page={page} onChange={handleChange} />
            </Stack>
        );
    }
}

export default ViewOfContent;
