import { Button, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import SEO from "components/SEO";
import { FlexBox, FlexRowCenter } from "components/flex-box";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

const Waiting = () => {
    const router = useRouter();
    const [page, setPage] = useState("");
    let token = "";
    if (typeof localStorage !== "undefined") {
        token = localStorage.getItem("token");
    } else if (typeof sessionStorage !== "undefined") {
        // Fallback to sessionStorage if localStorage is not supported
        token = localStorage.getItem("token");
    } else {

    }
    useEffect(() => {
        const fetchStatusOrder = async () => {
            const orderId = localStorage.getItem("orderId");
            try {
                const responseGetOrderStatus = await axios.get(
                    `https://four-gems-system-790aeec3afd8.herokuapp.com/order/status/${orderId}`,
                    {
                        headers: {
                            Authorization: "Bearer " + token, //the token is a variable which holds the token
                        },
                    }
                );
                setPage(responseGetOrderStatus.data.data);
            } catch (error) {
                console.error("Failed to search customers:", error);
            }
        };
        fetchStatusOrder();
        const intervalId = setInterval(fetchStatusOrder, 1000);

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);
    if (page === "Confirm") {
        router.push("payment");
    } else if (page === "Cancel") {
        router.push("/cancel");
    }
    return (
        <FlexRowCenter px={2} minHeight="100vh" flexDirection="column">
            <SEO title="Process Order" />

            <Typography variant="h3" align="center" sx={{ mb: 3 }}>
                Please wait for the confirmation
            </Typography>

            <CircularProgress color="primary" sx={{ mt: 3 }} />
        </FlexRowCenter>
    );
};

export default Waiting;
