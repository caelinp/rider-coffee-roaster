// FeaturedProductsPage.tsx

import './FeaturedProductsPage.css';
import productImage1 from './img/product1.jpg'
import productImage2 from './img/product2.jpg'
import productImage3 from './img/product3.jpg'

const FeaturedProductsPage = () => {
  const products = [
    {
      id: 1,
      name: 'Trail Rider',
      price: '$19.99',
      imageUrl: productImage1,
    },
    {
      id: 2,
      name: 'Low Rider',
      price: '$19.99',
      imageUrl: productImage2,
    },
    {
      id: 3,
      name: 'Easy Rider',
      price: '$19.99',
      imageUrl: productImage3,
    },
    // Add more product objects here as needed
  ];

  return (
    <div className="featured-products-page">
      <div className="featured-products-container">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.imageUrl} alt={product.name} className="product-image" />
            <div className="product-details">
              <h2 className="product-name">{product.name}</h2>
              <p className="product-price">{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProductsPage;
