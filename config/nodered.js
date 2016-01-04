/**
 * Created by admin on 1/4/16.
 */
var RED = require("node-red");
var settings = require('./settings');

function init(server, app){

  console.log(settings.nodered);

  // Initialise the runtime with a server and settings
  RED.init(server, settings.nodered);

  // Serve the editor UI from /red
  app.use(settings.nodered.httpAdminRoot, RED.httpAdmin);

  // Serve the http nodes UI from /api
  app.use(settings.nodered.httpNodeRoot, RED.httpNode);

}

function start(){
  // Start the runtime
  RED.start();
  console.log("Red starting...");
}

module.exports = {
  init: init,
  start: start
};
