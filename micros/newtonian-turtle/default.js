/*
  Hit the "docs" button to get started 
  drawing with Turtles!
*/

const w = 300;
const h = 300;

setCanvasSize(w, h);
fillScreen("white");

const t = createTurtle(w/2, h/2);

t.setSize(10);

t.onUpdate(frame => {
  t.changeSpeed(0.2);
  t.right(2)
})