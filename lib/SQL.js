const logger = require('./logger');
const FileManager = require('./manageFiles');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var connection;

function connect(config) {
    return new Promise(function (resolve, reject) {
        connection = new Connection(config);

        //connection.on('error', reject("Error"));

        connection.connect(function (err) {
            if (err) {

            } else {
                resolve("done")
            }
        });
    })
};

function disconnect() {
    return new Promise(function (resolve, reject) {
        connection.close()
        connection.cancel()

        connection.on('end', function (err) {
            resolve("done")
        });
        //connection.on('error', reject("Error"))
    });
};


function query(query) {
    return new Promise(function (resolve, reject) {
        try {
            var result = [];
            var resultValue = {
                columnTitle: [],
                line: []
            };
            // If no error, then good to go...
            const request = new Request(query, function (err, rowCount, rows) {
                //logger.log('Numero righe ' + rowCount)
                if (!err) {
                    //console.log(err);
                    reject("Request error " + err);
                }
            });

            request.on('row', function (columns) {
                 if (resultValue.line.length == 2000) {
                    logger.warning("Attenction the rows exceeded the maximum value", "SQL")
                    //connection.cancel()
                    //resolve(resultValue)
                }
                //console.log(resultValue.line.length)
                result = [];
                columns.forEach(function (column) {//cycle every filed of a row
                    if (column.value === null) {
                        result.push('NULL');
                    } else {
                        result.push(column.value);
                    }
                });
                resultValue.line.push(result);

                if (resultValue.line.length == 200) {
                    //resolve(resultValue)
                    resultValue.line=[];
                } 
            });

            connection.on('end', function (rowCount, more) {
                //resolve(resultValue)
            });

            request.on('columnMetadata', function (columns) {

                var names = [];
                columns.forEach(function (column) {//cycle every filed of a row
                    names.push(column.colName);
                });
                resultValue.columnTitle.push(names);
            });

            request.setTimeout(0);
            connection.execSql(request);
        }
        catch (err) {
            reject("error " + err);
        }


    });
}

exports.connect = connect;
exports.disconnect = disconnect;
exports.query = query;