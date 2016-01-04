/**
 * Created by admin on 11/23/15.
 */
// expose our settings directly to our application using module.exports
module.exports = {
  milight: {
    wifiboxip: '10.0.1.7',
    wifiboxport: '8899'
  },
  mqtt: {
    rftopic: 'codesend/{0}/{1}',
    lsptopic: 'lightshowpi/{0}/{1}',
    gpiotopic: 'gpio/{0}/{1}',
    cmdtopic: 'cmd/{0}/{1}',
    broker: 'mqtt://10.0.1.4:1883'
  },
  sammytv: {

  }
};
