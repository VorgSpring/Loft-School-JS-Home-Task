var usersModule = require('./users');

module.exports = {
    /**
     * Создаёт и отправляет сообщение о новом зарегистрированном пользователе
     * @param {string} login
     */
    createAuthorizationMessage: function (login) {
        var user = usersModule.searchUser(login, true);
        var message = {
            type: 'authorization',
            name: user.name,
            id: user.id
        };

        usersModule.sendToAllUsers(message);
    },

    /**
     * Создаёт и отправляет сообщение о неудачной регистрации
     * @param {Object} ws
     */
    createFailedAuthorizationMessage: function (ws) {
        var message = {
                type: 'failedAuthorization',
                text: 'Пользователь с таким логином уже в сети!'
            };
        ws.send(JSON.stringify(message));
    }
};

