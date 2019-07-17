const fs = require('fs');
const path = require('path');
const constants = require('./constants');

module.exports = pluginContext => {
    let user = null;
    const inputFile = path.join(pluginContext.cwd, constants.sendToFile);
    return {
        respondsTo: (query = '', env = {}) => {
            try {
                const text = fs.readFileSync(inputFile);
                user = JSON.parse(text);
                const currentTime = Math.floor(Date.now()/1000);
                if (currentTime - user.time > constants.timeout) {
                    throw 'timeout';
                }
                return user.id && (user.name || user.handle) && user.email;
            } catch (err) {
                try {
                    fs.unlinkSync(inputFile);
                } catch {}
                return false;
            }
        },
        search: (msg, env = {}) => {
            return new Promise((resolve, reject) => {
                resolve(
                    user
                        ? [
                              {
                                  id: 'goodos',
                                  icon: user.avatar,
                                  title: `Send goodos to @${user.name || user.handle}`,
                                  subtitle: `Preview: @${user.name || user.handle} ${msg || '<message>'}`,
                                  value: JSON.stringify({ user, msg }),
                              },
                              {
                                  id: 'goodos-cancel',
                                  icon: 'fa-times',
                                  title: `Cancel`,
                                  subtitle: 'Do not send goodos at this time',
                                  value: constants.cancelText,
                              },
                          ]
                        : [],
                );
            });
        },
    };
};
