/** @format */

import React, { useRef, useState, useEffect } from "react"
import * as tf from "@tensorflow/tfjs"
import * as handpose from "@tensorflow-models/handpose"
import * as fp from "fingerpose"
import Webcam from "react-webcam"
import { evaluateCircle, evaluateSquare, evaluateTriangle,evaluateRectangle } from "../utilities"
import "../App.css"
import "../Css/Shapes.css"

function Shape() {
	const webcamRef = useRef(null)
	const canvasRef = useRef(null)
	const [result, setResult] = useState("START DRAWING")
	const [timer, setTimer] = useState(0)
	const [drawing, setDrawing] = useState(true)
	const [selected, setSelected] = useState("1")
	let array = [] // this array will collect points for shapes, [x,y]
	let index = 0
	let lastX = -1
	let lastY = -1

	const resetShape = () => {	
		index = 0
		array = []	
		setDrawing(false)
	}

	const runHandpose = async () => {
		const net = await handpose.load()
		//  Loop and detect hands
		setInterval(() => {
			detect(net)
		}, 10)
	}

	const detect = async (net) => {
		// Check data is available
		if (
			typeof webcamRef.current !== "undefined" &&
			webcamRef.current !== null &&
			webcamRef.current.video.readyState === 4
		) {
			// Get Video Properties
			const video = webcamRef.current.video
			const videoWidth = webcamRef.current.video.videoWidth
			const videoHeight = webcamRef.current.video.videoHeight

			// Set video width
			webcamRef.current.video.width = videoWidth
			webcamRef.current.video.height = videoHeight
			if (canvasRef != null && canvasRef.current != null) {
				canvasRef.current.width = videoWidth
				canvasRef.current.height = videoHeight

				const hand = await net.estimateHands(video)
				if (!drawing) {
					return
				}
				
				const ctx = canvasRef.current.getContext("2d")
				if (array.length > 0) {
					ctx.beginPath()

					ctx.fillStyle = "Black"
					ctx.lineWidth = 5
					ctx.moveTo(array[0].x, array[0].y)
					for (let { x, y } of array) {
						ctx.lineTo(x, y)
					}
					ctx.stroke()
					ctx.closePath()
				}
				if (hand.length > 0) {
					let centerX = 0
					let centerY = 0
					let centerZ = 0

					for (let [x, y, z] of hand[0].landmarks) {
						centerX += (640 - x) * 1
						centerY += y * 1
						centerZ += z * 1
					}
					centerX = centerX / 21
					centerY = centerY / 21
					centerZ = centerZ / 21

					array.push({ x: centerX, y: centerY })
					if (
						Math.sqrt(
							(centerX - array[0].x) * (centerX - array[0].x) +
								(centerY - array[0].y) * (centerY - array[0].y)
						) < 15 &&
						index > 30
					) {
					
						if (evaluateCircle(array)) {
							
							setResult(
								<div className="image-result">
									<img
										style={{ width: "300px", height: "300px" }}
										src="https://static.vecteezy.com/system/resources/previews/001/192/069/non_2x/circle-png.png"
										alt="circle"
									/>
								</div>
							)
						} else if (evaluateSquare(array)) {
							
							setResult(
								<div className="image-result">
									<img
										style={{ width: "300px", height: "300px" }}
										src="https://www.pngmart.com/files/13/Square-PNG-Pic.png"
										alt="square"
									/>
								</div>
							)
						} else if (evaluateTriangle(array)) {
							
							setResult(
								<div className="image-result">
									<img
										style={{ width: "300px", height: "300px" }}
										src="https://www.freeiconspng.com/thumbs/triangle-png/black-and-white-triangle-png-16.png"
										alt="triangle"
									/>
								</div>
							)
						} else if(evaluateRectangle(array)){
							setResult(
								<div className="image-result">
									<img
										style={{ width: "300px" }}
										src="https://www.onlygfx.com/wp-content/uploads/2018/02/rectangle-grunge-frame-4-1.png"
										alt="rectangle "
									/>
								</div>
							)
							
						}else{
							setResult(
								<div className="image-result">
									<img
										style={{ width: "300px", height: "300px" }}
										src="https://static.vecteezy.com/system/resources/thumbnails/011/459/127/small/organic-shape-boho-blob-png.png"
										alt="random shape"
									/>
								</div>
							)
						}
						resetShape()

						///evaluate the shape
					}
					ctx.beginPath()
					/*
          let base_image = new Image();
          base_image.src = 'https://img.icons8.com/color/120/paint-brush.png';
          base_image.style.width="20px"
          ctx.drawImage(base_image, centerX-80, centerY-80);
          */

					ctx.fillStyle = "lightblue"
					ctx.strokeStyle = "black"
					ctx.arc(centerX, centerY, 10, 0, 2 * 3.14)

					ctx.fill()
					ctx.stroke()

					ctx.closePath()

					ctx.beginPath()
					/*
          let base_image = new Image();
          base_image.src = 'https://img.icons8.com/color/120/paint-brush.png';
          base_image.style.width="20px"
          ctx.drawImage(base_image, centerX-80, centerY-80);
          */
					if (array.length > 0) {
						ctx.fillStyle = "red"
						ctx.strokeStyle = "black"
						ctx.arc(array[0].x, array[0].y, 6, 0, 2 * 3.14)

						ctx.fill()
						ctx.stroke()
					}

					ctx.closePath()

					ctx.beginPath()
					ctx.lineWidth = "3"
					ctx.strokeStyle = "red"
					ctx.beginPath()
					ctx.moveTo(centerX, centerY)

					index += 1

					ctx.stroke()
					ctx.closePath()

					if (lastX > 0) {
						let dx = centerX - lastX
						let dy = centerY - lastY
					}

					lastX = centerX
					lastY = centerY
					
				}
			}
		}
	}

	useEffect(() => {
		runHandpose()

		let el = document.getElementById("resetBtn")
		el.addEventListener("click", resetShape)
		return () => {
			el.removeEventListener("click", resetShape)
		}
	}, [])

	return (
		<div className="App">


			<div className="timer-button">
				<div className="button-web">
					<div className="buton1" hidden>
						<button id="resetBtn" class="button button--piyo">
							<div class="button__wrapper">
								<span class="button__text">Reset</span>
							</div>
							<div class="characterBox">
								<div class="character wakeup">
									<div class="character__face"></div>
								</div>
								<div class="character wakeup">
									<div class="character__face"></div>
								</div>
								<div class="character">
									<div class="character__face"></div>
								</div>
							</div>
						</button>

						<button
							onClick={() => {
								let time = 5
								let interval = setInterval(() => {
									time--
									setTimer(time)
								}, 1000)
								setTimeout(() => {
									setDrawing(true)
									clearInterval(interval)
								}, 5000)
							}}
							href="#"
							class="button button--hoo">
							<div class="button__wrapper">
								<span class="button__text">Draw</span>
							</div>
							<div class="characterBox">
								<div class="character wakeup">
									<div class="character__face"></div>
									<div class="charactor__face2"></div>
									<div class="charactor__body"></div>
								</div>
								<div class="character wakeup">
									<div class="character__face"></div>
									<div class="charactor__face2"></div>
									<div class="charactor__body"></div>
								</div>
								<div class="character">
									<div class="character__face"></div>
									<div class="charactor__face2"></div>
									<div class="charactor__body"></div>
								</div>
							</div>
						</button>
						<h1 className="Statement">Press DRAW to start</h1>
						<div>
							<h2 className="timer">{timer}</h2>
						</div>
					</div>
					<div>
						<Webcam
							className="webcam"
							ref={webcamRef}
							style={{
								position: "absolute",
								marginLeft: "auto",
								marginRight: "auto",
								left: 0,
								right: 0,
								textAlign: "center",
								zindex: 9,
								width: 640,
								height: 480,
							}}
							mirrored={true}
						/>
						{drawing && (
							<canvas
								ref={canvasRef}
								style={{
									position: "absolute",
									marginLeft: "auto",
									marginRight: "auto",
									left: 0,
									right: 0,
									textAlign: "center",
									zindex: 9,
									width: 640,
									height: 480,
								}}
							/>
						)}
					</div>
					<div className="result">
						<h1>Last Result:</h1>
						<div className="image-result">{result}</div>
					</div>
				</div>
				<div>
					<p className="rules">
						<ul>
							<li className="li">
								1. On startup, please be patient for Site to properly load.
							</li>
							<li className="li">
								2. To start drawing. Please place your hand near  the center of
								the screen and press the draw button.
							</li>
							<li className="li">
								3. Shapes that can be Drawn:  Circle, Square, Rectangle,
								Triangle
							</li>
							<li className="li">
								4. Reset button: If image is not drawn as intended, please use
								this button to clear canvas.
							</li>
							<li className="li">
								5. Draw button: After a iteration of shape recognition is
								complete, please press on draw to begin drawing again.
							</li>
							<li className="li">
								6. Please have fun playing this game and only practice makes
								perfect when trying to draw a shape correctly.
							</li>
						</ul>
					</p>
				</div>
			</div>
		</div>
	)
}

export default Shape
