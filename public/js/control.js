$(document).ready(function() {
  var devices = $('.device').bootstrapSwitch();
  var socket = io.connect();

  $('.togcam').click(function(){
    var cam = $(this).parent().find(".wcam");
    if (cam.attr("src") != cam.attr("data-src")) {
      cam.attr("src", cam.attr("data-src"));
      cam.show();
    } else {
      cam.hide();
      cam.attr("src", '');
    }
  });

  devices.on('switchChange.bootstrapSwitch', function(event, state) {
    socket.emit('deviceoperate', this.getAttribute("id"));
  });

  socket.on('deviceoperated', function(data) {
    var resp = JSON.parse(data);
    var device = $("#" + resp.id);
    if(device.bootstrapSwitch("state") != resp.state ) {
      device.bootstrapSwitch('state', resp.state, true);
    }
    device.attr("data-state", resp.state);
    device.parent().parent().next("div").find("em").text(resp.changed);
  });
});
