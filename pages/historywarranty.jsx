import { useEffect, useState } from "react";
import { Delete, RemoveRedEye } from "@mui/icons-material";
import {
    Box,
    Button,
    Typography,
    TextField,
} from "@mui/material";
import TableRow from "components/TableRow";
import axios from "axios";
import QCDashboardLayout from "../src/components/layouts/customer-dashboard/QCPage";
import { SearchOutlinedIcon } from "../src/components/search-box/styled";
import { jwtDecode } from "jwt-decode";

function convertDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
    return formattedDate;
}
const WarrantyHistory = () => {
    const [loading, setLoading] = useState(false);
    const [buybackCus, setBuybackCus] = useState([]);
    const [roleId, setRoleId] = useState(null);  // Initialize as null
    const [dataNumSearch, setDataNumSearch] = useState("");

    const getToken = () => {
        if (typeof localStorage !== "undefined") {
            return localStorage.getItem("token");
        }
        return null;
    };

    const token = getToken();

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setRoleId(decoded.id);
            } catch (error) {
                console.error("Failed to decode token:", error);
            }
        }
    }, [token]);

    const fetchOrderBuyBack = async (phoneNumber) => {
        if (!roleId) return;  // Only fetch if roleId is defined

        setLoading(true);
        try {
            const responseOrderToBuyBack = await axios.get(
                `https://four-gems-system-790aeec3afd8.herokuapp.com/warranty-card/view-warranty-history?userId=${roleId}&warrantyCardCode=${dataNumSearch}`,
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );
            setBuybackCus(responseOrderToBuyBack.data.data);
        } catch (error) {
            console.error("Failed to fetch order buy back:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBtnSearch = async () => {
        await fetchOrderBuyBack(dataNumSearch);
    };

    const SEARCH_BUTTON = (
        <Button
            color="primary"
            disableElevation
            variant="contained"
            onClick={handleBtnSearch}
            sx={{
                px: "2rem",
                height: "100%",
                borderRadius: "0 20px 20px 0",
            }}
        >
            Search
        </Button>
    );

    return (
        <QCDashboardLayout>
            <Box
                className="searchBox"
                sx={{ width: "100%", margin: "0 auto", mb: 3 }}
            >
                <TextField
                    placeholder="Please enter warranty code."
                    fullWidth
                    InputProps={{
                        sx: {
                            height: 50,
                            paddingRight: 0,
                            color: "grey.700",
                            background: "#fff",
                            borderRadius: "20px",
                            mt: 3,
                            "& fieldset": {
                                border: "none",
                            },
                        },
                        endAdornment: SEARCH_BUTTON,
                        startAdornment: <SearchOutlinedIcon fontSize="small" />,
                    }}
                    onChange={(e) => setDataNumSearch(e.target.value)}
                />
            </Box>
            {buybackCus?.map((order) => (
                <TableRow
                    sx={{
                        mb: 2,
                        padding: "6px 18px",
                    }}
                    key={order.id}
                >
                    <Typography
                        whiteSpace="pre"
                        m={0.75}
                        textAlign="left"
                    >
                        {order.id}
                    </Typography>

                    <Typography
                        flex="1 1 260px !important"
                        m={0.75}
                        textAlign="left"
                    >
                        {convertDate(order.date)}
                    </Typography>
                </TableRow>
            ))}
        </QCDashboardLayout>
    );
};

export default WarrantyHistory;
