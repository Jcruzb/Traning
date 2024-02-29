import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import logo from '../../../public/Img/logo-sinceo2.png'

const styles = StyleSheet.create({
  certificateContainer: {
    width: '794px', /* Ancho para tamaño A4 */
    height: '1123px', /* Alto para tamaño A4 */
    position: 'relative',
    padding: '20px',
  },
  logo: {
    width: '100px',
    position: 'absolute',
    top: '20px',
    left: '20px',
  },
  certificate: {

    border: '2px solid #701227',
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  certificateHeader: {
    marginTop: '150px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '20px',
  },
  headerText: {
    color: '#701227',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  subHeaderText: {
    fontSize: '18px',
    fontWeight: 'heavy',
  },
  normalText: {
    fontWeight: 'normal',
    fontSize: '16px',
  },
  certificateContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    margin: ' 10px 20px 20px 10px'
  },
  fontText: {
    color: '#701227',
    fontWeight: 'bold',
    margin: '10px 0px 15px 0px',
  },
  certificateContentInfo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    margin: ' 20px 20px 10px 10px',
  },
  certificateFooter: {
    marginTop: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  certificateBrand: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'stretch', 
    marginTop: '60px',
    color: '#701227',
    fontSize: '8px',
    width: '80%',
    borderTop: '1px solid #701227',
  },

});

const Certificate = ({ user, course }) => {
  // Convertir fecha a formato dd/mm/yyyy
  const formatDate = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString();
  }
  const dateToRender = formatDate(course.updatedAt)

  return (
    <Document>
      <Page size="A4" style={styles.certificateContainer}>
        <View style={styles.certificate}>
          <Image src={logo} style={styles.logo} alt="logo"></Image >
          <View style={styles.certificateHeader}>
            <Text style={styles.headerText}>CERTIFICADO</Text>
            <Text style={styles.headerText}>DE PARTICIPACIÓN Y APROBACIÓN</Text>
            <Text style={styles.subHeaderText}>{course.name}</Text>
          </View>
          <View style={styles.certificateContent}>
            <Text style={styles.normalText}>Este certificado es otorgado a:</Text>
            <Text style={styles.subHeaderText}>{user.username}</Text>
          </View>
          <View style={styles.certificateContentInfo}>
            <Text >
              Por completar satisfactoriamente el curso de:</Text>
            <Text style={styles.fontText}>{course.name}</Text>
            <Text>Dictado a la empresa:</Text>
            <Text style={styles.fontText}>{user.company.name}</Text>
            <Text>A través de la plataforma de formaciones con una duración de </Text>
            <Text style={styles.fontText}>4 horas y 30 minutos.</Text>
          </View>
          <View style={styles.certificateContentInfo}>
            <Text>Fecha de finalización:</Text><Text stype={styles.fontText}>{dateToRender}</Text>
          </View>
          <View style={styles.certificateFooter}>
            <Text>SinCeO2</Text>
            <Text>Consultoría energética</Text>
          </View>
          <View style={styles.certificateBrand}>
            <View style={styles.certificateBrandDivider} />
            <Text style={styles.certificateBrandText}>Dirección: C/ Arte, nº 21 - 1ª planta. 28033</Text>
            <Text>Teléfono: +34 913 456 073</Text>
            <Text>Correo: info@sinceo2.com</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default Certificate;
