import React from "react"
import { Link } from "react-router-dom"
import { useEffect ,useState,useRef} from "react"
import { evaluateCircle } from "../utilities"
import { evaluateRectangle } from "../utilities"
import { evaluateSquare } from "../utilities"
import { evaluateTriangle } from "../utilities"
import { enclosingPowerOfTwo } from "@tensorflow/tfjs"
const shapes=["Circle","Square","Triangle"]
const Test=()=>{
const [shape,setShape]=useState("circle")
const [result,setResult]=useState(0)
const [array,setArray]=useState([])
const [state,setState]=useState({TN:0,FN:0,TP:0,FP:0,T:0,FScore:0})
const [bars,setBars]=useState([])
const canvasRef = useRef(null)

const resultShape=(arr,th)=>{
    if(evaluateCircle(arr,th)){
        return "Circle"
    }
    else if(evaluateSquare(arr,th)){
        return "Square"
    } else{
        return "Triangle"
    }
}

useEffect(()=>{
    let i=0;
    let fp=0;
    let fn=0;
    let tp=0;
    let tn=0;
    let fscore=0;
    let th=0;
    let bars=[]
    setInterval(() => {
       
        let rnd=Math.floor(Math.random()*3)
        
        
       let arr=[]
        if(rnd==0){
       
           
          
            const ctx = canvasRef.current.getContext("2d")
  let center=[canvasRef.current.width/2-40,canvasRef.current.height/2-40]
 
            for(let angle=0;angle<=360;angle+=10){
                arr.push({x:center[0]+90*Math.sin(angle/180*Math.PI)+10*Math.random(),y:center[0]+90*Math.cos(angle/180*Math.PI)+10*Math.random()})
            }

				if (arr.length > 0) {
                    ctx.clearRect(0, 0, canvasRef.current.width,canvasRef.current.height);
					ctx.beginPath()
					ctx.fillStyle = "Black"
					ctx.lineWidth = 5
					ctx.moveTo(arr[0].x, arr[0].y)
					for (let {x,y} of arr) {
						ctx.lineTo(x, y)
                      
					}
					ctx.stroke()
					ctx.closePath()
                  
				}
                
                
            setArray(arr)
           
        }else if(rnd==1){

         
          
            const ctx = canvasRef.current.getContext("2d")
  let center=[canvasRef.current.width/2-40,canvasRef.current.height/2-40]
 
            for(let angle=0;angle<=360;angle+=360/4){
                arr.push({x:center[0]+90*Math.sin((angle+45)/180*Math.PI)+50*Math.random(),y:center[0]+90*Math.cos((angle+45)/180*Math.PI)+50*Math.random()})
            }

				if (arr.length > 0) {
                    ctx.clearRect(0, 0, canvasRef.current.width,canvasRef.current.height);
					ctx.beginPath()
					ctx.fillStyle = "Black"
					ctx.lineWidth = 5
					ctx.moveTo(arr[0].x, arr[0].y)
					for (let {x,y} of arr) {
						ctx.lineTo(x, y)
                      
					}
					ctx.stroke()
					ctx.closePath()
                  
				}
              
        }else if(rnd==3){
           
            const ctx = canvasRef.current.getContext("2d")
  let center=[canvasRef.current.width/2-40,canvasRef.current.height/2-40]
 
            for(let angle=0;angle<=360;angle+=360/3){
                arr.push({x:center[0]+90*Math.sin((angle+180)/180*Math.PI)+50*Math.random(),y:center[0]+90*Math.cos((angle+180)/180*Math.PI)+50*Math.random()})
            }
				if (arr.length > 0) {
                    ctx.clearRect(0, 0, canvasRef.current.width,canvasRef.current.height);
					ctx.beginPath()
					ctx.fillStyle = "Black"
					ctx.lineWidth = 5
					ctx.moveTo(arr[0][0], arr[0][1])
					for (let {x,y} of arr) {
						ctx.lineTo(x, y)
                      
					}
					ctx.stroke()
					ctx.closePath()
                  
				}

        }
        setShape(shapes[rnd])
        setResult(resultShape(arr))
        i++;
     /*#Shape*/
        if(shapes[rnd]=="Circle"){
          
        
            if(resultShape(arr,th)=="Circle"){
                tp++;
            }
            if(resultShape(arr,th) !="Circle"){
                fn++;
            }
        }else{
            if(resultShape(arr,th)=="Circle"){
                fp++;
            }
            if(resultShape(arr,th) !="Circle"){
                tn++;
            }
        }
        setState({TN:tn,FN:fn,TP:tp,FP:fp,T:i,FScore:(2*tp / (2*tp + fp + fn)).toFixed(2)})
    if(i>500){
        bars=[...bars,{fscore:(2*tp / (2*tp + fp + fn)).toFixed(2),th:th.toFixed(2)}]
        setBars(bars)
     i=0;
     fn=0;
     tn=0;
     fp=0;
     tp=0;
     th +=0.01
    }
    }, 1)
},[])

    return (
			<div>
				{<canvas
                width="400px"
                height="400px"
				ref={canvasRef}
				style={{
						margin:"auto",
						textAlign: "center",
                        zindex: 9,
					    border:"2px solid black"
								}}
							/>}
                            <h1>Actual Shape:  {shape}</h1>
                            <h1>Result Shape:  {result}</h1>
                            <h1 style={{textAlign:"center",color:shape==result?"green":"red"}}>{shape==result?"Correct":"Wrong"}</h1>
			              <br></br>
                          <h1>Confusion Matrix for circle:</h1>
                          <div>
                          <table>
  <tr>
    <th>Total:{state.T}</th>
    <th>Actual positive</th>
    <th>Actual Negative</th>
  </tr>
  <tr>
    <td>Predicted Positive</td>
    <td>TP:{state.TP}</td>
    <td>FP:{state.FP}</td>
  </tr>
  <tr>
    <td>Predicted negative</td>
    <td>FN:{state.FN}</td>
    <td>TN:{state.TN}</td>
  </tr>
</table>
<br></br>
<h1>F1Score: {state.FScore}</h1>
                          </div>

<div style={{margin:"30px",display:"flex",flexDirection:"row",alignItems:"flex-end",justifyContent:"center"}}>
{bars.map((item)=>{
    return <div style={{display:"flex",flexDirection:"column"}}><div style={{height:item.fscore*200,width:"10px",margin:"15px",
    backgroundColor:item.fscore<0.5?"red":item.fscore<0.8?"yellow":item.fscore<0.9?"yellowgreen":"green"
}}></div><div>{item.th}</div></div>
})}
</div>
            
            </div>
		)
}
export default Test