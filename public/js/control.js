$(document).ready(function() {
  var devices = $('.device').bootstrapSwitch();
  var devicebs = $('.deviceb');
  var cpickers = $('.basic').spectrum({showAlpha: true});
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

  cpickers.on('change.spectrum', function(event, color){
    var data = {
      deviceid: $(this).parent().find('.device').attr('id'),
      cmd: this.getAttribute("data-cmd"),
      hex: color.toHexString(),
      updateState: false,
      source: 'jsWebsocket',
      notify: false
    };
    socket.emit('deviceoperate', data);
  });

  devicebs.on('click', function() {
    var data = {
      deviceid: this.getAttribute("id"),
      cmd: this.getAttribute("data-cmd"),
      updateState: true,
      source: 'jsWebsocket',
      notify: false
    };
    socket.emit('deviceoperate', data);
  });

  devices.on('switchChange.bootstrapSwitch', function(event, state) {
    var data = {
      deviceid: this.getAttribute("id"),
      cmd: this.getAttribute("data-cmd"),
      updateState: true,
      source: 'jsWebsocket',
      notify: false
    };
    socket.emit('deviceoperate', data);
  });

  socket.on('deviceoperated', function(data) {
    var resp = JSON.parse(data);
    var device = $("#" + resp.id);
    if(device.hasClass('device') && device.bootstrapSwitch("state") != resp.state ) {
      device.bootstrapSwitch('state', resp.state, true);
    }
    device.attr("data-state", resp.state);
    //device.parent().parent().next("div").find("em").text(resp.changed);
    var deviceEm = $("#em_" + resp.id);
    deviceEm.text(resp.changed);
  });
});
