/*
  Hit the "docs" button to get started 
  drawing with Newton's Turtles!
*/

// creating variables for the canvas size
const width = 300;
const height = 300;

// set the size of the canvas
setCanvasSize(width, height);

// adjust the speed of the animation
setTimeScale(1);

// set the canvas background
fillScreen("white");

// create a turtle
const t = createTurtle(width/2, height/2);

// set the turtle's inital size and speed
t.setSize(0);
t.addSpeed(25);

// repeat a function every 1/60 seconds
createTimer(time => {
  t.right(5);
  t.setSize(Math.sin(time*7)*18+16)
  t.setColor(`hsl(${time*100%360}, 50%, 50%)`);
  t.addSpeed(2.5);
}, 1/60);
