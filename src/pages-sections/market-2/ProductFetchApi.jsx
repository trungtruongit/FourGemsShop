import React, { useEffect, useState } from "react";
import ProductSection from "./ProductSection";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const ProductFetchApi = ({ categoryName }) => {
    const [categoryProduct, setCategoryProduct] = useState([]);
    console.log(categoryName);
    useEffect(() => {
        const fetchProduct = async () => {
            const token = localStorage.getItem("token");
            const decoded = jwtDecode(token);
            const counterId = decoded?.counterId;
            try {
                const resProduct = await axios.get(
                    `https://four-gems-system-790aeec3afd8.herokuapp.com/product/show-product?countId=${counterId}&pageSize=300&page=0&sortKeyword=productId&sortType=ASC&categoryName=${categoryName}&searchKeyword= `,
                    {
                        headers: {
                            Authorization: "Bearer " + token, //the token is a variable which holds the token
                        },
                    }
                );
                setCategoryProduct(
                    resProduct?.data?.data.filter((res) => res.active === true)
                );
            } catch (e) {
                console.log(e);
            }
        };
        fetchProduct();
    }, []);

    return (
        <ProductSection
            products={categoryProduct}
            title={categoryName}
            category={categoryName}
        />
    );
};

export default ProductFetchApi;
