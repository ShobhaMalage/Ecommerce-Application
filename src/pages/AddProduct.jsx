
import { useNavigate } from "react-router-dom";
import ProductAddForm from "../component/ProductAddForm";

function AddProduct({ onAddProduct }) {
  const navigate = useNavigate();

  const handleAddProduct = (newProduct) => {
    onAddProduct(newProduct);
    navigate("/admin");
  };

  const handleCancel = () => {
    navigate("/products");
  };

  return (
    <div className="add-product-page">
      <h1>Add New Product</h1>

      <ProductAddForm onAddProduct={handleAddProduct} />

      <button type="button" onClick={handleCancel}>
        Cancel
      </button>
    </div>
  );
}

export default AddProduct;
