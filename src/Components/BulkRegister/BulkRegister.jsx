import React, { useState } from "react";
import * as XLSX from "xlsx";
import List from "../List/List";
import DownloadTemplate from "../../ExcelTemplate/ExcelTemplate";
import { Box } from "@mui/material";
import UploadFile from "../UploadFile/UploadFile";

const ExcelImporter = () => {
  const [excelData, setExcelData] = useState(null);

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Convierte los datos del Excel en el formato esperado por el componente List
      const headers = jsonData[0];
      const rows = (jsonData.slice(1) || []).map((row) => ({
        username: row[0],
        email: row[1],
        password: row[2],
        role: row[3],
      }));

      setExcelData({ headers, rows });
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Box>
        <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', gap:1, padding:1}}>
        <DownloadTemplate />
      <UploadFile onFileUpload={handleFileUpload} />
        </Box>
      {excelData &&
        excelData.rows && ( 
          <Box>
            <h3>Excel Data:</h3>
            <List
              headers={excelData.headers} 
              columns={["username", "email", "password", "role"]} 
              rows={excelData.rows} 
              onRowClick={() => {}} 
            />
          </Box>
        )}
    </Box>
  );
};

export default ExcelImporter;
