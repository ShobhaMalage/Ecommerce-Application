function ProductCard({ product }) {
  return (
    <div>
      <img src={product.image} alt={product.name} />

      <h2>{product.name}</h2>

      <p>Price: ₹{product.price}</p>

      <p>Rating: ⭐ {product.rating}</p>

      <button>Add to Cart</button>
    </div>
  )
}

export default ProductCard