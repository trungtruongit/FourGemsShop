import Warranty from "../src/pages-sections/sessions/CheckWarranty";
import {FlexRowCenter} from "../src/components/flex-box";
import SEO from "../src/components/SEO";

const CheckWarrantyPage = () => {
    return (
        <FlexRowCenter flexDirection="column" minHeight="100vh">
            <SEO title="Check Warranty" />
            <Warranty />
        </FlexRowCenter>
    );
};

export default CheckWarrantyPage;
