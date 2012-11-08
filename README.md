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

Add Gemfile for sass
add .sasscache to gitignore

move App-object to a file  + add shortcut for templates like this:

App = 
  supportedLanguages: ["de"] # for each supported language there needs to be a translation hash in translations.coffee and a data.$langauge.json in public
  locale: navigator.language[0..1] # use the device/navigator language
  events: _.extend {}, Backbone.Events # EventBus for App
  trigger: (events, payload) -> App.events.trigger(events, payload)
  on: (events, callback, context) -> App.events.on(events, callback, context)
  t: (key, placeholders) -> # i18n function
    return window.translations[App.locale][key] unless placeholders?
    _.template(window.translations[App.locale][key], placeholders, interpolate: /\{\{(.+?)\}\}/g)  
class App.View extends Backbone.View
  template: (context) ->
    context = {} unless context?
    context.t = App.t
    @tmpl = JST[@tmpl] if typeof @tmpl != "function"
    @tmpl(context)