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

//testdata in a really roundabout way because my brain prefers it.
var testData = [
  {title: 'root', description: 'the root node', parent: '', children: ['one', 'two']},
  {title: "one", description: "this is the root thing", parent: 'root', children: ['a', 'b', 'c']},
  {title: 'two', description: 'this is the other thing', parent: 'root', children: ['x', 'y', 'z']},
  {title: 'a', description: 'this is a', parent: 'one', children: []},
  {title: 'b', description: 'this is b', parent: 'one', children: []},
  {title: 'c', description: 'this is c', parent: 'one', children: []},
  {title: 'x', description: 'this is x', parent: 'two', children: []},
  {title: 'y', description: 'this is y', parent: 'two', children: []},
  {title: 'z', description: 'this is z', parent: 'two', children: []}
];
var arrayToMap = function(array){
  var ret = {};
  for(var i=0; i<array.length; i++){
    ret[array[i].title] = array[i];
  }
  return ret;
}
var testMap = arrayToMap(testData);

//draw a data object to the canvas (target)
var drawData = function(target, data){
  var c = document.getElementById(target);
  var ctx = c.getContext('2d');
  //start at root (assumed to be present)
  drawBox(target, (c.width-defaultBox.width)/2, 0);
  //do children of root
  mapChildren(target, 'root');
  console.log(depthNodes);
  //draw the nodes in depthNodes
  drawChildren(target);
}

var drawChildren = function(target){
  var c = document.getElementById(target);
  for(var key in depthNodes){
    console.log(key+": ");
    console.log(depthNodes[key]);
    if(key==0){
      drawBox(target, (c.width-defaultBox.width)/2, 0);
    } else {
      for(var i=0; i<depthNodes[key].length; i++){
        //do stuff
        drawBox(target, childOffset.x*i, childOffset.y*key);
      }
    }
  }
}

//given a canvas and a object, work your way down (depth first traversal)
//makes calls all the way down, now just have to figure out how to make it do something in the process
var mapChildren = function(target, nodeName){
  console.log(nodeName);
  var node = testMap[nodeName];
  var depth = findDepth(nodeName);
  console.log('on node '+nodeName+' in mapChildren at depth: '+depth);
  //console.log(node.children);
  node.children.forEach(function(entry){
    console.log("calling mapChildren on "+entry);
    mapChildren(target, entry);
  });
}

//a way to find the depth of a given node
var findDepth = function(target){
  console.log('initial findDepth for: '+target);
  return findDepthWorker('root', target, 0);
}
var findDepthWorker = function(currentNode, target, n){
  if(!n){
    n=0
  }else{
    n=parseInt(n);
  }
  console.log('secondary findDepth on: '+currentNode+" looking for "+target);
  var node = testMap[currentNode];
  if(node.title == target){
    //add to the depthNodes object
    if(depthNodes[n]){
      depthNodes[n].push(node);
    }else{
      depthNodes[n]=[node];
    }
    return n;
  }
  if(node.children.length > 0){
    //console.log(node.children);
  } else {
    console.log('no further children');
    return -2;
  }
  if(node.children.indexOf(target)>0){
    return n
  } else{
    node.children.forEach(function(entry){
      return findDepthWorker(entry, target, n+1);
    });
    return;
  }
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

var drawLabel = function(target){
  var c = document.getElementById(target);
  var ctx = c.getContext('2d');
  ctx.font = "30px Arial";
  ctx.fillStyle="#ff0000";
  ctx.textAlign="center";
  ctx.fillText("Label", c.width/2, c.height/2);
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
  //ctx.fillStyle="#dcdcdc";
  ctx.fillStyle="#cccccc";
  ctx.fillRect(x,y,30,20);
}
