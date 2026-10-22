
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./ProductDetails.css";

function ProductDetails({ products = [] }) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  // Get product from navigation state or find it by URL ID
  const product =
    state?.product ||
    products.find((item) => String(item.id) === String(id));

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product details are unavailable</h2>
        <p>The product may have been removed or does not exist.</p>
        <button
          type="button"
          onClick={() => navigate("/products")}
        >
          Back to Products
        </button>
      </div>
    );
  }

  const price = Number(product.price) || 0;
  const oldPrice = Number(product.oldPrice) || 0;
  const quantity = Number(product.quantity) || 0;

  return (
    <div className="product-details-page">
      <button
        type="button"
        className="back-button"
        onClick={() => navigate("/products")}
      >
        ← Back to Products
      </button>

      <div className="product-details-card">
        {/* Product Image */}
        <div className="product-details-image">
          {product.image ? (
            <img src={product.image} alt={product.name || "Product"} />
          ) : (
            <div className="no-product-image">
              No Image Available
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="product-details-info">
          <span className="details-category">
            {product.category || "Uncategorized"}
          </span>

          <h1>{product.name || "Unnamed Product"}</h1>

          {/* Rating and Reviews */}
          <p className="details-rating">
            ⭐ {product.rating ?? 0}/5
            {" "}({product.reviews ?? 0} reviews)
          </p>

          {/* Price Information */}
          <div className="details-prices">
            <strong>
              ₹{price.toLocaleString("en-IN")}
            </strong>

            {oldPrice > price && (
              <span className="details-old-price">
                ₹{oldPrice.toLocaleString("en-IN")}
              </span>
            )}

            {Number(product.discount) > 0 && (
              <span className="details-discount">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* All Product Fields */}
          <div className="product-information">
            <h2>Product Information</h2>

          
            <p className="product-description">
           
              {product.description || "No description available."}
            </p>

            <p>
              <strong>Price:</strong>{" "}
              ₹{price.toLocaleString("en-IN")}
            </p>

            <p>
              <strong>Old Price:</strong>{" "}
              {oldPrice > 0
                ? `₹${oldPrice.toLocaleString("en-IN")}`
                : "N/A"}
            </p>

            <p>
              <strong>Discount:</strong>{" "}
              {Number(product.discount) > 0
                ? `${product.discount}%`
                : "No discount"}
            </p>

            <p>
              <strong>Rating:</strong> ⭐ {product.rating ?? 0}/5
            </p>

            <p>
              <strong>Reviews:</strong> {product.reviews ?? 0}
            </p>

            <p>
              <strong>Quantity in Stock:</strong> {quantity}
            </p>

            <p>
              <strong>Availability:</strong>{" "}
              {quantity > 0 ? (
                <span className="in-stock">In Stock</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </p>
          </div>

          <button
            type="button"
            className="continue-shopping-button"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
