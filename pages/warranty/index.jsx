import { Box } from "@mui/material";
import * as yup from "yup";
import { H3 } from "components/Typography";
import { jwtDecode } from "jwt-decode";
import WarrantyForm from "../../src/pages-sections/warranty-form/WarrantyForm";
import QCDashboardLayout from "../../src/components/layouts/customer-dashboard/QCPage";
import axios from "axios";
import {useSnackbar} from "notistack"; // =============================================================================

CreateAccount.getLayout = function getLayout(page) {
    return <QCDashboardLayout>{page}</QCDashboardLayout>;
}; // =============================================================================

export default function CreateAccount() {
    let token = "";
    if (typeof localStorage !== "undefined") {
        token = localStorage.getItem("token");
    } else if (typeof sessionStorage !== "undefined") {
        token = localStorage.getItem("token");
    }
    const decoded = jwtDecode(token);
    const INITIAL_VALUES = {
        warrantyCardCode: "",
    };
    const { enqueueSnackbar } = useSnackbar();
    const validationSchema = yup.object().shape({
        warrantyCardCode: yup
            .string()
            .required("Warranty card code is required")
            .matches(
                /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
                "Warranty card code must be a valid UUID"
            ),
    });

    const handleFormSubmit = async (values) => {
        const accountNew = {
            userId: decoded.id,
            warrantyCardCode: values.warrantyCardCode,
        };
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `https://four-gems-system-790aeec3afd8.herokuapp.com/warranty-card/make-warranty?userId=${decoded.id}&warrantyCardCode=${values.warrantyCardCode}`,
                accountNew,
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                },
            );
            enqueueSnackbar("Warranty Successfully.", {
                variant: "success",
            });
        } catch (e) {
            enqueueSnackbar("Warranty Failed.", {
                variant: "danger",
            });
        }
    };
    return (
        <Box py={4}>
            <H3 mb={2}>Warranty</H3>
            <WarrantyForm
                initialValues={INITIAL_VALUES}
                validationSchema={validationSchema}
                handleFormSubmit={handleFormSubmit}
            />
        </Box>
    );
}
