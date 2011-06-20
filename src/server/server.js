
require('./libs/fs.extra');

var express = require('express'),
    form = require('connect-form'),
    path = require('path'),
    uuid = require('node-uuid'),
    fs = require('fs'),
    mkdirP = require('./libs/mkdir_p'),
    app = express.createServer(form({ keepExtensions: true })),
    port = process.env.PORT || 8888,
    tasks = {
        // task for test
        '12345': {
            taskId: '12345',
            url: 'http://www.taobao.com/',
            status: {},
            path: '2011/06/17/12345'
        }
    };

app.configure(function() {
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, '../../imgs')));
});

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, './views/'));
app.listen(port);
console.log('[log] server started at '+port);


/////////////////////////////////////////////////
// Router

app.get('/', function(req, res) {
    var listGuide = '';
    try {
        var query = require('querystring').parse(require('url').parse(req.url).query);
        var p = query.path;
        p = p.replace(/\//g, '-');
        listGuide = '<br><br><a href="/list/'+p+'">Click to view imgs..</a>';
    } catch(e) {}
    res.render('home.jade', {layout:false, listGuide:listGuide});
});

app.get('/add', function(req, res) {
    try {
        var query = require('querystring').parse(require('url').parse(req.url).query);
        var task = addTask(query['url']);
        // res.send("ok\n");
        res.redirect('/?path='+task.path);
    } catch(e) {
        res.send("error\n");
    }
    // console.log(tasks);
});

app.get('/get/:type', function(req, res) {
    var type = req.params.type;
    try {
        res.send(JSON.stringify(getTasks(type))+"\n");
    } catch(e) {
        res.end();
    }
});

app.post('/upload/:type/:taskId', function(req, res, next) {
    var taskId = req.params.taskId;
    var type = req.params.type;

    // Ref: https://github.com/visionmedia/express/blob/master/examples/multipart/app.js
    //      http://visionmedia.github.com/connect-form/
    // Command: curl -F "filename=@file.jpg" http://host:port/upload
    req.form.complete(function(err, fields, files) {
        if (err) {
            return next();
        }
        
        for (var k in files) {
            var f = files[k];
            console.log('fileinfo === ');
            console.log('path: ' + f.path);
            console.log('name: ' + f.name);
            console.log('taskId: ' + taskId);

            var task = tasks[taskId];
            if (task) {
                console.log(task);
                var p = path.join(__dirname, '../../imgs/', task.path + '/');
                mkdirP(p, 488, function() {
                    var newFilePath = p + type + path.extname(f.name);
                    fs.move(f.path, newFilePath);
                    // fs.rename(f.path, newFilePath);
                });
            }
        }
        
        res.send("ok\n");
    });
});

app.get('/list/:path', function(req, res) {
    var p = req.params.path;
    var dir = p.slice(0, 11).replace(/-/g, '/');
    p = path.join(__dirname, '../../imgs/', dir, p.slice(11));

    fs.readdir(p, function(err, files) {
        if (err) {
            res.render('list.jade', {layout:false, imgs:'error'});
            return;
        }

        var imgs = '';
        files.forEach(function(f) {
            var filePath = path.join(p, f).split('imgs')[1];
            imgs += '<h2>' + f + '</h2>';
            imgs += '<div><img src="'+filePath+'" alt="'+f+'" /></div><br><br>';
        });
        res.render('list.jade', {layout: false, imgs:imgs});
    });
});


/////////////////////////////////////////////////
// Task

function addTask(url) {
    var taskId = uuid();
    var n = new Date();
    var y = n.getFullYear();
    var m = n.getMonth() + 1 + '';
    var d = n.getDate();
    m = m.length === 1 ? ('0'+m) : m;

    var task = {
        taskId: taskId,
        url: url,
        status: {},
        path: y+'/'+m+'/'+d+'/'+taskId
    };
    tasks[taskId] = task;
    return task;
}

function getTasks(type) {
    var ret = [];
    for (var k in tasks) {
        if (!tasks[k]['status'][type]) {
            tasks[k]['status'][type] = true;
            ret.push([tasks[k]['url'], tasks[k]['taskId']]);
        }
    }
    return ret;
}

