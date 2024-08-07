import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Container, Grid } from "@mui/material";
import Stepper from "components/stepper/Stepper";
import ShopLayout1 from "./ShopLayout1";
/**
 *  Used:
 *  1. cart page
 *  2. checkout page
 *  3. payment page
 */
// ======================================================

// ======================================================
const CheckoutNavLayout = ({ children }) => {
  const [selectedStep, setSelectedStep] = useState(0);
  const router = useRouter();
  const { pathname } = router;

  useEffect(() => {
    switch (pathname) {
      case "/cart":
        setSelectedStep(1);
        break;

      case "/checkout":
        setSelectedStep(2);
        break;

      case "/payment":
        setSelectedStep(3);
        break;

      default:
        break;
    }
  }, [pathname]);
  return (
    <ShopLayout1>
      <Container
        sx={{
          my: 4,
        }}
      >
        <Box
          mb={3}
          display={{
            sm: "block",
            xs: "none",
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stepper
                stepperList={stepperList}
                selectedStep={selectedStep}
              />
            </Grid>
          </Grid>
        </Box>
        {children}
      </Container>
    </ShopLayout1>
  );
};

const stepperList = [
  {
    title: "Cart",
    disabled: false,
  },
  {
    title: "Details",
    disabled: false,
  },
  {
    title: "Payment",
    disabled: false,
  },
];
export default CheckoutNavLayout;
