const fs = require('fs');
const path = require('path');
const constants = require('./constants');

module.exports = pluginContext => {
    const outputFile = path.join(pluginContext.cwd, constants.whoamiFile);
    return (userId, env = {}) => {
        return new Promise((resolve, reject) => {
            fs.writeFileSync(outputFile, JSON.stringify({ id: userId }));
            resolve(data);
        });
    };
};
