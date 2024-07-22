import { styled, TableCell, TableHead, TableRow } from "@mui/material";
import TableSortLabel from "@mui/material/TableSortLabel";
import UpDown from "components/icons/UpDown";
import React from "react"; // styled components

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 600,
    padding: "12px 16px",
    color: theme.palette.grey[900],
    ":first-of-type": {
        paddingLeft: 70,
    },
})); // ----------------------------------------------------------------------

// ----------------------------------------------------------------------
const TableHeaderCustomer = (props) => {
    const { heading } = props;
    return (
        <TableHead
            sx={{
                backgroundColor: "grey.200",
            }}
        >
            <TableRow>
                {heading.map((headCell) => (
                    <StyledTableCell
                        key={headCell.id}
                        align={headCell.alignCenter ? "center" : "left"}
                    >
                            {headCell.label}
                    </StyledTableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};

export default TableHeaderCustomer;
