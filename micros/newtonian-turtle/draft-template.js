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
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.speed = 0;
    this.size = 1;
    this.color = "black";
    this.timer = null;
    this.dt = 0;

    this._ctx = canvas.getContext("2d");
    this._ctx.lineCap = "round";
  }

  up() {
    this.drawing = false;

    return this;
  }

  down() {
    this.drawing = true;

    return this;
  }

  _goTo(x, y) {
    
    if (this.drawing) {
      this._ctx.lineWidth = this.size === 0 ? 0.000000001 : this.size;
      this._ctx.strokeStyle = this.color;
      this._ctx.fillStyle = this.color; 

      this._ctx.beginPath();
      this._ctx.moveTo(this.x, this.y)
      this._ctx.lineTo(x, y);
      this._ctx.stroke();
    }

    this.x = x;
    this.y = y;
    
    return this;
  }

  _forward(distance) {
    const a = this.angle/180 * Math.PI;
    const x = this.x + distance * Math.cos(a);
    const y = this.y + distance * Math.sin(a);

    this._goTo(x, y);

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
    const dx = Math.abs(this.x-otherTurtle.x);
    const dy = Math.abs(this.y-otherTurtle.y);
    return Math.sqrt(dx**2 + dy**2);
  }

  changeSpeed(ds) {
    this.speed += ds;

    return this;
  }

  // onUpdate(func) {
  //   this._onUpdate = func;

  //   return this;
  // }

  onTimer(func, time = 1) {
    this.timer = [ func, 1 ];

    return this;
  }

  update(timeStep, frame) {
    // should speed be in pixels per a second or pixels per update
   this._forward(this.speed*timeStep/1000);
   this.dt += timeStep;

   if (this.timer && this.dt > this.timer[1]) {
     this.timer[0]();
     this.dt = 0;
   } 

   // if (this._onUpdate) this._onUpdate(frame);

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
  t.up()._goTo(x, y).down();
  console.log("Create", t, x, y);
  turtles.push(t);
  return t;
}

function fillScreen(color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawTurtle(t) {
  const startX = t.x;
  const startY = t.y;

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

let msBetweenUpdates = 1000/60;
let frame = 0;
let timeScale = 1;

const setUpdatesPerSecond = n => {
  n = Math.max(n, 0.1);
  msBetweenUpdates = 1000/n;
}

const setTimeScale = n => {
  timeScale = n;
}

function start() {
  let last = 0;
  let timeAcc = 0;

  function loop(ts) {
    const elapsedMs = Math.min(3000, ts - last)/timeScale;
    timeAcc += elapsedMs;
    last = ts;

    // render

    // if (ts - lastPrint > 2000) {
    //   console.log(turtles);
    //   lastPrint = ts;
    // }

    // for (let i = 0; i < Math.floor(timeAcc/msBetweenUpdates); i++) {

    //   turtles.forEach(t => t.update(msBetweenUpdates, frame));

    //   frame += 1;
    // }

    // timeAcc = timeAcc % msBetweenUpdates;

    // while (timeAcc > msBetweenUpdates) {
    //   turtles.forEach(t => t.update(elapsedMs, frame));

    //   timeAcc -= msBetweenUpdates;
    //   frame += 1;
    // }

    turtles.forEach(t => t.update(elapsedMs, frame));
    // frame += 1;

    // while to cap frame rate

    window.requestAnimationFrame(loop)
  }

  requestAnimationFrame(loop)
}

start();


// whole template is run on initialization
// when code is sent this function is run
export default function evaluate(program) {

  const func = new Function("setCanvasSize", "fillScreen", "createTurtle", "setUpdatesPerSecond", "setTimeScale", program);

  turtles = [];
  msBetweenUpdates = 1000/60;
  frame = 0;
  timeScale = 1;
  lastProgram = program;

  fillScreen("white");

  func(setCanvasSize, fillScreen, createTurtle, setUpdatesPerSecond, setTimeScale);

  // turtles.forEach(drawTurtle);

}



// if (ts - lastPrint > 2000) {
//   console.log(turtles);
//   lastPrint = ts;
// }

// for (let i = 0; i < Math.floor(timeAcc/msBetweenUpdates); i++) {

//   turtles.forEach(t => t.update(msBetweenUpdates, frame));

//   frame += 1;
// }

// timeAcc = timeAcc % msBetweenUpdates;

