import { useCallback, useState } from "react";
import { Button, Card, IconButton, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import * as yup from "yup";
import { useFormik } from "formik";
import { H1 } from "components/Typography";
import BazaarImage from "components/BazaarImage";
import BazaarTextField from "components/BazaarTextField";
import axios from "axios";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { RemoveRedEye } from "@mui/icons-material";
import TableHeaderCustomer from "../dashboard/table/TableHeaderCustomer";

const fbStyle = {
    background: "#3B5998",
    color: "white",
};
const googleStyle = {
    background: "#4285F4",
    color: "white",
};
const tableHeading = [
    {
        id: "orderName",
        label: "Product Name",
        align: "center",
    },
    {
        id: "orderDate",
        label: "Order Date",
        align: "center",
    },
    {
        id: "expiredDate",
        label: "Expired Date",
        align: "center",
    },
    {
        id: "url",
        label: "Warranty Card",
        align: "center",
    },
];
export const Wrapper = styled(({ children, ...rest }) => (
    <Card {...rest}>{children}</Card>
))(({ theme }) => ({
    display: 'flex',
    width: '100%',
    padding: "2rem 3rem",
    [theme.breakpoints.down("sm")]: {
        width: "100%",
        flexDirection: "column",
    },
    ".facebookButton": {
        marginBottom: 10,
        ...fbStyle,
        "&:hover": fbStyle,
    },
    ".googleButton": { ...googleStyle, "&:hover": googleStyle },
    ".agreement": {
        marginTop: 12,
        marginBottom: 24,
    },
}));

const FormWrapper = styled('div')(({ theme }) => ({
    position: 'sticky',
    top: '20px',
    alignSelf: 'flex-start',
    width: '300px',
}));

const Warranty = () => {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const [warrantyCus, setWarrantyCustom] = useState([]);
    const handleFormSubmit = async (values) => {
        const { orderId, customerPhoneNumber } = values;
        try {
            const response = await axios.get(
                `https://four-gems-system-790aeec3afd8.herokuapp.com/warranty-card/view-warranty-customer?orderId=${orderId}&customerPhoneNumber=${customerPhoneNumber}`,
            );
            setWarrantyCustom(response.data.data);
            console.log(response.data.data);
        } catch (e) {
            enqueueSnackbar("Order does not exist. Please try again.", {
                variant: "error",
            });
        }
    };
    const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
        useFormik({
            initialValues,
            onSubmit: handleFormSubmit,
            validationSchema: formSchema,
        });
    const handleViewOrderDetail = (url) => {
        window.open(url, '_blank');
    }
    function convertDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
        return formattedDate;
    }
    return (
        <Wrapper elevation={3} sx={{
            width: '70%',
        }}>
            <FormWrapper>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', paddingRight: '16px' }}>
                    <BazaarImage
                        src="/logo.png"
                        sx={{
                            width: "100px",
                            height: "100px",
                            m: "auto",
                        }}
                    />

                    <H1 textAlign="center" mt={1} mb={4} fontSize={16}>
                        View Warranty Card
                    </H1>
                    <BazaarTextField
                        mb={1.5}
                        fullWidth
                        name="orderId"
                        size="small"
                        type="text"
                        variant="outlined"
                        onBlur={handleBlur}
                        value={values.orderId}
                        onChange={handleChange}
                        label="Order Id"
                        error={!!touched.orderId && !!errors.orderId}
                        helperText={touched.orderId && errors.orderId}
                    />

                    <BazaarTextField
                        mb={2}
                        fullWidth
                        size="small"
                        name="customerPhoneNumber"
                        label="Customer Phone Number"
                        autoComplete="on"
                        variant="outlined"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.customerPhoneNumber}
                        error={!!touched.customerPhoneNumber && !!errors.customerPhoneNumber}
                        helperText={touched.customerPhoneNumber && errors.customerPhoneNumber}
                    />

                    <Button
                        fullWidth
                        type="submit"
                        color="primary"
                        variant="contained"
                        sx={{
                            height: 44,
                        }}
                    >
                        Find my Warranty
                    </Button>
                </form>
            </FormWrapper>

            <div style={{ flex: 10, padding: '0 16px', overflowY: 'auto', marginLeft: '60px' }}>
                {warrantyCus.length > 0 ? (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {tableHeading.map((heading) => (
                                        <TableCell key={heading.id} align={heading.align}>
                                            {heading.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {warrantyCus.map((order) => (
                                    <TableRow key={order.code}>
                                        <TableCell align="center">{order.product.productName}</TableCell>
                                        <TableCell align="center">{convertDate(order.orderDate)}</TableCell>
                                        <TableCell align="center">{convertDate(order.expiredDate)}</TableCell>
                                        <TableCell align="center">
                                            <IconButton onClick={() => handleViewOrderDetail(order.url)}>
                                                <RemoveRedEye fontSize="small" color="inherit" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography textAlign="center" mt={2}>
                        No orders found.
                    </Typography>
                )}
            </div>
        </Wrapper>
    );
};

const initialValues = {
    orderId: "",
    customerPhoneNumber: "",
};
const formSchema = yup.object().shape({
    orderId: yup
        .number()
        .typeError("Order Id must be a number")
        .required("Order Id is required"),
    customerPhoneNumber: yup
        .string()
        .matches(/^0\d{9}$/, "Phone number must be exactly 10 digits and start with 0")
        .required("Phone number is required"),
});
export default Warranty;
