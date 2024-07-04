import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Button,
    Grid,
    MenuItem,
    TextField,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Box,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Link from "next/link";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import ProductCardRotateGoodsList from "../../../src/components/products/ProductCardRotateGoodsList";
import ProductCardRotateGoodsDetail from "../../../src/components/product-cards/ProductCardRotateGoodsDetail";
import SEO from "components/SEO";
import { useAppContext } from "contexts/AppContext";
import Card1 from "../../../src/components/Card1";
import { H5 } from "../../../src/components/Typography";

const RotateDetails = () => {
    const { state } = useAppContext();
    const cartList = state.cart;
    const [rotateId, setRotateId] = useState({ counterId: "" });
    const [counterInfo, setCounterInfo] = useState(null);
    const [popupOpen, setPopupOpen] = useState(false);
    const [confirmPopup, setConfirmPopup] = useState(false);
    const [rotateGoods, setRotateGoods] = useState([]);
    const [loading, setLoading] = useState(true);
    let token = "";

    // Retrieve token from local storage if available
    if (typeof localStorage !== "undefined") {
        token = localStorage.getItem("token");
    } else if (typeof sessionStorage !== "undefined") {
        token = localStorage.getItem("token");
    } else {
        console.log("Web Storage is not supported in this environment.");
    }

    // Fetch rotate goods data based on counterId
    useEffect(() => {
        const counterId = localStorage.getItem("counterId");
        const fetchProductRotate = async () => {
            try {
                const response = await axios.get(
                    `https://four-gems-system-790aeec3afd8.herokuapp.com/product/get-product-quantity-less-than?counterid=${counterId}&quantity=20`,
                    {
                        headers: {
                            Authorization: "Bearer " + token,
                        },
                    }
                );
                console.log("Full response:", response.data.data);
                setRotateGoods(response.data.data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductRotate();
    }, [token]);

    // Handle form submission for rotate details
    const handleFormSubmit = async (values) => {
        setRotateId(values);
        const counterId = localStorage.getItem("counterId");
        if (counterId === values.counterId) {
            setPopupOpen(true);
        } else {
            setConfirmPopup(true);
        }
    };

    // Validation schema for Formik form
    const validationSchema = yup.object().shape({
        counterId: yup.string().required("Counter ID is required"),
    });

    // Close popup dialog
    const handleClosePopup = () => {
        setPopupOpen(false);
    };

    // Handle confirmation of rotate goods transfer
    const handleConfirmTransfer = async (values) => {
        setConfirmPopup(false);
        const counterId = localStorage.getItem("counterId");
        const RotateRequest = {
            fromCounterId: parseInt(counterId),
            toCounterId: parseInt(values.counterId),
            productTransferRequestList: cartList.map((item) => ({
                productId: item.id,
                quantity: item.qty,
            })),
        };
        try {
            // Make API call to create rotate goods request
            const createRotateRequest = await axios.post(
                `https://four-gems-system-790aeec3afd8.herokuapp.com/transfer-request`,
                RotateRequest,
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );
            console.log("Rotate request created:", createRotateRequest.data.data.orderId);
        } catch (error) {
            console.error("Failed to create rotate request:", error);
        }
        // Redirect user after successful request (optional)
        // setTimeout(() => {
        //   router.push("/checkout");
        // }, 3000);
    };

    return (
        <VendorDashboardLayout>
            <SEO title="Rotate Goods" />
            <Grid container spacing={3} sx={{ mt: 1 }}>
                {/* Order List Section */}
                <Grid item xs={12} md={8}>
                    <Box>
                        <div style={styles.gridContainer}>
                            {loading ? (
                                <h1>Loading...</h1>
                            ) : (
                                rotateGoods.map((product, index) => (
                                    <div key={index}>
                                        <ProductCardRotateGoodsList products={[product]} />
                                    </div>
                                ))
                            )}
                        </div>
                    </Box>
                </Grid>
                <Grid item xs={12} md={4}>
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
                                            <Grid
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    marginBottom: "7px",
                                                }}
                                            >
                                                <H5 sx={{ marginRight: "10px", marginTop: "1px" }}>
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
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        sx={{ mt: 1 }}
                                    >
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
                    <Button
                        onClick={() => handleConfirmTransfer(rotateId)}
                        color="primary"
                        autoFocus
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </VendorDashboardLayout>
    );
};

const styles = {
    gridContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "16px",
    },
};

export default RotateDetails;
