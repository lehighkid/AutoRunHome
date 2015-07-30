$(document).ready(function() {

    $('.rfdev').bootstrapSwitch();

    var socket = io.connect();

    $('#gDoor').click(function() {
      var selectedID = $(this).attr("id");
      socket.emit('gDoor', selectedID);
    });

  $('.rfdev').on('switchChange.bootstrapSwitch', function(event, state) {
    var device = {};
    device.id = this.getAttribute("id");
    device.codes = this.getAttribute("data-codes").split(",");
    device.state = this.getAttribute("data-state");
    var json = JSON.stringify(device);
    socket.emit('sendrfcode', json);

  });

    $('.rfdev').click(function() {
      var device = {};
      device.id = $(this).attr("id");
      device.codes = $(this).attr("data-codes").split(",");
      device.state = $(this).attr("data-state");
      var json = JSON.stringify(device);
      socket.emit('sendrfcode', json);
    });

    socket.on('gDoorToggled', function(msg) {
	    //alert('gDoorToggled');
	    $('#msg').append('<p>' + msg + '</p>');
    });

    socket.on('stateUpdated', function(data){
      var resp = JSON.parse(data);
      var id = resp.id;
      var state = resp.state;
      //alert(state);
      callbacktriggered = 1;
      if($("#"+id).bootstrapSwitch("state")!=state){
        $("#" + id).bootstrapSwitch('state', state, true);
      }
      $("#"+id).attr("data-state", state);
    });
});
