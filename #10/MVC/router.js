var Router = {
    handle: function(route) {
        var routeName = route + 'Route';

        /*if (!Controller.hasOwnProperty(routeName)) {
            throw new Error('Маршрут не найден!');
        }*/

        if(route === 'photos') {
            photoBTN.style.display = 'block';
        } else {
            photoBTN.style.display = 'none';
        }
        Controller[routeName]();
    }
};

