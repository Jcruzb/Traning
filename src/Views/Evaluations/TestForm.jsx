import { useParams } from "react-router";
import { getCourseDetail } from "../../Services/CoursesService";
import { useEffect, useState } from "react";
import { Box, Button, Divider, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material";
import Quiestion from "../../Components/Quiestion/Quiestion";   


const TestForm = () => {

    const { id } = useParams();

    const [course, setCourse] = useState({
    });
    const [test, setTest] = useState({
        title: "",
        questions: [],

    })

    console.log(test);

    useEffect(() => {
        getCourseDetail(id)
            .then((data) => {
                console.log(data);
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


    console.log(course);

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
                            <Quiestion key={index} />
                        ))
                        }

                        <Button onClick={addQuestion} variant="contained" color="success" sx={{marginY:1}}>
                            Agregar Pregunta
                        </Button>

                    </form>
                </Box>
            </Box>
        )
    }
}

export default TestForm;