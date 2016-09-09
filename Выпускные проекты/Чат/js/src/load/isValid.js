'use strict';

/**
 * Валидация формы загрузки фото
 * @param {object} file
 */
module.exports = function (file) {
    if(file.type !== 'image/jpeg') {
        alert('Можно загружать только JPG-файлы');
        return false;
    }
    if(file.size > 524288) {
        alert('Можно загружать только файлы меньше 512kb');
        return false;
    }
    return true;
};
