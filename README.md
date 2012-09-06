Install
========
Clone the repository and then run ´npm install -g´ to install the wunderland binary globally.

Dependencies
=========
You'll need compass/sass, node, coffeescript ....

Create new wunderland app
========
To create a new wunderland app simply use ´wunderland create MyAwesomeApp´.
It will create a new directory "MyAwesomeApp", give you a skeleton and install all dependencies. ´cd´ into the folder and run ´cake -w server´ to startup a development server and start watching .sass and .coffee files.

Usage
========
Run ´cake -w server´ to start developing. It will start a local server on localhost:3001. If your ready to deploy just push it to heroku (see the Procfile) or copy the contents of the "public" folder to use it in phonegap or as a static asset....


Todo
========
Better documentation, better code... This is very much just a tool that I refactored out of one of my iPhone/phonegap apps.