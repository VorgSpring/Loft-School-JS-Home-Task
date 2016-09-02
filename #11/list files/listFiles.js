var fs = require('fs');

var listFiles = function (path, level) {
    level = level || 0;
    var dirs = fs.readdirSync(path);

    for(var dir of dirs) {
        var stat = fs.statSync(path + dir);
        console.log('--'.repeat(level)+dir, Math.ceil(stat.size/1024) + 'kb');
        if(stat.isDirectory()) {
            listFiles(path + dir + '/', level + 1);
        }
    }
};

listFiles('./');
