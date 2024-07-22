import ProductCardRotateGoods from "../product-cards/ProductCardRotateGoods";

// ==========================================================
const ProductCardRotateGoodsList = ({ products }) => {
    return (
        <div>
            {products.map((item) => (
                <ProductCardRotateGoods
                    productId={item.productId}
                    slug={item.productName}
                    title={item.productName}
                    price={item.price}
                    stock={item.quantityInStock}
                    imgUrl={item.image}
                />
            ))}
        </div>
    );
};

export default ProductCardRotateGoodsList;
