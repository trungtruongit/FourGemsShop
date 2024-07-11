import { Box, Card, Stack, Table, TableContainer } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import SearchArea from "components/dashboard/SearchArea";
import TableHeader from "components/data-table/TableHeader";
import TablePagination from "components/data-table/TablePagination";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import useMuiTable from "hooks/useMuiTable";
import Scrollbar from "components/Scrollbar";
import { CategoryRow } from "pages-sections/admin";
import api from "utils/__api__/dashboard"; // TABLE HEADING DATA LIST
import { useState } from "react";
import { useRouter } from "next/router";

const tableHeading = [
    {
        id: "id",
        label: "ID",
        align: "left",
    },
    {
        id: "name",
        label: "Name",
        align: "left",
    },
    {
        id: "image",
        label: "Image",
        align: "left",
    },
    {
        id: "level",
        label: "Level",
        align: "left",
    },
    {
        id: "featured",
        label: "Featured",
        align: "left",
    },
    {
        id: "action",
        label: "Action",
        align: "center",
    },
]; // =============================================================================

CategoryList.getLayout = function getLayout(page) {
    return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

// =============================================================================
export default function CategoryList(props) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { categories } = props; // RESHAPE THE PRODUCT LIST BASED TABLE HEAD CELL ID
    const [categoryList, setCategoylist] = useState(props);
    const handleNav = () => {
        router.push("/admin/products/create");
    };

    const filteredCategories = categories.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image,
        featured: item.featured,
        level: Math.ceil(Math.random() * 1),
    }));
    const {
        order,
        orderBy,
        selected,
        rowsPerPage,
        filteredList,
        handleChangePage,
        handleRequestSort,
        page,
        handleChangeRowsPerPage,
    } = useMuiTable({
        listData: filteredCategories,
    });

    let token = "";
    if (typeof localStorage !== "undefined") {
        token = localStorage.getItem("token");
    } else if (typeof sessionStorage !== "undefined") {
        token = sessionStorage.getItem("token");
    } else {
        console.log("Web Storage is not supported in this environment.");
    }
    return (
        <Box py={4}>
            <H3 mb={2}>Product Categories</H3>

            <SearchArea
                handleSearch={() => {}}
                buttonText="Add Category"
                handleBtnClick={handleNav}
                searchPlaceholder="Search Category..."
            />

            <Card>
                <Scrollbar>
                    <TableContainer
                        sx={{
                            minWidth: 900,
                        }}
                    >
                        <Table>
                            <TableHeader
                                order={order}
                                hideSelectBtn
                                orderBy={orderBy}
                                heading={tableHeading}
                                rowCount={categories.length}
                                numSelected={selected.length}
                                onRequestSort={handleRequestSort}
                            />

                            <TableBody>
                                {filteredList.map((category) => (
                                    <CategoryRow
                                        item={category}
                                        key={category.id}
                                        selected={selected}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <Stack alignItems="center" my={4}>
                    <TablePagination
                        onChange={handleChangePage}
                        count={Math.ceil(categoryList?.length / rowsPerPage)}
                        page={page + 1}
                        rowsPerPage={rowsPerPage}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Stack>
            </Card>
        </Box>
    );
}
export const getStaticProps = async () => {
    const categories = await api.category();
    return {
        props: {
            categories,
        },
    };
};
