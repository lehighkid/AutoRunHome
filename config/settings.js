/**
 * Created by admin on 11/23/15.
 */
// expose our settings directly to our application using module.exports
module.exports = {
  milight: {
    wifiboxip: '10.0.1.',
    wifiboxport: '8899'
  },
  razberry: {
    zboxip: '10.0.1.',
    zboxport: '8083',
    zpath: 'ZWaveAPI/Run/devices[0].instances[0].commandClasses[98].Set({0})'
  },
  nest: {
    execcmd: 'nest --conf /home/pi/commands/nest.conf temp'
  },
  rfcodesend: {
    execcmd: 'sudo /home/pi/commands/rfoutlet/codesend {0}'
  },
  lightshowpi: {
    execcmd: 'sudo python /home/pi/lightshowpi/py/hardware_controller.py --light {0} --state {1}'
  },
  gdoor: {
    execpin: '16',
    closedpin: '22',
    openedpin: '25',
    deviceid: ''

  },
  dasher: {
    cottonelle: "",
    dashes: ""
  }
};
