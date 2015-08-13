$(document).ready(function() {

  var devices = $('.device').bootstrapSwitch();

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

  devices.on('switchChange.bootstrapSwitch', function(event, state) {
    socket.emit('deviceoperate', this.getAttribute("id"));
  });

  socket.on('gDoorStateDetected', function(data){
    alert('GDSD: ' + data);
  });

  socket.on('deviceoperated', function(data) {
    var resp = JSON.parse(data);
    var id = resp.id;
    var state = resp.state;
    var device = $("#"+id);
    if(device.bootstrapSwitch("state")!=state){
      device.bootstrapSwitch('state', state, true);
    }
    device.attr("data-state", state);
    var devicets = device.parent().parent().next("div").find("em");
    devicets.text(resp.changed);
  });
});
