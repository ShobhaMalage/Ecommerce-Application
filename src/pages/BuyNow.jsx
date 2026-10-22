
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./buynow.css";

function BuyNow({ products = [] }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const stateProduct = location.state?.product;

  const product =
    products.find((item) => String(item.id) === String(id)) ||
    (stateProduct && String(stateProduct.id) === String(id)
      ? stateProduct
      : null);

  const [quantity, setQuantity] = useState(
    Math.max(1, Number(location.state?.quantity) || 1)
  );

  if (!product) {
    return (
      <div className="buy-now-page">
        <h2>Product not found</h2>
        <p>Please select a product from the products page.</p>
        <button
          className="buy-back-button"
          onClick={() => navigate("/products")}
        >
          Back to Products
        </button>
      </div>
    );
  }

  const productName = product.name || product.title || "Product";
  const price = Number(product.price) || 0;
  const total = price * quantity;

  const formatPrice = (amount) =>
    amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="buy-now-page">
      <button
        type="button"
        className="buy-back-button"
        onClick={() => navigate("/products")}
      >
        ← Continue Shopping
      </button>

      <h1>Buy Now</h1>
      <p className="buy-page-subtitle">
        Review your selected product before checkout.
      </p>

      <div className="buy-now-card">
        {/* Product Image */}
        <div className="buy-now-image">
          <img
            src={
              product.image ||
              product.imageUrl ||
              "https://placehold.co/300x300?text=Product"
            }
            alt={productName}
          />
        </div>

        {/* Product Details */}
        <div className="buy-now-info">
          <span className="buy-product-category">
            {product.category || "General"}
          </span>

          <h2>{productName}</h2>

          <p className="buy-product-description">
            {product.description || "No description available."}
          </p>

          <div className="buy-product-price">
            ₹{formatPrice(price)}
          </div>

          <p className="buy-delivery">✓ Free delivery</p>

          {/* Quantity */}
          <div className="buy-quantity">
            <span>Quantity</span>

            <div className="buy-quantity-controls">
              <button
                type="button"
                onClick={() =>
                  setQuantity((previous) =>
                    Math.max(1, previous - 1)
                  )
                }
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                onClick={() =>
                  setQuantity((previous) => previous + 1)
                }
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="buy-order-summary">
            <h3>Order Summary</h3>

            <div className="buy-summary-row">
              <span>Price per item</span>
              <span>₹{formatPrice(price)}</span>
            </div>

            <div className="buy-summary-row">
              <span>Quantity</span>
              <span>{quantity}</span>
            </div>

            <div className="buy-summary-row">
              <span>Delivery</span>
              <span className="free-delivery">FREE</span>
            </div>

            <div className="buy-summary-total">
              <span>Total Amount</span>
              <strong>₹{formatPrice(total)}</strong>
            </div>
          </div>

          <button
            type="button"
            className="continue-checkout-button"
            onClick={() =>
              navigate("/checkout", {
                state: {
                  product,
                  quantity,
                  total,
                },
              })
            }
          >
            Continue to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}

export default BuyNow;
