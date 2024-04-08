import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import Skeleton from '@mui/material/Skeleton';
import { useState } from 'react';
import TextFormatToShowInCourseContent from '../TextFormat/TextFormatToShowInCourseContent';

const label = { inputProps: { 'aria-label': 'Color switch demo' } };

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const AsignCourseToUser = ({
    userCourses,
    rows,
    columns,
    properties,
    handleChange,
    handleupdate,
    handleStudentsChange,
    handleStudentUpdate,
    loading
}) => {
    const [changed, setChanged] = useState(false);

    const changeAndUpdaye = async (e, row) => {
        await handleStudentsChange(e, row);
        await handleChange(e, row);
        setChanged(true);
    }
    if (changed) {
        console.log(userCourses)
        handleupdate();
        handleStudentUpdate();
        setChanged(false);

    }

    
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        {columns.map((column, i) => (
                            <StyledTableCell align="center" key={i}>
                                {column}
                            </StyledTableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, i) => (
                        <StyledTableRow key={i}>
                            <StyledTableCell align="center" component="th" scope="row">
                                {loading ? (
                                    <Skeleton variant="rounded" width={48} height={24} />
                                ) : (
                                    <Switch
                                        {...label}
                                        checked={
                                            userCourses.includes(row.id) ? true : false
                                        }
                                        color="primary"
                                        onClick={(e) => {
                                            changeAndUpdaye(e, row);
                                        }}
                                    />
                                )}
                            </StyledTableCell>
                            {properties.map((property, i) => (
                                property === "description" ?(
                                    <StyledTableCell key={i} align="center">
                                    <TextFormatToShowInCourseContent htmlContent={row[property]} />
                                </StyledTableCell>
                                ):(
                                 
                                <StyledTableCell key={i} align="center">
                                    {row[property]}
                                </StyledTableCell>
                                )
                            ))}
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default AsignCourseToUser;
