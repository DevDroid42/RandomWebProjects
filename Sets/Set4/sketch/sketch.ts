const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
let dTime = 1;

class Color {
  constructor(
    public H: number,
    public S: number,
    public V: number
  ) { }

  public p5Color(): p5.Color {
    push()
    colorMode(HSL);
    let newColor = color(this.H, this.S, this.V, 1);
    pop()
    return newColor;
  }
}

class Ball {
  constructor(
    public position: p5.Vector,
    public speed: p5.Vector,
    public diameter: number,
    public color: Color
  ) { }

  public draw() {
    push()
    fill(this.color.p5Color())
    circle(this.position.x, this.position.y, this.diameter);
    pop()
  }

  public tick(delta: number) {
    if (ball.position.x > windowWidth - ball.diameter / 2 || ball.position.x < ball.diameter / 2) {
      ball.position.x = clamp(ball.position.x, ball.diameter / 2, windowWidth - ball.diameter / 2);
      sound.setVolume(ball.speed.dist(createVector(0,0)) / (width + height));
      ball.speed.x *= -0.5;
      sound.play();
    }

    if (ball.position.y > (windowHeight) - ball.diameter / 2 || ball.position.y - ball.diameter / 2 < 0) {
      ball.position.y = clamp(ball.position.y, ball.diameter / 2, windowHeight - ball.diameter / 2);
      sound.setVolume(ball.speed.dist(createVector(0,0)) / (width + height));
      ball.speed.y *= -0.5;
      sound.play();
    }
    ball.position.add(p5.Vector.mult(ball.speed, delta));
  }

  public attract(delta) {
    let mousePos = createVector(mouseX, mouseY);
    ball.speed.add(p5.Vector.mult(p5.Vector.sub(mousePos, ball.position), delta * 10));
  }
}

let sound;
let music;
function preload(){
  sound = loadSound('assets/c.wav');
  music = loadSound('assets/myMusic.ogg');
  music.setLoop(true);
  music.playMode('restart');
}

let ball: Ball;
function setup() {
  frameRate(120);
  createCanvas(windowWidth, windowHeight);
  ball = new Ball(
    createVector(Math.round(Math.random() * windowWidth), Math.round(Math.random() * windowHeight)),
    createVector(Math.round(Math.random() * windowWidth) / 100, Math.round(Math.random() * windowHeight) / 100),
    windowHeight / 10, //diameter
    new Color(255, 255, 255) // color
  );
}

function draw() {
  background(0, 10);
  fill(255);
  textSize(width / 30);
  text("click to change sustain and play music", 0, height / 2);
  dTime = deltaTime / 1000;
  ball.tick(dTime);
  ball.attract(dTime);
  ball.draw();
  color(255, 0, 0)
  circle(mouseX, mouseY, 100);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let sus = false;
function mouseClicked(){
  music.play();
  console.log('clicked');
  sus = !sus;
  if(sus){
    sound.playMode('sustain');
  }else{
    sound.playMode('restart');
  }
}