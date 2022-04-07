import { Turtle } from "https://leomcelroy.com/gram-js/exports.js";
// import {render, html, svg} from 'https://unpkg.com/uhtml?module';

const renderPath = (path) => {
  let points = path.points.reduce((acc, point) => acc + ` ${point.x},${point.y}`, " ");

  let polyline = `
    <g transform="scale(1, -1)">
      <polyline 
        points="${points}" 
        fill=${path.fillColor} 
        stroke=${path.strokeColor}
        stroke-width="${path.strokeWidth}px"
        stroke-dasharray="${path.dashed ? path.dashed : "none"}"
        stroke-linejoin=${path.linejoin}
        stroke-linecap=${path.linecap}
        vector-effect="non-scaling-stroke"/>
    </g>
  `;

  return polyline;
};

let pathStrings = [];

const drawTurtle = (turtle) => {
  pathStrings = turtle.path.reduce((acc, cur) => [...acc, renderPath(cur)], pathStrings);
}

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

    svg {
      width: 100%;
      height: 100%;
      background: white;
    }

  </style>

  <main>
    <svg><g class="svg-content"></g></svg>
  </main>
`

function init(t) {
  t.arc(103, 4)
  t.forward(9)
  t.arc(-208, 5)
  t.forward(9)
  t.arc(105, 4)
  
  t.thicken(2)
  
  return t;
}

function stitch(type, aboveColor, currentColor) {
  const top = init(new Turtle());
  const bottom = init(new Turtle()).translate([0, -12])
  const intersections = bottom.copy().intersect(top).polylines()
    
  const overlaps = [];
  
  for (let i = 0; i < 4; i++) {
    const t = new Turtle();
    if (type === "knit") {
      if (i === 0) t.fillColor(aboveColor)
      if (i === 1) t.fillColor(aboveColor)
      if (i === 2) t.fillColor(currentColor)
      if (i === 3) t.fillColor(currentColor)
    }
    
    if (type === "purl") {
      if (i === 0) t.fillColor(currentColor)
      if (i === 1) t.fillColor(currentColor)
      if (i === 2) t.fillColor(aboveColor)
      if (i === 3) t.fillColor(aboveColor)
    }
    
    t.strokeWidth(0)
    
    intersections[i].pts.forEach((pt, i) => t.goTo(pt, i !== 0))
    overlaps.push(t)
  }
  
  return bottom.fillColor(currentColor).group(...overlaps)
}

const createPattern = (stitches = 10, color = "red") => {

  const grid = []
  
  const firstRow = [];
  for (let i = 0; i < stitches; i++) {
    firstRow.push({ type: "top", color });
  }
  
  grid.push(firstRow);
  
  const currentRow = () => {
    if (grid.at(-1).length === stitches) grid.push([])
    
    return grid.at(-1);
  }
  
  const knit = (color) => {
    currentRow().push({ type: "knit", color })
    return result;
  }
  
  const purl = (color) => {
    currentRow().push({ type: "purl", color })
    
    return result;
  }
  
   const result = { 
    grid,
    knit,
    purl
  };
    
  return result;
}

const drawPattern = ({ grid }) => {
  
  for (let i = 0; i < grid[0].length; i++) {
    const t = new Turtle();
    init(t)
    t.translate([t.width*i, 0])
    t.fillColor(grid[0][i].color)
    drawTurtle(t);
  }
  
  for (let i = 0; i < grid.slice(1).length; i++) {
    const row = grid.slice(1)[i];
    for (let j = 0; j < row.length; j++) {
      const cur = row[j]
      const aboveColor = grid[i][j].color;
      const t = stitch(cur.type, aboveColor, cur.color);
      t.translate([t.width*j, -12*i])
      drawTurtle(t);
    }
  }
  
  return;
}

const container = document.querySelector(".svg-content");
const svgEl = document.querySelector("svg");

export default function evaluate(program) {
  const func = new Function("createPattern", "drawPattern", program);

  func(createPattern, drawPattern);

  container.innerHTML = pathStrings.join("");

  container.style.transformOrigin = `${0}px ${0}px`;
  container.style.transform = "translate(0px, 0px) scale(1)";

  const containerBB = container.getBoundingClientRect();

  const svgBB = svgEl.getBoundingClientRect();

  const xr = containerBB.width;
  const yr = containerBB.height;
  const xScalingFactor = svgBB.width/xr;
  const yScalingFactor = svgBB.height/yr;

  const scalingFactor = Math.min(xScalingFactor, yScalingFactor) * 0.9;

  const scale = scalingFactor;

  const center = { 
    x: (containerBB.left + containerBB.right)/2 * scalingFactor - svgBB.width/2,
    y: (containerBB.top + containerBB.bottom)/2 * scalingFactor - svgBB.height/2
  }

  const x = -center.x;
  const y = -center.y;


  container.style.transformOrigin = `${0}px ${0}px`;
  container.style.transform = "translate(" + x + "px, " + y + "px) scale(" + scale + ")";

}


