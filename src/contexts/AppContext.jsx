import { createContext, useContext, useMemo, useReducer } from "react";

const INITIAL_CART = [];
const INITIAL_STATE = {
    cart: INITIAL_CART,
    totalQuantity: 0,
};

const AppContext = createContext({
    state: INITIAL_STATE,
    dispatch: () => {},
});

const reducer = (state, action) => {
    switch (action.type) {
        case "CHANGE_CART_AMOUNT": {
            const cartList = state.cart;
            const cartItem = action.payload;
            const exist = cartList.find(
                (item) => item.productId === cartItem.productId
            );

            let newCart;
            let totalQuantity;

            if (cartItem.qty < 1) {
                newCart = cartList.filter(
                    (item) => item.productId !== cartItem.productId
                );
            } else if (exist) {
                newCart = cartList.map((item) =>
                    Number(item.productId) === Number(cartItem.productId)
                        ? { ...item, qty: cartItem.qty }
                        : item
                );
            } else {
                newCart = [...cartList, cartItem];
            }

            totalQuantity = newCart.reduce((acc, item) => acc + item.qty, 0);
            return { ...state, cart: newCart, totalQuantity };
        }

        default:
            return state;
    }
};

export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    const contextValue = useMemo(
        () => ({ state, dispatch }),
        [state, dispatch]
    );
    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
export default AppContext;
