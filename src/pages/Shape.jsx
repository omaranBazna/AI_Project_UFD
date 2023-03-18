/** @format */

import React, { useRef, useState, useEffect } from "react"
import * as tf from "@tensorflow/tfjs"
import * as handpose from "@tensorflow-models/handpose"
import * as fp from "fingerpose"
import Webcam from "react-webcam"
import { evaluateCircle, evaluateSquare, evaluateTriangle } from "../utilities"
import "../App.css"
import "../Css/Shapes.css"

function Shape() {
	const webcamRef = useRef(null)
	const canvasRef = useRef(null)
	const [result, setResult] = useState("draw the shape")
	const [timer, setTimer] = useState(0)
	const [drawing, setDrawing] = useState(true)
	let array = [] // this array will collect points for shapes, [x,y]
	let index = 0
	let lastX = -1
	let lastY = -1

	const resetShape = () => {
		console.log("before", array)
		index = 0
		array = []
		console.log("after", array)
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
				console.log(array)
				const ctx = canvasRef.current.getContext("2d")
				if (array.length > 0) {
					ctx.beginPath()
					ctx.fillStyle = "Black"
					ctx.lineWidth = 10
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
						) < 30 &&
						index > 30
					) {
						console.log("close the shape")
						if (evaluateCircle(array)) {
							////@Enea add to the UI a pop up window  you draw a circle Good Job
							///pop up window React Bootstrap//sound effect

							console.log("You draw circle Good job!!")
							setResult("Circle")
						} else if (evaluateSquare(array)) {
							console.log("you draw square Good job!!")
							setResult("Square")
						} else if (evaluateTriangle(array)) {
							console.log("you draw triangle Good job!!")
							setResult("Triangle")
						} else {
							setResult("Random shape")
						}
						resetShape()

						///evaluate the shape
					}
					ctx.beginPath()
					ctx.fillStyle = "lightblue"
					ctx.arc(centerX, centerY, 20, 0, 2 * 3.14)

					ctx.fill()
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
					/// drawHand(hand, ctx);
				}
			}
		}
	}

	useEffect(() => {
		runHandpose()
	}, [])

	return (
		<div className="App">
			<div className="timer-button">
				<div className="result">
					{/* <span className="timer">
						{drawing ? "" : "press the button to start drawing"}
					</span> */}
					<h1>Last Result: {result}</h1>
				</div>
				<div className="button-web">
					<div className="buton1" hidden>
						<button id="resetBtn" href="#" class="button button--piyo">
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
				</div>
			</div>
		</div>
	)
}

export default Shape
