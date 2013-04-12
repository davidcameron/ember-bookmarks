var crud_read = require('./models/read'),
    Q = require('q');

function read (params) {
    var defer = Q.defer();
    console.log(params[0]);
    if (params[0] === 'sites') {
        console.log('api read');
        crud_read.read().then(function (data) {

            var json = JSON.stringify(data);

            defer.resolve(json);
        });
    }

    return defer.promise;
}

exports.read = read;