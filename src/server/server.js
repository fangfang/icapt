
var express = require('express'),
    form = require('connect-form'),
    path = require('path'),
    uuid = require('node-uuid'),
    mkdirP = require('./libs/mkdir_p'),
    app = express.createServer(form({ keepExtensions: true })),
    port = process.env.PORT || 8888,
    tasks = {};

app.configure(function() {
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
});

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, './'));
app.listen(port);
console.log('[log] server started at '+port);


/////////////////////////////////////////////////
// Router

app.get('/', function(req, res) {
    res.render('home.jade', {layout: false});
});

app.get('/add', function(req, res) {
    var query = require('querystring').parse(require('url').parse(req.url).query);
    addTask(query['url']);
    res.send('ok');
});

app.get('/get/:clientId', function(req, res) {
    var clientId = req.params.clientId;
    console.log(tasks);
    console.log(clientId);
    try {
        res.send(JSON.stringify(getTasks(clientId)));
    } catch(e) {
        res.end();
    }
});

app.post('/upload/:taskId', function(req, res, next) {
    var taskId = req.params.taskId;

    // Ref: https://github.com/visionmedia/express/blob/master/examples/multipart/app.js
    //      http://visionmedia.github.com/connect-form/
    // Command: curl -F "filename=@file.jpg" http://host:port/upload
    req.form.complete(function(err, fields, files) {
        if (err) {
            return next();
        }
        
        for (var k in files) {
            console.log('path: ' + files[k].path);
            console.log('name: ' + files[k].name);
            console.log('taskId: ' + taskId);
        }
        /*
        console.log('uploaded %s to %s'
                , files.image.filename
                , files.image.path);
        */
        /*
        var p = path.join(a, b);
        mkdirP(path, 488);
        */
        res.send('back');
    });

    req.form.on('progress', function(bytesReceived, bytesExpected) {
        var percent = (bytesReceived / bytesExpected * 100) | 0;
        process.stdout.write('Uploading: %' + percent + '\r');
    });
});


/////////////////////////////////////////////////
// Task

function addTask(url) {
    var taskId = uuid();
    var n = new Date();
    var task = {
        taskId: taskId,
        url: url,
        status: {},
        date: '' + n.getFullYear() + (n.getMonth()+1) + n.getDate()
    };
    tasks[taskId] = task;
}

function getTasks(clientId) {
    var ret = [];
    for (var k in tasks) {
        if (!tasks[k]['status'][clientId]) {
            tasks[k]['status'][clientId] = true;
            ret.push([tasks[k]['url'], tasks[k]['taskId']]);
        }
    }
    return ret;
}

