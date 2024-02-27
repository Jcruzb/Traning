import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import List from "../List/List";
import DownloadTemplate from "../../ExcelTemplate/ExcelTemplate";
import { Box, Button } from "@mui/material";
import UploadFile from "../UploadFile/UploadFile";
import { useCompanyContext } from "../../Contexts/CompanyContext";
import { registerUser } from "../../Services/UsersService";
import { useNavigate } from "react-router";
import { fi } from "date-fns/locale";

const ExcelImporter = () => {
  const [excelData, setExcelData] = useState(null);
  const [usersToSave, setUsersToSave] = useState([]); 
  //company del contexto
  const { company } = useCompanyContext();

  const { navigate } = useNavigate();

  const handleFileUpload = (file) => {
    setExcelData(null);
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

  useEffect(() => {
    if (excelData && excelData.rows) {
      //quitar los users con email repetido
      const uniqueUsers = excelData.rows.filter((user, index, self) => index === self.findIndex((t) => (t.email === user.email)));
      //quitar los usuarios que esten en company.users
      const usersInCompany = company.users.map((user) => user.email);
      const uniqueUsersInCompany = uniqueUsers.filter((user) => !usersInCompany.includes(user.email));
      const users = uniqueUsersInCompany.map((user) => {
        return {
          username: user.username,
          email: user.email,
          password: user.password,
          role: user.role,
          company: company.id,
        };
      });
      setUsersToSave(users);
    }
  }, [excelData, company]);

  const handleUsersSubmit = async () => {
    console.log('click');
    try {
      for (const user of usersToSave) {
        console.log(user);
        await registerUser(user);
      }
      alert("Usuarios registrados correctamente");
      navigate("/#/users");
    } catch (error) {
      console.error(error);
    } finally {
      setExcelData(null);
    }

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
            <Button variant="contained" color="primary" onClick={handleUsersSubmit}>
              Guardar
            </Button>
          </Box>
        )}
    </Box>
  );
};

export default ExcelImporter;
