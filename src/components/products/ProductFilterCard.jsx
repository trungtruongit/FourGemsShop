import {
    Card,
    Checkbox,
    Divider,
    FormControlLabel,
    TextField,
} from "@mui/material";
import Accordion from "components/accordion/Accordion";
import { FlexBetween, FlexBox } from "components/flex-box";
import { H5, H6, Paragraph, Span } from "components/Typography";
import AccordionHeader from "components/accordion/AccordionHeader";
import Link from "next/link";

const ProductFilterCard = () => {
    return (
        <Card
            sx={{
                p: "18px 27px",
                overflow: "auto",
            }}
            elevation={1}
        >
            {/* CATEGORY VARIANT FILTER */}
            <H6 mb={1.25}>Categories</H6>

            {categoryList.map((item) =>
                item.subCategories ? (
                    <Accordion key={item.title} expanded>
                        <AccordionHeader px={0} py={0.75} color="grey.600">
                            <Span
                                sx={{
                                    cursor: "pointer",
                                    mr: "9px",
                                }}
                            >
                                <Link
                                    href={`/category/${item.title.toLowerCase()}`}
                                    passHref
                                >
                                    <a>{item.title}</a>
                                </Link>
                            </Span>
                        </AccordionHeader>

                        {item.subCategories.map((name) => (
                            <Paragraph
                                pl="22px"
                                py={0.75}
                                key={name}
                                fontSize="18px"
                                color="grey.600"
                                sx={{
                                    cursor: "pointer",
                                }}
                            >
                                <Link
                                    href={`/subcategory/${name.toLowerCase()}`}
                                    passHref
                                >
                                    <a>{name}</a>
                                </Link>
                            </Paragraph>
                        ))}
                    </Accordion>
                ) : (
                    <Paragraph
                        py={0.75}
                        fontSize="18px"
                        color="grey.600"
                        key={item.title}
                        className="cursor-pointer"
                    >
                        <Link
                            href={`/product/search/${item.title.toLowerCase()}`}
                            passHref
                        >
                            <a>{item.title}</a>
                        </Link>
                    </Paragraph>
                )
            )}

            <Divider
                sx={{
                    mt: 2,
                    mb: 3,
                }}
            />

            {/* PRICE VARIANT FILTER */}
            <H6 mb={2}>Price Range</H6>
            <FlexBetween>
                <TextField
                    placeholder="0"
                    type="number"
                    size="small"
                    fullWidth
                />
                <H5 color="grey.600" px={1}>
                    -
                </H5>
                <TextField
                    placeholder="250"
                    type="number"
                    size="small"
                    fullWidth
                />
            </FlexBetween>

            <Divider
                sx={{
                    my: 3,
                }}
            />

            {otherOptions.map((item) => (
                <FormControlLabel
                    key={item}
                    sx={{
                        display: "flex",
                    }}
                    label={<Span color="inherit">{item}</Span>}
                    control={<Checkbox size="small" color="secondary" />}
                />
            ))}

            <Divider
                sx={{
                    my: 3,
                }}
            />
        </Card>
    );
};

const categoryList = [
    {
        title: "Necklace",
    },
    {
        title: "Ring",
    },
    {
        title: "Earring",
    },
    {
        title: "Bracelet",
    },
    {
        title: "Charm",
    },
];
const otherOptions = ["On Sale", "In Stock"];

export default ProductFilterCard;
