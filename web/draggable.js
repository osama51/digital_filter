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
let poleButton = false;
let zeroButton = false;
let overPoint = false;
let overPole = false;
let overZero= false;
let overCanvas = false;
let isOn = false;
let picked = false;

var poles = [];
var zeros = [];


function setup() {
    var myCanvas = createCanvas(300, 300);
    myCanvas.mouseOver(mouseOverCnv);
    myCanvas.mouseOut(mouseOutCnv);

    myCanvas.parent("canvas");
    bx = constrain(width / 2.0, leftWall, rightWall);
    by = constrain(height / 2.0, leftWall, rightWall);
    
    rectMode(RADIUS);
    strokeWeight(2);
    
    let col2 = color(50,50,50);
  let col = color(105,105,105);
  buttonPole = createButton('Add Pole');
  buttonPole.style('background-color', col);
  buttonPole.style('font-size', '18px');
  buttonPole.style('color', '#FFFFFF');
  //buttonPole.style('border', '#FFFAFA');
  buttonPole.style('width', '150px');
  buttonPole.parent("container");
  buttonPole.position(150, 600);
  //buttonPole.mousePressed(() => poles.push(new pole(150, 150)));
  buttonPole.mousePressed(() => selectable('pole'));
  
  buttonZero = createButton('Add Zero');
  buttonZero.style('background-color', col);
  buttonZero.style('font-size', '18px');
  buttonZero.style('color', '#FFFFFF');
  //buttonZero.style('border', '#FFFAFA');
  buttonZero.style('width', '150px');
  buttonZero.parent("container");
  buttonZero.position(150, 650);
  buttonZero.mousePressed(() => selectable('zero'));

}

class pole {
    constructor(x, y) {
        this.x = constrain(x, leftWall, rightWall);
        this.y = constrain(y, topWall, bottomWall);
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
                    stroke(100);
                    fill(200, 200, 200);
                }
            } else {
                stroke(0);
                fill(96, 96, 96);
                this.overBox = false;
            }
            
            // Draw the box
            //rect(this.x, this.y, boxSize, boxSize);
            line(this.x-5, this.y-5, this.x+5, this.y+5)
            line(this.x+5, this.y-5, this.x-5, this.y+5)
            //rect(this.x, 300-this.y, boxSize, boxSize);
            line(this.x-5, 300-this.y-5, this.x+5, 300-this.y+5)
            line(this.x+5, 300-this.y-5, this.x-5, 300-this.y+5)
            console.log(overPoint)
        }
        
        clicked(){
            if (this.overBox) {
                this.locked = true;
                picked = true;
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
            this.x = constrain(x, leftWall, rightWall);
            this.y = constrain(y, topWall, bottomWall);
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
                        stroke(100);
                        fill(200, 200, 200);
                    }
                } else {
                    stroke(0);
                    fill(96, 96, 96);
                    this.overBox = false;
                }
                
                // Draw the box
                ellipse(this.x, this.y, boxSize, boxSize);
                ellipse(this.x, 300-this.y, boxSize, boxSize);
    }
    
    clicked(){
        if (this.overBox) {
            this.locked = true;
            picked = true;
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
    
    fill("#FFFFFF");
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

function mouseOverCnv(){
    overCanvas = true;
}

function mouseOutCnv(){
    overCanvas = false;
}

function selectable(mode){
    if (mode == 'zero'){
        if (zeroButton){
            zeroButton = false;
        }else{
            zeroButton = true;
        }
    }
    if (mode == 'pole'){
        if (poleButton){
            poleButton = false;
        }else{poleButton = true;
        }
    }
}
function checkOverPoint(){
    for (var i = 0; i < zeros.length; i++){
        
            if (zeros[i].overBox){
                overZero = true;
                break;
            }else{ overZero = false;}
        
        
    }
    for (var i = 0; i < poles.length; i++){
        
            if(poles[i].overBox){
                overPole = true;
                break;
            }else{ overPole = false;}
    }
    if (!overPole && !overZero){overPoint = false;}else{overPoint = true;}
    if (poles.length == 0 && zeros.length == 0){overPoint = false;}
}
function appendPole() {
    checkOverPoint();
    if (!overPoint && overCanvas){
        poles.push(new pole(mouseX, mouseY));
    }
}

function appendZero() {
    checkOverPoint();
    if (!overPoint && overCanvas){
        console.log(!overPoint)
        zeros.push(new zero(mouseX, mouseY));
    }
}

function mousePressed() {
    if (poleButton) {

        appendPole();
    }

    if (zeroButton) {
        appendZero();
    }

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
    picked = false;
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
    // for (var i = 0; i<height/2; i+=this.spacing){
      
    //       //vertical tickmarks
    //       stroke(this.lineColor)
    //       strokeWeight(this.thickness);
    //      line(+2,i,-2,i)
    //      line(+2,-i,-2,-i)
        
    //         //horizontal tickmarks
    //       stroke(this.lineColor)
    //       strokeWeight(this.thickness);
    //      line(i,+3,i,-3)
    //      line(-i,+3,-i,-3)
    // }

    stroke(this.lineColor)
    strokeWeight(this.thickness);
    //horizontal line
    line(-width/2,0,+width/2,0)
    //vertical line
    line(0,height/2,0,-height/2)
  
    pop();
  
  }
