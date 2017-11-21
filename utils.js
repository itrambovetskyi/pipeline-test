const jwt = require('jsonwebtoken');
const fs = require('fs');

class Utils {

    static createJwt (projectId, privateKeyFile, algorithm = 'RS256') {
        const token = {
            'iat': parseInt(Date.now() / 1000),
            'exp': parseInt(Date.now() / 1000) + 20 * 60,  // 20 minutes
            'aud': projectId
        };
        const privateKey = fs.readFileSync(privateKeyFile);

        return jwt.sign(token, privateKey, { algorithm: algorithm });
    }
}

module.exports = Utils;