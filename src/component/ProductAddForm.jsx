
import { useRef, useState } from "react";
import "./ProductAddForm.css";

const initialForm = {
  id:"",
  name: "",
  description: "",
  category: "",
  price: "",
  quantity: "",
  imageUrl: "",
  status: "",
};

function ProductAddForm({ onAddProduct }) {
  const [formData, setFormData] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      image: name === "imageUrl" ? "" : prev.image,
    }));

    setSuccess("");
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    setImageFile(file || null);
    setErrors((prev) => ({ ...prev, image: "" }));
    setSuccess("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category.";
    }

    if (formData.price.trim() === "") {
      newErrors.price = "Price is required.";
    } else if (
      !Number.isFinite(Number(formData.price)) ||
      Number(formData.price) <= 0
    ) {
      newErrors.price = "Price must be greater than zero.";
    }

    if (formData.quantity.trim() === "") {
      newErrors.quantity = "Quantity is required.";
    } else if (
      !Number.isInteger(Number(formData.quantity)) ||
      Number(formData.quantity) < 0
    ) {
      newErrors.quantity =
        "Quantity must be a whole number and cannot be negative.";
    }

    if (imageFile) {
      if (!imageFile.type.startsWith("image/")) {
        newErrors.image = "Please select a valid image file.";
      }
    } else if (formData.imageUrl.trim()) {
      try {
        const url = new URL(formData.imageUrl.trim());

        if (!["http:", "https:"].includes(url.protocol)) {
          newErrors.image = "Image URL must start with HTTP or HTTPS.";
        }
      } catch {
        newErrors.image = "Please enter a valid image URL.";
      }
    } else {
      newErrors.image = "Please provide an image URL or choose an image file.";
    }

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);
    setSuccess("");

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const image = imageFile
      ? URL.createObjectURL(imageFile)
      : formData.imageUrl.trim();

    const newProduct = {
      id: Date.now(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      image,
      status: formData.status,
      oldPrice: Number(formData.price),
      discount: 0,
      rating: 0,
      reviews: 0,
    };

    onAddProduct(newProduct);
    setSuccess("Product added successfully!");
    setFormData(initialForm);
    setImageFile(null);
    setErrors({});

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReset = () => {
    setFormData(initialForm);
    setImageFile(null);
    setErrors({});
    setSuccess("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <section className="add-product-section">
      <div className="add-product-heading">
        <div>
          <h2>Add New Product</h2>
          <p>Enter product information to add it to your store.</p>
        </div>
      </div>

      {success && (
        <p className="form-success" role="status">
          {success}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="add-form-grid">
          <div className="add-form-field">
            <label htmlFor="product-name">Product Name *</label>
            <input
              id="product-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
            />
            {errors.name && (
              <span className="form-error">{errors.name}</span>
            )}
          </div>

          <div className="add-form-field">
            <label htmlFor="product-category">Category *</label>
            <select
              id="product-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Beauty">Beauty</option>
              <option value="Sports & Fitness">Sports & Fitness</option>
              <option value="Books">Books</option>
              <option value="Toys">Toys</option>
              <option value="Accessories">Accessories</option>
            </select>
            {errors.category && (
              <span className="form-error">{errors.category}</span>
            )}
          </div>

          <div className="add-form-field full-width">
            <label htmlFor="product-description">Description *</label>
            <textarea
              id="product-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows={3}
            />
            {errors.description && (
              <span className="form-error">{errors.description}</span>
            )}
          </div>

          <div className="add-form-field">
            <label htmlFor="product-price">Price (₹) *</label>
            <input
              id="product-price"
              name="price"
              type="number"
              min="0.01"
              step="any"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
            />
            {errors.price && (
              <span className="form-error">{errors.price}</span>
            )}
          </div>

          <div className="add-form-field">
            <label htmlFor="product-quantity">Quantity *</label>
            <input
              id="product-quantity"
              name="quantity"
              type="number"
              min="0"
              step="1"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Enter stock quantity"
            />
            {errors.quantity && (
              <span className="form-error">{errors.quantity}</span>
            )}
          </div>

          <div className="add-form-field full-width">
            <label htmlFor="product-image-url">Product Image URL</label>
            <input
              id="product-image-url"
              name="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(event) => {
                setImageFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
                handleChange(event);
              }}
              disabled={Boolean(imageFile)}
              placeholder="https://example.com/product.jpg"
            />

            <span className="form-hint">
              Alternatively, upload an image file below.
            </span>

            <input
              ref={fileInputRef}
              id="product-image-file"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files[0];

                if (file && !file.type.startsWith("image/")) {
                  setImageFile(null);
                  setErrors((prev) => ({
                    ...prev,
                    image: "Please select a valid image file.",
                  }));
                  event.target.value = "";
                  return;
                }

                setFormData((prev) => ({ ...prev, imageUrl: "" }));
                setImageFile(file || null);
                setErrors((prev) => ({ ...prev, image: "" }));
              }}
              disabled={Boolean(formData.imageUrl.trim())}
            />

            {imageFile && (
              <span className="form-hint">
                Selected file: {imageFile.name}
              </span>
            )}

            {errors.image && (
              <span className="form-error">{errors.image}</span>
            )}
          </div>

          <div className="add-form-field">
            <label htmlFor="product-status">Product Status *</label>
            <select
              id="product-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="add-form-actions">
          <button type="submit" className="add-product-btn">
            Add Product
          </button>

          <button
            type="button"
            className="reset-product-btn"
            onClick={handleReset}
          >
            Reset Form
          </button>
        </div>
      </form>
    </section>
  );
}

export default ProductAddForm;
