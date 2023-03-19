import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";

import Webcam from "react-webcam";
import "../App.css";

let xCenter=1250;
let yCenter=145


function Avatar() {
  const webcamRef = useRef(null);

  const [eye,setEye]=useState("eye1")
  const [nose,setNose]=useState("nose1")
  const [mouth,setMouth]=useState("mouth1")
  
  
  
  let data={
   eye1:{
    left:"http://clipart-library.com/images_k/transparent-cartoon-eyes/transparent-cartoon-eyes-20.png",
    right:"",
    yPos:70
   },
   eye2:{
    left:"http://clipart-library.com/images_k/transparent-cartoon-eyes/transparent-cartoon-eyes-13.png",
    right:"",
    yPos:70
   },
   eye3:{
    left:"http://clipart-library.com/images_k/transparent-cartoon-eyes/transparent-cartoon-eyes-15.png"
   ,right:"",
   yPos:70
  },
   eye4:{
    left:"http://clipart-library.com/images_k/transparent-cartoon-eyes/transparent-cartoon-eyes-18.png"
    ,right:"",
    yPos:70
   },
 
   nose1:"http://clipart-library.com/img/1115576.png",
   nose2:"",
   nose3:"",
   nose4:"",
   nose5:"",
   mouth1:"",
   mouth2:"",
   mouth3:"",
   mouth4:"",
   mouth5:""
  }
  const [leftEye,setLeftEye]=useState({x:0,y:0,z:0})
  const [rightEye,setRightEye]=useState({x:0,y:0,z:0})
  const [nosep,setNosep]=useState({x:0,y:0,z:0})
  const runFace = async () => {

    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    const detectorConfig = {
      runtime: 'mediapipe', // or 'tfjs'
      solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
    }
    const detector = await faceLandmarksDetection.createDetector(model, detectorConfig);

    setInterval(()=>{
       detect(detector)
    },10)
  }
  const detect = async (net) => {
  

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      

    

        const face= await net.estimateFaces(video);
       console.log(face&&face[0] &&face[0].keypoints && face[0].keypoints.map((item,index)=>{
            if(item.hasOwnProperty("name") && item["name"].includes("lips")){
              return {
                ...item,
                index
              }
            }else{
              return -1
            }
        }).filter(item=>item !=-1))
       console.log(face&& face[0] && face[0].keypoints[249])
       if(face && face[0]){
       setLeftEye(face[0].keypoints[249])
       setRightEye(face[0].keypoints[7])
       setNosep(face[0].keypoints[0])
       }
      }
    
  };

  useEffect(() => {
    runFace();
  }, []);

  return (
    <div className="App">
      <select value={eye} onChange={(e)=>setEye(e.target.value)}>
        <option value="eye1">Eye1</option>
        <option value="eye2">Eye2</option>
        <option value="eye3">Eye3</option>
        <option value="eye4">Eye4</option>
        
        
      </select>
      <select value={nose} onChange={(e)=>setNose(e.target.value)}>
        <option value="nose1">Nose1</option>
        <option value="nose2">Nose2</option>
      </select>
      <select value={mouth} onChange={(e)=>setMouth(e.target.value)}>
        <option value="mouth1">Mouth1</option>
        <option value="mouth2">Mouth2</option>
      </select>

      
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
            width: 1200,
            height: 480,
          }}
          mirrored={true}
        ></Webcam>
        
          <img src={data[eye].left} style={{position:"absolute",top:leftEye.y*1+yCenter-data[eye].yPos,left:xCenter+10-leftEye.x,width:"160px"}} />
          <img src={data[eye].right} style={{position:"absolute",top:rightEye.y*1+yCenter,left:xCenter-10-rightEye.x,width:"50px"}} />
          <img src={data[nose]} style={{position:"absolute",top:nosep.y*1+yCenter-40,left:xCenter-nosep.x,width:"60px"}} />
          <img src={data[mouth]} style={{position:"absolute",top:nosep.y*1+yCenter+10,left:xCenter-10-nosep.x,width:"80px"}} />
      
      
        
      </header>
    </div>
  );
}

export default Avatar;