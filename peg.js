function Peg(x, y, w, h) {
  var options = {
    density: 0.99,
    restitution: 0.95,
    friction: 0.0,
    isStatic: true
  };
  //this.body = Bodies.rectangle(x, y, w, h, options);
  this.body = Bodies.circle(x, y, w, options);
  this.w = w;
  this.h = h;
  World.add(world, this.body);
}

Peg.prototype.show = function() {
  fill(255);
  stroke(255);
  var pos = this.body.position;
  push();
  translate(pos.x, pos.y);
  rectMode(CENTER);
  circle(0, 0, this.w);
  pop();
};
