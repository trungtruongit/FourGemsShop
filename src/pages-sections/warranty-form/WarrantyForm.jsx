import React, {useEffect, useState} from "react";
import { Button, Card, Grid, MenuItem, TextField } from "@mui/material";
import { Formik } from "formik";
import axios from "axios";
const WarrantyForm = (props) => {
    const { initialValues, validationSchema, handleFormSubmit } = props;
    let token = "";
    if (typeof localStorage !== "undefined") {
        token = localStorage.getItem("token");
    } else if (typeof sessionStorage !== "undefined") {
        token = sessionStorage.getItem("token");
    } else {
    }
    return (
        <Card
            sx={{
                p: 6,
            }}
        >
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
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
                        <Grid container spacing={3}>
                            <Grid item sm={12} xs={12}>
                                <TextField
                                    fullWidth
                                    name="warrantyCardCode"
                                    label="Warranty Card Code"
                                    color="info"
                                    size="medium"
                                    placeholder="Warranty Card Code"
                                    value={values.warrantyCardCode}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    error={!!touched.warrantyCardCode && !!errors.warrantyCardCode}
                                    helperText={touched.warrantyCardCode && errors.warrantyCardCode}
                                />
                            </Grid>
                            <Grid item sm={12} xs={12}>
                                <Button variant="contained" color="info" type="submit">
                                    Confirm Warranty
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
        </Card>
    );
};

export default WarrantyForm;
