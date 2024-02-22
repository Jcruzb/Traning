import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Button } from '@mui/material';

const DownloadTemplate = () => {
  const downloadTemplate = () => {

    const wb = XLSX.utils.book_new();


    const ws = XLSX.utils.aoa_to_sheet([
      ['Nombres y Apellidos', 'Email', 'Password', 'Rol']
    ]);


    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');


    const wbout = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });


    const blob = new Blob([wbout], { type: 'application/octet-stream' });


    saveAs(blob, 'Plantilla.xlsx');
  };

  return (
    <div>
      <Button variant="contained" color='success' onClick={downloadTemplate}>Descarga la plantilla</Button>
    </div>
  );
};

export default DownloadTemplate;
