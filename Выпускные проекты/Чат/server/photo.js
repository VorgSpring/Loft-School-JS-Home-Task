var usersModule = require('./users');
var fs = require('fs');

module.exports = {
    /**
     * Сохраняет фото на сервер и отправляет сообщение о новом фото пользователя
     * @param {number} id
     * @param {string} photo
     */
    createNewPhoto: function (id, photo) {
        // Путь до файла
        var src = './../image/users/' + id + '.jpg';
        
        // Если файл с таким именем существует, то удаляем его
        if(fs.existsSync(src)) {
            fs.unlinkSync(src, function (err) {
                if(err)
                    throw new Error(err);
            });
        }
        
        // Сохраняем файл на сервер
        var base64Data = photo.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, "");
        fs.writeFile(src, base64Data, 'base64', function (err) {
            if(err)
                throw new Error(err);
        });
        
        // Ищем пользователя и меняем у него поле photo
        usersModule.changePhoto(id);
    }
};