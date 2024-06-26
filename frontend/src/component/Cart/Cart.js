import React, { Fragment, useEffect } from "react";
import "./Cart.css";
import CartItemCard from "./CardItemCard";
import { useSelector, useDispatch } from "react-redux";
import { addItemsToCart, removeItemsFromCart } from "../../actions/cartAction";
import { Typography } from "@material-ui/core";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { Link, useNavigate } from "react-router-dom";
import { clearErrors } from "../../actions/userActions";
import { useAlert } from "react-alert";

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const alert = useAlert();
  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );
  console.log(isAuthenticated);
  console.log(cartItems);

  const increaseQuantity = (id, quantity, stock) => {
    console.log(stock);
    const newQty = quantity + 1;
    if (stock <= quantity) {
      return;
    }
    console.log(newQty);
    dispatch(addItemsToCart(id, newQty));
  };

  const decreaseQuantity = (id, quantity) => {
    const newQty = quantity - 1;
    if (1 >= quantity) {
      return;
    }
    dispatch(addItemsToCart(id, newQty));
  };

  const deleteCartItems = (id) => {
    dispatch(removeItemsFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/shipping");
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isAuthenticated) {
      console.log("logged in");
    }
  }, [dispatch, error, alert, isAuthenticated]);

  return (
    <Fragment>
      {isAuthenticated ? (
        <Fragment>
          <button>Sign In</button>
        </Fragment>
      ) : (
        <Fragment>
          {cartItems.length === 0 ? (
            <div className="emptyCart">
              <RemoveShoppingCartIcon />

              <Typography>No Product in Your Cart</Typography>
              <Link to="/products">View Products</Link>
            </div>
          ) : (
            <Fragment>
              <div className="cartPage">
                <div className="cartHeader">
                  <p>Product</p>
                  <p>Quantity</p>
                  <p>Subtotal</p>
                </div>

                {cartItems &&
                  cartItems.map((item) => (
                    <div className="cartContainer" key={item.product}>
                      <CartItemCard
                        item={item}
                        deleteCartItems={deleteCartItems}
                      />
                      <div className="cartInput">
                        <button
                          className="minus"
                          onClick={() =>
                            decreaseQuantity(item.product, item.quantity)
                          }
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="plus"
                          onClick={() =>
                            increaseQuantity(
                              item.product,
                              item.quantity,
                              item.stock
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                      <p className="cartSubtotal">{`₹${
                        item.price * item.quantity
                      }`}</p>
                    </div>
                  ))}

                <div className="cartGrossProfit">
                  <div></div>
                  <div className="cartGrossProfitBox">
                    <p>Gross Total</p>
                    <p>{`₹${cartItems.reduce(
                      (acc, item) => acc + item.quantity * item.price,
                      0
                    )}`}</p>
                  </div>
                  <div></div>
                  <div className="checkOutBtn">
                    <button onClick={checkoutHandler}>Check Out</button>
                  </div>
                </div>
              </div>
            </Fragment>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Cart;
