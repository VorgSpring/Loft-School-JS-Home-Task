var aboutMe = document.querySelector('.aboutMe');
var container = document.querySelector('.container');
// Шаблон для блока с фотографиями
var templateElement = document.querySelector('template');

// content элемента templateElement
var elementToClone;

// Если браузер не поддерживает тег 'template'
if ('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.friend');
} else {
    elementToClone = templateElement.querySelector('.friend');
}

// Создаёт объект element на основе шаблона templateElement
var getElement = function() {
    // Клонируем шаблонный элемент
    var element = elementToClone.cloneNode(true);
    element.avatar = element.querySelector('.friend-avatar');
    element.surname = element.querySelector('.friend-surname');
    element.name = element.querySelector('.friend-name');
    element.birthdate = element.querySelector('.friend-birthdate');
    element.age = element.querySelector('.friend-age');
    return element;
};

// Создание DOM-разметки в element
var fillElement = function(element, data) {
    element.name.textContent = data.first_name;
    element.surname.textContent = data.last_name;
    element.birthdate.textContent = data.bdate || 'не указал(а)';
    element.age.textContent = getAge(data.bdate);
    var contentImage = element.avatar;
    // Добавляем фото
    var uploadImage = new Image();

    // Обработчик загрузки
    uploadImage.onload = function () {
        uploadImage.onerror = null;
        contentImage.src = data.photo_100;
    };

    // Обработчик ошибки
    uploadImage.onerror = function () {
        uploadImage.onload = null;
        contentImage.src = '';
    };

    uploadImage.src = data.photo_100;
};

var sortFunction = function (a, b) {
    var dateB = b.bdate.split('.').map(function (item) {
        return parseInt(item);
    });
    var dateA = a.bdate.split('.').map(function (item) {
        return parseInt(item);
    });

    if(dateA[1] > dateB[1])
        return 1;
    else if(dateA[1] < dateB[1])
        return -1;
    else
        return dateA[0] - dateB[0]

};

// сортирует список так чтобы первыми от рисовались те у кого день рождение ближе к сегодняшней дате
var sortByBirthday = function (list) {
    var month = new Date().getMonth() + 1;
    var day = new Date().getDate();
    var listNoDate = [];
    var listPast = [];
    var listFuture = [];
    var listNow = [];
    var listSorted = [];

    list.forEach(function (item) {
        if(item.bdate){
            var dateBirthday = item.bdate.split('.');
            if(dateBirthday[1] > month)
                listFuture.push(item);
            else if(dateBirthday[1] < month)
                listPast.push(item);
            else {
                if(dateBirthday[0] > day)
                    listFuture.push(item);
                else if(dateBirthday[0] < day)
                    listPast.push(item);
                else
                    listNow.push(item);
            }
        } else
            listNoDate.push(item);
    });


    listSorted = listSorted.concat(listNow);
    listSorted = listSorted.concat(listFuture.sort(sortFunction));
    listSorted = listSorted.concat(listPast.sort(sortFunction));
    listSorted = listSorted.concat(listNoDate);

    return listSorted;
};

// возвращяет возраст
var getAge = function (date) {
    var year = new Date().getFullYear();
    if(date) {
        date = date.split('.')[2];
        if(date){
            return year - date;
        } else {
            return 'Возраст не указан';
        }
    } else {
        return 'Возраст не указан';
    }
};

new Promise(function(resolve) {
    if (document.readyState === 'complete') {
        resolve();
    } else {
        window.onload = resolve;
    }
}).then(function() {
    return new Promise(function(resolve, reject) {
        VK.init({
            apiId: 5582471
        });

        VK.Auth.login(function(response) {
            if (response.session) {
                resolve(response);
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 2);
    });
}).then(function() {
    return new Promise(function (resolve, reject) {
        VK.api('users.get', {'name_case': 'gen'}, function (response) {
            if (response.error) {
                reject(new Error(response.error.error_msg));
            } else {
                aboutMe.textContent = `Друзья ${response.response[0].first_name} ${response.response[0].last_name}`;
                resolve();
            }
        });
    })
}).then(function() {
    return new Promise(function (resolve, reject) {
        VK.api('friends.get', {'fields': 'bdate,photo_100', 'v': '5.53'}, function (response) {
            if (response.error) {
                reject(new Error(response.error.error_msg));
            } else {
                resolve(response);
            }
        });
    })
}).then(function (response) {
    var friends = response.response.items;
    friends = sortByBirthday(friends);
    friends.forEach(function (item) {
        var friend = getElement();
        fillElement(friend, item);
        container.appendChild(friend);
    })
}, function() {
    alert('Ошибка!')
});