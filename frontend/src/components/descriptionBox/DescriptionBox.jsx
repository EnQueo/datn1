import React from 'react'
import './DescriptionBox.css'



const DescriptionBox = () => {
  return (
    <div className='descriptionBox'>
      <div className="descriptionBox-navigator">
        <div className="descriptionBox-nav-box">Description</div>
        <div className="descriptionBox-nav-box fade">Reviews (122)</div>
      </div>
      <div className="descriptionBox-description">
        <p>Description text</p>
      </div>
    </div>
  )
}

export default DescriptionBox
