var async = require('asyncawait/async');
var await = require('asyncawait/await');
var TokenDAO = require("./dao/token-dao").TokenDAO;
var LWTAuth = require("./oauth2/lwa-oauth2-refreshtoken-client");
var Utils = require("./utils/utils");
var Logger = Utils.Logger;

exports.handler = async(function(event, context, callback){
    try{
        Logger.logDebug("Handling refresh token");
        Logger.logDebug("ClientId: "+process.env.CLIENT_ID);
        Logger.logDebug("ClientSecret: "+process.env.CLIENT_SECRET);
        var tokenDao = new TokenDAO();
        var tokenInfo = await( tokenDao.getTokenInfoByClientId(process.env.CLIENT_ID) );
        Logger.logDebug("Current token info: "+JSON.stringify(tokenInfo));
        var tokens = await( LWTAuth.refreshTokensLWT(process.env.CLIENT_ID, process.env.CLIENT_SECRET, tokenInfo.refreshToken) );
        Logger.logDebug("New token info: "+JSON.stringify(tokens));
        await(
            tokenDao.addToTokenTable(
                process.env.CLIENT_ID, process.env.CLIENT_SECRET, 
                tokens.token_type, tokens.access_token, 
                tokens.refresh_token, tokens.expires_in
            )
        );
        Logger.logDebug("Token info saved OK");
        callback(null, "OK");
    }catch(exc){
        Logger.logError(exc);
        callback(exc);
    }    
});