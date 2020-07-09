function Chip(x, y, dr, mc) { 
  // added instance variable mc
  // changed this.hue to equal mc, instead of Random(360)
  //changes at call in sketch.js as well 
  this.hue = mc;
  var options = {
    density: 1,
    restitution: 0.25,
    friction: 0.0,
    frictionAir: 0.0 
  };
  this.d = dr;
  this.body = Bodies.circle(x + random(-1,1), y, this.d / 2, options);
  World.add(world, this.body);
}

Chip.prototype.show = function() {
  fill(this.hue, 255, 255);
  noStroke();
  var pos = this.body.position;
  push();
  translate(pos.x, pos.y);
  ellipse(0, 0, this.d);
  pop();
};
