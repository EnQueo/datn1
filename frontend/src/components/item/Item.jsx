import React from 'react';
import './Item.css';
import { Link } from 'react-router-dom';
import defaultImage from '../assets/Frontend_Assets/luka1.jpg';

const Item = ({ id, name, image, new_price, old_price }) => {
  const images = image && image.length > 0 ? image[0] : defaultImage;

  return (
    <div className='item'>
      <Link to={`/product/${id}`}>
        <img 
          src={images} 
          alt={name} 
          onClick={() => window.scrollTo(0, 0)}
          className="item-image"
        />
      </Link>
      <p>{name}</p>
      <div className="item-price">
        <div className="item-price-new">
          ${new_price}
        </div>
        <div className="item-price-old">
          ${old_price}
        </div>
      </div>
    </div>
  );
};

export default Item;
