const fs = require('fs');
const path = require('path');
const constants = require('./constants');

module.exports = pluginContext => {
    const outputFile = path.join(pluginContext.cwd, constants.sendToFile);
    return (data, env = {}) => {
        return new Promise((resolve, reject) => {
            if (data === constants.cancelText) {
                resolve(null);
            }
            const newData = {...data, time: Math.floor(Date.now()/1000)}
            fs.writeFileSync(outputFile, JSON.stringify(newData));
            resolve(data);
        });
    };
};
