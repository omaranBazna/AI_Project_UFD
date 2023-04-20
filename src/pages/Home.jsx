import React from "react"
import { Link } from "react-router-dom"
import "../Css/Home.css"
import shapes from "../assets/shapes.png"
import emoji from "../assets/emoji.jpeg"

const Home=()=>{
/* https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details */
    return (
			<div>
				<div>
					<div className="welcome">WELCOME EVERYONE</div>
					<div className="hello">We are glad you are here</div>
					<div className="hello">Are you ready to play?</div>
				</div>
				<div className="games">
					<div>
						<Link to="/shapes">
							<img className="logo-home" src={shapes} alt="shapes" />
						</Link>
					</div>
					<div>
						<Link to="/avatar">
							<img className="logo-home" src={emoji} alt="emoji" />
						</Link>
						
					</div>
				</div>
			</div>
		)
}
export default Home