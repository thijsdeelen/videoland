// Authenticator wordt gebruikt om te authoriseren via JWT.
var jwt			= require('jwt-simple');
const moment 	= require('moment');

// Token aanmaken via username en password op inlog.
function encodeToken(username, password) {
    const info = {
        exp: moment().add(1, 'days').unix(),
        iat: moment().unix(),
        sub: username, password
    };
    return jwt.encode(info, process.env.TOPSECRET);
    console.log("[TOKEN] - Encoded token.");
}

// Token terug decoden naar username en password
function decodeToken(token, cb) {

    try {
        const payload = jwt.decode(token, process.env.TOPSECRET);
        const now = moment().unix();

        // Token verlopen?
        if (now > payload.exp) {
            console.log('[VERLOPEN] - Token is verlopen.');
        }

        // Return.
        cb(null, payload);
        console.log('[TOKEN] - Decoded token.');

    } catch (err) {
        cb(err, null);
        console.log("[FAILED] - Token error.");
    }
}

// Exporteer token functies.
module.exports = 
{
    encodeToken,
    decodeToken
};