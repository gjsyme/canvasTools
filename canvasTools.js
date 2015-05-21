var defaultBox = {
  width: 200,
  height: 100
};
var offsets = {
  x: 100,
  y: 100
};
var childOffset = {
  x: 250,
  y: 150
};
var canvasScale = {
  x: 1,
  y: 1,
  font: 1
}
var depthMap = {};
var canvasOffsets={};
var canvasToolTarget;

//testdata is a format that exists in my application that i would like this for. A full object is listed below.
//data is stored in a MongoDB with the following information (currenlty input is by tree strucutre - you have to define a parent to create children)
//as such, relationships are driven by the child (as the parent upon creation has no concept of its children)
//***********************TEST DATA SETUP************
//testdata in a really roundabout way because my brain prefers it.
var testData = [
  { "_id" : "gC5mxB6iCzLvSbtHW", "name" : "I would like to eat", "target" : "/content", "parent" : "home", "category" : "food", "user" : "ZFsAL9ZnvL5nEfvHi", "title" : "Food", "body" : "There are many competitive options for satisfying your caloric requirements. While eastern cuisine is delicious, you may find it short lived in providing satiety; conversely, western fare has been known to become monotonous and potentially less-than-healthy in the Standard American Diet (SAD). As a compromise, Mediterranean dishes are often a great selection." },
  { "_id" : "qhpreMZYqchraJiji", "name" : "I would like to watch a movie", "target" : "/content", "parent" : "home", "category" : "movies", "user" : "ZFsAL9ZnvL5nEfvHi", "title" : "Movies", "body" : "Movies are divided up into various genres, which are listed below. Based upon what type of movie experience you are looking for, we can help you find exactly what you're looking for." },
  { "_id" : "wfHz8tBjKyNmK4kmH", "name" : "I would like to read a book", "target" : "/content", "parent" : "home", "category" : "books", "user" : "ZFsAL9ZnvL5nEfvHi", "title" : "Reading", "body" : "There are many different things to consider when selecting reading material. To start, please select a category from below:" },
  { "_id" : "JF5pHhf4WngyDtrea", "name" : "I would like to find things on the internet", "target" : "/content", "parent" : "home", "category" : "internet", "user" : "ZFsAL9ZnvL5nEfvHi", "title" : "The Web", "body" : "The infinite (dependent upon addressable IP space) expanses of the internet - too many things to even attempt to categorize. Here's a very broad selection of things you may wish to see while on the internet - please pick one:" },
  { "_id" : "qaMBzBzPjBvnJ3LNQ", "name" : "Social Aggregated Content", "target" : "//www.reddit.com", "parent" : "internet", "category" : "", "user" : "ZFsAL9ZnvL5nEfvHi", "title" : "", "body" : "" },
  { "_id" : "hQR2fnYAc7AaN5yJr", "name" : "Kitten GIFs", "target" : "//giphy.com/search/kitten", "parent" : "internet", "category" : "", "user" : "ZFsAL9ZnvL5nEfvHi", "title" : "", "body" : "" },
  { "_id" : "8jHdM6Jgjuqg83gYT", "name" : "More Kitten GIFs", "target" : "//www.tumblr.com/tagged/kitten-gifs", "parent" : "internet", "category" : "", "user" : "ZFsAL9ZnvL5nEfvHi", "title" : "", "body" : "" },
  { "_id" : "jZaY2PkQqmHMJfqwY", "name" : "Fiction", "target" : "/content", "parent" : "books", "category" : "fiction", "user" : "ZFsAL9ZnvL5nEfvHi", "title" : "Fiction", "body" : "Creativity at its best, and most papery. Well, except for origami, but who can really compete with all those crazy folds? And maybe those people who do crazy papercraft projects - those can be pretty excellent, too. So maybe it's really more like the third or fourth most creative thing you can do with paper. Anyway, what kind of story do you want to read? Pick below:" },
  { "_id" : "eoXLBnsepx9DvL5q8", "name" : "Non-Fiction", "target" : "/content", "parent" : "books", "category" : "nonfiction", "user" : "ZFsAL9ZnvL5nEfvHi", "title" : "Non-Fiction", "body" : "Like the news, but potentially millenia late. This stuff is pretty interesting though, and covers a wide range of significant events and people, as well as the latest in self improvement, scientific thought, and research. Pick you area of interest:" },
  { "_id" : "8h5mCNQ82mBi8x8mn", "name" : "Biography", "target" : "/content", "parent" : "nonfiction", "category" : "biography", "user" : "ZFsAL9ZnvL5nEfvHi", "title" : "Biographies", "body" : "Find out more about famous dead people, famous living people, infamous people living or dead, and otherwise-unknown people with enough resources to get someone to write a book about them!" },
  { "_id" : "B6M6BzQMavTyDiBvn", "name" : "Historical Figures", "target" : "/stub", "parent" : "biography", "category" : "historical-biography", "user" : "ZFsAL9ZnvL5nEfvHi", "title" : "Historical Figures", "body" : "Something something famous dead people something." },
  { "_id" : "gFkXWAwrsKA9EHR7K", "name" : "History", "target" : "/stub", "parent" : "nonfiction", "category" : "history", "user" : "ZFsAL9ZnvL5nEfvHi", "title" : "History", "body" : "Look at what happened in the past to prevent it from happening again in the future. If doing is more your style, then take notes and do it better than the last guy. In either case, history tells us about what, how, and why things have happened before." },
  { "_id" : "qFarQafY73Cm7sDzR", "name" : "Reference", "target" : "/stub", "parent" : "nonfiction", "category" : "reference", "user" : "ZFsAL9ZnvL5nEfvHi", "title" : "Reference Material", "body" : "A catchall for all other non-fiction that doesn't fall into categories listed under separate sections." },
  { "_id" : "y2ctbATkyiGWoQvZq", "name" : "Textbooks", "target" : "/stub", "parent" : "nonfiction", "category" : "textbooks", "user" : "ZFsAL9ZnvL5nEfvHi", "title" : "Textbooks", "body" : "Just in case you're looking to catch up on that three dimensional calculus or organic chemistry class you weren't really paying attention to freshman year..." },
  { "_id" : "ZLs58sKvZzigzwjLR", "name" : "Bars and Grills", "target" : "/content", "parent" : "food", "category" : "barandgrill", "user" : "ZFsAL9ZnvL5nEfvHi", "title" : "Bars and Grills", "body" : "Standard american fare!" },
  { "_id" : "vcMKCSE589GrbHxA9", "name" : "Ethnic Foods", "target" : "/content", "parent" : "food", "category" : "ethnic", "user" : "ZFsAL9ZnvL5nEfvHi", "title" : "Ethnic Food", "body" : "Find restaurants / food by the region of its origin" },
  { "_id" : "qmsuSpharFruoYRiE", "name" : "Action", "target" : "/content", "parent" : "movies", "category" : "action", "user" : "ZFsAL9ZnvL5nEfvHi", "title" : "Action Movies", "body" : "More explosions than a real war and less plot than a three panel comic - why would you pay for something that requires you to use your brain?" },
  { "_id" : "X3w3ueMwQZaQXs4bg", "name" : "Adventure", "target" : "/content", "parent" : "movies", "category" : "adventure", "user" : "ZFsAL9ZnvL5nEfvHi", "title" : "Adventure", "body" : "I don't even know what this genre is supposed to be about. No, really. Like it doesn't make sense. Is it a fictional travel documentary?" },
  { "_id" : "EzJTXYDsiaDSYRwpB", "name" : "Drama", "target" : "/content", "parent" : "movies", "category" : "drama", "user" : "ZFsAL9ZnvL5nEfvHi", "title" : "Drama", "body" : "Just in case you're enjoying your own life, spend the next two hours exploring the awkwardness, struggles, and terrible circumstance that befalls other people so that you can also be depressed." },
  { "_id" : "zQ4LAyBynthDExbeF", "name" : "Fantasy", "target" : "/stub", "parent" : "fiction", "category" : "fantasy", "user" : "ZFsAL9ZnvL5nEfvHi", "title" : "Fantasy books", "body" : "Dragons? Check. Armor? Check. Swords? Thirty three varieties and another 26 that aren't quite swords, but don't exist in the real world. Angels? Yes. Demons? Them too. Angels and Demons? ...try suspense." },
  { "_id" : "ouLhNaJKxocCwx5EQ", "name" : "Science Fiction", "target" : "/stub", "parent" : "fiction", "category" : "scifi", "user" : "ZFsAL9ZnvL5nEfvHi", "title" : "Science Fiction", "body" : "Speculative fiction as rebranded since the emergence of the cult of 'science' (but that's a topic for a difference website). Lasers and spaceships and robots, oh my!" },
  { "_id" : "LLoRbB5yFnp7kxtgY", "name" : "Young Adult", "target" : "/stub", "parent" : "fiction", "category" : "young-adult", "user" : "ZFsAL9ZnvL5nEfvHi", "title" : "Young Adult", "body" : "The reading options for tweens and others who prefer their vocabulary limited, their sentence structure limited, and their page counts in the double-digits." },
  { "_id" : "vR5ZEacwy735CS5x3", "name" : "Grocery Stores", "target" : "/content", "parent" : "food", "category" : "grocery", "user" : "ZFsAL9ZnvL5nEfvHi", "title" : "Grocery Stores", "body" : "Whether its microwave dinner or DIY meals, a store is the place to get started." }
];
var arrayToMap = function(array){
  var ret = {};
  for(var i=0; i<array.length; i++){
    if(array[i].title=="") array[i].title=array[i].name; //oneoff to eliminate null title cases
    ret[array[i].title] = array[i];
  }
  return ret;
}
var testMap = arrayToMap(testData);
// console.log(testMap);
//*************************************************
//will have to address how this is to be handled with a real datasource

