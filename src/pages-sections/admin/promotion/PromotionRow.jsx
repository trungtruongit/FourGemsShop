import { useState } from "react";
import { Delete, Edit, RemoveRedEye } from "@mui/icons-material";
import { Avatar, Box } from "@mui/material";
import { FlexBox } from "components/flex-box";
import { Paragraph, Small } from "components/Typography";
import {
    StyledIconButton,
    StyledTableCell,
    StyledTableRow,
} from "../StyledComponents";
// ========================================================================
function convertDate(dateString) {
    const date = new Date(dateString);

    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; // Tháng bắt đầu từ 0
    const year = date.getUTCFullYear();

    const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;

    return formattedDate;
}
// ========================================================================
const PromotionRow = ({ seller }) => {
    const {
        description,
        id,
        discount,
        startDate,
        endDate,
        loyaltyPoints,
        package: sellerPackage,
    } = seller;
    return (
        <StyledTableRow tabIndex={-1} role="checkbox">
            <StyledTableCell
                align="center"
                sx={{
                    fontWeight: 400,
                }}
            >
                {id}
            </StyledTableCell>

            <StyledTableCell
                align="center"
                sx={{
                    fontWeight: 400,
                }}
            >
                {description}
            </StyledTableCell>
            <StyledTableCell
                align="center"
                sx={{
                    fontWeight: 400,
                }}
            >
                {discount + "%"}
            </StyledTableCell>
            <StyledTableCell
                align="left"
                sx={{
                    fontWeight: 400,
                }}
            >
                {convertDate(startDate)}
            </StyledTableCell>
            <StyledTableCell
                align="left"
                sx={{
                    fontWeight: 400,
                }}
            >
                {convertDate(endDate)}
            </StyledTableCell>
        </StyledTableRow>
    );
};

export default PromotionRow;
