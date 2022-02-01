let bx;
let by;
let boxSize = 10;
let overBox = false;
let locked = false;
let xOffset = 0.0;
let yOffset = 0.0;
let leftWall = 0;
let rightWall = 300;
let topWall = 0;
let bottomWall = 150;


var poles = [];
var zeros = [];


function setup() {
  var myCanvas = createCanvas(300, 300);
  myCanvas.parent("canvas");
  bx = constrain(width / 2.0, leftWall, rightWall);
  by = constrain(height / 2.0, leftWall, rightWall);
  
  rectMode(RADIUS);
  strokeWeight(2);

  buttonPole = createButton('Add Pole');
  buttonPole.parent("container")
  buttonPole.position(150, 600);
  buttonPole.mousePressed(() => poles.push(new pole(150, 150)));
  
  buttonZero = createButton('Add Zero');
  buttonZero.parent("container")
  buttonZero.position(150, 650);
  buttonZero.mousePressed(() => zeros.push(new zero(150, 150)));

}

class pole {
    constructor(x, y) {
        this.x = constrain(150, leftWall, rightWall);
        this.y = constrain(150, topWall, bottomWall);
        this.conjx = 150;
        this.conjy = 150;
        this.xOffset = 0.0;
        this.yOffset = 0.0;
        this.locked = false; 
        this.overBox = false;
    }
    
    display(){
        if (
            mouseX > this.x - boxSize &&
            mouseX < this.x + boxSize &&
            mouseY > this.y - boxSize &&
            mouseY < this.y + boxSize
            ) {
                this.overBox = true;
                if (!this.locked) {
                    stroke(255);
                    fill(244, 122, 158);
                }
            } else {
                stroke(156, 39, 176);
                fill(244, 122, 158);
                this.overBox = false;
            }
            
            // Draw the box
            //rect(this.x, this.y, boxSize, boxSize);
            line(this.x-5, this.y-5, this.x+5, this.y+5)
            line(this.x+5, this.y-5, this.x-5, this.y+5)
            //rect(this.x, 300-this.y, boxSize, boxSize);
            line(this.x-5, 300-this.y-5, this.x+5, 300-this.y+5)
            line(this.x+5, 300-this.y-5, this.x-5, 300-this.y+5)
        }
        
        clicked(){
            if (this.overBox) {
                this.locked = true;
                fill(255, 255, 255);
            } else {
                this.locked = false;
            }
            this.xOffset = constrain(mouseX - this.x, leftWall, rightWall);
            this.yOffset = constrain(mouseY - this.y, topWall, bottomWall);
        }
        dragged(){
            var d = dist(mouseX, mouseY, this.x, this.y);
            if (d < 12){
                console.log("x", this.x, "y", this.y)
                if (this.locked) {
                    this.x = constrain(mouseX - this.xOffset, leftWall, rightWall);
                    this.y = constrain(mouseY - this.yOffset, topWall, bottomWall);
                }
            }
        }
    }
    
class zero {
        constructor(x, y) {
            this.x = constrain(150, leftWall, rightWall);
            this.y = constrain(150, topWall, bottomWall);
            this.conjx = 150;
            this.conjy = 150;
            this.xOffset = 0.0;
            this.yOffset = 0.0;
            this.locked = false; 
            this.overBox = false;
        }
        
        display(){
            if (
                mouseX > this.x - boxSize &&
                mouseX < this.x + boxSize &&
                mouseY > this.y - boxSize &&
                mouseY < this.y + boxSize
                ) {
                    this.overBox = true;
                    if (!this.locked) {
                        stroke(255);
                        fill(244, 122, 158);
                    }
                } else {
                    stroke(156, 39, 176);
                    fill(244, 122, 158);
                    this.overBox = false;
                }
                
                // Draw the box
                ellipse(this.x, this.y, boxSize, boxSize);
                ellipse(this.x, 300-this.y, boxSize, boxSize);
    }
    
    clicked(){
        if (this.overBox) {
            this.locked = true;
            fill(255, 255, 255);
        } else {
            this.locked = false;
        }
        this.xOffset = constrain(mouseX - this.x, leftWall, rightWall);
        this.yOffset = constrain(mouseY - this.y, topWall, bottomWall);
    }
    dragged(){
        var d = dist(mouseX, mouseY, this.x, this.y);
        if (d < 12){
            console.log("x", this.x, "y", this.y)
            if (this.locked) {
                this.x = constrain(mouseX - this.xOffset, leftWall, rightWall);
                this.y = constrain(mouseY - this.yOffset, topWall, bottomWall);
            }
        }
        
    }
    
}

function draw() {
    background(255,255,255);
    fill("#D8A7B1");
    stroke(20);
    strokeWeight(2);
    circle(150, 150, 240);

    translate(width/2,height/2)
    //primary axes
    drawTickAxes(20,0.7,12.2,0,0)
    //offset secondary axes that are red and move
    translate(-width/2,-height/2)
    for (var i = 0; i < poles.length; i++){
        // Test if the cursor is over the box
        poles[i].display();
    }
    for (var i = 0; i < zeros.length; i++){
        zeros[i].display();
    }
}


function mousePressed() {
    for (var i = 0; i < poles.length; i++){
        poles[i].clicked();
    }
    console.log("poles", poles.length)
    
    
    for (var i = 0; i < zeros.length; i++){
        zeros[i].clicked();
    }
    console.log("zeros", zeros.length)
}

function mouseDragged() {
    for (var i = 0; i < poles.length; i++){
        poles[i].dragged();
    }
    
    for (var i = 0; i < zeros.length; i++){
        zeros[i].dragged();
    }
}

function doubleClicked() {
    for (var i = 0; i < poles.length; i++){
        if(poles[i].overBox){
            poles.splice(i,1);
        }
    }
    
    for (var i = 0; i < zeros.length; i++){
        if(zeros[i].overBox){
            zeros.splice(i,1);
        }
    }
}

function mouseReleased() {
    for (var i = 0; i < poles.length; i++){
        poles[i].locked = false;
    }
    
    for (var i = 0; i < zeros.length; i++){
        zeros[i].locked = false;
    }
}

function drawTickAxes(lineColor,thickness,spacing,xoffset,yoffset) {
    this.lineColor = lineColor;
    this.thickness = thickness;
    this.spacing = spacing;
    this.xoffset = xoffset;
    this.yoffset = yoffset;
    push();
      translate(this.xoffset,this.yoffset)
    stroke(this.lineColor)
    for (var i = 0; i<height/2; i+=this.spacing){
      
          //vertical tickmarks
          stroke(this.lineColor)
          strokeWeight(this.thickness);
         line(+2,i,-2,i)
         line(+2,-i,-2,-i)
        
            //horizontal tickmarks
          stroke(this.lineColor)
          strokeWeight(this.thickness);
         line(i,+3,i,-3)
         line(-i,+3,-i,-3)
    }

    stroke(this.lineColor)
    strokeWeight(this.thickness);
    //horizontal line
    line(-width/2,0,+width/2,0)
    //vertical line
    line(0,height/2,0,-height/2)
  
    pop();
  
  }
