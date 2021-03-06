# Newton's Turtles

Let's play around with laws of motion by drawing with some agents who can only have their speed adjusted. We can change these agents' paths by making them move faster and slower over different increments of time.

# Construction Kit

```js
// set the canvas size
setCanvasSize(300, 300);

// adjust the time scale for the animation
// 1 is real time
// less than 1 is slower
// greater than 1 is faster
setTimeScale(1);

// set the background
fillScreen("white");

// create a drawing turtle with starting x and y
const t = createTurtle(150, 150);

// add speed to the turtle
t.addSpeed(30);

// change the color
t.setColor("blue");

// turn right 45 degrees
t.right(45);

// turn left 30 degrees
t.left(30);

// set the pen size
t.setSize(3);

// set the angle to 90 degrees
t.setAngle(90);

// create a timer which will loop a function 
// every 1/30 seconds
createTimer(timePassed => {
  t.addSpeed(10);
}, 1/30);

// create and destroy a timer
const timer = createTimer(() => {}, 1);
destroyTimer(timer);

```

# Examples

**Draw a straight line:**

![Screen Recording 2022-04-10 at 12 17 04 PM](https://user-images.githubusercontent.com/27078897/162630398-3fec4e24-5444-4550-8809-89c8fcc4091f.gif)

```
const w = 300;
const h = 300;

setCanvasSize(w, h);
fillScreen("white");

const t = createTurtle(w/2, h/2);

t.setSize(10);
t.addSpeed(50);
```

**Draw a square:**

![Screen Recording 2022-04-10 at 12 27 04 PM](https://user-images.githubusercontent.com/27078897/162630416-b1eba8f3-eac8-454a-86e4-70ef4b39b34e.gif)

```
const w = 300;
const h = 300;

setCanvasSize(w, h);
fillScreen("white");

const t = createTurtle(w/2, h/2);

t.setSize(10);
t.addSpeed(50);

createTimer(() => {
  t.right(90);
}, 1);
```

**Draw a circle:**

![Screen Recording 2022-04-10 at 12 17 55 PM](https://user-images.githubusercontent.com/27078897/162630433-38a5d245-636b-42ed-9d4f-67766503a758.gif)

```
const w = 300;
const h = 300;

setCanvasSize(w, h);
fillScreen("white");

const t = createTurtle(w/2, h/2);

t.setSize(10);
t.addSpeed(50);

createTimer(() => {
  t.right(3);
}, 1/30);
```

**Draw a spiral:**

![Screen Recording 2022-04-10 at 12 19 24 PM](https://user-images.githubusercontent.com/27078897/162630485-4026d484-0687-44ac-9838-7613b7d2520c.gif)

```
const w = 300;
const h = 300;

setCanvasSize(w, h);
fillScreen("white");

const t = createTurtle(w/2, h/2);

t.setSize(10);
t.addSpeed(5);

createTimer(() => {
  t.right(3);
  t.addSpeed(.5);
}, 1/30);
```

## Useful Snippets

**Random number:**

```js
const random = (min, max) => Math.random()*(max-min) + min;
```

**Change color:**

Use a tagged template literal to write the color as a string in `hsla` format.

```js
t.setColor(`hsla(${66}, ${104}%, ${70}%, ${84}%)`);
```

**Oscillations:**

```
Math.sin(t/frequency)*amplitude+baseline
```
