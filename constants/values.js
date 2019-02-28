const path = require('path');
module.exports.MILLISECONDS_ID_DAY = 86400000;
module.exports.ANGULAR_IP = process.env.ANGULAR_IP || `http://192.168.0.131:4201`;
module.exports.MAIN_PATH = path.dirname(require.main.filename || process.mainModule.filename);
module.exports.ADMIN_ROLES = 'administrator moderator';
module.exports.BLOCKED_ROLES = 'candidate customer';