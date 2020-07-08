var slotWidthScale = 1.05, 
    slotHeightScale = 1.25, 
    pegWidthScale = 0.025, 
    pegHeightScale = 0.025,
    boxHeightScale = 2.5;        // multiples of the chip diameter

var fontScale = 0.02;        // multiples of the canvas size
var inputXScale = 0.5;        // multiples of the canvas size
var inputWidthScale = 8;        // multiples of the font size
var inputHeightScale = 0.5;        // multiples of the font size
var buttonXScale = 0.75;        // multiples of the canvas size
var buttonWidthScale = 8;        // multiples of the font size
var buttonHeightScale = 3;        // multiples of the font size

var fps = 60;        // frames per second
var timeInterval = 5;         // seconds between two balls' departures

var leftChips = [], 
    rightChips = [],
    //customChips = [], 
    pegs = [], 
    boxEdges = [];

var leftOutput = 0, 
    rightOutput = 0; 

var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;

var engine = Engine.create(), 
    world = engine.world;

var canvasSize;
var fontSize; 
var d, w, n1, n2;
var sequence = [];
var diameter;
var currentIndex = 0;

function setup() {
  frameRate(fps);
  canvasSize = min(windowWidth, windowHeight);
  fontSize = fontScale*canvasSize;
  createCanvas(canvasSize, canvasSize + 9*fontSize);
  colorMode(HSB);
  stroke(255);  

  settingOneButton = createButton("pre set 1");
  settingOneButton.size(inputWidthScale*fontSize,2*inputHeightScale*fontSize);
  settingOneButton.position(inputXScale*width, width);
  settingOneButton.mouseClicked(settingOneClick);

  settingTwoButton = createButton("pre set 2");
  settingTwoButton.size(inputWidthScale*fontSize,2*inputHeightScale*fontSize);
  settingTwoButton.position(inputXScale*width, width + 1.6*fontSize);
  settingTwoButton.mouseClicked(settingTwoClick);

  settingThreeButton = createButton("pre set 3");
  settingThreeButton.size(inputWidthScale*fontSize,2*inputHeightScale*fontSize);
  settingThreeButton.position(inputXScale*width, width + 3.2*fontSize);
  settingThreeButton.mouseClicked(settingThreeClick);

  settingFourButton = createButton("pre set 4");
  settingFourButton.size(inputWidthScale*fontSize,2*inputHeightScale*fontSize);
  settingFourButton.position(inputXScale*width, width + 4.8*fontSize);
  settingFourButton.mouseClicked(settingFourClick);

  responceSequence = createInput();
  responceSequence.size(inputWidthScale*fontSize,2*inputHeightScale*fontSize);
  responceSequence.position(inputXScale*width, width + 6.4*fontSize);

  /*
  dInput = createInput();
  dInput.size(inputWidthScale*fontSize,2*inputHeightScale*fontSize);
  dInput.position(inputXScale*width, width);
  wInput = createInput();
  wInput.size(inputWidthScale*fontSize,2*inputHeightScale*fontSize);
  wInput.position(inputXScale*width, width + 1.6*fontSize);
  leftInput = createInput();
  leftInput.size(inputWidthScale*fontSize,2*inputHeightScale*fontSize);
  leftInput.position(inputXScale*width, width + 3.2*fontSize);
  rightInput = createInput();
  rightInput.size(inputWidthScale*fontSize,2*inputHeightScale*fontSize);
  rightInput.position(inputXScale*width, width + 4.8*fontSize);
  */
  startButton = createButton("Start");
  startButton.size(buttonWidthScale*fontSize,buttonHeightScale*fontSize);
  startButton.position(buttonXScale*width, width);
  startButton.mouseClicked(startGame);
  stopButton = createButton("Stop");
  stopButton.size(buttonWidthScale*fontSize,buttonHeightScale*fontSize);
  stopButton.position(buttonXScale*width, width + 3*fontSize);
  stopButton.mouseClicked(stopGame);
  continueButton = createButton("Continue");
  continueButton.size(buttonWidthScale*fontSize,buttonHeightScale*fontSize);
  continueButton.position(buttonXScale*width, width + 6*fontSize);
  continueButton.mouseClicked(continueGame);

}
function settingOneClick(){
  d = int(1);
  w = int(12);
  resetLocationInString();
  alert("setting One clicked, variable d = " + d + " variable w = " + w);
}
function settingTwoClick(){
  d = int(2);
  w = int(8);
  resetLocationInString();
  alert("setting Two clicked, variable d = " + d + " variable w = " + w);
}
function settingThreeClick(){
  d = int(3);
  w = int(12);
  resetLocationInString();
  alert("setting Three clicked, variable d = " + d + " variable w = " + w);
}
function settingFourClick(){
  d = int(5);
  w = int(12);
  resetLocationInString();
  alert("setting Four clicked, variable d = " + d + " variable w = " + w);
}

