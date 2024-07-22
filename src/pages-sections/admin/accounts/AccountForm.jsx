import React, {useEffect, useState} from "react";
import { Button, Card, Grid, MenuItem, TextField } from "@mui/material";
import { Formik } from "formik";
import axios from "axios";
const AccountForm = (props) => {
  const { initialValues, validationSchema, handleFormSubmit } = props;
  const [files, setFiles] = useState([]); // HANDLE UPDATE NEW IMAGE VIA DROP ZONE
  const [productPulish, setProductPublish] = useState();
  const [counters, setCounters] = useState([]);
  let token = "";
  if (typeof localStorage !== "undefined") {
    token = localStorage.getItem("token");
  } else if (typeof sessionStorage !== "undefined") {
    token = sessionStorage.getItem("token");
  } else {
  }

  useEffect(() => {
    const fetchCounters = async () => {
      try {
        const response = await axios.get(
            `https://four-gems-system-790aeec3afd8.herokuapp.com/counter`,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
        );
        setCounters(response.data.data);
      } catch (error) {
        console.error("Failed to fetch counters:", error);
      }
    };

    fetchCounters();
  }, [token]);
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
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="userName"
                  label="User Name"
                  color="info"
                  size="medium"
                  placeholder="User Name"
                  value={values.userName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.userName && !!errors.userName}
                  helperText={touched.userName && errors.userName}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="name"
                  label="Full Name"
                  color="info"
                  size="medium"
                  placeholder="Full Name"
                  value={values.name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="address"
                  label="Address"
                  color="info"
                  size="medium"
                  placeholder="Address"
                  value={values.address}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.address && !!errors.address}
                  helperText={touched.address && errors.address}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  color="info"
                  size="medium"
                  placeholder="Email"
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="phoneNumber"
                  label="Phone Number"
                  color="info"
                  size="medium"
                  placeholder="Phone Number"
                  value={values.phoneNumber}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.phoneNumber && !!errors.phoneNumber}
                  helperText={touched.phoneNumber && errors.phoneNumber}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  color="info"
                  size="medium"
                  placeholder="Password"
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  select
                  fullWidth
                  color="info"
                  size="medium"
                  name="counterId"
                  onBlur={handleBlur}
                  placeholder="CounterId"
                  onChange={handleChange}
                  value={values.counterId}
                  label="CounterId"
                  error={!!touched.counterId && !!errors.counterId}
                  helperText={touched.counterId && errors.counterId}
                >
                  {counters.map((counter) => (
                      <MenuItem
                          key={counter.counterId}
                          value={counter.counterId}
                      >
                        Counter {counter.counterId}
                      </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  select
                  fullWidth
                  color="info"
                  size="medium"
                  name="roleId"
                  onBlur={handleBlur}
                  placeholder="RoleId"
                  onChange={handleChange}
                  value={values.roleId}
                  label="RoleId"
                  error={!!touched.roleId && !!errors.roleId}
                  helperText={touched.roleId && errors.roleId}
                >
                  <MenuItem value="4">QC</MenuItem>
                  <MenuItem value="3">Admin</MenuItem>
                  <MenuItem value="2">Manager</MenuItem>
                  <MenuItem value="1">Staff</MenuItem>
                </TextField>
              </Grid>
              <Grid item sm={12} xs={12}>
                <Button variant="contained" color="info" type="submit">
                  Add user
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Card>
  );
};

export default AccountForm;
