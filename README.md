# canvasTools
An attempt to make an automated display of a dataset that is very close to a tree (but is JSON and not aware of that tree type of structure).

Right now this is minimal function, scale, etc. Right now you can 'host' by opening the file in a browser.
- From a very quick stab at a simple express and nginx, I had issues getting this to render (just the <canvas> element, nevermind the rest of it)

#Todo
- Scale the image in a meaningful way to the number of nodes in the tree
  - definitely will require vertical scale
  - maybe horizontal (this gets crazier faster due to the normality of vertical scrolling in our web-life)
- Establish interactivity of the visualization
  - have to create children and rebalance the depth of the child dynamically to draw them each in the right spot
  - starting to look more and more like this will require a CSS to go with, but trying to avoid (ref: canary yellow 'modal')
- Connect the datasource to a Mongo instance
  - The existing 'test' data was pulled by db.collection.find(); so it should at least be fairly high integrity for my testing
    - your mileage may vary, of course
- Set up a server with this repo for the purpose of having Mongo + Web Server that will simulate the normal operational relationship
- Add a save button by which to update the existing nodes through the 'modal'
- TBD
