import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useParams } from 'react-router-dom';
import Breadcrum from '../components/Breadcrums/Breadcrum';
import ProductDisplay from '../components/ProductDisplay/ProductDisplay';
import Footer from '../components/fotter/Footer';
import DescriptionBox from '../components/descriptionBox/DescriptionBox';
import RelatedProduct from '../components/relatedProduct/RelatedProduct';


const Product = () => {
  const{all_product} = useContext(ShopContext);
  const{productId} = useParams();
  const product = all_product.find((e)=>e.id=== Number(productId))

  return (
    <div>
      <Breadcrum product={product}/>
      <ProductDisplay product={product}/>
      <DescriptionBox/>
      <RelatedProduct />
      <Footer/>
    </div>
  )
}

export default Product
