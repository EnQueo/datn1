import React, { useState, useContext, useEffect } from 'react';
import './ProductDisplay.css';
import star_icon from '../assets/Frontend_Assets/star_icon.png';
import star_dull_icon from '../assets/Frontend_Assets/star_dull_icon.png';
import { ShopContext } from '../../context/ShopContext';

const ProductDisplay = (props) => {
    const { product } = props;
    const { addToCart } = useContext(ShopContext);

    const [images, setImages] = useState([...product.image]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [sizes, setSizes] = useState([]);

    useEffect(() => {
        if (product.sizes && Array.isArray(product.sizes)) {
            setSizes(product.sizes.map(size => size.size));
        }
    }, [product.sizes]); 

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
    };

    const handleThumbnailClick = (index) => {
        const newImages = [...images];
        [newImages[0], newImages[index]] = [newImages[index], newImages[0]];
        setImages(newImages);
    };

    return (
        <div className='product-display'>
            <div className="product-display-left">
                <div className="product-display-img-list">
                    {images.slice(1).map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Product ${index + 2}`}
                            onClick={() => handleThumbnailClick(index + 1)} // Đảm bảo đúng index
                            className={images[0] === img ? 'selected' : ''} 
                        />
                    ))}
                </div>
                <div className="product-display-img">
                    <img className='product-display-main-img' src={images[0]} alt="Main Product" />
                </div>
            </div>

            <div className="product-display-right">
                <div className="product-name">{product.name}</div>
                <div className="product-display-right-prices">
                    <div>Price:</div>
                    <div className="product-display-right-price-old">${product.old_price}</div>
                    <div className="product-display-right-price-new">${product.new_price}</div>
                </div>
                <div className="product-display-right-size">
                    <h1>Select Size</h1>
                    <div className="product-display-right-sizes">
                        {sizes.length > 0 ? (
                            sizes.map((size, index) => (
                                <div
                                    key={index}
                                    className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                                    onClick={() => handleSizeSelect(size)}
                                >
                                    {size}
                                </div>
                            ))
                        ) : (
                            <p>No sizes available</p>
                        )}
                    </div>
                </div>
                <br />
                <button 
                    onClick={() => { 
                        if (selectedSize) {
                            addToCart(product.id, selectedSize); 
                        } else {
                            alert('Please select a size');
                        }
                    }}
                >
                    ADD TO CART
                </button>
                <p className='product-display-right-category'>
                    <span>Category : </span>{product.category}
                </p>
                <p className='product-display-right-brand'>
                    <span>Brand : </span>{product.brand}
                </p>
            </div>
        </div>
    );
};

export default ProductDisplay;
