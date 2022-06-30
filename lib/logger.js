const { Console } = require('console');
const fs = require('fs');
var datamanager = require('./manageFiles.js');
var time = require('./time.js');
const LOG_PATH = './LOG/'


module.exports = {
    warning: function (logtext, channel = "") {
        makeLog(logtext, 1, channel)
    },
    error: function (logtext, channel = "") {
        makeLog(logtext, 2, channel)
    },
    info: function (logtext, channel = "") {
        makeLog(logtext, 0, channel)
    },
    log: function (logtext) {
        var log = time.Date() + '\t' + time.Time() + '\t \t \t' + logtext;
        console.log(log)
    },
};


function makeLog(logtext, type, channel) {
    var log = time.Date() + '\t' + time.Time() + '\t' + channel + '\t' + getTypeLog(type) + '\t' + logtext;
    var filename = LOG_PATH + time.Date() + '_LOG.log';

    switch (getTypeLog(type)) {
        case "ERRO":
            console.error(log);
            break;

        case "WARN":
            console.warn(log);
            break;

        default:
            console.log(log);
            break;
    }



    if (!fs.existsSync(LOG_PATH)) { //create the log folder if not exists
        fs.mkdirSync(LOG_PATH, { recursive: true });
    }
    datamanager.append(filename, log + "\n");
}

function getTypeLog(num) {
    if (num == 1)
        return "WARN"
    else if (num == 2)
        return "ERRO"
    else
        return "INFO"
}


