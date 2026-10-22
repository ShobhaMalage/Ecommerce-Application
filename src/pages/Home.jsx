
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

function Home({ products = [] }) {
  const navigate = useNavigate();

  const categories = [
    { name: "Electronics", icon: "🎧" },
    { name: "Fashion", icon: "👕" },
    { name: "Home & Kitchen", icon: "🏠" },
    { name: "Beauty", icon: "✨" },
    { name: "Sports & Fitness", icon: "🏃" },
    { name: "Books", icon: "📚" },
    { name: "Toys", icon: "🧸" },
    { name: "Accessories", icon: "👜" },
  ];

  const featuredProducts = useMemo(
    () => products.slice(0, 8),
    [products]
  );

  const getProductName = (product) =>
    product.name || product.title || "Product";

  const getProductImage = (product) =>
    product.image || product.imageUrl || product.thumbnail || "";

  const getProductPrice = (product) =>
    Number(
      String(product.price ?? 0).replace(/[^\d.]/g, "")
    ) || 0;

  const openProducts = (category = "") => {
    navigate(
      category
        ? `/products?category=${encodeURIComponent(category)}`
        : "/products"
    );
  };

  const buyNow = (product) => {
    navigate("/checkout", {
      state: { product },
    });
  };

  return (
    <main className="home-page">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-content">
          <span className="hero-label">
            YOUR EVERYDAY SHOPPING DESTINATION
          </span>

          <h1>
            Discover Products
            <br />
            You'll <span>Love.</span>
          </h1>

          <p>
            Find your favourite electronics, fashion, home essentials
            and more — all in one place.
          </p>

          <div className="hero-buttons">
            <button
              className="hero-primary-btn"
              onClick={() => openProducts()}
            >
              Shop Now <span>→</span>
            </button>

            <button
              className="hero-secondary-btn"
              onClick={() =>
                document
                  .getElementById("home-categories")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Categories
            </button>
          </div>

          <div className="hero-trust">
            <span>✓ Quality Products</span>
            <span>✓ Easy Shopping</span>
            <span>✓ Cash on Delivery</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-circle">
            <div className="hero-shopping-icon">🛍️</div>
          </div>

          <div className="hero-floating-card hero-card-top">
            <span>✨</span>
            <div>
              <strong>Great Finds</strong>
              <small>For every lifestyle</small>
            </div>
          </div>

          <div className="hero-floating-card hero-card-bottom">
            <span>🚚</span>
            <div>
              <strong>Easy Ordering</strong>
              <small>Shop from home</small>
            </div>
          </div>
        </div>
      </section>

      {/* Shopping Benefits */}
      <section className="home-benefits">
        <div className="benefit-item">
          <span className="benefit-icon">🚚</span>
          <div>
            <h3>Convenient Shopping</h3>
            <p>Browse products anytime</p>
          </div>
        </div>

        <div className="benefit-item">
          <span className="benefit-icon">💳</span>
          <div>
            <h3>Cash on Delivery</h3>
            <p>Pay when your order arrives</p>
          </div>
        </div>

        <div className="benefit-item">
          <span className="benefit-icon">🛒</span>
          <div>
            <h3>Easy Ordering</h3>
            <p>Simple checkout experience</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="home-section" id="home-categories">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">EXPLORE OUR STORE</span>
            <h2>Shop by Category</h2>
            <p>Find exactly what you are looking for.</p>
          </div>

          <button
            className="text-link"
            onClick={() => openProducts()}
          >
            View All Products →
          </button>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <button
              type="button"
              className="category-card"
              key={category.name}
              onClick={() => openProducts(category.name)}
            >
              <span className="category-icon">
                {category.icon}
              </span>

              <span className="category-name">
                {category.name}
              </span>

              <span className="category-arrow">↗</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="home-section featured-section">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">HANDPICKED FOR YOU</span>
            <h2>Featured Products</h2>
            <p>Discover some of our products available in the store.</p>
          </div>

          <button
            className="text-link"
            onClick={() => openProducts()}
          >
            View All →
          </button>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="featured-product-grid">
            {featuredProducts.map((product, index) => {
              const image = getProductImage(product);
              const name = getProductName(product);
              const price = getProductPrice(product);

              return (
                <article
                  className="featured-product-card"
                  key={product.id ?? product.name ?? index}
                >
                  <button
                    type="button"
                    className="featured-image-button"
                    onClick={() => openProducts()}
                    aria-label={`Browse products: ${name}`}
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={name}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="product-image-placeholder">
                        🛍️
                      </div>
                    )}

                    <span className="featured-tag">Featured</span>
                  </button>

                  <div className="featured-product-info">
                    <span className="featured-category">
                      {product.category || "Everyday Essentials"}
                    </span>

                    <h3>{name}</h3>

                    <div className="featured-price-row">
                      <strong>
                        ₹{price.toLocaleString("en-IN")}
                      </strong>
                    </div>

                    <button
                      type="button"
                      className="featured-buy-btn"
                      onClick={() => buyNow(product)}
                    >
                      Buy Now →
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-products">
            <span>🛍️</span>
            <h3>Your products will appear here</h3>
            <p>
              Add products to your store to display them on the home page.
            </p>
            <button
              className="hero-primary-btn"
              onClick={() => openProducts()}
            >
              Browse Products
            </button>
          </div>
        )}
      </section>

      {/* Promotional Banner */}
      <section className="home-promo">
        <div>
          <span className="section-eyebrow">YOUR NEXT GREAT FIND</span>
          <h2>Something for Everyone.</h2>
          <p>
            Explore the collection and find products that fit your style,
            needs and everyday life.
          </p>
          <button
            className="promo-button"
            onClick={() => openProducts()}
          >
            Explore the Store →
          </button>
        </div>

        <div className="promo-illustration" aria-hidden="true">
          <span>🎧</span>
          <span>👟</span>
          <span>👜</span>
          <span>⌚</span>
        </div>
      </section>
    </main>
  );
}

export default Home;
