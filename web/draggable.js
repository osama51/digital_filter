let boxSize = 10;
let overBox = false;
let locked = false;
let xOffset = 0.0;
let yOffset = 0.0;
let leftWall = 0;
let rightWall = 300;
let topWall = 0;
let bottomWall = 150;
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
    
    rectMode(RADIUS);
    strokeWeight(2);
    

  var poleCheck = document.getElementById("poleCheck");
  var zeroCheck = document.getElementById("zeroCheck");

  document.getElementById("clearpoints").onclick = clearAll;
  $(".tgl.tgl-skewed:not([checked])").on('change' , function(){
    $(".tgl.tgl-skewed").not(this).prop("checked" , false);
  });

}

class pole {
    constructor(x, y) {
        this.x = constrain(x, leftWall, rightWall);
        this.y = constrain(y, topWall, bottomWall);
        this.conjx = x;
        this.conjy = 300-y;
        this.xOffset = 0.0;
        this.yOffset = 0.0;
        this.locked = false; 
        this.lockedconj = false;
        this.overBox = false;
        this.overBoxconj = false;
    }
    
    display(){
        // if (
        //     mouseX > this.conjx - boxSize &&
        //     mouseX < this.conjx + boxSize &&
        //     mouseY > this.conjy - boxSize &&
        //     mouseY < this.conjy + boxSize
        // ){this.overBoxconj = true;} else{this.overBoxconj = false;}
        if (
            mouseX > this.x - boxSize &&
            mouseX < this.x + boxSize &&
            mouseY > this.y - boxSize &&
            mouseY < this.y + boxSize
            ) {
                this.overBox = true;
                if (!this.locked || !this.lockedconj) {
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
            //console.log(overPoint)
        }
        
        clicked(){
            if (this.overBox) {
                this.locked = true;
                picked = true;
            } else {
                this.locked = false;
            }
            // if (this.overBoxconj) {
            //     this.lockedconj = true;
            //     fill(255, 255, 255);
            // } else {
            //     this.lockedconj = false;
            // }
            this.xOffset = constrain(mouseX - this.x, leftWall, rightWall);
            this.yOffset = constrain(mouseY - this.y, topWall, bottomWall);
            // this.conjxOffset = constrain(mouseX - this.conjx, leftWall, rightWall);
            // this.conjyOffset = constrain(mouseY - this.conjy, topWall, bottomWall);
        }
        dragged(){
            var d = dist(mouseX, mouseY, this.x, this.y);
            if (d < 12){
                console.log("x", this.x, "y", this.y)
                if (this.locked) {
                    this.x = constrain(mouseX - this.xOffset, leftWall, rightWall);
                    this.y = constrain(mouseY - this.yOffset, topWall, bottomWall);
                }
                // else if (this.lockedconj){
                    this.conjx = this.x;
                    this.conjy = 300-this.y;
                //     }
                }
            }
        }
    
    
class zero {
        constructor(x, y) {
            this.x = constrain(x, leftWall, rightWall);
            this.y = constrain(y, topWall, bottomWall);
            this.conjx = x;
            this.conjy = 300-y;
            this.xOffset = 0.0;
            this.yOffset = 0.0;
            this.locked = false; 
            this.lockedconj = false;
            this.overBox = false;
            this.overBoxconj = false;
        }
        
        display(){
            // if (
            //     mouseX > this.conjx - boxSize &&
            //     mouseX < this.conjx + boxSize &&
            //     mouseY > this.conjy - boxSize &&
            //     mouseY < this.conjy + boxSize
            // ){this.overBoxconj = true;} else{this.overBoxconj = false;}
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
        } else {
            this.locked = false;
        }
        // if (this.overBoxconj) {
        //     this.lockedconj = true;
        //     fill(255, 255, 255);
        // } else {
        //     this.lockedconj = false;
        // }

        this.xOffset = constrain(mouseX - this.x, leftWall, rightWall);
        this.yOffset = constrain(mouseY - this.y, topWall, bottomWall);
        // this.conjxOffset = constrain(mouseX - this.conjx, leftWall, rightWall);
        // this.conjyOffset = constrain(300 - mouseY - this.conjy, topWall, bottomWall);
    }
    dragged(){
        var d = dist(mouseX, mouseY, this.x, this.y);
        if (d < 12){
            console.log("x", this.x, "y", this.y)
            if (this.locked) {
                this.x = constrain(mouseX - this.xOffset, leftWall, rightWall);
                this.y = constrain(mouseY - this.yOffset, topWall, bottomWall);
            }
            // else if (this.lockedconj){
               this.conjx = this.x;
               this.conjy = 300-this.y;
            // }
            }
        }
    }


function draw() {
    background(255,255,255);
    
    fill("#FFFFFF");
    stroke(20);
    strokeWeight(2);
    circle(150, 150, 200);
    // for(let i = 2; i < 6; i++){
    //     line((width/2)-(100*Math.cos(3.14/(12/i))), (height/2)-(100*Math.sin(3.14/(12/i))), (width/2)+(100*Math.cos(3.14/(12/i))), (height/2)+(100*Math.sin(3.14/(12/i))))
    // }
    //line((width/2)+(100*Math.cos(3.14/(12/1))), (height/2)+(100*Math.sin(3.14/(12/1))), (width/2)-(100*Math.cos(3.14/(12/1))), (height/2)-(100*Math.sin(3.14/(12/1))))
    // line((width/2)+(100*Math.cos(3.14/(12/2))), (height/2)+(100*Math.sin(3.14/(12/2))), (width/2)-(100*Math.cos(3.14/(12/2))), (height/2)-(100*Math.sin(3.14/(12/2))))
    // line((width/2)-(100*Math.cos(3.14/(12/3))), (height/2)+(100*Math.sin(3.14/(12/3))), (width/2)+(100*Math.cos(3.14/(12/3))), (height/2)-(100*Math.sin(3.14/(12/3))))
    // line((width/2)-(100*Math.cos(3.14/(12/5))), (height/2)+(100*Math.sin(3.14/(12/5))), (width/2)+(100*Math.cos(3.14/(12/5))), (height/2)-(100*Math.sin(3.14/(12/5))))
    
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
    
    if (poleCheck.checked == true) {
        if(zeroCheck.checked == true){zeroCheck.checked = false;}
    }
    if (zeroCheck.checked == true) {
        if(poleCheck.checked == true){poleCheck.checked= false;}
    }
}

function mouseOverCnv(){
    overCanvas = true;
}

function mouseOutCnv(){
    overCanvas = false;
}

function checkOverPoint(){
    for (var i = 0; i < zeros.length; i++){
        
            if (zeros[i].overBox || zeros[i].overBoxconj){
                overZero = true;
                break;
            }else{ overZero = false;}
    }
    for (var i = 0; i < poles.length; i++){
        
            if(poles[i].overBox || poles[i].overBoxconj){
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
        //console.log(!overPoint)
        zeros.push(new zero(mouseX, mouseY));
    }
}

function mousePressed() {
    if (poleCheck.checked == true) {
        appendPole();
    }

    if (zeroCheck.checked == true) {
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

    stroke(this.lineColor)
    strokeWeight(this.thickness);
    //horizontal line
    line(-width/2,0,+width/2,0)
    //vertical line
    line(0,height/2,0,-height/2)
  
    pop();
  
  }

  function clearAll(){
    poles.length = 0;
    zeros.length = 0;
  }
