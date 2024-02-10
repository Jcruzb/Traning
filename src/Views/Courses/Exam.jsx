import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getCourseDetail } from "../../Services/CoursesService";
import {
    Avatar,
    Box,
    Button,
    Checkbox,
    Divider,
    List,
    Typography,
} from "@mui/material";
import { useAuthContext } from "../../Contexts/AuthContext";
import { updateExam } from "../../Services/UsersService";
import CorrectAnswers from "../../Components/CourseTest/CorrectAnswers";

const Exam = () => {
    const { id } = useParams();
    const [course, setCourse] = useState({});
    const [exam, setExam] = useState({});
    const [answers, setAnswers] = useState([]);

    const { user } = useAuthContext();

    useEffect(() => {
        getCourseDetail(id)
            .then((response) => {
                setCourse(response);
                setExam(response.Exam);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]);

    const handleAnswer = (e, option) => {
        const { name, value } = e.target;
        const answer = { questionId: name, optionId: value, isCorrect: option.isCorrect };
        const newAnswers = [...answers];

        const existingAnswerIndex = newAnswers.findIndex(ans => ans.questionId === name);

        if (existingAnswerIndex !== -1) {
            newAnswers[existingAnswerIndex] = answer;
        } else {
            newAnswers.push(answer);
        }

        setAnswers(newAnswers);
    };

    console.log(answers);

    const prepareExamResults = (questions, selectedAnswers) => {
        const score = answers.filter(answer => answer.isCorrect).length;
        const result = calculateScore(score, questions);
        return {
            responses: selectedAnswers,
            score,
            result
        };

    };

    const calculateScore = (score, questions) => {
        if (score > questions.length / 2) {
            return 'Aprobado';
        } else {
            return 'Reprobado';
        }
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        const examResults = prepareExamResults(exam.questions, answers);
        const body = {
            courseId: id,
            userId: user.id,
            examResults: examResults
        };
        updateExam(user.id, body).then((data) => {
            console.log(data);
            window.location.reload();
        }
        ).catch((error) => {
            console.log(error);
        });

    }

    const existingExam = () => {
        for (const course of user.courses) {
            if (course.course.id === id) {
                if (course.examResults.result !== 'pending') {
                    return true;
                }
            }
        }
        return false;
    };

    //cambiando el estado a pending
    const clearExam = () => {
        const body = {
            courseId: id,
            userId: user.id,
            examResults: {
                result: 'pending'
            }
        };
        updateExam(user.id, body).then((data) => {
            console.log(data);
            window.location.reload();
        }
        ).catch((error) => {
            console.log(error);
        });
    };


    if (!course || !exam) {
        return <h1>Loading...</h1>;
    } else {
        if (existingExam()) {
            console.log('ya has realizado este examen');
            return (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 2,
                    margin: 2

                }}>
                    <Typography variant='h4'>Ya has realizado este examen</Typography>
                    <Typography variant='h5'>Tu resultado es: <b>{user.courses.find(course => course.course.id === id).examResults.result}</b></Typography>
                    <Typography variant='h5'>Tu puntuación es: <b>{user.courses.find(course => course.course.id === id).examResults.score}</b></Typography>
                    {
                        user.courses.find(course => course.course.id === id).examResults.result === 'Reprobado' ? (
                            <Box>
                                <Typography variant='h5'>Debes volver a realizar el examen</Typography>
                                <Button
                                variant='contained'
                                color='primary'
                                onClick={clearExam}
                                sx={{margin:2}}
                                >Volver a realizar el examen</Button>
                            </Box>
                        ) : (
                            <Box>
                                <Typography variant='h5'>Estas son las respuestas correctas:</Typography>
                                <CorrectAnswers questions={exam.questions} />
                            </Box>
                        )
                    }

                </Box>
            )
        } else {
            return (

                <Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Avatar
                            sx={{ m: 1, bgcolor: "secondary.main" }}
                            src={course.mainImage}
                        />
                        <Typography variant="h4" gutterBottom component="div">
                            {course.name}
                        </Typography>
                    </Box>
                    <Divider />
                    <form onSubmit={handleSubmit}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <Typography variant="h5" gutterBottom component="div">
                                {exam.title}
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <List
                                    dense
                                    sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
                                >
                                    {exam.questions?.map((question) => {
                                        const labelId = `checkbox-list-secondary-label-${question._id}`;
                                        return (
                                            <Box key={question._id} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'start' }} >
                                                <Typography variant='h5'>{question.question}</Typography>
                                                {question.options.map((option) => (
                                                    <Box key={option._id} sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', gap: 1, margin: 1, width: '100vh' }}>
                                                        <Checkbox
                                                            edge="end"
                                                            checked={answers.some((ans) => ans.questionId === question._id && ans.optionId === option._id)}
                                                            inputProps={{ 'aria-labelledby': labelId }}
                                                            name={question._id}
                                                            value={option._id}
                                                            onChange={(e) => handleAnswer(e, option)}
                                                        />
                                                        <Typography variant='h6'>{option.option}</Typography>
                                                    </Box>
                                                ))}

                                            </Box>
                                        );
                                    })}

                                </List>
                            </Box>
                        </Box>
                        <Button type='submit' variant='contained' color='primary' onClick={handleSubmit}>Guardar Examen</Button>
                    </form>
                </Box>
            );
        }
    }
};

export default Exam;
