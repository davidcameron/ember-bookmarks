var crud_read = require('./models/read'),
    Q = require('q');

function read (params) {
    var defer = Q.defer();
    console.log(params[0]);
    if (params[0] === 'sites') {
        console.log('api read');
        crud_read.read().then(function (data) {
            console.log('in api');
            var response = {sites: data};
            var json = JSON.stringify(response);

            defer.resolve(json);
        });
    }

    return defer.promise;
}

exports.read = read;