
import { useNavigate } from "react-router-dom";
import "./Wishlist.css";

function Wishlist({ wishlist = [], setWishlist, setCart }) {
  const navigate = useNavigate();

  // Remove product from wishlist
  const handleRemove = (productId) => {
    setWishlist((previousWishlist) =>
      previousWishlist.filter(
        (product) => String(product.id) !== String(productId)
      )
    );
  };

  // Move product to cart
  const handleAddToCart = (product) => {
    const stockAvailable =
      product.quantity !== undefined &&
      product.quantity !== null &&
      product.quantity !== "";

    const stock = Number(product.quantity);

    if (stockAvailable && Number.isFinite(stock) && stock < 1) {
      alert("Sorry, this product is out of stock.");
      return;
    }

    const existingProduct = JSON.parse(
      localStorage.getItem("cart") || "[]"
    ).find(
      (item) => String(item.id) === String(product.id)
    );

    if (
      existingProduct &&
      stockAvailable &&
      Number.isFinite(stock) &&
      existingProduct.quantity + 1 > stock
    ) {
      alert("Requested quantity exceeds available stock.");
      return;
    }

    setCart((previousCart) => {
      const existing = previousCart.find(
        (item) => String(item.id) === String(product.id)
      );

      if (existing) {
        return previousCart.map((item) =>
          String(item.id) === String(product.id)
            ? {
                ...item,
                quantity: (Number(item.quantity) || 0) + 1,
              }
            : item
        );
      }

      return [...previousCart, { ...product, quantity: 1 }];
    });

    handleRemove(product.id);
  };

  return (
    <div className="wishlist-page">
      {/* Wishlist Header */}
      <div className="wishlist-header">
        <div>
          <h1>My Wishlist ♥</h1>
          <p>Your favorite products in one place.</p>
        </div>

        <div className="wishlist-header-actions">
          <span className="wishlist-count">
            {wishlist.length} items
          </span>

          <button
            type="button"
            className="back-to-shopping"
            onClick={() => navigate("/products")}
          >
            ← Back to Shopping
          </button>
        </div>
      </div>

      {/* Empty Wishlist */}
      {wishlist.length === 0 ? (
        <div className="empty-wishlist">
          <h2>Your wishlist is empty!</h2>

          <p>
            You haven't added any favorite products yet.
          </p>

          <button
            type="button"
            className="wishlist-shop-button"
            onClick={() => navigate("/products")}
          >
            Browse Products
          </button>
        </div>
      ) : (
        /* Wishlist Products */
        <div className="wishlist-grid">
          {wishlist.map((product) => (
            <div className="wishlist-card" key={product.id}>
              <img
                className="wishlist-image"
                src={
                  product.imageUrl ||
                  product.image ||
                  "https://placehold.co/300x220?text=Product"
                }
                alt={product.name || "Product"}
              />

              <div className="wishlist-info">
                <h3>{product.name}</h3>

                <p className="wishlist-category">
                  {product.category || "General"}
                </p>

                <p className="wishlist-price">
                  ₹
                  {Number(product.price || 0).toLocaleString("en-IN")}
                </p>

                <div className="wishlist-actions">
                  <button
                    type="button"
                    className="wishlist-add-cart"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>

                  <button
                    type="button"
                    className="wishlist-remove"
                    onClick={() => handleRemove(product.id)}
                  >
                    Remove ♥
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
