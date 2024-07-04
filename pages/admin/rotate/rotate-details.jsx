import Link from "next/link";
import {Box, Button, Divider, Grid, MenuItem, TextField, Typography} from "@mui/material";
import SEO from "components/SEO";
import { useAppContext } from "contexts/AppContext";
import {useRouter} from "next/router";
import {useState} from "react";
import {Formik} from "formik";
import * as yup from "yup";
import VendorDashboardLayout from "../../../src/components/layouts/vendor-dashboard";
import Card1 from "../../../src/components/Card1";
import {H5} from "../../../src/components/Typography";
import ProductCardRotateGoodsDetail from "../../../src/components/product-cards/ProductCardRotateGoodsDetail";

const RotateDetails = () => {
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
    return (
        <VendorDashboardLayout>
            <SEO title="Rotate Goods" />
            <Grid container spacing={3} sx={{mt: 3}}>
                {/* CART PRODUCT LIST */}
                <Grid item md={8} xs={12}>
                    <Grid container spacing={3}>
                        {cartList.map((item) => (
                            <Grid item md={6} xs={12} key={item.id}>
                                <ProductCardRotateGoodsDetail {...item} />
                            </Grid>
                        ))}
                    </Grid>
                    <Grid container spacing={6}>
                        <Grid item sm={6} xs={12}>
                            <Link href="/admin/rotate/rotate-request" passHref>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    type="button"
                                    fullWidth
                                >
                                    Back to Rotate Goods
                                </Button>
                            </Link>
                        </Grid>

                        <Grid item sm={6} xs={12}>
                            <Link href={`/checkout?customerId=${customerInfo.id}`}  passHref>
                                <Button variant="outlined"
                                        color="primary"
                                        type="button"
                                        fullWidth>
                                    Confirm
                                </Button>
                            </Link>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item md={4} xs={12}>
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
                                <Card1
                                    sx={{
                                        mb: 4,
                                    }}
                                >
                                    <Grid item sm={12} xs={12} mb={3}>
                                        <TextField
                                            select
                                            fullWidth
                                            color="info"
                                            size="medium"
                                            name="counterId"
                                            onBlur={handleBlur}
                                            placeholder="Counter"
                                            onChange={handleChange}
                                            value={values.counterId}
                                            label="Counter"
                                            error={!!touched.counterId && !!errors.counterId}
                                            helperText={touched.counterId && errors.counterId}
                                        >
                                            <MenuItem value="1">123 Le Van Viet</MenuItem>
                                            <MenuItem value="2">456 Xa Lo Ha Noi</MenuItem>
                                            <MenuItem value="3">Masteri Thao Dien</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Typography fontWeight="600" mb={2}>
                                        Counter Infomation
                                    </Typography>

                                    <Grid container spacing={6}>
                                        <Grid item sm={4} xs={12}>
                                            <Grid sx={{
                                                display: "flex",
                                                marginBottom: "7px",
                                            }}><H5 sx={{
                                                marginRight: "10px",
                                                marginTop: "1px",
                                            }}>Id:</H5>
                                                {customerInfo.name}
                                            </Grid>
                                        </Grid>

                                        <Grid item sm={8} xs={12}>
                                            <Grid sx={{
                                                display: "flex",
                                                marginBottom: "7px",
                                            }}><H5 sx={{
                                                marginRight: "10px",
                                                marginTop: "1px",
                                            }}>Manager Name:</H5>
                                                {customerInfo.email}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Card1>
                            </form>
                        )}
                    </Formik>
                </Grid>
            </Grid>
        </VendorDashboardLayout>
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
export default RotateDetails;
