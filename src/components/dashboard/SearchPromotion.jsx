import { Add } from "@mui/icons-material";
import { Button, useMediaQuery } from "@mui/material";
import { FlexBox } from "components/flex-box";
import SearchInput from "components/SearchInput";
import React from "react"; // ===============================================================

// ===============================================================
const SearchPromotion = (props) => {
    const {
        searchPlaceholder,
        buttonText,
        handleBtnClick,
        dataSearch,
        setDataSearch,
    } = props;
    const downSM = useMediaQuery((theme) => theme.breakpoints.down("sm"));
    return (
        <FlexBox mb={2} gap={2} justifyContent="space-between" flexWrap="wrap">
            <SearchInput
                placeholder={searchPlaceholder}
                value={dataSearch}
                onChange={(e) => setDataSearch(e.target.value)}
            />

            <Button
                color="info"
                fullWidth={downSM}
                variant="contained"
                startIcon={<Add />}
                onClick={handleBtnClick}
                sx={{
                    minHeight: 44,
                }}
            >
                {buttonText}
            </Button>
        </FlexBox>
    );
};

SearchPromotion.defaultProps = {
    buttonText: "Add Product",
    searchPlaceholder: "Search Product...",
};
export default SearchPromotion;
