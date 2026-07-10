import { Fragment, useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import {useSearchParams} from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

export default function Home() {
 const[products,setProduct] = useState([]);
 const[searchParams] =useSearchParams() 

 useEffect(()=>{
   fetch(`${API_URL}/product?${searchParams.toString()}`)
   .then(res => res.json())
   .then(res => {
    const apiProducts = Array.isArray(res.products) ? res.products : [];
        // Some records may contain a nested "products" array from older seed imports.
        const flattenedProducts = apiProducts.flatMap((product) =>
          Array.isArray(product?.products) ? product.products : product
        );
        const validProducts = flattenedProducts.filter((product) => product?._id && product?.name);
    setProduct(validProducts);
   })
   .catch(() => setProduct([]));
 },[searchParams])

  return (
    <Fragment>
      <h1 id="products_heading">Latest Products</h1>
      <section id="products" className="container mt-5">
        <div className="row">
          {products.map(product =>
            <ProductCard key={product._id} product={product}/>
          )} 
        </div>
      </section>
    </Fragment>
  );
}