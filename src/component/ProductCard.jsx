
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./productcart.css";

function ProductCard({
  product,
  onAddToCart,
  onViewDetails,
  onWishlist,
  isWishlisted = false,
}) {
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const productName = product.name || product.title || "Product";
  const price = Number(product.price) || 0;

  // Check whether stock quantity is available in the product object.
  const hasStock =
    product.quantity !== undefined &&
    product.quantity !== null &&
    product.quantity !== "";

  const stock = hasStock ? Number(product.quantity) : null;

  const isOutOfStock =
    hasStock && (!Number.isFinite(stock) || stock <= 0);

  const increaseQuantity = () => {
    if (isOutOfStock) return;

    setQuantity((previousQuantity) => {
      if (hasStock) {
        return Math.min(previousQuantity + 1, stock);
      }

      return previousQuantity + 1;
    });

    setAdded(false);
  };

  const decreaseQuantity = () => {
    setQuantity((previousQuantity) =>
      Math.max(1, previousQuantity - 1)
    );

    setAdded(false);
  };

  // Add product to cart.
  const handleAddToCart = () => {
    if (isOutOfStock) {
      alert("This product is out of stock.");
      return;
    }

    if (hasStock && quantity > stock) {
      alert("Requested quantity exceeds available stock.");
      return;
    }

    if (typeof onAddToCart !== "function") {
      console.error("onAddToCart function is missing!");
      return;
    }

    onAddToCart(quantity);
    setAdded(true);
  };

  // Buy Now.
  const handleBuyNow = () => {
    if (isOutOfStock) {
      alert("This product is out of stock.");
      return;
    }

    if (hasStock && quantity > stock) {
      alert("Requested quantity exceeds available stock.");
      return;
    }

    navigate(`/buy-now/${product.id}`, {
      state: {
        product,
        quantity,
      },
    });
  };

  // Add or remove product from wishlist.
  const handleWishlist = (event) => {
    event.stopPropagation();

    if (typeof onWishlist === "function") {
      onWishlist();
    }
  };

  return (
    <div className="product-card">
      {/* Product Image */}
      <div className="product-image-container">
        {!isOutOfStock && (
          <span className="discount-badge">
            {product.discount ?? 0}% OFF
          </span>
        )}

        {isOutOfStock && (
          <span className="stock-badge">
            Out of Stock
          </span>
        )}

        <button
          type="button"
          className={`wishlist ${
            isWishlisted ? "active wishlisted" : ""
          }`}
          onClick={handleWishlist}
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          aria-pressed={isWishlisted}
        >
          {isWishlisted ? "♥" : "♡"}
        </button>

        <img
          src={
            product.image ||
            product.imageUrl ||
            "https://placehold.co/300x220?text=Product"
          }
          alt={productName}
          className={`product-image ${
            isOutOfStock ? "out-of-stock-image" : ""
          }`}
        />
      </div>

      {/* Product Information */}
      <div className="product-info">
        <p className="product-category">
          {product.category || "General"}
        </p>

        <h3 className="product-name">{productName}</h3>

        <div className="rating">
          <span>⭐ {product.rating ?? 0}</span>
          <span className="review-count">
            ({product.reviews ?? 0} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="price-section">
          <span className="current-price">
            ₹{price.toLocaleString("en-IN")}
          </span>

          {product.oldPrice != null && (
            <span className="old-price">
              ₹
              {Number(product.oldPrice).toLocaleString("en-IN")}
            </span>
          )}
        </div>

        <p className="delivery">✓ Free delivery</p>

{/* Stock Status */}
<p className="stock-status">
  {isOutOfStock ? (
    <span className="out-of-stock-text">
      Out of Stock
    </span>
  ) : hasStock && stock <= 5 ? (
    <span className="low-stock-text">
      Only {stock} left
    </span>
  ) : null}
</p>


        {/* Quantity Controls */}
        <div className="quantity-control">
          <span className="quantity-label">Quantity</span>

          <div className="quantity-buttons">
            <button
              type="button"
              onClick={decreaseQuantity}
              disabled={quantity === 1 || isOutOfStock}
              aria-label="Decrease quantity"
            >
              −
            </button>

            <span className="quantity-value">
              {quantity}
            </span>

            <button
              type="button"
              onClick={increaseQuantity}
              disabled={
                isOutOfStock ||
                (hasStock && quantity >= stock)
              }
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* Total Price */}
        <p className="product-total">
          Total: ₹
          {(price * quantity).toLocaleString("en-IN")}
        </p>

        {/* Action Buttons */}
        <div className="product-actions">
          <button
            type="button"
            className="add-cart"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            {isOutOfStock
              ? "Out of Stock"
              : added
              ? "Added ✓"
              : "Add to Cart"}
          </button>

          <button
            type="button"
            className="buy-now"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? "Unavailable" : "Buy Now"}
          </button>

          <button
            type="button"
            className="view-details-button"
            onClick={() => {
              if (typeof onViewDetails === "function") {
                onViewDetails();
              }
            }}
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
