
import { useState, useEffect } from "react";
import "./EditProduct.css";

const initialForm = {
  name: "",
  category: "",
  description: "",
  price: "",
  oldPrice: "",
  discount: "",
  rating: "",
  reviews: "",
  quantity: "",
  image: "",
};
function ProductUpdate({ product, onUpdateProduct, onCancel }) {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

useEffect(() => {
  if (product) {
    setFormData({
      name: product.name ?? "",
      category: product.category ?? "",
      description: product.description ?? "",
      price: product.price ?? "",
      oldPrice: product.oldPrice ?? "",
      discount: product.discount ?? "",
      rating: product.rating ?? "",
      reviews: product.reviews ?? "",
      quantity: product.quantity ?? "",
      image: product.image ?? "",
    });
  }
}, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (formData.price === "" || Number(formData.price) < 0) {
      newErrors.price = "Enter a valid price";
    }

    if (
      formData.oldPrice !== "" &&
      Number(formData.oldPrice) < 0
    ) {
      newErrors.oldPrice = "Enter a valid old price";
    }

    if (
      formData.rating !== "" &&
      (Number(formData.rating) < 0 ||
        Number(formData.rating) > 5)
    ) {
      newErrors.rating = "Rating must be between 0 and 5";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedProduct = {
      ...product,
      ...formData,
      id: product.id,
      price: Number(formData.price),
      oldPrice:
        formData.oldPrice === ""
          ? 0
          : Number(formData.oldPrice),
      discount: Number(formData.discount) || 0,
      rating:
        formData.rating === ""
          ? 0
          : Number(formData.rating),
      reviews: Number(formData.reviews) || 0,
    };

    onUpdateProduct(updatedProduct);
  };

  return (
    <div className="update-page">
      <form className="update-form" onSubmit={handleSubmit}>
        <h2>Update Product</h2>
        <p className="form-subtitle">
          Edit your product information below.
        </p>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
            />
            {errors.name && <small>{errors.name}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter category"
            />
            {errors.category && (
              <small>{errors.category}</small>
            )}
          </div>

<div className="form-group">
  <label htmlFor="description">Product Description *</label>
  <textarea
    id="description"
    name="description"
    value={formData.description}
    onChange={handleChange}
    placeholder="Enter product description"
    rows={4}
    required
  />
</div>

<div className="form-group">
  <label htmlFor="quantity">Quantity *</label>
  <input
    id="quantity"
    name="quantity"
    type="number"
    min="0"
    step="1"
    value={formData.quantity}
    onChange={handleChange}
    placeholder="Enter available quantity"
    required
  />
</div>

          <div className="form-group">
            <label htmlFor="price">Selling Price (₹) *</label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter selling price"
            />
            {errors.price && <small>{errors.price}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="oldPrice">Original Price (₹)</label>
            <input
              id="oldPrice"
              name="oldPrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.oldPrice}
              onChange={handleChange}
              placeholder="Enter original price"
            />
            {errors.oldPrice && (
              <small>{errors.oldPrice}</small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="discount">Discount (%)</label>
            <input
              id="discount"
              name="discount"
              type="number"
              min="0"
              max="100"
              value={formData.discount}
              onChange={handleChange}
              placeholder="Enter discount"
            />
          </div>

          <div className="form-group">
            <label htmlFor="rating">Rating (0–5)</label>
            <input
              id="rating"
              name="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={handleChange}
              placeholder="Enter rating"
            />
            {errors.rating && (
              <small>{errors.rating}</small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="reviews">Number of Reviews</label>
            <input
              id="reviews"
              name="reviews"
              type="number"
              min="0"
              value={formData.reviews}
              onChange={handleChange}
              placeholder="Enter review count"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              id="image"
              name="image"
              type="url"
              value={formData.image}
              onChange={handleChange}
              placeholder="Enter image URL"
            />
          </div>
        </div>

        {formData.image && (
          <div className="image-preview">
            <p>Product Image Preview</p>
            <img
              src={formData.image}
              alt="Product preview"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="update-btn">
            Update Product
          </button>

          <button
            type="button"
            className="cancel-btn"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductUpdate;
