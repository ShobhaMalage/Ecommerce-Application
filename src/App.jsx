import './App.css'
import ProductCard from './component/Productcard.jsx'

function App() {

  const product = {
    image: "https://via.placeholder.com/200",
    name: "Wireless Headphones",
    price: 1999,
    rating: 4.5
  }

  return (
    <>
      <ProductCard product={product} />
    </>
  )
}

export default App