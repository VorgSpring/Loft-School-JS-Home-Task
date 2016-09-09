var http = require('http');
var Static = require('node-static');
var WebSocketServer = new require('ws');
var usersModule = require('./users');
var messageModule = require('./message');
var authorizationModule = require('./authorization');
var photoModule = require('./photo');

// Создаём WebSocket-сервер на порту 8081
var webSocketServer = new WebSocketServer.Server({
    port: 8081
});

// Создаём обычный сервер (статика) на порту 8080
var fileServer = new Static.Server('..');
http.createServer(function (req, res) {
    fileServer.serve(req, res);
}).listen(8080);

// Обработчик нового соединения
webSocketServer.on('connection', function (ws) {
    // Обработчик входящих сообщений
    ws.on('message', function (message) {
        // Обрабатываем JSON
        var data = JSON.parse(message);

        // Если поступило сообщение о новой регистрации
        if(data.type === 'authorization') {
            // Проверяем есть-ли online пользователь с таким-же login
            var checkLogin = usersModule.searchUser(data.login, true);
            // Если есть отправляем сообщение о неудачной регистрации
            if(checkLogin) {
                authorizationModule.createFailedAuthorizationMessage(ws);
            } else {
                // Добавляем соединение в список участников чата
                usersModule.usersList.push(ws);

                // Ищем пользователя, с введенным login, в архиве зарегистрированных пользователей
                var restoredUser = usersModule.searchUser(data.login);

                // Если пользователь существует, то добавляем его в список online пользователей
                if(restoredUser){
                    // Если при входе пользователь указал другое имя, то меняем имя
                    if(restoredUser.name !== data.name){
                        usersModule.changeName(data.name, restoredUser.id);
                    }

                    // Предаём пользователю информацию об id и о фото
                    usersModule.sendInfo(restoredUser, ws);

                    // Добавляем в список online пользователей
                    usersModule.usersOnline.push(restoredUser);
                } else {
                    // Если пользователь не найден, то создаём нового пользователя
                    usersModule.createNewUser(data.name, data.login, ws);
                }

                // Отправляем сообщение о том, что добавился новый пользователь
                authorizationModule.createAuthorizationMessage(data.login);

                // Отправляем пользователю имеющиеся в чате сообщения
                messageModule.sendOldMessage(ws);

                // Обработчик закрытия соединения
                ws.on('close', function() {
                    // Удаляем пользователя и отправляем сообщение о том, что он покинул чат
                    usersModule.deleteUser(data.login, ws);
                });
            }
        }

        // Если поступило сообщение о новом сообщении от пользователя
        if(data.type === 'newMessage') {
            usersModule.createNewMessage(data.id, data.text);
        }

        // Если поступило сообщение о новом фото пользователя
        if (data.type === 'newPhoto') {
            photoModule.createNewPhoto(data.id, data.photo);
        }
    });
});
