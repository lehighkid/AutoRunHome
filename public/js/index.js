$(document).ready(function() {

    var socket = io.connect();

    $('#gDoor').click(function() {
      var selectedID = $(this).attr("id");
      socket.emit('gDoor', selectedID);
    });

    $('.rfdev').click(function() {
      var device = {};
      device.id = $(this).attr("id");
      device.codes = $(this).attr("codes").split(",");
      device.state = $(this).text();
      var json = JSON.stringify(device);
      alert(json);
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
      $("#"+id).text(state);
    });
});
