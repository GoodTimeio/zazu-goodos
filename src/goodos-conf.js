const fs = require('fs');
const path = require('path');
const constants = require('./constants');
module.exports = pluginContext => {
    try {
        fs.unlinkSync(path.join(pluginContext.cwd, constants.sendToFile));
    } catch {}
    return (param, env = {}) => {
        return new Promise((resolve, reject) => {
            resolve(
                [{
                    id: 'goodos-conf',
                    icon: 'fa-user-circle',
                    title: `Set your user id to use with goodos`,
                    subtitle: `${param}`,
                    value: param,
                }],
            );
        });
    };
};
