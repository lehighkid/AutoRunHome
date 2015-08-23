/**
 * Created by admin on 8/23/15.
 */

function set_source(f, target){
  f();
  target.text(f.toString())
}

function callback_example(){
  var cw = Raphael.colorwheel($("#callback_example .colorwheel")[0],150),
    onchange_el = $("#callback_example .onchange"),
    ondrag_el = $("#callback_example .ondrag");
  cw.color("#F00");

  function start(){ondrag_el.show()}
  function stop(){ondrag_el.hide()}

  cw.ondrag(start, stop);
  cw.onchange(function(color)
  {
    var colors = [parseInt(color.r), parseInt(color.g), parseInt(color.b)]
    onchange_el.css("background", color.hex).text("RGB:"+colors.join(", "))
  })

}

$(document).ready(function(){
  set_source(callback_example, $("#callback_example .source"));

});
