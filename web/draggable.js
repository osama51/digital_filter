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
let overAP = false;
let overCanvas = false;
let isOn = false;
let picked = false;

var poles = [];
var zeros = [];
var allpass_array = [];


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
  document.getElementById("addAP").onclick = all_pass;

}
function px_to_unitcircle(x, y) {
    var scaled_x = (x-150.0)/100.0; 
    var scaled_y = (150.0-y)/100.0; 
    return [scaled_x, scaled_y];
}
function unitcircle_to_px(x, y) {
    var scaled_x = x*100.0 + 150.0;
    var scaled_y = (y*-100.0) + 150.0;
    return [scaled_x, scaled_y];
}
class allpass {
    constructor(x, y) {        
        this.x = x;
        this.y = y;
        this.zero_x = this.x/(Math.pow(this.x,2) + Math.pow(this.x,2));
        this.zero_y = this.y/(Math.pow(this.y,2) + Math.pow(this.y,2));

        this.scaled_x = constrain(unitcircle_to_px(this.x,0)[0], leftWall, rightWall);
        this.scaled_y = constrain(unitcircle_to_px(0,this.y)[1], topWall, bottomWall);

        this.scaled_zero_x = unitcircle_to_px(this.zero_x,0)[0];
        this.scaled_zero_y = unitcircle_to_px(0,this.zero_y)[1];
        
        // this.scaled_x = constrain((this.x*100.0) + 150.0, 
        //         Math.cos(Math.atan2((this.x*100.0) + 150.0,(this.y*-100.0) + 150.0)), 
        //         Math.cos(Math.atan2((this.x*100.0) + 150.0,(this.y*-100.0) + 150.0))); //setting the unit circle as constrain
    
        // this.scaled_y = constrain(((this.y*-100.0) + 150.0), 
        //         Math.sin(Math.atan2((this.x*100.0) + 150.0,(this.y*-100.0) + 150.0)), 
        //         Math.sin(Math.atan2((this.x*100.0) + 150.0,(this.y*-100.0) + 150.0))); //setting the unit circle as constrain
        this.conjx = this.scaled_x;
        this.conjy = 300-this.scaled_y;
        this.conjx_zero = this.scaled_zero_x;
        this.conjy_zero = 300-this.scaled_zero_y;
        this.xOffset = 0.0;
        this.yOffset = 0.0;
        this.locked = false; 
        this.lockedconj = false;
        this.overBox = false;
        this.overBoxconj = false;
    }

