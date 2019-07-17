const constants = require('./constants');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports = pluginContext => {
    const outputFile = path.join(pluginContext.cwd, constants.usersFile);
    return (env = {}) => {
        const url = `${constants.slack}?token=${env.oauthToken}`;
        pluginContext.console.log('info', url);
        return axios
            .get(url)
            .then(response => {
                const userData = response.data.members
                    .filter(
                        user =>
                            user.id !== 'USLACKBOT' &&
                            !user.deleted &&
                            !user.is_restricted &&
                            !user.is_bot &&
                            !user.is_ultra_restricted,
                    )
                    .map(user => ({
                        id: user.id,
                        email: user.profile.email,
                        name: user.profile.real_name,
                        handle: user.profile.display_name,
                        avatar: user.profile.image_48,
                    }));
                return fs.writeFileSync(outputFile, JSON.stringify(userData));
            })
            .catch(() => null);
    };
};
