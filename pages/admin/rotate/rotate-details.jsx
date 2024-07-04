import Link from "next/link";
import { Box, Button, Divider, Grid, MenuItem, TextField, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
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
    const [popupOpen, setPopupOpen] = useState(false);
    const [confirmPopup, setConfirmPopup] = useState(false); // State for confirmation popup
    let token = '';
    if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem('token');
    } else if (typeof sessionStorage !== 'undefined') {
        token = localStorage.getItem('token');
    } else {
        console.log('Web Storage is not supported in this environment.');
    }
    const counterId = localStorage.getItem("counterId");
    const productRotateGoods = cartList?.map((item) => ({
        productId: item?.id,
        quantity: item?.qty,
    }));
    console.log(productRotateGoods);
    const handleFormSubmit = async (values) => {
        setRotateId(values);
        if (counterId === values.counterId) {
            setPopupOpen(true);
        } else {
            setConfirmPopup(true); // Show confirmation popup
        }
    };
    const validationSchema = yup.object().shape({
        counterId: yup.string().required("required"),
    });
    const handleClosePopup = () => {
        setPopupOpen(false);
    };
    const handleConfirmTransfer = () => {
        setConfirmPopup(false); // Hide confirmation popup
        const fetchCounterInfo = async () => {
            try {
                const resCounterInfo = await axios.get(`https://four-gems-system-790aeec3afd8.herokuapp.com/counter/${rotateId.counterId}`,
                    {
                        headers: {
                            Authorization: 'Bearer ' + token
                        }
                    });
                console.log(resCounterInfo.data.data);
                setCounterInfo(resCounterInfo.data.data);
            } catch (error) {
                console.error("Failed to fetch counter info:", error);
            }
        };
        fetchCounterInfo();
        const RotateRequest = {
            fromCounterId: counterId,
            toCounterId: values.counterId,
            productTransferRequestList: productRotateGoods,
        }
        console.log(RotateRequest)
        // setTimeout(() => {
        //     router.push("/checkout");
        // }, 3000);
    };

    return (
        <VendorDashboardLayout>
            <SEO title="Rotate Goods" />
            <Grid container spacing={3} sx={{ mt: 3 }}>
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
                                <Card1 sx={{ mb: 4 }}>
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
                                            <Grid sx={{ display: "flex", flexDirection: "column", marginBottom: "7px" }}>
                                                <H5 sx={{ marginRight: "10px", marginTop: "1px" }}>
                                                    Id
                                                </H5>
                                                <Typography>{counterInfo?.counterId}</Typography>
                                            </Grid>
                                        </Grid>

                                        <Grid item sm={10} xs={12}>
                                            <Grid sx={{ display: "flex", flexDirection: "column", marginBottom: "7px" }}>
                                                <H5 sx={{ marginRight: "10px", marginTop: "1px" }}>
                                                    Manager Name
                                                </H5>
                                                <Typography>{counterInfo?.managerName}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={6} sx={{ mt: 1 }}>
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
                                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 1 }}>
                                        Submit
                                    </Button>
                                </Card1>
                            </form>
                        )}
                    </Formik>
                </Grid>
            </Grid>
            <Dialog
                open={popupOpen}
                onClose={handleClosePopup}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"This is your counter"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        The counter ID you have entered matches your counter ID.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePopup} color="primary" autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Confirmation Dialog */}
            <Dialog
                open={confirmPopup}
                onClose={() => setConfirmPopup(false)}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title">Confirm Rotate Goods</DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        Are you sure you want to send rotate request?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmPopup(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmTransfer} color="primary" autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </VendorDashboardLayout>
    );
};

export default RotateDetails;
