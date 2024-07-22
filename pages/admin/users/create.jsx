import { Box } from "@mui/material";
import * as yup from "yup";
import { H3 } from "components/Typography";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import AccountForm from "../../../src/pages-sections/admin/accounts/AccountForm";
import axios from "axios";
import { useRouter } from "next/router"; // =============================================================================

CreateAccount.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

export default function CreateAccount() {
  const router = useRouter();
  const INITIAL_VALUES = {
    userName: "",
    name: "",
    address: "",
    email: "",
    password: "",
    phoneNumber: "",
    roleId: "",
    counterId: "",
  };
  const validationSchema = yup.object().shape({
    name: yup.string().required("required"),
    userName: yup.string().required("required"),
    address: yup.string().required("required"),
    email: yup.string().email("Invalid email address").required("required"),
    password: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters long"),
    phoneNumber: yup
        .string()
        .matches(/^0\d{9}$/, "Phone number must be exactly 10 digits and start with 0")
        .required("Phone number is required"),
    roleId: yup.string().required("required"),
    counterId: yup.string().required("required"),
  });

  const handleFormSubmit = async (values) => {
    const accountNew = {
      name: values.name,
      userName: values.userName,
      address: values.address,
      email: values.email,
      password: values.password,
      phoneNumber: values.phoneNumber,
      roleId: values.roleId,
      counterId: values.counterId,
    };
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://four-gems-system-790aeec3afd8.herokuapp.com/user/signup",
        accountNew,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
    } catch (e) {
      console.log(e);
    }
    await router.push("/admin/users-account");
  };
  return (
    <Box py={4}>
      <H3 mb={2}>Add New User</H3>

      <AccountForm
        initialValues={INITIAL_VALUES}
        validationSchema={validationSchema}
        handleFormSubmit={handleFormSubmit}
      />
    </Box>
  );
}
