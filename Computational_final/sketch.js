//let angle = 0;
let atest;

function preload(){
  atest = loadModel('atest.obj');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  //rotateX(mouseX, mouseY);
  //rotateY(mouseX, mouseY);
  //rotateZ(mouseX, mouseY);
  systems = [];
}

function draw() {
  background(25, 15, 50);

  let camX = map(mouseX, 0, width, -500,500);
  let camY = map(mouseY, 0, width, -500,500);
  camera(camX,camY,(height/2)/tan(PI/6),0,0,0,0,1,0);

  var lockX = mouseX - height / 2;
  var lockY = mouseY - width / 2;

  ambientLight(50);
  directionalLight(255, 0, 0, 0.25, 0.25, 0);
  pointLight(0, 0, 255, lockX, lockY, 250);

  rotateX(3);
  noStroke();
  translate(0,-100)
  scale(.5);
  specularMaterial(250);
  model(atest);

  for (i = 0; i < systems.length; i++) {
    systems[i].run();
    systems[i].addParticle();
  }
  if (systems.length==0) {
    fill(255);
    textAlign(CENTER);
    textSize(32);
    text("click mouse to add particle systems", width/2, height/2);
  }
}
function mousePressed() {
  this.p = new ParticleSystem(createVector(mouseX-width/2, mouseY-height/2,));
  systems.push(p);
}

var Particle = function(position) {
  this.acceleration = createVector(0, 0.05);
  this.velocity = createVector(random(-1, 1), random(-1, 0));
  this.position = position.copy();
  this.lifespan = 255.0;
};

Particle.prototype.run = function() {
  this.update();
  this.display();
};

Particle.prototype.update = function(){
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.lifespan -= 2;
};


Particle.prototype.display = function () {
  //stroke(200, this.lifespan);
  //strokeWeight(2);
  noStroke();
  fill(225,this.lifespan);
  ellipse(this.position.x, this.position.y, 5, 5);
};

Particle.prototype.isDead = function () {
  if (this.lifespan < 0) {
    return true;
  } else {
    return false;
  }
};

var ParticleSystem = function (position) {
  this.origin = position.copy();
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function () {
  // Add either a Particle or CrazyParticle to the system
  if (int(random(0, 2)) == 0) {
    p = new Particle(this.origin);
  }
  else {
    p = new CrazyParticle(this.origin);
  }
  this.particles.push(p);
};

ParticleSystem.prototype.run = function () {
  for (var i = this.particles.length - 1; i >= 0; i--) {
    var p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};


function CrazyParticle(origin) {
  Particle.call(this, origin);
  this.theta = 0.0;
};

CrazyParticle.prototype = Object.create(Particle.prototype);

CrazyParticle.prototype.constructor = CrazyParticle;

CrazyParticle.prototype.update=function() {
  Particle.prototype.update.call(this);
  this.theta += (this.velocity.x * this.velocity.mag()) / 2.0;
}

CrazyParticle.prototype.display=function() {
  Particle.prototype.display.call(this);
  push();
  translate(this.position.x, this.position.y);
  rotate(this.theta);
  //stroke(255,this.lifespan);
  //line(0,0,25,0);
  pop();
}
//https://p5js.org/examples/simulate-multiple-particle-systems.html
