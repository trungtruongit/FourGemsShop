import { useState, useEffect } from "react";
import { Add, Remove } from "@mui/icons-material";
import { Box, Button, Grid } from "@mui/material";
import LazyImage from "components/LazyImage";
import { H1, H2, H3 } from "components/Typography";
import { useAppContext } from "contexts/AppContext";
import { FlexBox } from "../flex-box";
import { currency } from "lib";

const ProductIntro = ({ product }) => {
    const {
        productId,
        price,
        productName,
        image,
        description,
        quantityInStock,
    } = product;
    const { state, dispatch } = useAppContext();
    const [cartItem, setCartItem] = useState(null);

    useEffect(() => {
        const foundCartItem = state.cart.find(
            (item) => item.productId === productId
        );
        setCartItem(foundCartItem);
    }, [state.cart, productId]);

    const handleCartAmountChange = (amount) => () => {
        if (amount < 0 || amount > quantityInStock) return;

        dispatch({
            type: "CHANGE_CART_AMOUNT",
            payload: {
                price,
                qty: amount,
                name: productName,
                imgUrl: image,
                productId,
            },
        });
    };

    return (
        <Box width="100%">
            <Grid container spacing={3} justifyContent="space-around">
                <Grid item md={6} xs={12} alignItems="center">
                    <FlexBox justifyContent="center" mb={2}>
                        <LazyImage
                            alt={productName}
                            width={590}
                            height={450}
                            bgcolor="white"
                            loading="eager"
                            objectFit="contain"
                            src={image || "/assets/images/logo.png"}
                        />
                    </FlexBox>
                </Grid>

                <Grid
                    bgcolor="white"
                    item
                    md={6}
                    xs={12}
                    mt={3}
                    alignItems="center"
                    height={450}
                >
                    <div
                        style={{
                            display: "grid",
                            textAlign: "center",
                            paddingTop: 7,
                        }}
                    >
                        <H1 mb={2}>{productName}</H1>
                    </div>
                    <div
                        style={{
                            fontFamily: "Ubuntu",
                            fontSize: "25px",
                        }}
                    >
                        <FlexBox
                            alignItems="center"
                            mb={2}
                            paddingRight={2}
                            fontSize={18}
                        >
                            <p>{description}</p>
                        </FlexBox>

                        <Box mb={3}>
                            <H2 color="primary.main" mb={0.5} lineHeight="1">
                                {currency(price)}
                            </H2>
                            <Box>
                                <span
                                    style={{
                                        color: "#102E46",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {quantityInStock}
                                </span>{" "}
                                Available
                            </Box>
                        </Box>

                        {!cartItem?.qty ? (
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={handleCartAmountChange(1)}
                                sx={{
                                    mb: 4.5,
                                    px: "1.75rem",
                                    height: 40,
                                    padding: 2,
                                }}
                            >
                                Add to Cart
                            </Button>
                        ) : (
                            <FlexBox alignItems="center" mb={4.5}>
                                <Button
                                    size="small"
                                    sx={{
                                        p: 1,
                                    }}
                                    color="primary"
                                    variant="outlined"
                                    onClick={handleCartAmountChange(
                                        cartItem.qty - 1
                                    )}
                                >
                                    <Remove fontSize="small" />
                                </Button>

                                <H3 fontWeight="600" mx={2.5}>
                                    {cartItem.qty.toString().padStart(2, "0")}
                                </H3>

                                <Button
                                    size="small"
                                    sx={{
                                        p: 1,
                                    }}
                                    color="primary"
                                    variant="outlined"
                                    onClick={handleCartAmountChange(
                                        cartItem.qty + 1
                                    )}
                                >
                                    <Add fontSize="small" />
                                </Button>
                            </FlexBox>
                        )}
                    </div>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProductIntro;
