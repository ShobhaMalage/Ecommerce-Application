
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "./Productcard";
import "./Productcart.css";

// Match navbar categories to local and Fake Store API categories.
function matchesCategory(productCategory, selectedCategory) {
  if (!selectedCategory || selectedCategory.toLowerCase() === "all") {
    return true;
  }

  const productValue = (productCategory || "").toLowerCase().trim();
  const selectedValue = selectedCategory.toLowerCase().trim();

  const categoryAliases = {
    fashion: ["fashion", "men's clothing", "women's clothing"],
    electronics: ["electronics"],
    jewelery: ["jewelery", "jewelry"],
    "home & kitchen": ["home & kitchen", "home", "kitchen"],
    beauty: ["beauty"],
    "sports & fitness": ["sports & fitness", "sports", "fitness"],
    books: ["books"],
  };

  const aliases = categoryAliases[selectedValue];

  if (aliases) {
    return aliases.some(
      (alias) =>
        productValue === alias ||
        (selectedValue === "fashion" && productValue.includes("clothing"))
    );
  }

  return productValue === selectedValue;
}

function ProductList({
  products = [],
  cart = [],
  setCart,
  wishlist = [],
  setWishlist,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // Read search and category from the URL.
  const queryParams = new URLSearchParams(location.search);
  const searchText = (queryParams.get("search") || "").trim().toLowerCase();
  const category = queryParams.get("category") || "All";

  // Filter products using the Navbar search and category links.
  const filteredProducts = products.filter((product) => {
    const searchableText = [
      product.name,
      product.title,
      product.description,
      product.category,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(searchText);
    const matchesSelectedCategory = matchesCategory(
      product.category,
      category
    );

    return matchesSearch && matchesSelectedCategory;
  });

  // Add product to cart with stock validation.
  const handleAddToCart = (product, quantity = 1) => {
    const requestedQuantity = Number(quantity);

    if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
      alert("Please select a valid quantity.");
      return;
    }

    const existingItem = cart.find(
      (item) => String(item.id) === String(product.id)
    );

    const currentQuantity = Number(existingItem?.quantity) || 0;

    const hasStock =
      product.quantity !== undefined &&
      product.quantity !== null &&
      product.quantity !== "";

    const stock = Number(product.quantity);

    if (
      hasStock &&
      Number.isFinite(stock) &&
      currentQuantity + requestedQuantity > stock
    ) {
      alert("Requested quantity exceeds available stock.");
      return;
    }

    setCart((previousCart) => {
      const found = previousCart.find(
        (item) => String(item.id) === String(product.id)
      );

      if (found) {
        return previousCart.map((item) =>
          String(item.id) === String(product.id)
            ? {
                ...item,
                quantity:
                  (Number(item.quantity) || 0) + requestedQuantity,
              }
            : item
        );
      }

      return [...previousCart, { ...product, quantity: requestedQuantity }];
    });
  };

  // Toggle wishlist status.
  const handleWishlist = (product) => {
    setWishlist((previousWishlist) => {
      const alreadyAdded = previousWishlist.some(
        (item) => String(item.id) === String(product.id)
      );

      return alreadyAdded
        ? previousWishlist.filter(
            (item) => String(item.id) !== String(product.id)
          )
        : [...previousWishlist, product];
    });
  };

  // Total items in cart.
  const cartCount = cart.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0
  );

  // Reset Navbar search and category filters.
  const handleReset = () => {
    navigate("/products");
  };

  return (
    <div className="shop-page">
      <div className="shop-header">
        <div className="shop-heading">
          <h1>ShopEase</h1>
          <p>Discover products you'll love.</p>
        </div>

        <div className="shop-actions">
          <button
            type="button"
            className="summary-button wishlist-summary"
            onClick={() => navigate("/wishlist")}
          >
            <span>♥ Wishlist</span>
            <span className="summary-count">{wishlist.length}</span>
          </button>

          <button
            type="button"
            className="summary-button cart-summary"
            onClick={() => navigate("/cart")}
          >
            <span>🛒 Cart</span>
            <span className="summary-count">{cartCount}</span>
          </button>
        </div>
      </div>

      <div className="filter-section">
        <select
          className="category-select"
          value={category}
          aria-label="Current category"
          onChange={(event) => {
            const selectedCategory = event.target.value;
            const params = new URLSearchParams(location.search);

            if (selectedCategory === "All") {
              params.delete("category");
            } else {
              params.set("category", selectedCategory);
            }

            const query = params.toString();
            navigate(query ? `/products?${query}` : "/products");
          }}
        >
          <option value="All">All Categories</option>
          {[...new Set(products.map((product) => product.category).filter(Boolean))].map(
            (item) => (
              <option key={item} value={item}>
                {item}
              </option>
            )
          )}
        </select>

        <button
          type="button"
          className="reset-button"
          onClick={handleReset}
        >
          Reset Filters
        </button>
      </div>

      <div className="results-info">
        <h2>Our Products</h2>
        <span>{filteredProducts.length} products found</span>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="product-container">
          {filteredProducts.map((product) => {
            const isWishlisted = wishlist.some(
              (item) => String(item.id) === String(product.id)
            );

            return (
            <div className="product-list-item" key={product.id}>
  <ProductCard
    product={product}
    isOutOfStock={
      product.quantity !== undefined &&
      product.quantity !== null &&
      Number(product.quantity) <= 0
    }
    onAddToCart={(quantity) =>
      handleAddToCart(product, quantity)
    }
    onWishlist={() => handleWishlist(product)}
    isWishlisted={isWishlisted}
    onViewDetails={() =>
      navigate(`/products/${product.id}`, {
        state: { product },
      })
    }
  />
</div>
            );
          })}
        </div>
      ) : (
        <div className="no-products">
          <h2>No products found!</h2>
          <p>Try another product name or category.</p>

          <button
            type="button"
            className="reset-button"
            onClick={handleReset}
          >
            View All Products
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductList;
