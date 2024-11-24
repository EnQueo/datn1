import React, { useState, useContext, useEffect } from 'react';
import './ProductDisplay.css';
import star_icon from '../assets/Frontend_Assets/star_icon.png';
import star_dull_icon from '../assets/Frontend_Assets/star_dull_icon.png';
import { ShopContext } from '../../context/ShopContext';

const ProductDisplay = (props) => {
    const { product } = props;
    const { addToCart } = useContext(ShopContext);

    const [images, setImages] = useState([...product.image]); // Lưu toàn bộ mảng ảnh
    const [selectedSize, setSelectedSize] = useState(null);
    const [sizes, setSizes] = useState([]);

    useEffect(() => {
        // Tách chuỗi size thành mảng
        if (product.size) {
            setSizes(product.size.split(',').map(size => size.trim()));
        }
    }, [product.size]); 

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
    };

    const handleThumbnailClick = (index) => {
        // Hoán đổi ảnh lớn và ảnh nhỏ được chọn
        const newImages = [...images];
        [newImages[0], newImages[index]] = [newImages[index], newImages[0]];
        setImages(newImages); // Cập nhật lại mảng ảnh
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
                <h1>{product.name}</h1>
                <div className="product-display-right-star">
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_dull_icon} alt="" />
                    <p>(122)</p>
                </div>
                <div className="product-display-right-prices">
                    <div className="product-display-right-price-old">${product.old_price}</div>
                    <div className="product-display-right-price-new">${product.new_price}</div>
                </div>
                <div className="product-display-right-description">
                    This is a Kobe product
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
