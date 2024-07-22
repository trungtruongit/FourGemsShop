import { Box, useTheme } from "@mui/material";
import SEO from "components/SEO";
import Setting from "components/Setting";
import Section5 from "pages-sections/market-2/Section5";
import Section6 from "pages-sections/market-2/Section6";
import Section7 from "pages-sections/market-2/Section7";
import Section8 from "pages-sections/market-2/Section8";
import Section9 from "pages-sections/market-2/Section9";
import ProductSection from "pages-sections/market-2/ProductSection";
import ProductFetchApi from "pages-sections/market-2/ProductFetchApi";
import ShopLayout1 from "components/layouts/ShopLayout1";
import api from "utils/__api__/market-2";
import { useRouter } from "next/router"; // =======================================================
import { H1 } from "components/Typography";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

// =======================================================
const Market = (props) => {
    const theme = useTheme();
    const router = useRouter();
    const [productType, setProductType] = useState([]);
    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }
            const decoded = jwtDecode(token);
            if (decoded?.role === "staff") {
                router.push("/");
            } else if (decoded?.role === "QC") {
                router.push("/qcpage");
            } else {
                router.push("/vendor/dashboard");
            }
        }
    }, []);

    useEffect(() => {
        const fetchProductType = async () => {
            const token = localStorage.getItem("token");
            try {
                const resProductType = await axios.get(
                    `https://four-gems-system-790aeec3afd8.herokuapp.com/product-type`,
                    {
                        headers: {
                            Authorization: "Bearer " + token, //the token is a variable which holds the token
                        },
                    }
                );
                setProductType(resProductType.data.data);
            } catch (e) {
                console.log(e);
            }
        };
        fetchProductType();
    }, []);

    return (
        <ShopLayout1 topbarBgColor={theme.palette.grey[900]}>
            <SEO title="FourGemsShop" />
            <Box bgcolor="#FFFFFF">
                {productType &&
                    productType.map((product) => (
                        <ProductFetchApi categoryName={product.name} />
                    ))}
                <div
                    style={{
                        display: "grid",
                        textAlign: "center",
                        paddingBottom: "1.5rem",
                    }}
                >
                    <H1> Four Gems Jewelry </H1>
                </div>
            </Box>
            {/* SETTINGS IS USED ONLY FOR DEMO, YOU CAN REMOVE THIS */}
            <Setting />
        </ShopLayout1>
    );
};

export const getStaticProps = async () => {
    const products = await api?.getProducts();
    const serviceList = await api?.getServices();
    const categories = await api?.getCategories();
    const mainCarouselData = await api?.getMainCarouselData();
    const menFashionProducts = await api?.getMenFashionProducts();
    const electronicsProducts = await api?.getElectronicsProducts();
    const womenFashionProducts = await api?.getWomenFashionProducts();
    return {
        props: {
            products,
            categories,
            serviceList,
            mainCarouselData,
            menFashionProducts,
            electronicsProducts,
            womenFashionProducts,
        },
    };
};
export default Market;