//determine what exactly is going on with a click that has been recorded by the listenere
var clickReporter = function(event){
  updateOffsets(event.target.getAttribute("id"));
  var x = event.x - canvasOffsets.x;
  var y = event.y - canvasOffsets.y;
  // console.log("clicked at: ("+x+", "+y+")");
  var selected = findBox(x, y);
  console.log(selected);
  if(selected) updateBox(selected);
}

//keep track of what is associated with the node box
var updateBox = function(selectedNode){
  if(selectedNode){
    document.getElementById('node-title').value = selectedNode.title;
    document.getElementById('node-body').value = selectedNode.body;
    document.getElementById('node-depth').value = selectedNode.depth;
    document.getElementById('node-parent').value = selectedNode.parent;
    // document.getElementById('node-depth').value = selectedNode.depth;
    toggleModal();
  } else {
    document.getElementById('node-title').value = '';
    document.getElementById('node-body').value = '';
    document.getElementById('node-depth').value = '';
    toggleModal();
  }
}

//create and save the new child node based upon parent node found in addChildNode
var createChildNode = function(node){
  var childNode = {};
  childNode.title = 'child of '+node.title;
  childNode.body = 'this is the child of '+node.title;
  childNode.parent = node.title;
  childNode.depth = node.depth+1;
  if(Object.keys(depthMap).indexOf(childNode.depth) > 0){
    depthMap[childNode.depth].push;
  }else{
    depthMap[childNode.depth] = [childNode];
  }
  // testData.push(childNode);
  // console.log(testData);
  // testMap = arrayToMap(testData);
  clearCanvas(canvasToolTarget);
  rebalanceRow(depthMap, childNode.depth);
  drawData(canvasToolTarget);
}
//handles the click, finds the current node, calls for the creation of the new node
var addChildNode = function(event){
  if($('#myModal').hasClass('in')){ toggleModal();}
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

var saveNode = function(event){
  //do stuff to save the node updates based on values of the inputs
  var title = document.getElementById('node-title').value;
  var body = document.getElementById('node-body').value;
  var parent = document.getElementById('node-parent').value;
  var depth = document.getElementById('node-depth').value;

  var homeArray = depthMap[depth];
  //crudely find the target Node
  var node;
  for(var key in homeArray){
    if(homeArray[key].title==title){
      node = homeArray[key];
      break;
    }
  }
  if(node.title != title) node.title = title;
  if(node.body != body) node.body = body;
  if(node.parent == parent){
    //keep the same parent -> keep the same depth -> easy save
    depthMap[depth][key] = node;
  }else{ //node.parent != parent
    // console.log('updating parent');
    node.parent = parent;
    //find the new parent
    for(var depthKey in depthMap){
      // console.log('examining '+depthKey+' in depthMap');
      for(var key in depthMap[depthKey]){
        //console.log(depthMap[depthKey][key].category+' : '+parent);
        if(depthMap[depthKey][key].category == parent){
          //found match, change the parent and depth record
          // console.log('match on '+depthMap[depthKey][key].category+' == '+parent);
          //console.log(node.depth);
          node.depth = depthMap[depthKey][key].depth+1;
          //console.log(node.depth);
          depthMap[node.depth].push(node);
          break;
        }
      }
    }
  }
  //ensure that things are redrawn before returning.
  console.log(depthMap);
  drawData(canvasToolTarget);
  toggleModal();
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
  canvasOffsets.x = c.offsetLeft*canvasScale.x;
  canvasOffsets.y = c.offsetTop*canvasScale.y;
  c.addEventListener('click', clickReporter, false);
}

//draw a data object to the canvas (target)
var drawDataSet = function(canvasToolTarget, data){
  drawLabel(canvasToolTarget, "Demo Label");
  //create a children field for each item in the map based on the parent field
  data = populateChildren(data);
  // console.log(data);
  updateCanvasParameters(canvasToolTarget);
  // console.log('param update');
  drawTree(canvasToolTarget, data);
}

var updateCanvasParameters = function(canvasToolTarget){
  var c = document.getElementById(canvasToolTarget);
  var ctx = c.getContext('2d');

  console.log("window width: "+window.innerWidth);

  var totalDepth = Object.keys(depthMap).length;
  var totalWidth=0;
  for(var key in depthMap){
    // console.log(depthMap[key].length);
    if(depthMap[key].length > totalWidth){totalWidth = depthMap[key].length;}
  }
  console.log(totalWidth);

  canvasScale.x = 1; canvasScale.y =1;

  var minHeight = (childOffset.y*totalDepth + 100);//*canvasScale.y;
  var minWidth = (childOffset.x*totalWidth + 100);//*canvasScale.x;
  console.log(minWidth);
  //shrink x to fit
  if(minWidth > c.width && minWidth > (window.innerWidth-30)) c.width = window.innerWidth-30;
  while(minWidth*canvasScale.x > c.width){
    canvasScale.x-=0.01;
  }
  // probably won't shrink on Y axis due to normalcy of vertical scroll (vice horizontal which is awkward)
  // shrink y to fit
  // while(minHeight*canvasScale.y > c.height){
  //   canvasScale.y-=0.01;
  // }
  console.log(canvasScale.x);
  canvasScale.font = canvasScale.x < canvasScale.y ? canvasScale.x : canvasScale.y;
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
  // console.log('finding parent for '+childNode.title+' at depth '+childNode.depth);
  if(child.depth ==0) return false;
  var parentDepth = child.depth -1;
  for(var key in depthMap[parentDepth]){
    //console.log(depthMap[parentDepth][key].title);
    if(depthMap[parentDepth][key].title == childNode.parent){
      return depthMap[parentDepth][key];
    }
    if(depthMap[parentDepth][key].category == childNode.parent){
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
    yPost = childOffset.y*depth*canvasScale.y;
    if(depthArray.length==1){
      xPost = xoffset;//*canvasScale.x;
    }else{
      xPost=xoffset*(i+1)-xoffset*canvasScale.x;
    }
    drawDetailedBox(canvasToolTarget, xPost, yPost, depthArray[i].title);
    var node = depthArray[i];
    node.x = xPost;
    node.y = yPost;
    // console.log(node);
    saveToDepthArray(node);
  }
}

var saveToDepthArray = function(node){
  // console.log('saving node to depthArray: '+node.title);
  // console.log('saving at depth: '+node.depth);
  var tempArray = depthMap[node.depth];
  // console.log(tempArray);
  for(var i=0; i<tempArray.length; i++){
    if(node.title == tempArray[i].title){
      // console.log('match');
      tempArray[i] = node;
    }
  }
  depthMap[node.depth] = tempArray;
}

//this function populates depthMap, effectively your source of node truth from this point forward
var populateChildren = function(data){
  //populate the depthMap with depth: [node1, node2, node...] for tracking purposes
  //also adds the depth data to the initial data (return the modified data to the caller)
  for(var key in data){
    // console.log('populating '+key);
    var depth = lengthToRoot(data, key, 0);
    // console.log('at depth: '+depth);
    data[key].depth = depth;
    if(depthMap[depth]){
      depthMap[depth].push(data[key]);
    }else{
      depthMap[depth] = [data[key]];
    }
  }
  // create default root node for those that don't manually add a root node - this may be how all instances from the dynamicResource app occur
  // and that is likely how any app (decision tree) happens due to the static home page utilized
  if(typeof depthMap[0] == "undefined") depthMap[0] = [{"title": "home", "body": "default home page", "depth": 0}];
  return data;
}

//this pretty much is 100% - in that it works in all tests i've done
var lengthToRoot = function(data, key, depth){
  if(key=="home") return depth;
  if(data[key]){
    if(data[key].parent==="home"){
      return depth+1;
    }else{
      var fetchedNode = fetchNodeByTitle(data, key);
      if(fetchedNode){
        return lengthToRoot(data, fetchedNode.parent, depth+1);
      }else{
        return lengthToRoot(data, data[key].parent, depth+1);
      }
    }
    return -1;
  }else{
    var fetchNode = fetchNodeByTitle(data, key);
    if(fetchNode){
      return lengthToRoot(data, fetchNode.parent, depth+1);
    }else{
      return lengthToRoot(data, data[key].parent, depth+1);
    }
  }
}

//search by key that will yield the node that is the parent of the node with that key
var fetchNodeByTitle = function(nodeMap, cat){
  var tempNode = nodeMap[cat];
  if(typeof tempNode == 'undefined'){
    for(key in nodeMap){
      if(nodeMap[key].category == cat) tempNode = nodeMap[key];
    }
  }
  return tempNode;
  return false;
}

//major TODO here
var rebalanceRow = function(depthMap, depth){
  var balanceArray = depthMap[depth];
  console.log(balanceArray);
  //have to now recalculate x for each of the nodes in the array; this should be called after adding a new child
}


//************
//magic for overlay modal type thing
//***********
var toggleModal = function() {
  if($('#myModal').hasClass('in')){
    document.getElementById('saveNode').removeEventListener('click', saveNode);
    document.getElementById('addChild').removeEventListener('click', addChildNode);
  }else{
    document.getElementById('saveNode').addEventListener('click', saveNode);
    document.getElementById('addChild').addEventListener('click', addChildNode);
  }
  $('.modal').modal('toggle');
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
  ctx.fillRect(x,y,defaultBox.width*canvasScale.x,defaultBox.height*canvasScale.y);
}
// NOT USED
// draw text at a location
// var drawText = function(target, x, y, text){
//   var c = document.getElementById(target);
//   var ctx = c.getContext('2d');
//   ctx.font = "20px Arial";
//   ctx.fillStyle="#000000";
//   ctx.fillText(text, 10, 50);
// }
//draw a label in top left corner
var drawLabel = function(target, labelText){
  var c = document.getElementById(target);
  var ctx = c.getContext('2d');
  var fontsize = 30*canvasScale.font;
  ctx.font = fontsize.toString()+"px Arial";
  ctx.fillStyle="#ff0000";
  ctx.fillText(labelText, 10, fontsize);
}
//draw an appropriately positioned title for the object-box located at x,y
var drawTitle=function(target, x, y, title){
  var fontHeight = 20*canvasScale.font;
  var c = document.getElementById(target);
  var ctx = c.getContext('2d');
  ctx.font=fontHeight.toString()+"px Arial";
  ctx.fillStyle="#000000";
  ctx.fillText(title, x+defaultBox.width/8*canvasScale.x, y+fontHeight*canvasScale.y);
}
// NOT USED
// draw a smaller box in the top right corner of the parent box at x,y
// var cornerBox=function(target, x, y){
//   x = x + defaultBox.width - 30;
//   var c = document.getElementById(target);
//   var ctx = c.getContext('2d');
//   ctx.fillStyle="#cccccc";
//   ctx.fillRect(x,y,30,20);
// }
var drawStroke=function(target, x1, y1, x2, y2){
  //console.log(target);
  var c = document.getElementById(target);
  var ctx = c.getContext('2d');
  ctx.beginPath();
  ctx.moveTo(x1+defaultBox.width/2*canvasScale.x, y1+defaultBox.height/2*canvasScale.y);
  ctx.lineTo(x2+defaultBox.width/2*canvasScale.x, y2+defaultBox.height/2*canvasScale.y);
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
