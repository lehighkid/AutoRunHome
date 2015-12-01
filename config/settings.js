/**
 * Created by admin on 11/23/15.
 */
// expose our settings directly to our application using module.exports
module.exports = {
  milight: {
    wifiboxip: '127.0.0.1',
    wifiboxport: '8899'
  },
  razberry: {
    zboxip: '127.0.0.1',
    zboxport: '8083',
    zpath: 'ZWaveAPI/Run/devices[1].instances[0].commandClasses[98].Set({0})'
  },
  nest: {
    execcmd: 'nest --conf /home/pi/commands/nest.conf temp'
  },
  rfcodesend: {
    execcmd: 'sudo /home/pi/commands/rfoutlet/codesend {0}'
  },
  gdoor: {
    execpin: '1',
    closedpin: '2',
    openedpin: '3',
    deviceid: 'deviceid'

  }
};
