const fs = require('fs');
const path = require('path');
const constants = require('./constants');
const axios = require('axios');

module.exports = pluginContext => {
    return (data, env = {}) => {
        const outputFile = path.join(pluginContext.cwd, constants.sendToFile);
        const whoamiFile = path.join(pluginContext.cwd, constants.whoamiFile);
        return new Promise((resolve, reject) => {
            if (data !== constants.cancelText) {
                data = JSON.parse(data);
                try {
                    const whoamiText = fs.readFileSync(whoamiFile);
                    const whoami = JSON.parse(whoamiText);
                    if (data.msg && data.user && whoami.id) {
                        
                        const url = `${env.goodosApi}?key=${env.goodosApiKey}`;
                        pluginContext.console.log('info', url, {data, whoami});
                        return axios.post(url, {
                            senderID: whoami.id,
                            receiverID: data.user.id,
                            message: data.msg,
                        }).then((response) => {
                            pluginContext.console.log('info', 'response', response);
                            pluginContext.console.log('info', url, {data, whoami});
                            resolve(`@${data.user.name || data.user.handle} ${data.msg}`);
                        }).catch((err) => {
                            pluginContext.console.log('error', 'could not send goodos', err);
                            resolve('Could not send goodos');        
                        });
                    }
                } catch (err) {
                    pluginContext.console.log('error', 'could not send goodos', err);
                    resolve('Could not send goodos');
                }
                
            } else {
                resolve('Did not send goodos');
            }
            try {
                fs.unlinkSync(outputFile);
            } catch {}
        });
    };
};
