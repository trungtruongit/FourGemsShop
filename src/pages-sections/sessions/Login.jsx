import { useCallback, useState } from "react";
import { Button, Card, styled } from "@mui/material";
import Link from "next/link";
import * as yup from "yup";
import { useFormik } from "formik";
import { H1 } from "components/Typography";
import BazaarImage from "components/BazaarImage";
import BazaarTextField from "components/BazaarTextField";
import EyeToggleButton from "./EyeToggleButton";
import axios from "axios";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";

const fbStyle = {
    background: "#3B5998",
    color: "white",
};
const googleStyle = {
    background: "#4285F4",
    color: "white",
};
export const Wrapper = styled(({ children, passwordVisibility, ...rest }) => (
    <Card {...rest}>{children}</Card>
))(({ theme, passwordVisibility }) => ({
    width: 500,
    padding: "2rem 3rem",
    [theme.breakpoints.down("sm")]: {
        width: "100%",
    },
    ".passwordEye": {
        color: passwordVisibility
            ? theme.palette.grey[600]
            : theme.palette.grey[400],
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

const Login = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const togglePasswordVisibility = useCallback(() => {
        setPasswordVisibility((visible) => !visible);
    }, []);
    const nav = useRouter();
    const handleFormSubmit = async (values) => {
        const { email, password } = values;
        localStorage.setItem("username", email);
        try {
            const response = await axios.post(
                `https://four-gems-system-790aeec3afd8.herokuapp.com/user/signin?username=${email}&password=${password}`,
                {
                    username: email,
                    password: password,
                }
            );
            if (response.data.data === true) {
                enqueueSnackbar(
                    "Please enter the OTP sent to your phone number",
                    { variant: "success" }
                );
                nav.push("/otp");
            } else {
                enqueueSnackbar(
                    "Please enter the right username and password",
                    { variant: "error" }
                );
            }
        } catch (e) {
            console.log(e);
            enqueueSnackbar("An error occurred. Please try again.", {
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
    return (
        <Wrapper elevation={3} passwordVisibility={passwordVisibility}>
            <form onSubmit={handleSubmit}>
                <BazaarImage
                    src="/logo.png"
                    sx={{
                        width: "100px",
                        height: "100px",
                        m: "auto",
                    }}
                />

                <H1 textAlign="center" mt={1} mb={4} fontSize={16}>
                    Welcome To FourGems Shop
                </H1>

                <BazaarTextField
                    mb={1.5}
                    fullWidth
                    name="email"
                    size="small"
                    type="text"
                    variant="outlined"
                    onBlur={handleBlur}
                    value={values.email}
                    onChange={handleChange}
                    label="Username"
                    placeholder="example@mail.com"
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                />

                <BazaarTextField
                    mb={2}
                    fullWidth
                    size="small"
                    name="password"
                    label="Password"
                    autoComplete="on"
                    variant="outlined"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    placeholder="*********"
                    type={passwordVisibility ? "text" : "password"}
                    error={!!touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                    InputProps={{
                        endAdornment: (
                            <EyeToggleButton
                                show={passwordVisibility}
                                click={togglePasswordVisibility}
                            />
                        ),
                    }}
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
                    Login
                </Button>
            </form>
        </Wrapper>
    );
};

const initialValues = {
    email: "",
    password: "",
};
const formSchema = yup.object().shape({
    password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    email: yup
        .string()
        .min(1, "Username must be between 1 and 50 characters")
        .max(50, "Username must be between 1 and 50 characters")
        .matches(/^\S.*$/, "Username cannot start with a space")
        .required("Username is required"),
});
export default Login;
