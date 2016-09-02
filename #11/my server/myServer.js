var fs = require('fs');
var http = require('http');

http.createServer(function (req, res) {
    var listFiles = function (path) {
        if(path.substring(path.length - 1) !== '/')
            path += '/';
        var dirs = fs.readdirSync(path);
        res.write('<ul>');
        for (var dir of dirs) {
            var stat = fs.statSync(path + dir);
            res.write('<li>' + dir+ ' ' + Math.ceil(stat.size / 1024) + 'kb </li>');
            if (stat.isDirectory()) {
                listFiles(path + dir + '/');
            }
        }
        res.write('</ul>');
    };
    res.setHeader('Content-Type', 'text/html');
    if(fs.existsSync('.' + req.url))
        listFiles('.' + req.url);
    else
        res.write('<h1> File not found </h1>');
    res.end();

}).listen(7777);

