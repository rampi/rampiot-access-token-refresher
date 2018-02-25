var async = require('asyncawait/async');
var await = require('asyncawait/await');
var request = require('request');
var config = require("./../config/configuration.json");
var Q = require('q');

var requestAccessToken = function(clientId, clientSecret, refreshToken, callback){
    var deferred = Q.defer();
    var credentials = new Buffer(clientId+":"+clientSecret).toString('base64');    
    var fData = "grant_type=refresh_token&refresh_token="+refreshToken;
    var cLength = fData.length;
    var options = {
        uri: config.lwtTokenURL,
        method: 'POST',
        headers:{
            'Content-Length': cLength,
            'Authorization': "Basic "+credentials,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: fData
    };
    request(options, function (error, response, body) {
        var jsonBody = JSON.parse(body);                
        if( error ){
            deferred.reject(error);
        }
        else if(response.statusCode === 200 ){
            deferred.resolve(jsonBody);
        }else{
            deferred.reject(jsonBody);
        }
    });
    return deferred.promise.nodeify(callback);
};

exports.refreshTokensLWT = async(function(clientId, clientSecret, refreshToken){
    return await(requestAccessToken(clientId, clientSecret, refreshToken));
});