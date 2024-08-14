import React from 'react'
import './Header.css'
import muuviheader from '../../images/muuviheader_blank.jpg'

/**
 * Header component for the top of the page.
 * @returns {Element}
 */


export default function Header() {
  return (
    <div id="image_container" style={{backgroundImage: muuviheader}}>
        <h1>Muuvit</h1>
    </div>
  )
}
