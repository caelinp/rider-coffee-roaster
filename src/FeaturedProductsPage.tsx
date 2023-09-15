// FeaturedProductsPage.tsx

import './FeaturedProductsPage.css';
import { Link } from 'react-router-dom';
import productsData from './json/products.json'; // Import the JSON file
import DynamicImage from './DynamicImage';
import {formatString} from './AllProductsPage';

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: string;
  notes: string;
  farm: string;
  roast: string;
}

const FeaturedProductsPage = () => {
  // Define a new Product interface

  // Filter products based on the featuredProducts list
  const featuredProducts: Product[] = productsData.featuredProducts.map((productId, index) => {
    const productData = productsData.products.find((product: any) => product.id === productId); // Use 'any' type here
  
    return {
      id: productData?.id || `${index + 1}`, // Use optional chaining to avoid errors if fields are missing
      name: productData?.productName || `Product ${index + 1}`,
      imageUrl: productData?.images?.bagImage || '',
      price: productData?.pricing?.size2?.price || "99.99", 
      notes: productData?.notes || "no notes", 
      farm: productData?.farm || "no farm", 
      roast: productData?.roast || "no roast", 
    };
  });

  return (
    <div className="featured-products-page">
      <div className="featured-products-and-bottom-container">
        <div className="featured-products-container">
          <h1 className="featured-header">Featured Roasts</h1>
          {featuredProducts.map((product) => (
            <div className="link-container" key={product.id}>
              <Link
                id="product-card-featured-products-link"
                to={`/rider-coffee-roaster/products/` + product.id + "/" + formatString(product.name) }
                key={product.id}
                className="product-link"
              >
                <div className="product-card-featured" key={product.id}>
                  <div className="product-image-featured-container">
                    <DynamicImage className="product-image-featured" imageUrl={product.imageUrl} alt={product.name} />
                  </div>
                  <div className="product-details-featured">
                    <h2 className="product-name-featured">{product.name}</h2>
                    <p className="product-roast-featured">{product.roast.toLowerCase()}</p>
                    <p className="product-notes-featured">notes: {product.notes}</p>
                    <p className="product-farm-featured">{product.farm}</p>
                  </div>
                </div>
                <br></br>
                <br></br>
                <br></br>
              </Link>
            </div>
          ))}
        </div>
        <div className="black-bar-bottom"></div>
      </div>
    </div>
  );
};

export default FeaturedProductsPage;
