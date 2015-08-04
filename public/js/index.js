$(document).ready(function() {

  var rfdevs = $('.rfdev').bootstrapSwitch();
  var gdoors = $('.gdoor').bootstrapSwitch();

  var socket = io.connect();

  $('.togcam').click(function(){
    var cam = $(this).parent().find(".wcam");
    if ($(this).attr("alt") == "show camera") {
      cam.attr("src", cam.attr("data-src"));
      $(this).attr("alt", "hide camera");
      cam.show();
    } else {
      cam.hide();
      cam.attr("src", '');
      $(this).attr("alt", "show camera");
    }

  });

  gdoors.on('switchChange.bootstrapSwitch', function(event, state) {
    var door = {};
    door.id = this.getAttribute("id");
    door.state = this.getAttribute("data-state");
    var json = JSON.stringify(door);
    socket.emit('gdtoggle', json);
  });

  socket.on('gdstateupdated', function(data) {
    var resp = JSON.parse(data);
    var id = resp.id;
    var state = resp.state;
    var gdoor = $("#"+id);
    if(gdoor.bootstrapSwitch("state")!=state){
      gdoor.bootstrapSwitch('state', state, true);
    }
    gdoor.attr("data-state", state);
    var gdoorts = gdoor.parent().parent().next("div").find("em");
    gdoorts.text(resp.statechanged);
  });

  rfdevs.on('switchChange.bootstrapSwitch', function(event, state) {
    var device = {};
    device.id = this.getAttribute("id");
    device.codes = this.getAttribute("data-codes").split(",");
    device.state = this.getAttribute("data-state");
    var json = JSON.stringify(device);
    socket.emit('rfsendcode', json);
  });

  socket.on('rfstateupdated', function(data){
    var resp = JSON.parse(data);
    var id = resp.id;
    var state = resp.state;
    var rfdev = $("#"+id);
    if(rfdev.bootstrapSwitch("state")!=state){
      rfdev.bootstrapSwitch('state', state, true);
    }
    rfdev.attr("data-state", state);
    var rfdevts = rfdev.parent().parent().next("div").find("em");
    rfdevts.text(resp.statechanged);
  });
});
