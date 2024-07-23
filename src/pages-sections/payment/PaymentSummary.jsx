import { Divider, Typography } from "@mui/material";
import Card1 from "components/Card1";
import { FlexBetween } from "components/flex-box";
import { Paragraph, Span } from "components/Typography";
import { currency } from "lib";
import { useAppContext } from "../../contexts/AppContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const PaymentSummary = () => {
    const { state } = useAppContext();
    const cartList = state.cart;
    const router = useRouter();
    const [perDiscount, setPerDiscount] = useState(0);
    const [percentMemberDiscount, setPercentMemberDiscount] = useState(0);

    const getTotalPrice = () =>
        cartList.reduce((accum, item) => accum + item.price * item.qty, 0);

    const tax =
        (getTotalPrice() - (getTotalPrice() * perDiscount) / 100 - (getTotalPrice() * percentMemberDiscount) / 100) * 0.1;
    const totalPrice = (
        getTotalPrice() -
        (perDiscount / 100) * getTotalPrice() -
        (percentMemberDiscount / 100) *
        getTotalPrice() +
        (getTotalPrice() -
            (perDiscount / 100) *
            getTotalPrice() -
            (percentMemberDiscount / 100) *
            getTotalPrice()) *
        0.1
    ).toFixed(2);

    useEffect(() => {
        const fetchData = async () => {
            const code = localStorage.getItem("code");
            const customerId = localStorage.getItem("customerId");
            const token = localStorage.getItem("token");
            console.log(customerId)
            try {
                // Fetch discount information
                if (code) {
                    const discountResponse = await axios.get(
                        `https://four-gems-system-790aeec3afd8.herokuapp.com/voucher/${code}`,
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    );
                    setPerDiscount(discountResponse.data.data.discountPercent);
                }

                // Fetch customer information
                if (customerId) {
                    const customerResponse = await axios.get(
                        `https://four-gems-system-790aeec3afd8.herokuapp.com/customers/${customerId}`,
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    );
                    setPercentMemberDiscount(customerResponse.data.data.precent_discount);
                    console.log(customerResponse.data.data.precent_discount)
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();
    }, [router.query.customerId]);

    return (
        <Card1>
            <FlexBetween mb={1}>
                <Typography color="grey.600">Subtotal:</Typography>
                <Typography fontSize="18px" fontWeight="600" lineHeight="1">
                    {currency(getTotalPrice())}
                </Typography>
            </FlexBetween>

            <FlexBetween mb={1}>
                <Typography color="grey.600">
                    Discount <Span sx={{ color: "green" }}>(-{perDiscount}%)</Span>:
                </Typography>
                <Typography fontSize="18px" fontWeight="600" lineHeight="1">
                    {currency((getTotalPrice() * perDiscount) / 100)}
                </Typography>
            </FlexBetween>

            <FlexBetween mb={1}>
                <Typography color="grey.600">
                    Membership <Span sx={{ color: "green" }}>(-{percentMemberDiscount}%)</Span>:
                </Typography>
                <Typography fontSize="18px" fontWeight="600" lineHeight="1">
                    {currency((getTotalPrice() * percentMemberDiscount) / 100)}
                </Typography>
            </FlexBetween>

            <FlexBetween mb={2}>
                <Typography color="grey.600">
                    Tax <Span sx={{ color: "red" }}>(+10%)</Span>:
                </Typography>
                <Typography fontSize="18px" fontWeight="600" lineHeight="1">
                    {currency(tax)}
                </Typography>
            </FlexBetween>

            <Divider
                sx={{
                    mb: 2,
                }}
            />

            <Paragraph
                fontSize={25}
                fontWeight={600}
                lineHeight={1}
                textAlign="right"
            >
                {currency(totalPrice)}
            </Paragraph>
        </Card1>
    );
};

export default PaymentSummary;
