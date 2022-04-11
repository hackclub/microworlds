const pattern = createPattern(5, "green");
console.log(pattern)

for (let i = 0; i< 19; i++) {
  if (i%2===0) pattern.knit("blue");
  else pattern.purl("red");
}

const drawn = drawPattern(pattern);

