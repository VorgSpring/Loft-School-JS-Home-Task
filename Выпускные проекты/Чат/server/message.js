var usersModule = require('./users');

module.exports = {
    /**
     * Список сообщений
     * @type {Array}
     */
    chatMessage: [],

    /**
     * Создаёт новое сообщение в чат
     * @param {object} user
     * @param {string} text
     */
    createNewMessage: function (user, text) {
        var message = {
            type: 'newMessage',
            name: user.name,
            id: user.id,
            photo: user.photo,
            date: new Date(),
            text: text
        };
        this.chatMessage.push(message);
        return message;
    },

    /**
     * Создаёт сообщение о новом имени пользователя
     * @param {string} name
     * @param {number} id
     */
    changeName: function (name, id) {
        // Меняем имя в сообщениях
        this.chatMessage.forEach(function (message) {
            if(message.id === id) {
                message.name = name;
            }
        });
        return {
            type: 'changeName',
            id: id,
            name: name
        };
    },

    /**
     * Создаёт сообщение о новом фото пользователя
     * @param {number} id
     * @param {string} photo
     */
    changePhoto: function (id, photo) {
        return {
            type: 'changePhoto',
            id: id,
            photo: photo
        };
    },

    /**
     * Создаёт сообщение о том, что пользователь покинул чат
     * @param {number} id
     */
    deleteUser: function (id) {
        return {
            type: 'deleteUser',
            id: id
        };
    },

    /**
     * Создаёт и отправляет сообщение с информацией об id, о фото и о уже подключенных пользователях
     * @param {object} user
     * @param {string} usersOnline
     * @param {object} ws
     */
    sendInfo: function (user, usersOnline, ws) {
        var message = {
            type: 'information',
            id: user.id,
            photo: user.photo,
            users: usersOnline
        };
        ws.send(JSON.stringify(message));
    },

    /**
     * Создаёт и отправляет сообщение с информацией о имеющихся в чате сообщениях
     * @param {object} ws
     */
    sendOldMessage: function (ws) {
        var oldMessage = JSON.stringify(this.chatMessage);
        var message = {
            type: 'oldMessage',
            massage: oldMessage
        };
        ws.send(JSON.stringify(message));
    }
};
