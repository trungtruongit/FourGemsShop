import Link from "next/link";
import { useEffect, useState } from "react";
import { Delete, RemoveRedEye } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Pagination, TextField, Typography } from "@mui/material";
import TableRow from "components/TableRow";
import { FlexBox } from "components/flex-box";
import CustomerDashboardLayout from "components/layouts/customer-dashboard";
import axios from "axios";
import { useRouter } from "next/router";
import api from "utils/__api__/address";
import { SearchOutlinedIcon } from "../../src/components/search-box/styled";
import Card1 from "../../src/components/Card1";
import { H5 } from "../../src/components/Typography";

const AddressList = ({ addressList }) => {
    const [allAddress, setAllAddress] = useState(addressList);
    const [loading, setLoading] = useState(false);
    const [buybackCus, setBuybackCus] = useState();
    const [customerInfo, setCustomerInfo] = useState("");
    const [dataNumSearch, setDataNumSearch] = useState("");
    const router = useRouter();
    let token = "";

    if (typeof localStorage !== "undefined") {
        token = localStorage.getItem("token");
    } else if (typeof sessionStorage !== "undefined") {
        token = localStorage.getItem("token");
    } else {
        console.log("Web Storage is not supported in this environment.");
    }

    useEffect(() => {
        const fetchOrderBuyBack = async () => {
            setLoading(true);
            try {
                const responseOrderToBuyBack = await axios.get(
                    `https://four-gems-api-c21adc436e90.herokuapp.com/order/get-order-to-buy-back`,
                    {
                        headers: {
                            Authorization: "Bearer " + token,
                        },
                    }
                );
                setBuybackCus(responseOrderToBuyBack.data.data);
                console.log(responseOrderToBuyBack.data.data);
            } catch (error) {
                console.error("Failed to fetch order buy back:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderBuyBack();
    }, []);

    const handleBtnSearch = async () => {
        const fetchSearchCustomInfo = async () => {
            try {
                const resCusInfo = await axios.get(
                    `https://four-gems-api-c21adc436e90.herokuapp.com/customers?phoneNumber=${dataNumSearch}`,
                    {
                        headers: {
                            Authorization: 'Bearer ' + token
                        }
                    });
                if (resCusInfo.data.data.length === 0) {
                    await router.push("/admin/customerInfo/create");
                } else {
                    setCustomerInfo(resCusInfo.data.data[0]);
                }
                console.log(resCusInfo.data.data[0]);
            } catch (error) {
                console.error("Failed to fetch customer:", error);
            }
        };
        fetchSearchCustomInfo();
    };

    const SEARCH_BUTTON = (
        <Button
            color="primary"
            disableElevation
            variant="contained"
            onClick={() => handleBtnSearch()}
            sx={{
                px: "2rem",
                height: "100%",
                borderRadius: "0 20px 20px 0",
            }}
        >
            Search
        </Button>
    );

    const handleAddressDelete = () => {
        // Implement address delete functionality
    };

    return (
        <CustomerDashboardLayout>
            <Box className="searchBox" sx={{ width: '100%', margin: '0 auto', mb: 3 }}>
                <TextField
                    placeholder="Searching customer by phone number"
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

            {customerInfo && (
                <>
                    <Card1 sx={{ width: '100%', margin: '0 auto', mb: 3 }}>
                        <Typography fontWeight="600" mb={2}>
                            Customer Information
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Grid sx={{ display: "flex", marginBottom: "7px" }}>
                                    <H5 sx={{ marginRight: "10px", marginTop: "1px" }}>Full Name:</H5>
                                    {customerInfo.name}
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <Grid sx={{ display: "flex", marginBottom: "7px" }}>
                                    <H5 sx={{ marginRight: "10px", marginTop: "1px" }}>Phone Number:</H5>
                                    {customerInfo.phoneNumber}
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <Grid sx={{ display: "flex", marginBottom: "7px" }}>
                                    <H5 sx={{ marginRight: "10px", marginTop: "1px" }}>Email:</H5>
                                    {customerInfo.email}
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid sx={{ display: "flex", marginBottom: "7px" }}>
                                    <H5 sx={{ marginRight: "10px", marginTop: "1px" }}>Address:</H5>
                                    {customerInfo.address}
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid sx={{ display: "flex", marginBottom: "7px" }}>
                                    <H5 sx={{ marginRight: "10px", marginTop: "1px" }}>Gender:</H5>
                                    {customerInfo.gender}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Card1>

                    {buybackCus?.map((buybackCus) => (
                        <TableRow
                            sx={{
                                mb: 2,
                                padding: "6px 18px",
                            }}
                            key={buybackCus.orderId}
                        >
                            <Typography whiteSpace="pre" m={0.75} textAlign="left">
                                {buybackCus.orderId}
                            </Typography>

                            <Typography flex="1 1 260px !important" m={0.75} textAlign="left">
                                {buybackCus.customerName}
                            </Typography>

                            <Typography whiteSpace="pre" m={0.75} textAlign="left">
                                {buybackCus.orderDate}
                            </Typography>

                            <Typography whiteSpace="pre" textAlign="center" color="grey.600">
                                <Link href={`/address/${buybackCus.orderId}`} passHref>
                                    <IconButton>
                                        <RemoveRedEye fontSize="small" color="inherit" />
                                    </IconButton>
                                </Link>

                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddressDelete(buybackCus.orderId);
                                    }}
                                >
                                    <Delete fontSize="small" color="inherit" />
                                </IconButton>
                            </Typography>
                        </TableRow>
                    ))}

                    <FlexBox justifyContent="center" mt={5}>
                        <Pagination count={5} onChange={(data) => console.log(data)} />
                    </FlexBox>
                </>
            )}
        </CustomerDashboardLayout>
    );
};

export const getStaticProps = async () => {
    const addressList = await api.getAddressList();
    return {
        props: {
            addressList,
        },
    };
};

export default AddressList;
