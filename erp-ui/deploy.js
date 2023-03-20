var sftp = require('node-sftp-deploy');
sftp({
  "host": "167.71.39.235",
  "port": "22",
  "user": "gbar",
  "pass": "123QweAs",
  "remotePath": "./gbar.digitize.ee/test",
  "sourcePath": "./public"
}, function(){
  console.log('good');
});


