import Link from "next/link";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Add, Favorite, Remove, RemoveRedEye } from "@mui/icons-material";
import { Box, Button, Chip, IconButton, styled } from "@mui/material";
import { useSnackbar } from "notistack";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import LazyImage from "components/LazyImage";
import BazaarCard from "components/BazaarCard";
import { H3, Span } from "components/Typography";
import BazaarRating from "components/BazaarRating";
import { useAppContext } from "contexts/AppContext";
import ProductViewDialog from "components/products/ProductViewDialog";
import { FlexBox } from "../flex-box";
import { calculateDiscount, currency } from "lib";

const StyledBazaarCard = styled(BazaarCard)(() => ({
    height: "100%",
    margin: "auto",
    display: "flex",
    overflow: "hidden",
    position: "relative",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "all 250ms ease-in-out",
    ":hover": {
        "& .hover-box": {
            opacity: 1,
        },
    },
}));
const ImageWrapper = styled(Box)(({ theme }) => ({
    textAlign: "center",
    position: "relative",
    display: "inline-block",
    [theme.breakpoints.down("sm")]: {
        display: "block",
    },
}));
const ContentWrapper = styled(Box)(() => ({
    padding: "1rem",
    "& .title, & .categories": {
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
    },
}));

const ProductCard1 = ({
    id,
    slug,
    title,
    price,
    imgUrl,
    hoverEffect,
    discount = 5,
    showProductSize,
    quantityInStock,
    off,
}) => {
    const { enqueueSnackbar } = useSnackbar();
    const { state, dispatch } = useAppContext();
    const [openModal, setOpenModal] = useState(false);
    const [cartItem, setCartItem] = useState(null);

    const toggleDialog = useCallback(() => setOpenModal((open) => !open), []);

    useEffect(() => {
        setCartItem(state.cart.find((item) => item.productId === id));
    }, [state.cart, id]);

    const handleCartAmountChange = (product, type) => () => {
        const currentQty = cartItem?.qty || 0;
        if (type === "add" && currentQty >= quantityInStock) {
            enqueueSnackbar("Cannot add more than available stock", {
                variant: "warning",
            });
            return;
        }
        const object = {
            price: product.price,
            qty: product.qty,
            name: product.name,
            imgUrl: product.imgUrl,
            productId: product.id,
        };
        dispatch({
            type: "CHANGE_CART_AMOUNT",
            payload: object,
        });

        if (type === "remove") {
            enqueueSnackbar("Removed from Cart", {
                variant: "error",
            });
        } else {
            enqueueSnackbar("Added to Cart", {
                variant: "success",
            });
        }
    };

    return (
        <StyledBazaarCard hoverEffect={hoverEffect}>
            <ImageWrapper>
                <Link href={`/product/${id}`}>
                    <a>
                        <LazyImage
                            src={imgUrl}
                            width={0}
                            height={0}
                            layout="responsive"
                            alt={title}
                        />
                    </a>
                </Link>
            </ImageWrapper>

            <ProductViewDialog
                openDialog={openModal}
                handleCloseDialog={toggleDialog}
                product={{
                    title,
                    price,
                    id,
                    slug,
                    imgGroup: [imgUrl, imgUrl],
                }}
            />

            <ContentWrapper>
                <FlexBox>
                    <Box flex="1 1 0" minWidth="0px" mr={1}>
                        <Link href={`/product/${slug}`}>
                            <a>
                                <H3
                                    mb={1}
                                    title={title}
                                    fontSize="14px"
                                    fontWeight="600"
                                    className="title"
                                    color="text.secondary"
                                >
                                    {title}
                                </H3>
                            </a>
                        </Link>

                        {showProductSize && (
                            <Span color="grey.600" mb={1} display="block">
                                {showProductSize}
                            </Span>
                        )}

                        <FlexBox alignItems="center" gap={1} mt={0.5}>
                            <Box fontWeight="600" color="primary.main">
                                {off === 0
                                    ? currency(price)
                                    : calculateDiscount(price, off)}
                            </Box>

                            {off !== 0 && (
                                <Box color="grey.600" fontWeight="600">
                                    <del>{currency(price)}</del>
                                </Box>
                            )}
                        </FlexBox>
                    </Box>

                    <FlexBox
                        width="30px"
                        alignItems="center"
                        className="add-cart"
                        flexDirection="column-reverse"
                        justifyContent={
                            !!cartItem?.qty ? "space-between" : "flex-start"
                        }
                    >
                        <Button
                            color="primary"
                            variant="outlined"
                            sx={{
                                padding: "3px",
                            }}
                            onClick={handleCartAmountChange(
                                {
                                    id,
                                    slug,
                                    price,
                                    imgUrl,
                                    name: title,
                                    qty: (cartItem?.qty || 0) + 1,
                                },
                                "add"
                            )}
                        >
                            <Add fontSize="small" />
                        </Button>

                        {!!cartItem?.qty && (
                            <Fragment>
                                <Box color="text.primary" fontWeight="600">
                                    {cartItem?.qty}
                                </Box>

                                <Button
                                    color="primary"
                                    variant="outlined"
                                    sx={{
                                        padding: "3px",
                                    }}
                                    onClick={handleCartAmountChange(
                                        {
                                            id,
                                            slug,
                                            price,
                                            imgUrl,
                                            name: title,
                                            qty: (cartItem?.qty || 0) - 1,
                                        },
                                        "remove"
                                    )}
                                >
                                    <Remove fontSize="small" />
                                </Button>
                            </Fragment>
                        )}
                    </FlexBox>
                </FlexBox>
            </ContentWrapper>
        </StyledBazaarCard>
    );
};

export default ProductCard1;
