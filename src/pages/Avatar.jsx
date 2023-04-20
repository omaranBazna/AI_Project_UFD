
import React, { useRef, useState, useEffect } from "react"
import * as tf from "@tensorflow/tfjs"
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection"

import Webcam from "react-webcam"
import "../Css/Avatar.css"
import { Dropdown } from "primereact/dropdown"
import nose1url from "../assets/Transparentnose2.png"
import nose2url from "../assets/Transparentnose3.png"
import nose3url from "../assets/Transparentnose4.png"
import nose4url from "../assets/Transparentnose5.png"
import nose5url from "../assets/Transparentnose6.png"
import mouth1url from "../assets/Transparentmouth1.png" 
import mouth2url from "../assets/Transparentmouth2.png"
import mouth3url from "../assets/Transparentmouth3.png"
import mouth4url from "../assets/Transparentmouth4.png"
import mouth5url from "../assets/Transparentmouth5.png"
import eye1url from "../assets/Eye1.png"
import eye2url from "../assets/Eye2.png"
import eye3url from "../assets/Eye3.png"
import eye4url from "../assets/Eye4.png"
import eye5url from "../assets/Eye5.png"
import eye6url from "../assets/Eye6.png"
import eye7url from "../assets/Eye11.png"
import eye8url from "../assets/Eye12.png"
import eye9url from "../assets/Eye13.png"
import eye10url from "../assets/Eye14.png"          
function Avatar() {
	const webcamRef = useRef(null)

	const [eye, setEye] = useState("eye1")
	const [nose, setNose] = useState("nose1")
	const [mouth, setMouth] = useState("mouth1")

	let data = {
		eye1: {
			left: eye1url,
			right: eye2url,
		},
		nose1:
			nose1url,
		mouth1:
			mouth1url,

		eye2: {
			left: eye3url,
			right: eye4url,
		},
		nose2:
			nose2url,	
		mouth2:
			mouth2url,
		eye3: {
			left: eye5url,
			right: eye6url,
		},
		nose3:
			nose3url,
		mouth3:
			mouth3url,
		eye4: {
			left: eye7url,
			right: eye8url,
		},
		nose4:
			nose4url,
		mouth4:
			mouth4url,
		eye5: {
			left: eye9url,
			right: eye10url,
		},
		nose5:
			nose5url,
		mouth5:
			mouth5url,						
	}
	const [leftEye, setLeftEye] = useState({ x: 0, y: 0, z: 0 })
	const [rightEye, setRightEye] = useState({ x: 0, y: 0, z: 0 })
	const [nosep, setNosep] = useState({ x: 0, y: 0, z: 0 })
	const runFace = async () => {
		const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
		const detectorConfig = {
			runtime: "mediapipe", // or 'tfjs'
			solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
		}
		const detector = await faceLandmarksDetection.createDetector(
			model,
			detectorConfig
		)

		setInterval(() => {
			detect(detector)
		}, 10)
	}
	const detect = async (net) => {
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

			const face = await net.estimateFaces(video)
			
			if (face && face[0]) {
				setLeftEye(face[0].keypoints[249])
				setRightEye(face[0].keypoints[7])
				setNosep(face[0].keypoints[0])
			}
		}
	}

	useEffect(() => {
		runFace()
	}, [])

	return (
		<div className="App">
			<div className="dropdown">
				<div className="drops">
					<select
						className="eye"
						style={{
							width:"200px",
							boxShadow:
								"rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
						}}
						value={eye}
						onChange={(e) => setEye(e.target.value)}>
						<option value="eye1">Eye1</option>
						<option value="eye2">Eye2</option>
						<option value="eye3">Eye3</option>
						<option value="eye4">Eye4</option>
						<option value="eye5">Eye5</option>
					</select>
				</div>
				<div className="drops">
					<select
						className="nose"
						style={{
							width:"200px",
							color: "black",
							background: "aqua",
							boxShadow:
								"rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
						}}
						value={nose}
						onChange={(e) => setNose(e.target.value)}>
						<option value="nose1">Nose1</option>
						<option value="nose2">Nose2</option>
						<option value="nose3">Nose3</option>
						<option value="nose4">Nose4</option>
						<option value="nose5">Nose5</option>
					</select>
				</div>
				<div className="drops">
					<select
						style={{
							width:"200px",
							color: "black",
							background: "orange",
							boxShadow:
								"rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
						}}
						className="mouth"
						value={mouth}
						onChange={(e) => setMouth(e.target.value)}>
						<option value="mouth1">Mouth1</option>
						<option value="mouth2">Mouth2</option>
						<option value="mouth3">Mouth3</option>
						<option value="mouth4">Mouth4</option>
						<option value="mouth5">Mouth5</option>
					</select>
				</div>
			</div>
			<div className="camera">
				<header className="App-header">
					<Webcam
						ref={webcamRef}
						style={{
							position: "absolute",
							marginLeft: "auto",
							marginRight: "auto",
							left: 0,
							right: 0,
							textAlign: "center",
							zindex: 9,
							width: 900,
							height: 480,
						}}
						mirrored={true}></Webcam>

					<img
						src={data[eye].left}
						style={{
							position: "absolute",
							top: leftEye.y * 1 + 60,
							left: 1070 - leftEye.x,
							width: "50px",
						}}
					/>
					<img
						src={data[eye].right}
						style={{
							position: "absolute",
							top: rightEye.y * 1 + 60,
							left: 1050 - rightEye.x,
							width: "50px",
						}}
					/>
					<img
						src={data[nose]}
						style={{
							position: "absolute",
							top: nosep.y * 1 + 20,
							left: 1055 - nosep.x,
							width: "60px",
						}}
					/>
					<img
						src={data[mouth]}
						style={{
							position: "absolute",
							top: nosep.y * 1 + 85,
							left: 1050 - nosep.x,
							width: "80px",
						}}
					/>
				</header>
			</div>
		</div>
	)
}

export default Avatar