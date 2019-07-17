const fs = require('fs');
const path = require('path');
const constants = require('./constants');
module.exports = pluginContext => {
    try {
        fs.unlinkSync(path.join(pluginContext.cwd, constants.sendToFile));
    } catch {}
    return (param, env = {}) => {
        try {
            const inputFile = fs.readFileSync(path.join(pluginContext.cwd, constants.usersFile));
            const users = JSON.parse(inputFile);
            return new Promise((resolve, reject) => {
                try {
                    const whoamiFile = fs.readFileSync(path.join(pluginContext.cwd, constants.whoamiFile));
                    const whoami = JSON.parse(whoamiFile);
                    if (!whoami.id) {
                        throw 'not configured';
                    }

                    const filteredUsers = users.filter(
                        user =>
                            (user.name.toLowerCase().includes(param.toLowerCase()) ||
                                user.handle.toLowerCase().includes(param.toLowerCase())) &&
                            user.id !== whoami.id,
                    );
                    resolve(
                        filteredUsers.map(user => ({
                            id: 'goodos',
                            icon: user.avatar,
                            title: `${user.name || user.handle}`,
                            subtitle: `Send goodos to ${user.name || user.handle}`,
                            value: user,
                        })),
                    );
                } catch (err) {
                    resolve([
                        {
                            id: 'goodos',
                            icon: 'fa-exclamation-triangle',
                            title: 'Goodos: Please set your user id first',
                            subtitle: 'Copy user id from slack and then do "gconf <user id>" to configure',
                            value: constants.cancelText,
                        },
                    ]);
                }
            });
        } catch (err) {
            resolve([
                {
                    id: 'goodos',
                    icon: 'fa-exclamation-triangle',
                    title: 'Could not sync slack users',
                    value: constants.cancelText,
                },
            ]);
        }
    };
};
