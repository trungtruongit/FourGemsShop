import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/router";
import { H3 } from "components/Typography";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { OrderDetails } from "pages-sections/admin";
import axios from "axios"; // =============================================================================

OrderEdit.getLayout = function getLayout(page) {
    return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

export default function OrderEdit() {
    const { query } = useRouter();
    const [orderDetails, setOrderDetails] = useState(null);
    const orderId = localStorage.getItem("orderIdStaff");
    const router = useRouter();
    let token = "";
    if (typeof localStorage !== "undefined") {
        token = localStorage.getItem("token");
    } else if (typeof sessionStorage !== "undefined") {
        // Fallback to sessionStorage if localStorage is not supported
        token = sessionStorage.getItem("token");
    } else {
        // If neither localStorage nor sessionStorage is supported
    }

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const resOrderDetail = await axios.get(
                    `https://four-gems-system-790aeec3afd8.herokuapp.com/warranty-card/view-warranty?orderId=${orderId}`,
                    {
                        headers: {
                            Authorization: "Bearer " + token, // the token is a variable which holds the token
                        },
                    }
                );
                if (
                    resOrderDetail.data.data &&
                    resOrderDetail.data.data.length > 0
                ) {
                    console.log(resOrderDetail.data.data[0].url);
                    window.open(resOrderDetail.data.data[0].url, "_blank");
                    router.push("/orderwarrantystaff/warranty");
                } else {
                    console.log("No data available");
                }

                // setOrderDetails(resOrderDetail.data.data);
            } catch (e) {
                console.log(e);
            }
        };
        fetchOrderDetail();
    }, []);
    if (!orderDetails) {
        return <h1>Loading...</h1>;
    }

    return (
        <Box py={4}>
            <Box
                sx={{
                    display: "flex",
                }}
            >
                <H3 mb={2}>Order Details</H3>
            </Box>
            <OrderDetails order={orderDetails} />
        </Box>
    );
}
