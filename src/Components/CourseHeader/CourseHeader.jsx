import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardMedia } from '@mui/material';
import TextFormatToShowInCourseContent from '../TextFormat/TextFormatToShowInCourseContent';

const CourseHeader = ({ title, description, image }) => {

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginY: 2, padding: 1 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5">
            {title}
          </Typography>
          <TextFormatToShowInCourseContent htmlContent={description} />
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginY: 2, padding: 1 }}>
        </Box>
      </Box>
      <CardMedia
        component="img"
        sx={{ width: 151 }}
        image={image}
        alt={title}
      />
    </Card>
  );
}

export default CourseHeader;
