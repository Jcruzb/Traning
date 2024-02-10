import { useNavigate, useParams } from "react-router"
import { getCourseDetail, updateCourse, updateCourseContent, updateCourseImage } from "../../Services/CoursesService";
import { useEffect, useState } from "react";
import { Box, Button, Card, Divider, Typography } from "@mui/material";
import CourseContent from "./CourseContent";
import CourseHeader from "../../Components/CourseHeader/CourseHeader";
import EditableTag from "../../Components/EditableTag/EditableTag";



const CoursesFormContent = () => {

    const { id } = useParams()
    const navigate = useNavigate();

    const [course, setCourse] = useState({
        name: "",
        description: "",
        mainImage: null,
        content: [],
    });

    const [contentList, setContentList] = useState(course.content ? course.content : [])



    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCourseDetail(id);
                setCourse(data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();

    }, [id]);




    const addContent = async (e) => {
        e.preventDefault();
        if (contentList.title === "" || contentList.description === "" || contentList.image === "") {
            return;
        }
        const formData = new FormData();
        formData.append("title", contentList.title);
        formData.append("description", contentList.description);
        formData.append("image", contentList.image instanceof File ? contentList.image : undefined);

        try {
            const data = await updateCourseContent(id, formData, { headers: { "Content-Type": "multipart/form-data" } });
            setCourse((prevCourse) => ({ ...prevCourse, content: data.content || [] }));
        } catch (error) {
            console.log(error);
        }
    }

    const testForm = (e) => {
        if (contentList.title !== "" || contentList.description !== "" || contentList.image !== "") {
            navigate(`/course/${id}/testForm`)
        } else {
            addContent(e)
            navigate(`/course/${id}/testForm`)
        }
    }
    const examForm = (e) => {
        if (contentList.title !== "" || contentList.description !== "" || contentList.image !== "") {
            navigate(`/course/${id}/examForm`)
        } else {
            addContent(e)
            navigate(`/course/${id}/examForm`)
        }
    }


    const handleAddContent = (event) => {
        const { name, value, files } = event.target;
        console.log(name, value, files)

        name === "image" ?
            setContentList({
                ...contentList,
                [name]: files[0],
            }) :
            setContentList({
                ...contentList,
                [name]: value,
            });
    };



    const editTag = (e, index) => {

        const { name, value } = e.target;
        const newContent = [...course.content];
        newContent[index][name] = value;
        setCourse({
            ...course,
            content: newContent
        })
        updateCourse(id, { content: newContent })
            .then((data) => {
                console.log(data)
            })
            .catch((error) => {
                console.log(error);
            });
    }


    const editImage = (files, index) => {

        const newContent = [...course.content];
        if (newContent[index]) {
            const name = "image";
            newContent[index][name] = files[0];

            const contentId = newContent[index]._id;

            setCourse({
                ...course,
                content: newContent
            });

            const formData = new FormData();
            formData.append("image", files[0] instanceof File ? files[0] : undefined);
            formData.append("contentId", contentId);

            updateCourseImage(id, formData, { headers: { "Content-Type": "multipart/form-data" } })
                .then((res) => {
                    console.log(res)
                    setCourse(res)
                    //reload
                    window.location.reload();
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            console.error(`newContent[${index}] is undefined`);
        }
    };

    const hanndleDeleteContent = (e, index) => {
        e.preventDefault();
        const newContent = [...course.content];
        console.log(newContent)
        console.log(index)
        newContent.splice(index, 1);
        setCourse({
            ...course,
            content: newContent
        })
        updateCourse(id, { content: newContent })
            .then((data) => {
                console.log(data)
            })
            .catch((error) => {
                console.log(error);
            });
    }




    if (!course.mainImage) {
        return <div>Loading...</div>;
    }
    else {

        return (
            <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={{ width: { sm: '100%', md: '80%' }, margin: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center' }}>
                        <CourseHeader
                            title={course.name}
                            description={course.description}
                            image={course.mainImage}
                        />
                    </Box >
                    <Divider orientation='horizontal' flexItem />
                    <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center' }}>

                        {course.content?.map((content, index) => (
                            <Card key={content._id} sx={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', margin: 2, padding: 1, minWidth: '80vh' }}>

                                <Box>
                                    <EditableTag
                                        index={index}
                                        name="title"
                                        sx={{ marginBottom: 1 }}
                                        typeOfTag={"h5"}
                                        initialValue={content.title ? content.title : ""}
                                        onUpdate={editTag}
                                    />
                                </Box>
                                <Box>
                                    <EditableTag
                                        index={index}
                                        name="description"
                                        sx={{ marginBottom: 1 }}
                                        typeOfTag={"p"}
                                        initialValue={content.description ? content.description : ""}
                                        onUpdate={editTag}
                                    />

                                </Box>
                                <Box>
                                    <EditableTag
                                        index={index}
                                        name="image"
                                        sx={{ marginBottom: 1 }}
                                        typeOfTag={"img"}
                                        initialValue={content.image ? content.image : ""}
                                        editImage={(e) => editImage(e, index)}
                                    />
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Button variant="contained" color="primary" sx={{ marginY: 2 }} onClick={(e) => hanndleDeleteContent(e, index)}>Eliminar contenido</Button>
                                </Box>

                            </Card>
                        ))}

                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: 'space-between', alignItems: 'center' }}>

                        <form action="submit" encType="multipart/form-data" >
                            <Card sx={{ display: 'flex', flexDirection: "column", justifyContent: 'space-between', padding: 1 }}>
                                <CourseContent
                                    key={course.content.length}
                                    onChange={handleAddContent}
                                />
                            </Card>
                            <Card sx={{ display: 'flex', flexDirection: "column", justifyContent: 'space-between', alignItems: 'center', marginTop: 1 }}>
                                <Typography variant="h4">Opciones</Typography>
                                <Divider orientation='horizontal' flexItem />

                                <Box sx={{ display: 'flex', flexDirection: "row", justifyContent: 'space-between', alignItems: 'center', marginTop: 1 }}>
                                    <Button type="submit" onClick={(e) => addContent(e)} variant="contained" color="success" sx={{ margin: 2 }}>Guardar sección</Button>
                                    <Button onClick={(e) => testForm(e)} variant="contained" color="primary" sx={{ margin: 2 }}>Evaluar una sección</Button>
                                    <Button onClick={(e) => examForm(e)} variant="contained" color="primary" sx={{ margin: 2 }}>Crear el exámen final</Button>
                                </Box>
                            </Card>
                        </form>
                    </Box>
                </Box>
            </Box>
        )
    }
}

export default CoursesFormContent