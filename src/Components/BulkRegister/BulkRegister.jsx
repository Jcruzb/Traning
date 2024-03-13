import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import List from "../List/List";
import DownloadTemplate from "../../ExcelTemplate/ExcelTemplate";
import { Box, Button, Typography } from "@mui/material";
import UploadFile from "../UploadFile/UploadFile";
import { useCompanyContext } from "../../Contexts/CompanyContext";
import { registerUser } from "../../Services/UsersService";
import { useNavigate } from "react-router";
import { getClientsIds } from "../../Services/ClientsService";
import { set } from "date-fns";
const ROLES = ["Administrador SinCeO2", "Administrador", "Usuario"];

const ExcelImporter = () => {
  const [excelData, setExcelData] = useState(null);
  const [usersToSave, setUsersToSave] = useState([]);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(0);
  const [companies, setCompanies] = useState([]);
  
  const { company } = useCompanyContext();

  const  navigate  = useNavigate();


  useEffect(() => {
    getClientsIds()
      .then((res) => {
        setCompanies(res);
      })
      .catch((err) => console.log(err));
  }, []);


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
        company: row[4],
      }));

      setExcelData({ headers, rows });
    };
    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    if (excelData && excelData.rows) {
      //quitar los users con email repetido
      const uniqueUsers = excelData.rows.filter(
        (user, index, self) =>
          index === self.findIndex((t) => t.email === user.email)
      );
      //quitar los usuarios que esten en company.users
      const usersInCompany = company.users.map((user) => user.email);
      const uniqueUsersInCompany = uniqueUsers.filter(
        (user) => !usersInCompany.includes(user.email)
      );
      //quitar los que tienen username en blanco o el rol no está en ROLES
      const usersWithUsername = uniqueUsersInCompany.filter(
        (user) => user.username && ROLES.includes(user.role)
      );
      const users = usersWithUsername.map((user) => {
        if (company.name === "SinCeO2") {
        return {
          username: user.username,
          email: user.email,
          password: user.password,
          role: user.role,
          company: user.company,
        };
      }else {
        return {
          username: user.username,
          email: user.email,
          password: user.password,
          role: user.role,
        };
      }
      });
      setUsersToSave(users);
    }
  }, [excelData, company]);




  const handleUsersSubmit = async () => {

    try {
      for (const user of usersToSave) {
        //changing the company name to the company id
        if (company.name === "SinCeO2") {
          const companyId = companies.find((c) => c.name === user.company);
          user.company = companyId.id;
        }
        console.log(user);
        await registerUser(user);
        setTime((prev) => prev + 1);
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      setLoading(false);
      navigate("/users");
      alert( "Usuarios registrados correctamente.");
    } catch (error) {
      console.error(error);
    } finally {
      setExcelData(null);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <Typography variant="h3">Registrando usuarios...</Typography>
        <Typography variant="h4">{time} usuarios registrados</Typography>
        <Typography variant="h4">Por favor no recargue la pantalla</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          padding: 1,
        }}
      >
        <DownloadTemplate />
        <UploadFile onFileUpload={handleFileUpload} />
      </Box>
      {excelData && excelData.rows && (
        <Box>
          <h3>Excel Data:</h3>
          <List
            headers={excelData.headers}
            columns={
              company.name === "SinCeO2" ?
              ["username", "email", "password", "role", "company"] :
              ["username", "email", "password", "role"]
            }
            rows={excelData.rows}
            onRowClick={() => {}}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUsersSubmit}
          >
            Guardar
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ExcelImporter;
