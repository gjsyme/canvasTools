# canvasTools
An attempt to make an automated display of a dataset that is very close to a tree (but is JSON and not aware of that tree type of structure).

Right now this is minimal function, scale, etc. Right now you can 'host' by opening the file in a browser.
- From a very quick stab at a simple express and nginx, I had issues getting this to render (just the <canvas> element, nevermind the rest of it)

#Todo
- Scale the image in a meaningful way to the number of nodes in the tree
  - ensure that there is some escape if the data would get too dense for people to read in their window size
    - i really dislike horiztonal scroll as a former windows user
- Connect the datasource to a Mongo instance
  - The existing 'test' data was pulled by db.collection.find(); so it should at least be fairly high integrity for my testing
    - your mileage may vary, of course
- Set up a server with this repo for the purpose of having Mongo + Web Server that will simulate the normal operational relationship
- prioritize putting items under / near their parents and without crazy line crossing in the depthmap or at least drawing
- TBD
