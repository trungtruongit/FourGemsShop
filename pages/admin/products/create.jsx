import { Box } from "@mui/material";
import * as yup from "yup";
import { H3 } from "components/Typography";
import { ProductForm } from "pages-sections/admin";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { useState } from "react";
import axios from "axios";

CreateProduct.getLayout = function getLayout(page) {
    return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};

export default function CreateProduct() {
    const [productPublish, setProductPublish] = useState(1);
    const [files, setFiles] = useState([]); // Files will now contain URLs

    const INITIAL_VALUES = {
        productName: "",
        description: "",
        quantityInStock: 0,
        weight: 0,
        laborCost: 0,
        ratioPrice: 0,
        stonePrice: 0,
        goldId: "",
        collectionId: "",
        isJewel: "",
        isGem: "",
        isActive: "",
        typeId: "",
    };

    const validationSchema = yup.object().shape({
        productName: yup.string().required("required"),
        description: yup.string().required("required"),
        quantityInStock: yup.number().required("required"),
        weight: yup.number().required("required"),
        laborCost: yup.number().required("required"),
        ratioPrice: yup.number().required("required"),
        stonePrice: yup.number().required("required"),
        goldId: yup.string().required("required"),
        collectionId: yup.number().required("required"),
        isJewel: yup.number().required("required"),
        isGem: yup.number().required("required"),
        isActive: yup.number().required("required"),
        typeId: yup.number().required("required"),
    });

    const handleFormSubmit = async (values) => {
        const imageUrls = files; // Image URLs from Firebase

        const productNew = {
            productName: values.name,
            weight: values.weight,
            laborCost: values.laborCost,
            ratioPrice: values.ratioPrice,
            stonePrice: values.stonePrice,
            costPrice: values.costPrice,
            isJewel: values.isJewel,
            isGem: values.isGem,
            isActive: values.isActive,
            image: imageUrls[0], // Assuming single image for simplicity
            quantityInStock: values.quantityInStock,
            description: values.description,
            goldId: values.goldId,
            typeId: values.typeId,
            collectionId: values.collectionId,
        };

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "https://four-gems-api-c21adc436e90.herokuapp.com/product/create-product",
                productNew,
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Box py={4}>
            <H3 mb={2}>Add New Product</H3>

            <ProductForm
                files={files}
                setFiles={setFiles}
                setProductPublish={setProductPublish}
                productPublish={productPublish}
                initialValues={INITIAL_VALUES}
                validationSchema={validationSchema}
                handleFormSubmit={handleFormSubmit}
            />
        </Box>
    );
}