function startGame() {
  //alert(String(responceSequence.value()[0]));
  leftChips = [];
  rightChips = [];
  //customChips = [];
  pegs = [];
  boxEdges = [];
  //alert("this is the problem");
  //var customChips = responceSequence.split(""); // possible error
  //alert("made it here");

  
  //d = int(dInput.value());
  //w = int(wInput.value());
  //n1 = int(3);//hardcoding 3 for now, will impliment variable inputs later
  //n2 = int(3);
  // keep this code for a custom set up, will be creating functions for each button,
  // the buttons will assign the values for d, w, n1, n2. 
  
  if (isNaN(d) || d < 1) {
      alert("Please enter a valid integer d of minimum 1 for the slot distance between the two inputs.");
  }
  else if (isNaN(w) || w < 2*d + 2 || w % 2 != 0) {
      alert("Please enter a valid even integer w of minimum 2*d + 2 for the number of open slots at the bottom.");
  }
  /*
  else if (isNaN(n1) || n1 < 0) {
      alert("Please enter a valid integer n1 of minimum 0 for the number of chips starting at the left input.");
  }
  else if (isNaN(n2) || n2 < 0) {
      alert("Please enter a valid integer n2 of minimum 0 for the number of chips starting at the right input.");
  }
  
  else if (responceSequence.length == 0){
      startGame();
  }
  */
  else {
    loop();

    engine = Engine.create(); 
    world = engine.world; 
    world.gravity.y = 1; 
    
    diameter = min(width/(1+(w-d-1)*slotHeightScale+(w-d)*pegHeightScale+boxHeightScale+pegWidthScale), width/(w*slotWidthScale+(w+1)*pegWidthScale));
    
    for (var i=1; i<=w-d; i++) {
      for (var j=1; j<=d+i+1; j++) {
        var x = (width-diameter*(i-2*j+d+2)*(slotWidthScale+pegWidthScale))/2;
        var y = ((2*i-2)*slotHeightScale+(2*i-1)*pegHeightScale+2)*diameter/2;
        pegs.push(new Peg(x, y, pegWidthScale*diameter, pegHeightScale*diameter));
      }
    }
    
    boxEdges.push(new BoxEdge(width/2-w*(slotWidthScale+pegWidthScale)*diameter/2, width-(pegWidthScale+boxHeightScale/2)*diameter, pegWidthScale*diameter, boxHeightScale*diameter));
    boxEdges.push(new BoxEdge(width/2, width-(pegWidthScale+boxHeightScale/2)*diameter, pegWidthScale*diameter, boxHeightScale*diameter));
    boxEdges.push(new BoxEdge(width/2+w*(slotWidthScale+pegWidthScale)*diameter/2, width-(pegWidthScale+boxHeightScale/2)*diameter, pegWidthScale*diameter, boxHeightScale*diameter));    
    boxEdges.push(new BoxEdge(width/2, width-pegWidthScale*diameter/2, (w*slotWidthScale+(w+1)*pegWidthScale)*diameter, pegWidthScale*diameter));
  }
}

function stopGame() {
  noLoop();
}

function continueGame() {
  loop();
}

function getLocationInString(){
  return currentIndex;
}
function setLocationInString(){
  currentIndex++;
}
function resetLocationInString(){
  currentIndex = 0;
}

