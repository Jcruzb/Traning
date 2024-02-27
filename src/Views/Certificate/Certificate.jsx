import { useParams } from 'react-router';
import { useAuthContext } from '../../Contexts/AuthContext';
import './Certificate.css'; // Archivo CSS para estilos

const Certificate = ({ recipientName, courseName, completionDate }) => {

    const {user} = useAuthContext();
    const id = useParams();

    /*
    
{username: 'Arnold_Schwarzenegger', email: 'arnold.sales@hack-erp.com', role: 'Administrador', avatar: 'https://image.tmdb.org/t/p/w500/sOkCXc9xuSr6v7mdAq9LwEBje68.jpg', active: true, …}
activationToken
: 
"9b0qq23td6penvjwtaimja"
active
: 
true
avatar
: 
"https://image.tmdb.org/t/p/w500/sOkCXc9xuSr6v7mdAq9LwEBje68.jpg"
company
: 
{name: 'Empresa 2', logo: 'https://static.thenounproject.com/png/638636-200.png', nif: '123asda', phone: 46542132, email: 'mail@empresa2.com', …}
courses
: 
Array(1)
0
: 
course
: 
{Exam: {…}, name: 'ISO 50001 Sistema de Gestión de la Energía', description: 'Curso de Interpretación de Norma ISO 50001:2016', mainImage: 'https://res.cloudinary.com/dqyphg6sa/image/upload/…08350/SinCeO2/TraningApp/un81v1tj3bphbsesejwj.png', students: Array(10), …}
dedication
: 
280
examResults
: 
{score: 0, result: 'pending', responses: Array(0)}
progress
: 
{courseLength: 0, courseProgress: 10, courseProgressPercent: 100}
startDate
: 
"2023-11-11T00:00:00.000Z"
status
: 
"pending"
testsResults
: 
[]
_id
: 
"65c5da5a1759df4f46552660"
[[Prototype]]
: 
Object
length
: 
1
[[Prototype]]
: 
Array(0)
createdAt
: 
"2024-02-09T07:55:06.304Z"
email
: 
"arnold.sales@hack-erp.com"
id
: 
"65ad2dadba7d6bd39c91f490"
role
: 
"Administrador"
updatedAt
: 
"2024-02-16T18:10:40.397Z"
username
: 
"Arnold_Schwarzenegger"
[[Prototype]]
: 
Object 
     */
    //filtrar el course de users.courses que tenga el id que llega por params

    const course = user.courses.filter((course) => course.course.id === id.id)
    console.log(course);



  return (
    <div className="certificate-container">
      <div className="certificate">
        <div className="certificate-header">
          <h1>CERTIFICADO</h1>
          <p>Por completar el curso de {courseName}</p>
        </div>
        <div className="certificate-content">
          <p>Este certificado es otorgado a</p>
          <h2>{recipientName}</h2>
          <p>Por completar satisfactoriamente el curso de {courseName}</p>
          <p>Fecha de finalización: {completionDate}</p>
        </div>
        <div className="certificate-footer">
          <p>Firma del Instructor</p>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
