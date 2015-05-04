# canvasTools
An attempt to make an automated display of a dataset that is very close to a tree (but is JSON and not aware of that tree type of structure).

Right now this is minimal function, scale, etc. Right now you can 'host' by opening the file in a browser.

#Todo
- Visualize the testdata as it descends the 'tree'
- Scale the image in a meaningful way to the number of nodes in the tree
  - definitely will require vertical scale
  - maybe horizontal
  - how to handle issues that are obviously way too big to be meaningful on a reasonable monitor size
- Connect the datasource to a Mongo instance
  - Include the schema and/or testdata in this repo
- Set up a server with this repo for the purpose of having Mongo + Web Server that will simulate the normal operational relationship
- Learn how to and implement automated testing
- Set watchers to react to the boxes (nodes) being clicked in a useful manner
  - Useful manner ultimately means showing detail and allowing the user to edit
- More I'm sure
