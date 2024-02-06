
import Switch from '@mui/joy/Switch';
import { Box, TextField } from '@mui/material';
import { useState } from 'react';

const Quiestion = () => {
  const [checked, setChecked] = useState(false);


  return (
    <Box
      orientation="horizontal"
      sx={{ width: 300, justifyContent: 'space-between' }}
    >
      <div>
        <TextField
          sx={{ marginTop: 2, minWidth: '50%', maxWidth: '80%' }}
          id="outlined-basic"
          label="Pregunta" />

      </div>
      <Switch
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
        color={checked ? 'success' : 'neutral'}
        variant={checked ? 'solid' : 'outlined'}
        endDecorator={checked ? 'On' : 'Off'}
        slotProps={{
          endDecorator: {
            sx: {
              minWidth: 24,
            },
          },
        }}
      />
    </Box>
  );
}

export default Quiestion;
