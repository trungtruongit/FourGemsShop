import { useState } from "react";
import { Avatar } from "@mui/material";
import { Delete } from "@mui/icons-material";
import BazaarSwitch from "components/BazaarSwitch";
import { FlexBox } from "components/flex-box";
import { Paragraph, Small } from "components/Typography";
import {
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from "./StyledComponents"; // ========================================================================

// ========================================================================
const ReviewRow = ({ showRotate }) => {
  const { id, fromCounter, toCounter, totalQuantity } = showRotate;
  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
        <StyledTableCell align="center">{id}</StyledTableCell>

      <StyledTableCell align="left">{fromCounter}</StyledTableCell>

      <StyledTableCell align="left">{toCounter}</StyledTableCell>

      <StyledTableCell align="center">{totalQuantity}</StyledTableCell>

      <StyledTableCell align="center">
        <StyledIconButton>
          <Delete />
        </StyledIconButton>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default ReviewRow;
