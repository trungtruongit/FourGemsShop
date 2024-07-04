import Link from "next/link";
import { Box, Button, Divider, Grid, MenuItem, TextField, Typography } from "@mui/material";
import SEO from "components/SEO";
import { useAppContext } from "contexts/AppContext";
import { useRouter } from "next/router";
import { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import VendorDashboardLayout from "../../../src/components/layouts/vendor-dashboard";
import Card1 from "../../../src/components/Card1";
import { H5 } from "../../../src/components/Typography";
import ProductCardRotateGoodsDetail from "../../../src/components/product-cards/ProductCardRotateGoodsDetail";
import axios from "axios";

const RotateDetails = () => {
    const { state } = useAppContext();
    const cartList = state.cart;
    const router = useRouter();
    const [customerInfo, setCustomerInfo] = useState("");
    const [rotateId, setRotateId] = useState({ counterId: "" });
    const [counterInfo, setCounterInfo] = useState();
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
    const counterId = localStorage.getItem("counterId");
    const handleFormSubmit = async (values) => {
        setRotateId(values);
        console.log(values.counterId);
        const fetchCounterInfo = async () => {
            try {
                const resCounterInfo = await axios.get(`https://four-gems-system-790aeec3afd8.herokuapp.com/counter/${values.counterId}`,
                    {
                        headers: {
                            Authorization: 'Bearer ' + token //the token is a variable which holds the token
                        }
                    });
                console.log(resCounterInfo.data.data)
                setCounterInfo(resCounterInfo.data.data)
            } catch (error) {
                console.error("Failed to fetch counter info:", error);
            }
        };
        fetchCounterInfo();
        // router.push("/payment");
    };
    const validationSchema = yup.object().shape({
        counterId: yup.string().required("required"),
    });
    return (
        <VendorDashboardLayout>
            <SEO title="Rotate Goods" />
            <Grid container spacing={3} sx={{ mt: 3 }}>
                {/* CART PRODUCT LIST */}
                <Grid item md={8} xs={12}>
                    <Grid container spacing={3}>
                        {cartList.map((item) => (
                            <Grid item md={6} xs={12} key={item.id}>
                                <ProductCardRotateGoodsDetail {...item} />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                <Grid item md={4} xs={12}>
                    <Formik
                        initialValues={rotateId}
                        validationSchema={validationSchema}
                        onSubmit={handleFormSubmit}
                    >
                        {({
                              values,
                              errors,
                              touched,
                              handleChange,
                              handleBlur,
                              handleSubmit,
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
                                        Counter Information
                                    </Typography>

                                    <Grid container spacing={6}>
                                        <Grid item sm={2} xs={12}>
                                            <Grid
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    marginBottom: "7px",
                                                }}
                                            >
                                                <H5
                                                    sx={{
                                                        marginRight: "10px",
                                                        marginTop: "1px",
                                                    }}
                                                >
                                                    Id
                                                </H5>
                                                <Typography>{counterInfo?.counterId}</Typography>
                                            </Grid>
                                        </Grid>

                                        <Grid item sm={10} xs={12}>
                                            <Grid
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    marginBottom: "7px",
                                                }}
                                            >
                                                <H5
                                                    sx={{
                                                        marginRight: "10px",
                                                        marginTop: "1px",
                                                    }}
                                                >
                                                    Manager Name
                                                </H5>
                                                <Typography>{counterInfo?.managerName}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={6} sx={{mt: 1}}>
                                        <Grid item sm={12} xs={12}>
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
                                    </Grid>
                                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{mt:1}}>
                                        Submit
                                    </Button>
                                </Card1>
                            </form>
                        )}
                    </Formik>
                </Grid>
            </Grid>
        </VendorDashboardLayout>
    );
};

export default RotateDetails;