    addPole() {
        poles.push(new pole(this.scaled_x, this.scaled_y));
    }
    addZero() {
        zeros.push(new zero(this.scaled_zero_x, this.scaled_zero_y));
    }
    display(){
        if (
            (mouseX > this.scaled_x - boxSize &&
            mouseX < this.scaled_x + boxSize &&
            mouseY > this.scaled_y - boxSize &&
            mouseY < this.scaled_y + boxSize) ||
            (mouseX > this.scaled_zero_x - boxSize &&
            mouseX < this.scaled_zero_x + boxSize &&
            mouseY > this.scaled_zero_y - boxSize &&
            mouseY < this.scaled_zero_y + boxSize)
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
            
            // Draw a Cross X
            line(this.scaled_x-5, this.scaled_y-5, this.scaled_x+5, this.scaled_y+5)
            line(this.scaled_x+5, this.scaled_y-5, this.scaled_x-5, this.scaled_y+5)

            line(this.scaled_x-5, 300-this.scaled_y-5, this.scaled_x+5, 300-this.scaled_y+5)
            line(this.scaled_x+5, 300-this.scaled_y-5, this.scaled_x-5, 300-this.scaled_y+5)
            
            // Draw a Circle
            ellipse(this.scaled_zero_x, this.scaled_zero_y, boxSize, boxSize);
            ellipse(this.scaled_zero_x, 300-this.scaled_zero_y, boxSize, boxSize);
        }
        
        clicked(){
            if (this.overBox) {
                this.locked = true;
                picked = true;
            } else {
                this.locked = false;
            }

            this.xOffset = constrain(mouseX - this.scaled_x, leftWall, rightWall);
            this.yOffset = constrain(mouseY - this.scaled_y, topWall, bottomWall);

        }
        dragged(){
            var d = dist(mouseX, mouseY, this.scaled_x, this.scaled_y);
            if (d < 12){
                console.log("x", this.scaled_x, "y", this.scaled_y)
                if (this.locked) {

                    this.scaled_x = mouseX - this.xOffset;
                    this.scaled_y = mouseY - this.yOffset;
                    this.x = px_to_unitcircle(this.scaled_x,0)[0];
                    this.y = px_to_unitcircle(0,this.scaled_y)[1];
                    var magnigtude = sqrt(Math.pow(this.y,2) + Math.pow(this.x,2));
                    if (magnigtude > 1) {
                        this.x = this.x / magnigtude;
                        this.y = this.y / magnigtude;
                    }
                    this.zero_x = this.x/(Math.pow(this.x,2) + Math.pow(this.y,2));
                    this.zero_y = this.y/(Math.pow(this.x,2) + Math.pow(this.y,2));
                    this.scaled_x = unitcircle_to_px(this.x,0)[0];
                    this.scaled_y = unitcircle_to_px(0,this.y)[1];
                    this.scaled_zero_x = unitcircle_to_px(this.zero_x,0)[0];
                    this.scaled_zero_y = unitcircle_to_px(0,this.zero_y)[1];
                }
                // else if (this.lockedconj){
                    this.conjx = this.scaled_x;
                    this.conjy = 300-this.scaled_y;
                    this.conjx_zero = this.scaled_zero_x;
                    this.conjy_zero = 300-this.scaled_zero_y;
                //     }
                }
            }
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
            
            // Draw a Cross X

            line(this.x-5, this.y-5, this.x+5, this.y+5)
            line(this.x+5, this.y-5, this.x-5, this.y+5)

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
                    // this.x = constrain(mouseX - this.xOffset, leftWall, rightWall);
                    // this.y = constrain(mouseY - this.yOffset, topWall, bottomWall);
                    this.x = mouseX - this.xOffset;
                    this.y = mouseY - this.yOffset;
                    this.x = (this.x - 150)/100;
                    this.y = (150 - this.y)/100;
                    var magnigtude = sqrt(Math.pow(this.y,2) + Math.pow(this.x,2));
                    if (magnigtude > 1) {
                        this.x = this.x / magnigtude;
                        this.y = this.y / magnigtude;
                    }
                    this.x = this.x*100 + 150;
                    this.y = this.y*-100 + 150;
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

                // Draw a Circle
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
    for (var i = 0; i < allpass_array.length; i++){
        allpass_array[i].display();
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
    for (var i = 0; i < allpass_array.length; i++){
        if(allpass_array[i].overBox || allpass_array[i].overBoxconj){
            overAP = true;
            break;
        }else{ overAP = false;}
}
    if (!overPole && !overZero && !overAP){overPoint = false;}else{overPoint = true;}
    if (poles.length == 0 && zeros.length == 0 && allpass_array.length == 0){overPoint = false;}
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
    console.log('X:', mouseX, 'Y:', mouseY);
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

    for (var i = 0; i < allpass_array.length; i++){
        allpass_array[i].clicked();
    }
}

function mouseDragged() {
    for (var i = 0; i < poles.length; i++){
        poles[i].dragged();
    }
    
    for (var i = 0; i < zeros.length; i++){
        zeros[i].dragged();
    }

    for (var i = 0; i < allpass_array.length; i++){
        allpass_array[i].dragged();
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

    for (var i = 0; i < allpass_array.length; i++){
        if(allpass_array[i].overBox){
            allpass_array.splice(i,1);
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

    for (var i = 0; i < allpass_array.length; i++){
        allpass_array[i].locked = false;
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

  function all_pass(){
    var regex = /[+-]?\d+(\.\d+)?/g;
    combobox = document.getElementById("allpass");
    current_value = combobox.value;
    if (current_value=="custom"){
        var x = document.getElementById("realPart").value;
        var y = document.getElementById("imgPart").value;

    }else{
        var num = 0;
        num = current_value.match(regex).map(function(v) { return parseFloat(v); });
        var x = num[0];
        var y = num[1];
    }
    allpass_array.push(new allpass(x,y));
  }

  function clearAll(){
    poles.length = 0;
    zeros.length = 0;
    allpass_array.length = 0;
  }
