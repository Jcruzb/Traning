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
  const [user, setUser] = useState({});
  const [companyCourses, setCompanyCourses] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [userCourses, setUserCourses] = useState([]);
  const [currentStudent, setCurrentStudent] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
   const { company } = useCompanyContext();

  useEffect(() => {
    const courses = user?.courses?.map((course) => course.course.id);
    setUserCourses(courses);
  }, [user]);

  const handleChange = (e, row) => {
    if (userCourses.includes(row.id)) {
      setUserCourses((prevCourses) =>
        prevCourses.filter((id) => id !== row.id)
      );
    } else {
      setUserCourses((prevCourses) => [...prevCourses, row.id]);
    }
  };
  useEffect(() => {
    getUserDetail(id)
      .then((res) => {
        setUser(res);
      })
      .catch((err) => console.log(err));
  }, [id]);

  useEffect(() => {
    getClientDetail(user?.company)
      .then((res) => {
        setCompanyName(res.name);
        setCompanyCourses(res.courses);
      })
      .catch((err) => console.log(err));
  }, [user?.company]);

  const handleStudentsChange = (e, row) => {
    setCurrentStudent(row.id);
  };
  const handleStudentUpdate = () => {
    updateCourseStudent(currentStudent, {
      studentId: id,
      courseId: currentStudent,
    })
      .then((res) => {
        console.log(res.user.id);
      })
      .catch((err) => console.log(err));
  };


  const handleupdate = () => {
    updateCourses(id, { coursesId: userCourses })
      .then((res) => {
        console.log(res.user.id);
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = () => {
    deleteUser(id)
        .then((res) => {
            navigate("/users");
        })
        .catch((err) => console.log(err));
    };

  if (!company) {
    return <h1>Loading...</h1>;
  } else {
    return (
      <Box
        className="ClientDetail"
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          width: "100%",
        }}
      >
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            maxWidth: "100%",
            marginY: 2,
            padding: 2,
          }}
        >
          <Typography variant="h4"> Detalle de Cliente</Typography>
          <Avatar
            sx={{ width: "15vh", height: "15vh", margin: 2 }}
            src={user?.avatar}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "start",
              gap: 2,
            }}
          >
            <TableContainer
              component={Paper}
              sx={{ marginY: 2, minWidth: "80px" }}
            >
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
                    <TableCell align="center">
                      {company?.courses?.length}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        <Button variant="contained" color="primary" onClick={handleDelete} >
          Eliminar Usuario
        </Button>
        </Card>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column" },
            margin: 2,
            justifyContent: "space-around",
          }}
        >
          <Typography variant="h4"> Cursos</Typography>

          <AsignCourseToUser
            userCourses={userCourses}
            id={id}
            rows={companyCourses}
            columns={["Asignar", "Curso", "Descripción"]}
            properties={["name", "description"]}
            handleChange={handleChange}
            handleupdate={handleupdate}
            handleStudentsChange={handleStudentsChange}
            handleStudentUpdate={handleStudentUpdate}
            loading={false}
          />
        </Box>
      </Box>
    );
  }
};

export default UserDetail;
