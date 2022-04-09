/*
  Hit the "docs" button to get started 
  drawing with Turtles!
*/

const w = 300;
const h = 300;

setCanvasSize(w, h);
setTimeScale(1);
fillScreen("white");

const t = createTurtle(w/2, h/2);

t.setSize(0);
t.changeSpeed(25);

createTimer(time => {
  t.right(5);
  t.setSize(Math.sin(time/143)*18+16)
  t.setColor(`hsl(${time/10%360}, 50%, 50%)`);
  t.changeSpeed(2.5);
}, 1/60);
