import Switch from '@mui/material/Switch';
import { Box, Button, Card, FormControlLabel, TextField } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const Question = ({question, setQuestion}) => {

  const isCorrect = ['Respuesta Correcta', 'Respuesta Incorrecta'];



  const addOption = () => {
    setQuestion({
      ...question,
      options: [...question.options, { option: '', isCorrect: false }]
    });
  };

  const handleQuestionChange = (e) => {
    setQuestion({ ...question, question: e.target.value });
  };

  const handleFieldChange = (e, index) => {
    const newOptions = [...question.options];
    newOptions[index].option = e.target.value;
    setQuestion({ ...question, options: newOptions });
  };

  const handleOptionChange = (e, index) => {
    const newOptions = [...question.options];
    newOptions[index].isCorrect = e.target.checked;
    setQuestion({ ...question, options: newOptions });
  }

  const deleteOption = (e, index) => {
    console.log(index);
    const newOptions = [...question.options];
    newOptions.splice(index, 1);
    setQuestion({ ...question, options: newOptions });
  }
    


 

  return (
    <Card sx={{ padding: 2, margin: 2 }} orientation="horizontal">
      <Box>
        <TextField
          sx={{ marginTop: 2, minWidth: '50%', width: '100%' }}
          id="outlined-basic"
          label="Pregunta"
          onChange={(e) => handleQuestionChange(e)}
        />
      </Box>
      {question.options.map((option, index) => (
        <Box key={index} sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
          <TextField
            sx={{ marginTop: 2, minWidth: '50%', maxWidth: '80%' }}
            id="outlined-basic"
            label="Opcion"
            value={option.option}
            onChange={(e) => handleFieldChange(e, index)}
          />
          <FormControlLabel
            control={
              <Switch
                checked={option.isCorrect} // Aquí establecemos el valor del Switch de acuerdo con la opción actual
                onChange={(e) => handleOptionChange(e, index)}
                name="optionSwitch"
              />
            }
            label={isCorrect[option.isCorrect ? 0 : 1]} // Aquí mostramos el texto correspondiente a si es correcta o incorrecta
          />
          <Button onClick={( e ) => deleteOption(e, index)} variant="contained" color="error" sx={{ marginTop: 2 }}><DeleteForeverIcon/></Button>
        </Box>
      ))}
      <Button variant="contained" sx={{ marginTop: 2 }} onClick={addOption}>
        Agregar Opción
      </Button>
    </Card>
  );
};

export default Question;
