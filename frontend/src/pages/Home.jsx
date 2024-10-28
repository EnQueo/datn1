import React from 'react'
import Hero from '../components/hero/Hero'
import Popular from '../components/popular/Popular'
import Offers from '../components/offers/Offers'
import NewCollections from '../components/newCollections/NewCollections'
import NewsLetter from '../components/newsLetter/NewsLetter'
import Footer from '../components/fotter/Footer'

const Home = () => {
  return (
    <div>
      <Hero/>
      <Popular/>
      <Offers/>
      <NewCollections/>
      <NewsLetter/>
      <Footer/>
    </div>
  )
}

export default Home
