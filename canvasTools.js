var defaultBox = {
  width: 200,
  height: 100
};
var offsets = {
  x: 100,
  y: 100
};
var rootBox = {
  x:200,
  y:0
};
var childOffset = {
  x:300,
  y: 150
};
var depthNodes = {};
var depthMap = {};
var canvasOffsets={};

//testdata is a format that exists in my application that i would like this for. A full object is listed below.
//data is stored in a MongoDB with the following information (currenlty input is by tree strucutre - you have to define a parent to create children)
//as such, relationships are driven by the child (as the parent upon creation has no concept of its children)

//testdata in a really roundabout way because my brain prefers it.
var testData = [
  {title: 'root', description: 'the root node', parent: ''},
  {title: "one", description: "this is the one thing", parent: 'root'},
  {title: 'two', description: 'this is the other thing', parent: 'root'},
  {title: 'a', description: 'this is a', parent: 'one'},
  {title: 'b', description: 'this is b', parent: 'one'},
  {title: 'c', description: 'this is c', parent: 'one'},
  {title: 'x', description: 'this is x', parent: 'two'},
  {title: 'y', description: 'this is y', parent: 'two'},
  {title: 'z', description: 'this is z', parent: 'two'}
];
var arrayToMap = function(array){
  var ret = {};
  for(var i=0; i<array.length; i++){
    ret[array[i].title] = array[i];
  }
  return ret;
}
var testMap = arrayToMap(testData);

//full sample object out of MongoDB
//{ "_id" : "mMY3vZ6kc6K786shT", "name" : "IdeaLab", "target" : "/content", "parent" : "home", "category" : "idealab", "user" : "Wzh6JMb7LcppDtwBN", "title" : "IdeaLab", "body" : "Use our 3d printer, 3d scanner, software development studio, and other exciting technical resources!" }

var clickReporter = function(event){
  //have to ensure that i have an up to date offset for the scroll and for the canvas at the time that the click happens.
  var x = event.x - canvasOffsets.x;
  var y = event.y - canvasOffsets.y;
  console.log("clicked at: ("+x+", "+y+")");
  findBox(x, y);
}

var findBox = function(x, y){
  var node = false;
  //determine if there is a box under the location x,y in the canvas
  //can first determine depth just by y position
  var depth = parseInt(y / 150);
  //console.log('hack depth:'+depth);
  for(var key in depthMap[depth]){
    var temp = depthMap[depth][key];
    //console.log(temp.title+": "+temp.x+" - "+temp.x+defaultBox.width);
    if(x>temp.x){
      //console.log('right of left-edge');
      if(x<(temp.x+defaultBox.width)){
        //console.log('left of right-edge');
        console.log('on box: '+temp.title);
      }
    }
    //any further action
  }

  return node;
}

var scrollUpdater = function(){
  //do stuff
  console.log('scroll updater');
}

var drawData = function(target){
  //target is the canvas id on the page
  drawDataSet(target, testMap);
  var c = document.getElementById(target);
  canvasOffsets.x = c.offsetLeft;
  canvasOffsets.y = c.offsetTop;
  c.addEventListener('click', clickReporter, false);
  c.addEventListener('scroll', scrollUpdater);
}

//draw a data object to the canvas (target)
var drawDataSet = function(target, data){
  drawLabel(target, "Demo Label");
  //create a children field for each item in the map based on the parent field
  data = populateChildren(data);
  updateCanvasParameters(target);
  drawTree(target, data);
}

var updateCanvasParameters = function(target){
  var c = document.getElementById(target);
  var ctx = c.getContext('2d');

  var totalDepth = Object.keys(depthMap).length;
  var totalWidth=0;
  for(var key in depthMap){
    // console.log(depthMap[key].length);
    if(depthMap[key].length > totalWidth){totalWidth = depthMap[key].length;}
  }

  var minHeight = childOffset.y*totalDepth + 100;
  var minWidth = childOffset.x*totalWidth + 100;
  //console.log('height: '+c.height+" minimum: "+minHeight);
  //console.log('width: '+c.width+" minimum: "+minWidth);
  c.height = c.height < minHeight ? minHeight : c.height;
  c.width = c.width < minWidth ? minWidth : c.width;
}

