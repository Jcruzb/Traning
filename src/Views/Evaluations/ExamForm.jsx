import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getCourseDetail, updateCourse } from "../../Services/CoursesService";
import { Box } from "@mui/system";
import { Avatar, Divider, Typography, Button } from "@mui/material";
import Question from "../../Components/Question/Question";

const ExamForm = () => {

    const [course, setCourse] = useState({});
    const [exam, setExam] = useState({
        title: "",
        questions: []

    });
    const { id } = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        getCourseDetail(id)
            .then((data) => {
                setCourse(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]);

    const addQuestion = () => {
        const newQuestion = {
            question: "",
            options: []
        }
        setExam({ ...exam, questions: [...exam.questions, newQuestion] });
    }

    const handleSubmit =  (e) => {
        e.preventDefault();
        const updatedCourse = {
            ...course,
            Exam: {
                title: course.name,
                questions: exam.questions
            }
        };
        updateCourse(id, updatedCourse)
            .then(() => {
                navigate('/courses')
            })
            .catch((error) => {
                console.log(error);
            });

    }





return (
    <Box sx={{ width: '100v%' }}>
        <Box sx={{ padding: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4"> Evaluación Final </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center', padding: 1 }}>
                    <Avatar alt={course.name} src={course.mainImage} sx={{ width: 30, height: 30 }} />
                    <Typography variant="h6"> {course.name} </Typography>
                </Box>
            </Box>
            <Divider />
            <form action="submit">
                <Box sx={{ padding: 1 }}>
                    <Typography variant="h6">Preguntas</Typography>
                    {exam.questions.map((question, index) => (
                        <Question key={index} number={index + 1} question={question} setQuestion={(newQuestion) => {
                            const newQuestions = [...exam.questions];
                            newQuestions[index] = newQuestion;
                            setExam({ ...exam, questions: newQuestions });
                        }} />
                    ))}
                    <Button onClick={addQuestion} variant="contained" color="success" sx={{ marginY: 1 }}>
                        Agregar Pregunta
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', padding: 1 }}>
                    <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ width: { sm: '80%', md: '500px' }, marginY: 1 }}>
                        Guardar
                    </Button>
                </Box>
            </form>
        </Box>
    </Box>
)
}

export default ExamForm