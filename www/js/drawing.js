
// Initialize Variables
var path, ink, chart, scores, userdetails=[];
var timer = 0, lastTimestamp = 0, lastTimestamp_check = 0, idx_guess = 0;
var d_scores = {};
var best_guess ="";

// Install Paper.js
paper.install(window);

// Initialize...
window.onload = function() {

  initInk();              // Initialize Ink array ()
  paper.setup('canvas');  // Setup Paper #canvas

  var tool = new Tool();  // Inititalize Paper Tool

  // Paper Tool Mouse Down Event
  tool.onMouseDown = function(event) {
    // New Paper Path and Settings
    path = new Path();          
    path.strokeColor = 'black'; 
    path.strokeWidth = 7;

    // Get Time [ms] for each Guess (needed for accurate Google AI Guessing)
    var thisTimestamp = event.event.timeStamp;
    if(timer === 0){
      timer = 1; 
      var time = 0;
    }else{
      var timeDelta = thisTimestamp - lastTimestamp;
      var time = ink[2][ink[2].length-1] + timeDelta;
    }
    
    // Get XY point from event w/ time [ms] to update Ink Array
    updateInk(event.point, time);
    // Draw XY point to Paper Path
    path.add(event.point);
    
    // Reset Timestamps
    lastTimestamp = thisTimestamp;
  }

  // Paper Tool Mouse Drag Event
  tool.onMouseDrag = function(event) {
    // Get Event Timestamp and Timestamp Delta
    var thisTimestamp = event.event.timeStamp ;
    var timeDelta = thisTimestamp - lastTimestamp;
    // Get new Time for Ink Array
    var time = ink[2][ink[2].length-1] + timeDelta;
    
    // Get XY point from event w/ time [ms] to update Ink Array
    updateInk(event.point, time);
    // Draw XY point to Paper Path
    path.add(event.point);
    
    // Reset Timestamps
    lastTimestamp = thisTimestamp;

    // Check Google AI Quickdraw every 250 m/s 
    if(thisTimestamp - lastTimestamp_check > 250){
      checkQuickDraw();
      lastTimestamp_check = thisTimestamp;
    }
  }

  // Initialize Info Modal
  initInfoModal();

}

// Initialize Ink Array
function initInk(){
  ink = [[],[],[]];
}

  //Post user choices
function postChoice(username, choice){
  var url = '/wish'
  // Init HTTP Request
  var xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type','application/json');
  // HTTP Request On Load
  xhr.onload = function() {
    if (xhr.status === 200) {
      res = xhr.responseText; // HTTP Response Text
    }
    else if (xhr.status !== 200) {
      console.log('Request failed.  Returned status of ' + xhr.status);
    }
  }; 

  var data = {
    username:username,
    drawing:choice
  }
  xhr.send(JSON.stringify(data));
  }

 function redirectUser(username){
  window.location.replace(window.location.href+'grant?username='+username.substring(0, username.lastIndexOf("@"))+'&domain='+username.substring(username.lastIndexOf("@") +1))
 }

 

 //Post user data
 function postUser(username){
  var url = '/email'
  // Init HTTP Request
  var xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type','application/json');
  // HTTP Request On Load
  xhr.onload = function() {
    if (xhr.status === 200) {
      res = xhr.responseText; // HTTP Response Text
    }
    else if (xhr.status !== 200) {
      console.log('Request failed.  Returned status of ' + xhr.status);
    }
  }; 

  var data = {
    username:username
  }
  xhr.send(JSON.stringify(data));
  }

//Trigger Email
function triggerEmail(){
  if(userdetails.username!==undefined && userdetails.username!=="") {
    clearDrawing();
    redirectUser(userdetails.username)//postUser(userdetails.username)
  }
}



// Clear Paper Drawing Canvas
function clearDrawing() {
  if((userdetails.username!==undefined && userdetails.username!=="") && best_guess!==""){
    postChoice(userdetails.username, best_guess);    
  } 

  for(i=0;i<10;i++){
    $("#btn"+i).text('All good');
    $("#btn"+i).css({ opacity: 0 });
  }
 
  // Remove Paper Path Layer
  paper.project.activeLayer.removeChildren();
  paper.view.draw();

  // Init Ink Array
  initInk();
    
  // Reset Variables
  timer = 0;
  idx_guess = 0;
  d_scores = {};


}

// Update Ink Array w/ XY Point + Time
function updateInk(point, time){
  ink[0].push(point.x);
  ink[1].push(point.y);
  ink[2].push(time);
}

// Get Paper Canvas Dimensions Width/Height
function getCanvasDimensions(){
  var w = document.getElementById('canvas').offsetWidth;
  var h = document.getElementById('canvas').offsetHeight;
  return {height: h, width: w};
}

// Check Quickdraw Google AI API
function checkQuickDraw(){

  // Get Paper Canvas Weight/Height
  var c_dims = getCanvasDimensions();

  // Set Base URL for Quickdraw Google AI API
  var url = 'https://inputtools.google.com/request?ime=handwriting&app=quickdraw&dbg=1&cs=1&oe=UTF-8'
  
  // Set HTTP Headers
  var headers = {
    'Accept': '*/*',
    'Content-Type': 'application/json'
  };

  // Init HTTP Request
  var xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  Object.keys(headers).forEach(function(key,index) {
      xhr.setRequestHeader(key, headers[key]); 
  });

  // HTTP Request On Load
  xhr.onload = function() {
    if (xhr.status === 200) {
      res = xhr.responseText; // HTTP Response Text
      parseResponse(res);     // Parse Response
      idx_guess += 1;         // Iterate Guess Index
    }
    else if (xhr.status !== 200) {
      console.log('Request failed.  Returned status of ' + xhr.status);
    }
  };

  // Create New Data Payload for Quickdraw Google AI API
  var data = {
    "input_type":0,
    "requests":[
      {
        "language":"quickdraw",
        "writing_guide":{"width": c_dims.width, "height":c_dims.height},
        "ink": [ink]
      }
    ]
  };

  // Convert Data Payload to JSON String
  var request_data = JSON.stringify(data);

  // Send HTTP Request w/ Data Payload
  xhr.send(request_data);

}

// Parse Quickdraw Google AI API Response
function parseResponse(res){
  // Convert Response String to JSON
  best_guess="";
  var res_j = JSON.parse(res);
  best_guess=res_j[1][0][1][0];
  $("#kid_info").hide();
  if((userdetails.username!==undefined && userdetails.username!=="")){
    for(i=0;i<10;i++){
      $("#btn"+i).text(res_j[1][0][1][i]);
      $("#btn"+i).css({ opacity: 1 });
      $("#sendEmail").show()
    }
  }
  

  // Extract Guess Score String from Response and Convert to JSON
  scores = JSON.parse(res_j[1][0][3].debug_info.match(/SCORESINKS: (.+) Combiner:/)[1]);
  // Add New Guess Scores to Score History
  //updateScoresHistory();
  // Plot Guess Scores
  //plotScores_Highcharts();

}

// Initialize Info Modal
function initInfoModal(){

  // Get the modal
  var modal = document.getElementById('info');

  // Get the button that opens the modal
  var btn = document.getElementById("btnInfo");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

 

  // When the user clicks on the button, open the modal 
  btn.onclick = function() {
      $("#kid_info").show();
  } 


  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
      modal.style.display = "none";
  }

  

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }

  document.getElementById('info').style.display = "block";
  
}