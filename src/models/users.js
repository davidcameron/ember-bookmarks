var fastLegsBase = require('FastLegS'),
    fastLegs = new fastLegsBase('pg'),
    Q = require("q"),
    passwordHash = require('password-hash');

var connectionParams = {
    user: 'postgres',
    password: 'darwin123',
    database: 'unminder',
    host: 'localhost',
    port: '5432'
};

fastLegs.connect(connectionParams);

var User = fastLegs.Base.extend({
    tableName : 'users',
    primaryKey : 'id'
});

function create (data) {
    var deferred = Q.defer();
    data.password_hash = passwordHash.generate(data.password);
    

    User.create(
        {
            email: data.email,
            name: data.name,
            password_hash: data.password_hash
        }, function (err, results) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(results.rows[0]);
            }
        }
    );

    return deferred.promise;
}

function findOne (id) {
    var deferred = Q.defer();
    
    User.find({id: id}, function (err, results) {
        deferred.resolve(results[0]);
    });

    return deferred.promise;
}

function update (id, data) {
    var deferred = Q.defer();
    
    User.update(
        {id: id},
        data,
        function (err, results) {
            findOne(id).then(deferred.resolve);
        }
    );

    return deferred.promise;
}

function destroy (id) {
    var deferred = Q.defer();

    User.destroy({id: id}, function (err, results) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(results);
        }
    });

    return deferred.promise;
}

exports.findOne = findOne;
exports.create = create;
exports.update = update;
exports.destroy = destroy;
