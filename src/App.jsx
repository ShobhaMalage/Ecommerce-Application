
import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { initialProducts } from "./data/products.js";

import Navbar from "./component/navbar.jsx";
import AddProduct from "./pages/AddProduct";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProductList from "./component/ProductList";
import AdminDashboard from "./pages/AdminDashboard";
import ProductDetails from "./pages/ProductDetails";
import EditProducts from "./pages/EditProducts.jsx";
import Cart from "./pages/Cart.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import BuyNow from "./pages/BuyNow.jsx";

import "./App.css";

const API_URL = "https://fakestoreapi.com/products";

// Safely load saved arrays from localStorage.
function loadSavedArray(key, fallback = []) {
  try {
    const saved = localStorage.getItem(key);

    if (!saved) return fallback;

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    return fallback;
  }
}

function AppContent() {
  const navigate = useNavigate();

  // Products, including saved admin products.
  const [products, setProducts] = useState(() => {
    const savedProducts = loadSavedArray("products", initialProducts);
    const mergedProducts = [...savedProducts];

    const existingIds = new Set(
      mergedProducts.map((product) => String(product.id))
    );

    initialProducts.forEach((product) => {
      if (!existingIds.has(String(product.id))) {
        mergedProducts.push(product);
      }
    });

    return mergedProducts;
  });

  const [cart, setCart] = useState(() =>
    loadSavedArray("cart")
  );

  const [wishlist, setWishlist] = useState(() =>
    loadSavedArray("wishlist")
  );

  // Login state.
  const [token, setToken] = useState(
    () => localStorage.getItem("token")
  );

  const isLoggedIn = Boolean(token);

  // API loading and error states.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [productsLoaded, setProductsLoaded] = useState(false);

  // Product selected for editing.
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Save products after the initial API request completes.
  useEffect(() => {
    if (!productsLoaded) return;

    try {
      localStorage.setItem("products", JSON.stringify(products));
    } catch (error) {
      console.error("Error saving products:", error);
    }
  }, [products, productsLoaded]);

  // Save cart.
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Save wishlist.
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Fetch API products while preserving locally added products.
  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch products.");
        }

        const data = await response.json();

        const apiProducts = data.map((item) => ({
          id: `api-${item.id}`,
          name: item.title,
          title: item.title,
          description: item.description,
          category: item.category,
          price: item.price,
          quantity: item.quantity ?? 10,
          image: item.image,
          status: "Active",
          oldPrice: item.price,
          discount: 0,
          rating: item.rating?.rate ?? 0,
          reviews: item.rating?.count ?? 0,
          source: "api",
        }));

        if (cancelled) return;

        setProducts((previousProducts) => {
          const localProducts = previousProducts.filter(
            (product) => product.source !== "api"
          );

          return [...localProducts, ...apiProducts];
        });
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to fetch products.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setProductsLoaded(true);
        }
      }
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  // ADD PRODUCT: record the date so Recent Products can display it.
  const handleAddProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: newProduct.id ?? `local-${Date.now()}`,
      source: "local",
      adminAddedAt: new Date().toISOString(),
    };

    setProducts((previousProducts) => [
      productWithId,
      ...previousProducts,
    ]);

    navigate("/admin");
  };

  // DELETE PRODUCT.
  const handleDeleteProduct = (productId) => {
    setProducts((previousProducts) =>
      previousProducts.filter(
        (product) => String(product.id) !== String(productId)
      )
    );
  };

  // SELECT PRODUCT FOR EDITING.
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
  };

  // UPDATE PRODUCT.
  const handleUpdateProduct = (updatedProduct) => {
    setProducts((previousProducts) =>
      previousProducts.map((product) =>
        String(product.id) === String(updatedProduct.id)
          ? {
              ...product,
              ...updatedProduct,
              adminAddedAt: product.adminAddedAt,
            }
          : product
      )
    );

    setSelectedProduct(null);
    navigate("/admin");
  };

  // LOGIN.
  const handleLogin = (newToken) => {
    if (!newToken) return;

    localStorage.setItem("token", newToken);
    setToken(newToken);
    navigate("/admin");
  };

  // LOGOUT.
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setSelectedProduct(null);
    navigate("/");
  };

  // Total items in cart.
  const cartCount = cart.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0
  );

  return (
    <>
      {/* Navbar visible on all pages, including Admin Dashboard. */}
      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      <main>
        <Routes>
          <Route
            path="/"
            element={<Home products={products} />}
          />

          <Route
            path="/home"
            element={<Home products={products} />}
          />

          {/* Product listing */}
          <Route
            path="/products"
            element={
              <>
                {loading && (
                  <p className="api-message" role="status">
                    Loading API products...
                  </p>
                )}

                {error && (
                  <div className="api-error" role="alert">
                    <p>
                      {error} Your saved products are still available.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setRetryCount((count) => count + 1)
                      }
                    >
                      Retry API
                    </button>
                  </div>
                )}

                <ProductList
                  products={products}
                  cart={cart}
                  setCart={setCart}
                  wishlist={wishlist}
                  setWishlist={setWishlist}
                />
              </>
            }
          />

          {/* Product details */}
          <Route
            path="/products/:id"
            element={
              <ProductDetails
                products={products}
                setCart={setCart}
              />
            }
          />

          {/* Buy Now */}
          <Route
            path="/buy-now/:id"
            element={<BuyNow products={products} />}
          />

          {/* Checkout */}
          <Route
            path="/checkout"
            element={
              <div className="checkout-placeholder">
                <h1>Checkout</h1>
                <p>Your checkout page will be implemented here.</p>
              </div>
            }
          />

          {/* Cart */}
          <Route
            path="/cart"
            element={
              <Cart cart={cart} setCart={setCart} />
            }
          />

          {/* Wishlist */}
          <Route
            path="/wishlist"
            element={
              <Wishlist
                wishlist={wishlist}
                setWishlist={setWishlist}
                setCart={setCart}
              />
            }
          />

          {/* Login */}
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/admin" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />

          {/* Protected Admin Dashboard */}
          <Route
            path="/admin"
            element={
              isLoggedIn ? (
                <AdminDashboard
                  products={products}
                  onEditProduct={handleEditProduct}
                  onDeleteProduct={handleDeleteProduct}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Protected Add Product */}
          <Route
            path="/add-product"
            element={
              isLoggedIn ? (
                <AddProduct onAddProduct={handleAddProduct} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Protected Edit Product */}
          <Route
            path="/update-product"
            element={
              isLoggedIn && selectedProduct ? (
                <EditProducts
                  product={selectedProduct}
                  onUpdateProduct={handleUpdateProduct}
                  onCancel={() => {
                    setSelectedProduct(null);
                    navigate("/admin");
                  }}
                />
              ) : (
                <Navigate
                  to={isLoggedIn ? "/admin" : "/login"}
                  replace
                />
              )
            }
          />

          {/* Unknown URLs */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