//go through the depthmap to draw
var drawTree = function(target, data){
  for(var key in depthMap){
    var depthArray = depthMap[key];
    intelliDraw(target, depthArray, key);
  }
}

//evenly distribute the nodes in the space allotted
var intelliDraw = function(target, depthArray, depth){
  var c = document.getElementById(target);
  //try to center align by division
  var xoffset = c.width / (depthArray.length+1);
  // console.log(xoffset);
  for(var i=0; i<depthArray.length; i++){
    yPost = childOffset.y*depth;
    xPost = xoffset*(i+1);
    drawDetailedBox(target, xPost, yPost, depthArray[i].title);
    var node = depthArray[i];
    node.x = xPost;
    node.y = yPost;
    // console.log(node);
    saveToDepthArray(node);
  }
  //console.log(depthMap);
}

var saveToDepthArray = function(node){
  // console.log('saving node to depthArray: '+node.title);
  var tempArray = depthMap[node.depth];
  //console.log(tempArray);
  for(var i=0; i<tempArray.length; i++){
    if(node.title == tempArray[i].title){
      //do stuff
      // console.log('match');
      tempArray[i] = node;
    }
  }
  depthMap[node.depth] = tempArray;
}

var populateChildren = function(data){
  //go to each node, find depth of that node
  //populate the depthMap with depth: [node1, node2, node...] for tracking purposes
  //experimentally, also adding the depth data to the initial data (return the modified data to the caller)
  for(var key in data){
    //console.log('populating '+key);
    var depth = lengthToRoot(data, key, 0);
    data[key].depth = depth;
    if(depthMap[depth]){
      depthMap[depth].push(data[key]);
    }else{
      depthMap[depth] = [data[key]];
    }
  }
  return data;
}

var lengthToRoot = function(data, key, depth){
  if(key==='root'){
    return depth;
  }else{
    return lengthToRoot(data, data[key].parent, depth+1);
  }
}





//**********************
//Drawing Functions
//This is a split between the tree logic and drawings
//Purely for the human at the keyboard
//**********************

//convenience method
var drawDetailedBox = function(target, x, y, title){
  drawBox(target, x, y);
  drawTitle(target, x, y, title);
}
//draw a box at a location
var drawBox = function(target, x, y){
  var c = document.getElementById(target);
  var ctx = c.getContext('2d');
  ctx.fillStyle="#dddddd";
  ctx.fillRect(x,y,defaultBox.width,defaultBox.height);
}
//draw text at a location
var drawText = function(target, x, y){
  var c = document.getElementById(target);
  var ctx = c.getContext('2d');
  ctx.font = "20px Arial";
  ctx.fillStyle="#000000";
  ctx.fillText("Hello canvas", 10, 50);
}
//draw a label in top left corner
var drawLabel = function(target, labelText){
  var c = document.getElementById(target);
  var ctx = c.getContext('2d');
  var fontsize = 30;
  ctx.font = fontsize.toString()+"px Arial";
  ctx.fillStyle="#ff0000";
  ctx.fillText(labelText, 10, fontsize);
}
//draw an appropriately positioned title for the object-box located at x,y
var drawTitle=function(target, x, y, title){
  var fontHeight = 20;
  var c = document.getElementById(target);
  var ctx = c.getContext('2d');
  ctx.font=fontHeight.toString()+"px Arial";
  ctx.fillStyle="#000000";
  ctx.fillText(title, x+defaultBox.width/2, y+fontHeight);
}
//draw a smaller box in the top right corner of the parent box at x,y
var cornerBox=function(target, x, y){
  x = x + defaultBox.width - 30;
  var c = document.getElementById(target);
  var ctx = c.getContext('2d');
  ctx.fillStyle="#cccccc";
  ctx.fillRect(x,y,30,20);
}
