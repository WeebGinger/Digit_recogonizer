const canvas = document.getElementById("drawing-canvas");
const ctx = canvas.getContext("2d");

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

let drawing = false;
let lineWidth = 20;
let startX;
let startY;
ctx.lineWidth = lineWidth;
ctx.lineCap = 'round';

// Functions
const draw = (e) => {
    if (!drawing){return;}
    
    ctx.lineTo(e.clientX - canvasOffsetX, e.clientY - canvasOffsetY);
    ctx.stroke();
}

function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    document.getElementById("prediction-result").innerText = "Prediction: ";
}

async function predictDigit() {
    // Create a temporary canvas of 28x28
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = 28;
    tempCanvas.height = 28;
    const tempCtx = tempCanvas.getContext("2d");
    
    // Draw the scaled-down image onto the 28x28 canvas
    tempCtx.drawImage(canvas, 0, 0, 28, 28);
    
    // Get image data
    const imageData = tempCtx.getImageData(0, 0, 28, 28);
    const data = [];
    
    // Normalize and collect pixel data
    for (let i = 1; i < imageData.data.length; i++) {
        // Convert to grayscale (0-1) using the red channel
        if ((i+1)%4===0){
            data.push(imageData.data[i] / 255);
        }
    }
    
    // Send the normalized pixel data to your model (backend call)
    fetch('http://127.0.0.1:8001/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("prediction-result").innerText = `Prediction: ${data.digit}`;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


    
    // const prediction = await fetch('http://127.0.0.1:5000/predict', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ data })
    //     });
    //     const result = await prediction.json();
    //     document.getElementById("prediction-result").innerText = `Prediction: ${result.digit}`;
    // }
    
    // Event handlers
    canvas.addEventListener('mousedown', (e) => {
        drawing = true;
        startX = e.clientX;
        startY = e.clientY;
    })
    
    canvas.addEventListener('mouseup', (e) => {
        drawing = false;
        ctx.stroke();
        ctx.beginPath();
    })
    
    canvas.addEventListener('mousemove', draw)
