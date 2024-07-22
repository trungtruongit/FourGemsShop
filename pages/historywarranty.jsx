import { useEffect, useState } from "react";
import {
    Box,
    Card,
    Container,
    Stack,
    Table,
    TableBody,
    TableContainer,
} from "@mui/material";
import { H1 } from "components/Typography";
import useMuiTable from "hooks/useMuiTable";
import Scrollbar from "components/Scrollbar";
import TableHeader from "components/data-table/TableHeader";
import TablePagination from "components/data-table/TablePagination";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {WarrantyHistoryRow} from "../src/pages-sections/warranty-form/WarrantyHistory";
import { useRouter } from "next/router";
import QCDashboardLayout from "../src/components/layouts/customer-dashboard/QCPage";

const tableHeading = [
    {
        id: "orderId",
        label: "Order ID",
        align: "left",
    },
    {
        id: "customerName",
        label: "Customer Name",
        align: "left",
    },
    {
        id: "orderDate",
        label: "Order Date",
        align: "left",
    },
    {
        id: "totalAmount",
        label: "Amount",
        align: "left",
    },
    {
        id: "status",
        label: "Status",
        align: "left",
    },
    {
        id: "action",
        label: "Action",
        align: "center",
    },
]; // =============================================================================

const WarrantyHistoryPage = () => {
    const router = useRouter();
    const [orderInfo, setOrderInfo] = useState([]);
    const [loading, setLoading] = useState(false);
    let token = "";
    if (typeof localStorage !== "undefined") {
        token = localStorage.getItem("token");
    } else if (typeof sessionStorage !== "undefined") {
        token = localStorage.getItem("token");
    } else {
    }
    useEffect(() => {
        const fetchOrderInfo = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }
            const tokenDecoded = jwtDecode(token);
            const userId = tokenDecoded?.id;
            try {
                const responseOrderInfo = await axios.get(
                    `https://four-gems-system-790aeec3afd8.herokuapp.com/order/get-order-by-user?userId=${userId}`,
                    {
                        headers: {
                            Authorization: "Bearer " + token,
                        },
                    }
                );
                setOrderInfo(responseOrderInfo.data.data);
            } catch (error) {
                console.error("Failed to fetch order info:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderInfo();
    }, []);

    const filteredOrders = orderInfo.map((order) => ({
        orderId: order.orderId,
        customerName: order.customerName,
        orderDate: order.orderDate,
        totalAmount: order.totalAmount,
        status: order.status,
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
        listData: filteredOrders,
        defaultSort: "status",
        defaultOrder: "desc",
    });

    return (
        <QCDashboardLayout>
            <Container>
                <div
                    style={{
                        display: "grid",
                        textAlign: "center",
                        paddingBottom: "1.5rem",
                        paddingTop: "1.5rem",
                    }}
                >
                    <H1 fontSize={40}>Warranty History</H1>
                </div>
                <Box py={4}>
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
                                        numSelected={selected.length}
                                        rowCount={filteredList.length}
                                        onRequestSort={handleRequestSort}
                                    />

                                    <TableBody>
                                        {filteredList.map((orderInfo) => (
                                            <WarrantyHistoryRow
                                                order={orderInfo}
                                                key={orderInfo.orderId}
                                            />
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Scrollbar>

                        <Stack alignItems="center" my={4}>
                            <TablePagination
                                onChange={handleChangePage}
                                count={Math.ceil(
                                    orderInfo.length / rowsPerPage
                                )}
                                page={page + 1}
                                rowsPerPage={rowsPerPage}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Stack>
                    </Card>
                </Box>
            </Container>
        </QCDashboardLayout>
    );
};

export default WarrantyHistoryPage;
