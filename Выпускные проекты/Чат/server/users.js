var messageModule = require('./message');

var user = {
    /**
     * id нового пользователя, меняется при создании нового пользователя
     * @type {number}
     */
    id: 0,
    /**
     * Cписок участников чата
     * @type {Array}
     */
    usersList: [],

    /**
     * Список online участников чата 
     * @type {Array}
     */
    usersOnline: [],

    /**
     * Архив пользователей
     * @type {Array}
     */
    archiveUsers: [],

    /**
     * Ищет, по id или login, в архиве или списке online, пользователя и возвращяет его
     * @param {string, number} loginOrId
     * @param {boolean} online
     * @return {Object}
     */
    searchUser: function (loginOrId, online) {
        online = online || false;
        var user = null;
        
        // Определяем тип переданного параметра
        var type = typeof loginOrId;
        
        // Если парамерт строка, передан был login
        if(type === 'string') {
            if(online) {
                this.usersOnline.some(function(userOnline){
                    if(userOnline.login === loginOrId){
                        user = userOnline;
                        return true;
                    }
                });
            } else {
                this.archiveUsers.some(function(archiveUser){
                    if(archiveUser.login === loginOrId){
                        user = archiveUser;
                        return true;
                    }
                });
            }
        } else if(type === 'number'){ 
            // Если парамерт число, то передан был id
            this.archiveUsers.some(function(archiveUser){
                if(archiveUser.id === loginOrId){
                    user = archiveUser;
                    return true;
                }
            });
        }

        return user;
    },

    /**
     * Создаёт нового пользователя
     * @param {string} name
     * @param {string} login
     * @param {object} ws
     */
    createNewUser: function (name, login, ws) {
        var newUser = {
            id: this.id++,
            name: name,
            login: login,
            photo: ''
        };
        // Отправляем информацию
        this.sendInfo(newUser, ws);
        // Добавляем в архив
        this.archiveUsers.push(newUser);
        // Добавляем в список online пользователей
        this.usersOnline.push(newUser);
    },

    /**
     * Меняет имя пользователя и отправляет сообщение о новом имени
     * @param {string} name
     * @param {number} id
     */
    changeName: function (name, id) {
        // Ищем пользователя и меняем у него поле name
        // Меняем имя в архиве
        this.archiveUsers.forEach(function (user) {
            if (user.id === id)
                user.name = name;
        });

        // Меняем имя в списке online пользователей
        this.usersOnline.forEach(function (user) {
            if (user.id === id)
                user.name = name;
        });

        var message = messageModule.changeName(name, id);
        this.sendToAllUsers(message);
    },

    /**
     * Меняет фото пользователя и отправляет сообщение о новом фото
     * @param {number} id
     */
    changePhoto: function (id) {
        var message = null;
        // Меняем фото в списке online пользователей
        this.usersOnline.forEach(function (user) {
            if(user.id === id) {
                user.photo = 'image/users/' + id + '.jpg';
            }
        });
        // Меняем фото в архиве и фотрмируем сообщение
        this.archiveUsers.forEach(function (user) {
            if(user.id === id) {
                user.photo = 'image/users/' + id + '.jpg';
                message = messageModule.changePhoto(id, user.photo);
            }
        });

        this.sendToAllUsers(message);
    },

    /**
     * Отправляет сообщение всем пользователям
     * @param {Object} message
     */
    sendToAllUsers: function (message) {
        var messageJSON = JSON.stringify(message);
        this.usersList.forEach(function (user) {
            user.send(messageJSON);
        });
    },

    /**
     * Создаёт и отправляет сообщение с информацией
     * @param {object} user
     * @param {object} ws
     */
    sendInfo: function (user, ws) {
        var usersOnline = this.usersOnline.map(function (userOnline) {
            return {
                name: userOnline.name,
                id: userOnline.id
            };
        });

        messageModule.sendInfo(user, JSON.stringify(usersOnline), ws);
    },

    /**
     * Создаёт и отправляет новое сообщение в чат
     * @param {number} id
     * @param {string} text
     */
    createNewMessage: function (id, text) {
        var user = this.searchUser(id);
        var message = messageModule.createNewMessage(user, text);
        this.sendToAllUsers(message);
    },

    /**
     * Удаляет пользователя и отправляет сообщение о том, что он покинул чат
     * @param {string} login
     * @param {object} ws
     */
    deleteUser: function (login, ws) {
        // Ищем пользователя по login
        var user = this.searchUser(login);
        // Удаляем из списка online пользователей
        this.usersOnline.exterminate(user);
        // Удаляем соединение
        this.usersList.exterminate(ws);
        // Отправляем сообщение о том, что пользователь покинул чат
        var message = messageModule.deleteUser(user.id);

        this.sendToAllUsers(message);
    }
};

/**
 * Удаляет из массива элемент по его значению
 * @param {object} value
 */
Array.prototype.exterminate = function (value) {
    this.splice(this.indexOf(value), 1);
};

module.exports = user;

