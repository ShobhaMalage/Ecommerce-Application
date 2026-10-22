
import { useNavigate } from "react-router-dom";
import "./cart.css";

function Cart({ cart = [], setCart }) {
  const navigate = useNavigate();

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total + Number(item.price || 0) * item.quantity,
    0
  );

  const updateQuantity = (id, change) => {
    setCart((previousCart) =>
      previousCart
        .map((item) => {
          if (String(item.id) !== String(id)) {
            return item;
          }

          const newQuantity = item.quantity + change;

          return newQuantity > 0
            ? { ...item, quantity: newQuantity }
            : item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((previousCart) =>
      previousCart.filter(
        (item) => String(item.id) !== String(id)
      )
    );
  };

  return (
    <div className="cart-page">
      <div className="cart-page-header">
        <div>
          <h1>Shopping Cart</h1>
          <p>
            {cartCount} item{cartCount !== 1 ? "s" : ""} in
            your cart
          </p>
        </div>

        <button
          type="button"
          className="continue-shopping"
          onClick={() => navigate("/products")}
        >
          ← Continue Shopping
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some products to your cart to see them here.</p>

          <button
            type="button"
            className="continue-shopping"
            onClick={() => navigate("/products")}
          >
            Shop Now
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          <section className="cart-products">
            <h2>Cart Items</h2>

            {cart.map((item) => (
              <article className="cart-product" key={item.id}>
                <div className="cart-product-image">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  ) : (
                    <span>No image</span>
                  )}
                </div>

                <div className="cart-product-info">
                  <h3>{item.name}</h3>

                  <p className="cart-product-category">
                    {item.category}
                  </p>

                  <p className="cart-product-price">
                    ₹
                    {Number(item.price || 0).toLocaleString(
                      "en-IN"
                    )}
                  </p>

                  <div className="cart-quantity">
                    <span>Quantity:</span>

                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      −
                    </button>

                    <strong>{item.quantity}</strong>

                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-product-actions">
                  <strong className="cart-line-total">
                    ₹
                    {(
                      Number(item.price || 0) * item.quantity
                    ).toLocaleString("en-IN")}
                  </strong>

                  <button
                    type="button"
                    className="remove-cart-item"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </section>

          <aside className="cart-summary-card">
            <h2>Order Summary</h2>

            <div className="cart-summary-row">
              <span>Total items</span>
              <strong>{cartCount}</strong>
            </div>

            <div className="cart-summary-row">
              <span>Delivery</span>
              <strong className="free-delivery">FREE</strong>
            </div>

            <div className="cart-summary-total">
              <span>Grand Total</span>
              <strong>
                ₹{cartTotal.toLocaleString("en-IN")}
              </strong>
            </div>

            <button
              type="button"
              className="checkout-button"
              onClick={() =>
                alert("Checkout functionality will be added next.")
              }
            >
              Proceed to Checkout
            </button>

            <button
              type="button"
              className="continue-shopping summary-continue"
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Cart;
