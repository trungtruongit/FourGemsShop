import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCardRotateGoodsList from "../../../src/components/products/ProductCardRotateGoodsList";
import {Box, Button} from "@mui/material";
import Link from "next/link";
OrderList.getLayout = function getLayout(page) {
    return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};
export default function OrderList() {
    const [rotateGoods, setRotateGoods] = useState([]);
    const [loading, setLoading] = useState(true);
    let token = "";
    if (typeof localStorage !== "undefined") {
        token = localStorage.getItem("token");
    } else if (typeof sessionStorage !== "undefined") {
        token = localStorage.getItem("token");
    } else {
        console.log("Web Storage is not supported in this environment.");
    }

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
    }, []);

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return (
        <div>
            {/* ORDER ITEM LIST */}
            <div style={styles.gridContainer}>
                {rotateGoods.map((product, index) => (
                    <div key={index}>
                        <ProductCardRotateGoodsList products={[product]} />
                    </div>
                ))}
            </div>
            {/* VIEW CART BUTTON */}
            <Box mt={2} display="flex" justifyContent="center">
                <Link href="/admin/rotate/rotate-details" passHref>
                    <Button
                        color="primary"
                        variant="outlined"
                        sx={{
                            height: 40,
                        }}
                    >
                        Send Rotate Request
                    </Button>
                </Link>
            </Box>
        </div>
    );
}

const styles = {
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
    },
};
