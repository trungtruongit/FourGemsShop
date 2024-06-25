import Link from "next/link";
import {Box, Button, Divider, Grid, TextField, Typography} from "@mui/material";
import SEO from "components/SEO";
import { FlexBetween} from "components/flex-box";
import ProductCard7 from "components/product-cards/ProductCard7";
import { useAppContext } from "contexts/AppContext";
import { currency } from "lib";
import Card1 from "../src/components/Card1";
import {SearchOutlinedIcon} from "../src/components/search-box/styled";
import {H5} from "../src/components/Typography";
import {useRouter} from "next/router";
import {useState} from "react";
import axios from "axios";
import {Formik} from "formik";
import * as yup from "yup";
import SaleLayout from "../src/components/layouts/SaleLayout";

const Cart = () => {
    const { state } = useAppContext();
    const cartList = state.cart;
    const router = useRouter();
    const getTotalPrice = () =>
        cartList.reduce((accum, item) => accum + item.price * item.qty, 0);
    const tax = getTotalPrice() * 0.08;
    const [customerInfo, setCustomerInfo] = useState("");
    const handleFormSubmit = async (values) => {
        router.push("/payment");
    };
    const [dataNumSearch, setDataNumSearch] = useState("");
    let token = '';
    if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem('token');
    } else if (typeof sessionStorage !== 'undefined') {
        // Fallback to sessionStorage if localStorage is not supported
        token = localStorage.getItem('token');
    } else {
        // If neither localStorage nor sessionStorage is supported
        console.log('Web Storage is not supported in this environment.');
    }
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
    const handleBtnSearch = async () => {
        const fetchSearchCustomInfo = async () => {
            try {
                const resCusInfo = await axios.get(`https://four-gems-api-c21adc436e90.herokuapp.com/customers?phoneNumber=${dataNumSearch}`,
                    {
                        headers: {
                            Authorization: 'Bearer ' + token //the token is a variable which holds the token
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
    return (
        <SaleLayout>
            <SEO title="Cart" />
            <Grid container spacing={3}>
                <Grid item md={12} xs={12}>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={checkoutSchema}
                        onSubmit={handleFormSubmit}
                    >
                        {({
                              values,
                              errors,
                              touched,
                              handleChange,
                              handleBlur,
                              handleSubmit,
                              setFieldValue,
                          }) => (
                            <form onSubmit={handleSubmit}>
                                <Box className="searchBox">
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
                                                mb: 2,
                                                "& fieldset": {
                                                    border: "none",
                                                },
                                            },
                                            endAdornment: SEARCH_BUTTON,
                                            startAdornment: <SearchOutlinedIcon fontSize="small"/>,
                                        }}
                                        onChange={(e) => setDataNumSearch(e.target.value)}
                                    />
                                </Box>
                                <Card1
                                    sx={{
                                        mb: 4,
                                    }}
                                >
                                    <Typography fontWeight="600" mb={2}>
                                        Customer Infomation
                                    </Typography>

                                    <Grid container spacing={6}>
                                        <Grid item sm={6} xs={12}>
                                            <Grid sx={{
                                                display: "flex",
                                                marginBottom: "7px",
                                            }}><H5 sx={{
                                                marginRight: "10px",
                                                marginTop: "1px",
                                            }}>Full Name:</H5>
                                                {customerInfo.name}
                                            </Grid>
                                            <Grid sx={{
                                                display: "flex",
                                                marginBottom: "7px",
                                            }}><H5 sx={{
                                                marginRight: "10px",
                                                marginTop: "1px",
                                            }}>Phone Number:</H5>
                                                {customerInfo.phoneNumber}
                                            </Grid>
                                            <Grid sx={{
                                                display: "flex",
                                                marginBottom: "7px",
                                            }}><H5 sx={{
                                                marginRight: "10px",
                                                marginTop: "1px",
                                            }}>Address:</H5>
                                                {customerInfo.address}
                                            </Grid>
                                        </Grid>

                                        <Grid item sm={6} xs={12}>
                                            <Grid sx={{
                                                display: "flex",
                                                marginBottom: "7px",
                                            }}><H5 sx={{
                                                marginRight: "10px",
                                                marginTop: "1px",
                                            }}>Email:</H5>
                                                {customerInfo.email}
                                            </Grid>
                                            <Grid sx={{
                                                display: "flex",
                                                marginBottom: "7px",
                                            }}><H5 sx={{
                                                marginRight: "10px",
                                                marginTop: "1px",
                                            }}>Gender:</H5>
                                                {customerInfo.gender}
                                            </Grid>

                                        </Grid>
                                    </Grid>
                                </Card1>
                                <Divider
                                    sx={{
                                        mb: "1rem",
                                    }}
                                />
                            </form>
                        )}
                    </Formik>
                </Grid>
            </Grid>
        </SaleLayout>
    );
};
const initialValues = {
    custom_fullname: "",
    custom_phoneNum: "",
    custom_email: "",
    custom_gender: "",
    shipping_address2: "",
};
const checkoutSchema = yup.object().shape({

});
export default Cart;
