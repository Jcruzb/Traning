import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import WorkIcon from "@mui/icons-material/Work";

const CourseStatus = ({ courses }) => {

  console.log(courses);
  if (!courses) {
    return <h1>Cargando...</h1>;
  } else {
    return (
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {courses.length === 0 ? (
          <h1>No tienes cursos</h1>
        ) : (
          courses.map((course) => (
            course && course._id && (
              <ListItem key={course._id}>
                <ListItemAvatar>
                  <Avatar
                    sx={{ width: 50, height: 50 }}
                    src={
                      course?.course?.mainImage
                        ? course?.course?.mainImage
                        : WorkIcon
                    }
                  ></Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={course.course.name}
                  secondary={course.status}
                />
              </ListItem>
            )
          ))
        )}
      </List>
    );
  }
};


export default CourseStatus;
