import { useNavigate, useParams } from "react-router";
import { getCourseDetail, updateCourse } from "../../Services/CoursesService";
import { useEffect, useState } from "react";
import { Box, Button, Divider, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material";
import Question from "../../Components/Question/Question";

const TestForm = () => {

    const { id } = useParams();

    const [course, setCourse] = useState({
    });
    const [test, setTest] = useState({
        title: "",
        questions: [],

    })
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

    const handleChange = (e, name) => {
        setTest({ ...test, [name]: e.target.value });
    }

    const addQuestion = () => {
        const newQuestion = {
            question: "",
            options: []
        }
        setTest({ ...test, questions: [...test.questions, newQuestion] });
    }

    console.log(test);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const courseToUpdate = { ...course };
        courseToUpdate.tests.push(test);
        setCourse(courseToUpdate);

        await updateCourse(id, course)
            .then(() => {
                navigate(`/course/content/${id}`)
            })
            .catch((error) => {
                console.log(error);
            });
    }


    if (!course) {
        return <div>Loading...</div>;
    } else {

        return (
            <Box sx={{ padding: 2 }}>
                <Typography variant="h4">{course.name}</Typography>
                <Typography variant="body">En esta sección agregará una Evaluación a un contenido específico del curso</Typography>
                <Divider />
                <Box sx={{ padding: 2 }}>
                    <form action="submit">
                        <Stack spacing={2}>
                            <InputLabel id="content-label">Seleccionar contenido</InputLabel>
                            <Select
                                labelId="content-label"

                                name="title"
                                sx={{ maxWidth: '80%' }}
                                onChange={(e) => handleChange(e, 'title')}
                                value={test.title}
                            >
                                {course.content?.map((content) => (
                                    <MenuItem key={content._id} value={content.title}  >{content.title}</MenuItem>
                                ))}
                            </Select>
                        </Stack>
                        {test.questions.map((question, index) => (
                            <Question
                                key={index}
                                question={question}
                                setQuestion={(updatedQuestion) => {
                                    const updatedQuestions = [...test.questions];
                                    updatedQuestions[index] = updatedQuestion;
                                    setTest({ ...test, questions: updatedQuestions });
                                }}
                                number={index + 1}
                            />
                        ))}
                        <Button onClick={addQuestion} variant="contained" color="success" sx={{ marginY: 1 }}>
                            Agregar Pregunta
                        </Button>

                    </form>
                    <Button onClick={e => handleSubmit(e)} variant="contained" color="primary" sx={{ marginY: 1 }}>
                        Guardar Test
                    </Button>
                </Box>
            </Box>
        )
    }
}

export default TestForm;