//make some simple axes with tick marks
//assumes a square canvas, but that could probably be changed

function setup() {
    createCanvas(400, 400);
  }
  
  function draw() {
    background(250);
    translate(width/2,height/2)
    //primary axes
    drawTickAxes(0,1,10,0,0)
    //offset secondary axes that are red and move
    
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
       line(+1,i,-1,i)
       line(+1,-i,-1,-i)
      
          //horizontal tickmarks
        stroke(this.lineColor)
        strokeWeight(this.thickness);
       line(i,+1,i,-1)
       line(-i,+1,-i,-1)
    }
    stroke(this.lineColor)
    strokeWeight(this.thickness);
    //horizontal line
    line(-width/2,0,+width/2,0)
    //vertical line
    line(0,height/2,0,-height/2)
  
    pop();
  
  }