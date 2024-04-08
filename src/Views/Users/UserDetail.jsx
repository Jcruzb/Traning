import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { deleteUser, getUserDetail, updateCourses } from "../../Services/UsersService";
import {
  Avatar,
  Box,
  Button,
  Card,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { getClientDetail } from "../../Services/ClientsService";
import AsignCourseToUser from "../../Components/AsignCourseTable/AsignCourseToUser";
import { updateCourseStudent } from "../../Services/CoursesService";
import { useCompanyContext } from "../../Contexts/CompanyContext";

const UserDetail = () => {
  const [userDetail, setUserDetail] = useState({
    user: {},
    companyCourses: [],
    userCourses: [],
    allCourses: []
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const { company } = useCompanyContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserDetail(id);
        const clientDetail = await getClientDetail(user.company);
        const userCourses = user.courses.map(course => course.course.id);
        const progress = user.courses.map(course => course.progress.courseProgressPercent + "%");
        const companyCourses = clientDetail.courses.map((course, index) => ({
          ...course,
          progress: progress[index] ?? 0,
        }));

        setUserDetail(prevState => ({
          ...prevState,
          user,
          companyCourses,
          userCourses,
          allCourses: companyCourses,
        }));
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteUser(id);
      navigate("/users");
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e, row) => {
    setUserDetail(prevState => ({
      ...prevState,
      userCourses: prevState.userCourses.includes(row.id)
        ? prevState.userCourses.filter(id => id !== row.id)
        : [...prevState.userCourses, row.id]
    }));
  };

  const handleStudentsChange = (row) => {
    setUserDetail(prevState => ({
      ...prevState,
      currentStudent: row.id,
    }));
  };

  const handleStudentUpdate = async () => {
    try {
      await updateCourseStudent(userDetail.currentStudent, {
        studentId: id,
        courseId: userDetail.currentStudent,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleupdate = async () => {
    try {
      await updateCourses(id, { coursesId: userDetail.userCourses });
    } catch (err) {
      console.error(err);
    }
  };

  if (!company || !userDetail.user) {
    return <h1>Loading...</h1>;
  }

  const { user, allCourses } = userDetail;

  return (
    <Box
      className="ClientDetail"
      sx={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%" }}
    >
      <Card
        sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", maxWidth: "100%", marginY: 2, padding: 2 }}
      >
        <Typography variant="h4"> Detalle de Cliente</Typography>
        <Avatar sx={{ width: "15vh", height: "15vh", margin: 2 }} src={user?.avatar} />
        <Box sx={{ display: "flex", justifyContent: "start", alignItems: "start", gap: 2 }}>
          <TableContainer component={Paper} sx={{ marginY: 2, minWidth: "80px" }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Empresa</TableCell>
                  <TableCell>Cursos Activos</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">{user?.username}</TableCell>
                  <TableCell align="center">{company?.name}</TableCell>
                  <TableCell align="center">{company?.courses?.length}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        {user?.role === "Administrador SinCeO2" ? (
          <Button variant="contained" color="primary" href="/#/users">
            Volver
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleDelete}>
            Eliminar Usuario
          </Button>
        )}
      </Card>
      <Box
        sx={{ display: "flex", flexDirection: { xs: "column" }, margin: 2, justifyContent: "space-around" }}
      >
        <Typography variant="h4"> Cursos</Typography>
        <AsignCourseToUser
          userCourses={userDetail.userCourses}
          id={id}
          rows={allCourses}
          columns={["Asignar", "Curso", "Progreso", "Descripción"]}
          properties={["name", "progress", "description"]}
          handleChange={handleChange}
          handleupdate={handleupdate}
          handleStudentsChange={handleStudentsChange}
          handleStudentUpdate={handleStudentUpdate}
          loading={false}
        />
      </Box>
    </Box>
  );
};

export default UserDetail;
