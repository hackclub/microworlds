const pattern = createPattern();
console.log(pattern)

for (let i = 0; i< 10; i++) {
  pattern.knit("blue");
}

for (let i = 0; i< 10; i++) {
  pattern.purl("red");
}



const drawn = drawPattern(pattern);

