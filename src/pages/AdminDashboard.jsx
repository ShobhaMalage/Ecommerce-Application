
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard({
  products = [],
  onEditProduct,
  onDeleteProduct,
}) {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // Get product stock quantity
  const getStockQuantity = (product) => {
    const value = product.quantity ?? product.stock;

    if (value !== undefined && value !== null && value !== "") {
      const quantity = Number(value);
      return Number.isFinite(quantity) && quantity > 0 ? quantity : 0;
    }

    // Fake Store API products use demo stock
    return product.source === "api" ? 10 : 0;
  };

  // Get categories
  const categories = useMemo(
    () => [
      "All",
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
          .map(String)
      ),
    ],
    [products]
  );

  // Search and filter products
  const filteredProducts = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return products.filter((product) => {
      const productName = String(
        product.name || product.title || ""
      ).toLowerCase();

      const productCategory = String(product.category || "");

      return (
        productName.includes(searchText) &&
        (category === "All" || productCategory === category)
      );
    });
  }, [products, search, category]);

  // Recently added products: newest first, maximum 5
  const recentProducts = useMemo(() => {
    return products
      .filter(
        (product) =>
          product.source === "local" &&
          product.adminAddedAt
      )
      .sort(
        (a, b) =>
          new Date(b.adminAddedAt).getTime() -
          new Date(a.adminAddedAt).getTime()
      )
      .slice(0, 5);
  }, [products]);

  // Summary counts
  const inStockCount = products.filter(
    (product) => getStockQuantity(product) > 0
  ).length;

  const outOfStockCount = products.length - inStockCount;

  // Navigate to add product
  const handleAddProduct = () => {
    setError("");
    navigate("/add-product");
  };

  // Edit product
  const handleEdit = (product) => {
    setError("");

    if (!product) {
      setError("Product not found.");
      return;
    }

    if (typeof onEditProduct !== "function") {
      setError("Edit functionality is not configured.");
      return;
    }

    try {
      onEditProduct(product);
      navigate("/update-product");
    } catch (err) {
      console.error("Edit error:", err);
      setError("Unable to open the edit page.");
    }
  };

  // Delete product
  const handleDelete = (product) => {
    setError("");

    if (!product) {
      setError("Product not found.");
      return;
    }

    if (typeof onDeleteProduct !== "function") {
      setError("Delete functionality is not configured.");
      return;
    }

    const productName =
      product.name || product.title || "this product";

    if (
      !window.confirm(
        `Are you sure you want to delete "${productName}"?`
      )
    ) {
      return;
    }

    try {
      onDeleteProduct(product.id);
    } catch (err) {
      console.error("Delete error:", err);
      setError("Unable to delete the product.");
    }
  };

  // Reusable product table row
  const renderProductRow = (product, index, showDate = false) => {
    const quantity = getStockQuantity(product);
    const isInStock = quantity > 0;

    const productName =
      product.name || product.title || "Unnamed Product";

    const productImage = product.image || product.thumbnail;

    const rowKey = product.id ?? `${productName}-${index}`;

    return (
      <tr key={rowKey}>
        <td className="product-name-cell">
          <div className="admin-product-info">
            {productImage ? (
              <img
                src={productImage}
                alt={productName}
                className="admin-product-image"
                loading="lazy"
              />
            ) : (
              <div
                className="admin-product-placeholder"
                aria-hidden="true"
              >
                ▦
              </div>
            )}

            <div className="admin-product-details">
              <strong>{productName}</strong>
              <span>ID: {product.id ?? "N/A"}</span>
            </div>
          </div>
        </td>

        <td>
          <span className="category-label">
            {product.category || "Uncategorized"}
          </span>
        </td>

        <td className="product-price">
          ₹{Number(product.price || 0).toLocaleString("en-IN")}
        </td>

        {showDate && (
          <td className="date-added-cell">
            {new Date(product.adminAddedAt).toLocaleDateString(
              "en-IN"
            )}
          </td>
        )}

        {!showDate && (
          <td className="quantity-cell">{quantity}</td>
        )}

        <td className="status-cell">
          <span
            className={`stock-badge ${
              isInStock ? "in-stock" : "out-of-stock"
            }`}
          >
            {isInStock ? "In Stock" : "Out of Stock"}
          </span>
        </td>

        {!showDate && (
          <td className="actions-cell">
            <div className="admin-actions">
              <button
                type="button"
                className="edit-btn"
                onClick={() => handleEdit(product)}
                aria-label={`Edit ${productName}`}
              >
                Edit
              </button>

              <button
                type="button"
                className="delete-btn"
                onClick={() => handleDelete(product)}
                aria-label={`Delete ${productName}`}
              >
                Delete
              </button>
            </div>
          </td>
        )}
      </tr>
    );
  };

  return (
    <main className="admin-dashboard">
      {/* Dashboard header */}
      <header className="admin-header">
        <div>
          <h1>Product Management</h1>
          <p>Manage your store products in one place.</p>
        </div>

        <button
          type="button"
          className="add-product-btn"
          onClick={handleAddProduct}
        >
          <span aria-hidden="true">+</span>
          Add New Product
        </button>
      </header>

      {error && (
        <div className="admin-error" role="alert">
          {error}
        </div>
      )}

      {/* Product summary */}
      <section
        className="product-summary"
        aria-label="Product summary"
      >
        <article className="summary-card">
          <div
            className="summary-icon total-icon"
            aria-hidden="true"
          >
            ▦
          </div>

          <div className="summary-copy">
            <p>Total Products</p>
            <h2>{products.length}</h2>
          </div>
        </article>

        <article className="summary-card">
          <div
            className="summary-icon stock-icon"
            aria-hidden="true"
          >
            ✓
          </div>

          <div className="summary-copy">
            <p>In Stock</p>
            <h2>{inStockCount}</h2>
          </div>
        </article>

        <article className="summary-card">
          <div
            className="summary-icon out-icon"
            aria-hidden="true"
          >
            ×
          </div>

          <div className="summary-copy">
            <p>Out of Stock</p>
            <h2>{outOfStockCount}</h2>
          </div>
        </article>
      </section>

      {/* Recently added products table */}
      <section className="product-management-card recent-products-card">
        <div className="product-list-header">
          <div>
            <h2>Recently Added Products</h2>
            <p>
              {recentProducts.length} recent products
            </p>
          </div>
        </div>

        {recentProducts.length === 0 ? (
          <div className="admin-empty">
            <div className="empty-icon" aria-hidden="true">
              ▦
            </div>

            <h3>No recent products</h3>
            <p>
              Products you add will appear here.
            </p>

            <button
              type="button"
              className="add-product-btn"
              onClick={handleAddProduct}
            >
              + Add Product
            </button>
          </div>
        ) : (
          <div className="admin-product-table">
            <table>
              <thead>
                <tr>
                  <th scope="col">PRODUCT</th>
                  <th scope="col">CATEGORY</th>
                  <th scope="col">PRICE</th>
                  <th scope="col">DATE ADDED</th>
                  <th scope="col">STATUS</th>
                </tr>
              </thead>

              <tbody>
                {recentProducts.map((product, index) =>
                  renderProductRow(product, index, true)
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* All products table */}
      <section className="product-management-card">
        <div className="product-list-header">
          <div>
            <h2>All Products</h2>
            <p>{filteredProducts.length} products found</p>
          </div>
        </div>

        {/* Search and category filter */}
        <div className="product-filters">
          <label className="admin-search">
            <span aria-hidden="true">⌕</span>

            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              aria-label="Search products"
            />
          </label>

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            aria-label="Filter by category"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All Categories" : item}
              </option>
            ))}
          </select>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="admin-empty">
            <div className="empty-icon" aria-hidden="true">
              ▦
            </div>

            <h3>No products found</h3>

            <p>
              {products.length === 0
                ? "Add your first product to get started."
                : "Try another search term or category."}
            </p>

            {products.length === 0 && (
              <button
                type="button"
                className="add-product-btn"
                onClick={handleAddProduct}
              >
                + Add Product
              </button>
            )}
          </div>
        ) : (
          <div className="admin-product-table">
            <table>
              <thead>
                <tr>
                  <th scope="col">PRODUCT</th>
                  <th scope="col">CATEGORY</th>
                  <th scope="col">PRICE</th>
                  <th scope="col">STOCK</th>
                  <th scope="col">STATUS</th>
                  <th scope="col">ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product, index) =>
                  renderProductRow(product, index, false)
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;