function draw() {
  var lc = getLocationInString();
  background(0);
  fontSize = fontScale*width;  
  leftOutput = 0; 
  rightOutput = 0;
  sequence = responceSequence.value().split("");
  
  

  if (frameCount % (timeInterval*fps) == 0 && lc < sequence.length && sequence[lc].localeCompare("y")==0){
    leftChips.push(new Chip((width-d*(slotWidthScale+pegWidthScale)*diameter)/2, diameter/2, diameter, 1));
    setLocationInString();
    // Should be if y is input, pushes a red chip into the que on the left
  }
  else if (frameCount % (timeInterval*fps) == 0 && lc < sequence.length && sequence[lc].localeCompare("n")==0){
    rightChips.push(new Chip((width+d*(slotWidthScale+pegWidthScale)*diameter)/2, diameter/2, diameter, 240));
    setLocationInString();
    // Shoulb be if n is input, pushes a blue chip into the que on the right
  }
  
  


  /*
  if (frameCount % (timeInterval*fps) == 0 && leftChips.length < n1) {
    leftChips.push(new Chip((width-d*(slotWidthScale+pegWidthScale)*diameter)/2, diameter/2, diameter, 1));
    //Added parameter string to end of call, red for left, hue 1 = red
    //Made appropriate changes in chip.js
}
else if (frameCount % (timeInterval*fps) == 0 && rightChips.length < n2) {
    rightChips.push(new Chip((width+d*(slotWidthScale+pegWidthScale)*diameter)/2, diameter/2, diameter, 240));
    //Added parameter string to end of call, blue for right, hue 240 = blue
    //Made appropriate changes in chip.js
}
*/
  
  Engine.update(engine);
  for (var i1 = 0; i1 < leftChips.length; i1++) {
    leftChips[i1].show(); // the chip spawns and falls regardless of this call
    if (leftChips[i1].body.position.x>width/2-w*(slotWidthScale+pegWidthScale)*diameter/2 && leftChips[i1].body.position.x<width/2 && leftChips[i1].body.position.y>width-(pegWidthScale+pegHeightScale)*diameter && leftChips[i1].body.position.y<width-pegWidthScale*diameter) {
        leftOutput++;
    }
    else if (leftChips[i1].body.position.x<width/2+w*(slotWidthScale+pegWidthScale)*diameter/2 && leftChips[i1].body.position.x>width/2 && leftChips[i1].body.position.y>width-(pegWidthScale+pegHeightScale)*diameter && leftChips[i1].body.position.y<width-pegWidthScale*diameter) {
        rightOutput++;     
    }
  }
  for (var i2 = 0; i2 < rightChips.length; i2++) {
    rightChips[i2].show(); // the chip spawns and falls regardless of this call
    if (rightChips[i2].body.position.x>width/2-w*(slotWidthScale+pegWidthScale)*diameter/2 && rightChips[i2].body.position.x<width/2 && rightChips[i2].body.position.y>width-(pegWidthScale+boxHeightScale)*diameter && rightChips[i2].body.position.y<width-pegWidthScale*diameter) {
        leftOutput++;
        
    }
    else if (rightChips[i2].body.position.x<width/2+w*(slotWidthScale+pegWidthScale)*diameter/2 && rightChips[i2].body.position.x>width/2 && rightChips[i2].body.position.y>width-(pegWidthScale+boxHeightScale)*diameter && rightChips[i2].body.position.y<width-pegWidthScale*diameter) {
        rightOutput++;
             
    }
  }
  for (var j = 0; j < pegs.length; j++) {
    pegs[j].show();
  }
  for (var k = 0; k < boxEdges.length; k++) {
    boxEdges[k].show();
  }
  
  line(0,width,width,width);
  fill(255);
  textSize(fontSize);
  text("61% probability of accurate responce ->", 0, width + 1.4*fontSize);
  text("75% probability of accurate responce ->", 0, width + 2.8*fontSize);
  text("80% probability of accurate responce ->", 0, width + 4.2*fontSize);
  text("93% probability of accurate responce ->", 0, width + 5.6*fontSize);
  text("enter a sequence of \"y\" or \"n\" with no spaces", 0, width + 7.0*fontSize);
  text("\"y\" will result in a red chip on the left, \"n\" will result in a blue chip on the right", 0, width + 8.4*fontSize);
  //text("The number of chips ending at the left output: "+leftOutput, 0, width + 7.0*fontSize);
  //text("The number of chips ending at the right output: "+rightOutput, 0, width + 8.4*fontSize);
}