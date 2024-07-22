import { useRouter } from 'next/router'; // Sử dụng next/router

export const WarrantyHistoryRow = ({ order }) => {
    const { orderId } = order;
    const router = useRouter(); // Sử dụng useRouter để lấy router

    const handleViewOrderDetail = () => {
        if (typeof window !== 'undefined') { // Kiểm tra môi trường client-side
            localStorage.setItem("orderIdStaff", orderId);
            router.push(`./${orderId}`);
        }
    };

    return (
        <StyledTableRow tabIndex={-1} role="checkbox">
            <StyledTableCell align="left">{order.orderId}</StyledTableCell>

            <StyledTableCell>
                <H5 m={0.75} textAlign="left">
                    {order.customerName}
                </H5>
            </StyledTableCell>

            <StyledTableCell>
                <Typography className="pre" m={0.75} textAlign="left">
                    {format(new Date(order.orderDate), "MMM dd, yyyy")}
                </Typography>
            </StyledTableCell>

            <StyledTableCell>
                <Typography m={0.75} textAlign="left">
                    {currency(order.totalAmount)}
                </Typography>
            </StyledTableCell>

            <StyledTableCell align="left">
                <StatusWrapper status={order.status}>
                    {order.status}
                </StatusWrapper>
            </StyledTableCell>

            <StyledTableCell align="center">
                <StyledIconButton onClick={handleViewOrderDetail}>
                    <RemoveRedEye />
                </StyledIconButton>
            </StyledTableCell>
        </StyledTableRow>
    );
};
