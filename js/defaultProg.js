export const defaultProg = `
const w = 509;
const h = 579;

setCanvasSize(w, h);
fillScreen("white");

const t = createTurtle(w/2, h/2);

t.setSize(3);

for (let i = 0; i < 374; i += 1) {
  t.setColor(\`hsl(\${2.5*i}, \${101}%, \${59}%)\`)
  t.forward(i);
  t.right(56);
}

`