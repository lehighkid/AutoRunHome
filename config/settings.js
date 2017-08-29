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
    ctrltopic: 'home/controllers/{0}/{1}/control',
    rftopic: 'codesend/{0}/{1}',
    irtopic: 'irsend/{0}/{1}',
    wemotopic: 'wemo/{0}/{1}',
    alarmtopic: 'c232/alarm/{0}',
    lsptopic: 'lightshowpi/{0}/{1}',
    gpiotopic: 'gpio/{0}/{1}',
    cmdtopic: 'cmd/{0}/{1}',
    doortopic: 'door/{0}/{1}',
    zwavetopic: 'zwave/{0}/{1}/{2}',
    horntopic: 'goal/{0}/{1}',
    grptopic: 'group/{0}/{1}',
    host: 'acdrago.com',
    port: '8883',
    key: '/users/aarondrago/CA/private/local.client.key',
    cert: '/users/aarondrago/CA/certs/local.client.crt',
    ca: '/users/aarondrago/CA/ca/ca.crt',
    sonofftopic: 'cmnd/{0}/power{1}',
    ospitopic: 'ospi/control/{0}/{1}/{2}'
  },
  sammytv: {

  },
  nodered: {
    httpAdminRoot: "/red",
    httpNodeRoot: "/api",
    userDir: "/Users/aarondrago/.nodered-i/",
    nodesDir: '/Users/aarondrago/.nodered-i/nodes',
    functionGlobalContext: {/*'guidModule':require('guid')*/ }    // enables global context
  }
};
