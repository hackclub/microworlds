document.body.innerHTML = `
  <style>
    body {
      margin: 0px;
    }
    
    main {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100vw;
      height: 100vh;
      background: darkgrey;
      overflow: scroll;
    }

    .options {
      display: flex;
      flex-direction: column;
      position: fixed;
      right: 20px;
      bottom: 20px;
    }

    canvas {
      background: white;
    }
  </style>

  <main>
    <canvas></canvas>
    <div class="options">
      <div>
        <span>draw turtles:</span>
        <input type="checkbox" checked="true" class="draw-turtles"></input>
      </div>
      <!-- <button class="download">download image</button> -->
    </div>
  </main>
`

const norm = vec => {
  const mag = Math.sqrt(vec[0]**2 + vec[1]**2);

  return [vec[0]/mag, vec[1]/mag];
}

class Turtle {
  constructor(canvas) {
    this.drawing = true;
    this.location = { x: 0, y: 0 };
    this.angle = 0;
    this.speed = 0;
    this.size = 1;
    this.color = "black";
    this.strokeType = "round";

    this._fillArray = [];
    this._ctx = canvas.getContext("2d");

    this._ctx.lineCap = "round";
  }

  goto(x, y) {
    
    if (this.drawing) {
      this._ctx.lineWidth = this.size === 0 ? 0.000000001 : this.size;
      this._ctx.strokeStyle = this.color;
      this._ctx.fillStyle = this.color; 

      const dx = x - this.location.x;
      const dy = y - this.location.y;

      const normVec = norm([ dx, dy ]);
      const backtrack = this.strokeType === "flat" ? -5 : 0;
      
      this._ctx.beginPath();
      this._ctx.moveTo(
        this.location.x + normVec[0] * backtrack, 
        this.location.y + normVec[1] * backtrack
      )
      this._ctx.lineTo(
        x, 
        y
      );
      this._ctx.stroke();

    }


    this.location = { x, y };
    if (this.drawing) this._fillArray.push(this.location);
    
    return this;
  }

  setAngle(theta) {
    this.angle = theta;

    return this;
  }

  right(theta) {
    this.angle += theta;

    return this;
  }

  left(theta) {
    this.angle -= theta;

    return this;
  }

  setSize(newSize) {
    this.size = newSize >= 0 ? newSize : 0;

    return this;
  }

  setColor(newColor) {
    this.color = newColor;
    
    return this;
  }

  distanceTo(otherTurtle) {
    return this;
  }

  
}

// STATE
let turtles = [];
let drawTurtles = true;
let lastProgram = "";


const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
ctx.translate(0.5, 0.5);

function setCanvasSize(width, height) {
  canvas.width = width;
  canvas.height = height;
}


function createTurtle(x, y) {
  const t = new Turtle(canvas);
  t.up().goto(x, y).down();
  turtles.push(t);
  return t;
}

function fillScreen(color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawTurtle(t) {
  const startX = t.location.x;
  const startY = t.location.y;

  ctx.save();
  ctx.fillStyle = "green";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;

  ctx.translate(startX, startY);
  ctx.rotate((t.angle-90)*Math.PI/180);
  ctx.translate(-startX, -startY)

  ctx.beginPath()
  ctx.moveTo(startX, startY);
  ctx.lineTo(startX - 5, startY - 10)
  ctx.lineTo(startX + 5, startY - 10)
  ctx.lineTo(startX, startY)
  ctx.stroke()
  ctx.closePath()


  ctx.fill();

  ctx.restore();
}

function download() {
  const canvas = document.querySelector("canvas");

  // create temporary link  
  const link = document.createElement('a');
  link.download = 'turtleArt.png';
  link.href = canvas.toDataURL();
  console.log(link);
  link.click();
  link.delete;
}

document
  .querySelector(".draw-turtles")
  .addEventListener("input", () => {
    drawTurtles = !drawTurtles;

    evaluate(lastProgram);
  })

// document
//   .querySelector(".download")
//   .addEventListener("click", download);

// whole template is run on initialization
// when code is sent this function is run
export default function evaluate(program) {
  const func = new Function("setCanvasSize", "fillScreen", "createTurtle", program);
  fillScreen("white");
  turtles = [];
  lastProgram = program;

  func(setCanvasSize, fillScreen, createTurtle);

  if (drawTurtles) {
    turtles.forEach(drawTurtle);
  }
}


