
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./navbar.css";

function Navbar({
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  onLogout,
}) {
  const [searchText, setSearchText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  // Search products
  const handleSearch = (event) => {
  event.preventDefault();

  const search = searchText.trim();

  if (search.length > 0) {
    navigate(
      `/products?search=${encodeURIComponent(search)}`
    );
    setMenuOpen(false);
  } else {
    navigate("/products");
  }
};

  // Close mobile menu
  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Logout user
  const handleLogout = () => {
    closeMenu();

    if (onLogout) {
      onLogout();
    } else {
      navigate("/login");
    }
  };

  // Product categories
  const categories = [
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Beauty",
    "Sports & Fitness",
    "Books",
  ];

  return (
    <header className="shop-header">
      {/* Main navbar */}
      <div className="navbar-top">
        {/* Logo */}
        <NavLink
          to="/home"
          className="shop-logo"
          onClick={closeMenu}
        >
          <span className="logo-icon">S</span>

          <span className="logo-text">
            <strong>
              Shop<span>Ease</span>
            </strong>

            <small>SHOP SMART. LIVE BETTER.</small>
          </span>
        </NavLink>

        {/* Search bar */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Search for products, brands and more..."
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            aria-label="Search products"
          />

          <button type="submit" aria-label="Search">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 5 5" />
            </svg>
          </button>
        </form>

        {/* Account, wishlist and cart */}
        <div className="navbar-actions">
          {/* Account */}
          <div className="account-area">
            <span className="account-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
              </svg>
            </span>

            <div className="account-text">
              <small>
                Hello Shobha, {isLoggedIn ? "Welcome" : "Guest"}
              </small>

              {isLoggedIn ? (
                <button
                  type="button"
                  className="account-link"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : (
                <NavLink to="/login" onClick={closeMenu}>
                  Login / Sign up
                </NavLink>
              )}
            </div>
          </div>

          {/* Wishlist */}
          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              `header-action ${isActive ? "active" : ""}`
            }
            aria-label={`Wishlist, ${wishlistCount} items`}
            onClick={closeMenu}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
            </svg>

            <span>Wishlist</span>

            {wishlistCount > 0 && (
              <span className="count-badge">
                {wishlistCount}
              </span>
            )}
          </NavLink>

          {/* Cart */}
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `header-action ${isActive ? "active" : ""}`
            }
            aria-label={`Cart, ${cartCount} items`}
            onClick={closeMenu}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 8H6" />
              <circle cx="10" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
            </svg>

            <span>Cart</span>

            {cartCount > 0 && (
              <span className="count-badge">
                {cartCount}
              </span>
            )}
          </NavLink>

          {/* Logout button on small screens when logged in */}
          {isLoggedIn && (
            <button
              type="button"
              className="logout-btn mobile-logout-btn"
              onClick={handleLogout}
              aria-label="Logout"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="mobile-menu-btn"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Category navigation */}
      <nav
        className={`category-navbar ${
          menuOpen ? "mobile-open" : ""
        }`}
        aria-label="Main navigation"
      >
        <div className="category-inner">
          <NavLink
            to="/home"
            onClick={closeMenu}
            className={({ isActive }) =>
              `category-link ${isActive ? "active" : ""}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            onClick={closeMenu}
            className={({ isActive }) =>
              `category-link ${
                isActive &&
                window.location.search === ""
                  ? "active"
                  : ""
              }`
            }
          >
            All Products
          </NavLink>

          {categories.map((category) => (
            <NavLink
              key={category}
              to={`/products?category=${encodeURIComponent(category)}`}
              onClick={closeMenu}
              className="category-link"
            >
              {category}
            </NavLink>
          ))}

          <NavLink
            to="/products?deals=true"
            onClick={closeMenu}
            className="category-link deals-link"
          >
            Today's Deals
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
