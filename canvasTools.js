var defaultBox = {
  width: 200,
  height: 100
};
var offsets = {
  x: 100,
  y: 100
};
var childOffset = {
  x:300,
  y: 150
};
var depthMap = {};
var canvasOffsets={};
var canvasToolTarget;

//testdata is a format that exists in my application that i would like this for. A full object is listed below.
//data is stored in a MongoDB with the following information (currenlty input is by tree strucutre - you have to define a parent to create children)
//as such, relationships are driven by the child (as the parent upon creation has no concept of its children)
//***********************TEST DATA SETUP************
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
//*************************************************
//will have to address how this is to be handled with a real datasource

//full sample object out of MongoDB
//{ "_id" : "mMY3vZ6kc6K786shT", "name" : "IdeaLab", "target" : "/content", "parent" : "home", "category" : "idealab", "user" : "Wzh6JMb7LcppDtwBN", "title" : "IdeaLab", "body" : "Use our 3d printer, 3d scanner, software development studio, and other exciting technical resources!" }

//determine what exactly is going on with a click that has been recorded by the listenere
var clickReporter = function(event){
  // console.log(event);
  //have to ensure that i have an up to date offset for the scroll and for the canvas at the time that the click happens.
  updateOffsets(event.target.getAttribute("id"));
  var x = event.x - canvasOffsets.x;
  var y = event.y - canvasOffsets.y;
  console.log("clicked at: ("+x+", "+y+")");
  var selected = findBox(x, y);
  console.log(selected);
  updateBox(selected);
}

//keep track of what is associated with the node box
var updateBox = function(selectedNode){
  if(selectedNode){
    document.getElementById('node-title').value = selectedNode.title;
    document.getElementById('node-description').value = selectedNode.description;
    document.getElementById('node-depth').value = selectedNode.depth;
    document.getElementById('div-hider').hidden="";
    document.getElementById('node-create-child').addEventListener('click', addChildNode);
  } else {
    document.getElementById('node-title').value = '';
    document.getElementById('node-description').value = '';
    document.getElementById('div-hider').hidden="hidden";
    document.getElementById('node-create-child').removeEventListener('click', addChildNode);
  }
}

//create and save the new child node based upon parent node found in addChildeNode
var createChildNode = function(node){
  var childNode = {};
  childNode.title = 'child of '+node.title;
  childNode.description = 'this is the child of '+node.title;
  childNode.parent = node.title;
  childNode.depth = node.depth+1;
  //depthMap[childNode.depth].push
  testData.push(childNode);
  console.log(testData);
  testMap = arrayToMap(testData);
  clearCanvas(canvasToolTarget);
  drawData(canvasToolTarget);
}
//handles the click, finds the current node, calls for the creation of the new node
var addChildNode = function(event){
  //do stuff here
  var depth = document.getElementById('node-depth').value;
  var title = document.getElementById('node-title').value;
  console.log('Looking for '+title+' at depth '+depth);
  var node;
  //populate the node
  for(var key in depthMap[depth]){
    console.log('key: '+key+ ' looking for '+title);
    if(depthMap[depth][key].title==title){
      node = depthMap[depth][key];
      break;
    }
  }
  console.log(node);
  createChildNode(node);
}

//ensure that the click is registring to the right spot on the canvas
var updateOffsets = function(canvasToolTarget){
  var c = document.getElementById(canvasToolTarget);
  canvasOffsets.x = c.offsetLeft - window.pageXOffset;
  canvasOffsets.y = c.offsetTop - window.pageYOffset;
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
        //console.log('on box: '+temp.title);
        //so this is where we trigger a modal or something
        node = temp;
      }
    }
    //any further action
  }
  return node;
}

var drawData = function(target){
  //reset data if you are not the first call here...
  depthMap = {};
  //target is the canvas id on the page
  canvasToolTarget = target;
  drawDataSet(canvasToolTarget, testMap);
  var c = document.getElementById(canvasToolTarget);
  canvasOffsets.x = c.offsetLeft;
  canvasOffsets.y = c.offsetTop;
  c.addEventListener('click', clickReporter, false);
}

//draw a data object to the canvas (target)
var drawDataSet = function(canvasToolTarget, data){
  drawLabel(canvasToolTarget, "Demo Label");
  //create a children field for each item in the map based on the parent field
  data = populateChildren(data);
  updateCanvasParameters(canvasToolTarget);
  drawTree(canvasToolTarget, data);
}

var updateCanvasParameters = function(canvasToolTarget){
  var c = document.getElementById(canvasToolTarget);
  var ctx = c.getContext('2d');

  var totalDepth = Object.keys(depthMap).length;
  var totalWidth=0;
  for(var key in depthMap){
    // console.log(depthMap[key].length);
    if(depthMap[key].length > totalWidth){totalWidth = depthMap[key].length;}
  }

  var minHeight = childOffset.y*totalDepth + 100;
  var minWidth = childOffset.x*totalWidth + 100;
  c.height = c.height < minHeight ? minHeight : c.height;
  c.width = c.width < minWidth ? minWidth : c.width;
}

//go through the depthmap to draw
var drawTree = function(canvasToolTarget, data){
  for(var key in depthMap){
    var depthArray = depthMap[key];
    intelliDraw(canvasToolTarget, depthArray, key);
  }
  //console.log(depthMap);
  drawLinks(canvasToolTarget);
}

var drawLinks = function(canvasToolTarget){
  //skip zero as it has no parents, but go through each tier and link to parent
  for(var key in depthMap){
    if(key==0) continue;
    for(var node in depthMap[key]){
      //console.log(depthMap[key][node]);
      child = depthMap[key][node];
      parent = findParent(child);
      drawStroke(canvasToolTarget, child.x, child.y, parent.x, parent.y);
      drawDetailedBox(canvasToolTarget, child.x, child.y, child.title);
    }
  }
}

var findParent = function(childNode){
  if(child.depth ==0) return false;
  var parentDepth = child.depth -1;
  for(var key in depthMap[parentDepth]){
    //console.log(depthMap[parentDepth][key].title);
    if(depthMap[parentDepth][key].title == childNode.parent){
      return depthMap[parentDepth][key];
    }
  }
  return false;
}

//evenly distribute the nodes in the space allotted
var intelliDraw = function(canvasToolTarget, depthArray, depth){
  var c = document.getElementById(canvasToolTarget);
  //try to center align by division
  var xoffset = c.width / (depthArray.length+1);
  // console.log(xoffset);
  for(var i=0; i<depthArray.length; i++){
    yPost = childOffset.y*depth;
    xPost = xoffset*(i+1);
    drawDetailedBox(canvasToolTarget, xPost, yPost, depthArray[i].title);
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
var drawStroke=function(target, x1, y1, x2, y2){
  //console.log(target);
  var c = document.getElementById(target);
  var ctx = c.getContext('2d');
  ctx.beginPath();
  ctx.moveTo(x1+defaultBox.width/2, y1+defaultBox.height/2);
  ctx.lineTo(x2+defaultBox.width/2, y2+defaultBox.height/2);
  ctx.strokeStyle="black";
  ctx.stroke();
}
//clear the existing canvas
var clearCanvas = function(target){
  var c = document.getElementById(target);
  var ctx = c.getContext('2d');
  ctx.beginPath();
  ctx.clearRect(0,0,c.width,c.height);
}
