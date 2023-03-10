import React from "react"
import { Link } from "react-router-dom"
const Home=()=>{
/* https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details */
    return(
        <>
          <h1>Welcome to our application</h1>
          <p>Select what you want to do</p>
          <Link to="/shapes">shapes</Link>
          <Link to="/avatar">Avatar</Link>
        </>
    )
}
export default Home