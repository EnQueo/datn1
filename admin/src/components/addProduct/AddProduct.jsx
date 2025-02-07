import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/Admin_Assets/upload_area.svg';

const AddProduct = () => {
    const [images, setImages] = useState([]);
    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        category: "basketballs",
        new_price: "",
        old_price: "",
        brand: "",
        sizes: []
    });

    const addSizeQuantity = () => {
        setProductDetails({
            ...productDetails,
            sizes: [...productDetails.sizes, { size: '', quantity: '' }]
        });
    };

    const handleSizeQuantityChange = (index, field, value) => {
        const newSizes = [...productDetails.sizes];
        newSizes[index][field] = value;
        setProductDetails({ ...productDetails, sizes: newSizes });
    };

    const imageHandler = (e) => {
        const files = e.target.files; 
        const uploadedImages = [...images];
       
        for (let i = 0; i < files.length; i++) {
            uploadedImages.push(files[i]);
        }

        setImages(uploadedImages);
    };

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    const Add_Product = async () => {
        try {
            let formData = new FormData();
            images.forEach((image) => {
                formData.append('product_images', image, image.name);
            });
        
            const uploadResponse = await fetch('/upload', {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body: formData,
            }).then((resp) => resp.json());

            if (uploadResponse.success) {
                const product = { ...productDetails, image_urls: uploadResponse.image_urls };

                const addResponse = await fetch('/addproduct', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(product),
                }).then((resp) => resp.json());

                if (addResponse.success) {
                    alert('Product Added');
                    setImages([]);
                    setProductDetails({
                        name: "",
                        image: "",
                        category: "basketballs",
                        new_price: "",
                        old_price: "",
                        brand: "",
                        sizes: []
                    });
                } else {
                    alert('Failed to add product');
                }
            } else {
                alert('Failed to upload images');
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    return (
        <div className='add-product'>
            <div className="addproduct-itemfield">
                <p>Product Title</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type="text" name="old_price" placeholder='Type here' />
                </div>
                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type="text" name="new_price" placeholder='Type here' />
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
                    <option value="shoes">Shoes</option>
                    <option value="basketballs">Basketballs</option>
                    <option value="accessories">Accessories</option>
                </select>
            </div>
            <div className="addproduct-itemfield">
                <p>Brand</p>
                <input value={productDetails.brand} onChange={changeHandler} type="text" name="brand" placeholder="Enter brand name" />
            </div>
            <div className="addproduct-itemfield">
                <label htmlFor="file-input">
                    <img src={images.length > 0 ? URL.createObjectURL(images[images.length - 1]) : upload_area} className='addproduct-thumbnail-img' />
                </label>
                <input onChange={imageHandler} type="file" name='image' id='file-input' multiple hidden />
            </div>

            <div className="image-preview">
                <h4>Uploaded Images:</h4>
                <ul>
                    {images.map((image, index) => (
                        <li key={index}>
                            <img className="preview-img" src={URL.createObjectURL(image)} alt={`uploaded-${index}`} />
                        </li>
                    ))}
                </ul>
            </div>

            <div className="addproduct-itemfield">
                <p>Product Sizes and Quantities</p>
                {productDetails.sizes.map((size, index) => (
                    <div key={index} className="size-input">
                        <input
                            type="text"
                            value={size.size}
                            onChange={(e) => handleSizeQuantityChange(index, 'size', e.target.value)}
                            placeholder="Size (e.g., 8)"
                        />
                        <input
                            type="number"
                            value={size.quantity}
                            onChange={(e) => handleSizeQuantityChange(index, 'quantity', e.target.value)}
                            placeholder="Quantity"
                        />
                    </div>
                ))}
                <button onClick={addSizeQuantity} className="add-size-btn">Add Size/Quantity</button>
            </div>

            <button onClick={Add_Product} className='addproduct-btn'>ADD</button>
        </div>
    );
};

export default AddProduct;
