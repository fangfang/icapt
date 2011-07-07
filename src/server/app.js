///////////////////////////////////////////////////////////////////
// Global

global.log = function(msg, type) {
    type = type || 'log';
    var colors = {
        'err': '31', // red
        'log': '90', // gray
        'info': '32', // green
        'ooo': '36'  // blue
    };
    console.log('   \033['+colors[type]+'m'+type+' -\033[39m ' + msg);
};


///////////////////////////////////////////////////////////////////
// App

require.paths.unshift('./node_modules');

var express = require('express'),
    form = require('connect-form'),
    path = require('path'),
    uuid = require('node-uuid'),
    fs = require('fs'),
    exec = require('child_process').exec,

    IMG_DIR = path.join(__dirname, './imgs'),
    port = process.env.VMC_APP_PORT || process.env.PORT || 8888,
    app = express.createServer(form({
        keepExtensions: true,
        uploadDir: IMG_DIR
    })),
    tasks = {},
    sessions = {};

app.configure(function() {
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.static(IMG_DIR));
});

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, './views/'));
app.listen(port);
log('server started at '+port, 'info');


///////////////////////////////////////////////////////////////////
// Router

app.get('/', function(req, res) {
    var listGuide = '';

    try {
        var query = require('querystring').parse(require('url').parse(req.url).query);
        var p = query.path;
        p = p.replace(/\//g, '-');
        listGuide = '<br><br><a href="/list/'+p+'">client is rendering, please click to view imgs after 5 seconds.</a>';
    } catch(e) {}

    // Check Session And Get Clients
    var clients = [];
    for (var k in sessions) {
        if (new Date() - sessions[k] > 60000) {
            delete sessions[k];
        } else {
            clients.push(k);
        }
    }
    clients = clients.length ? ('clients: ' + clients.join(', ')) : '';

    res.render('home.jade', {layout:false, listGuide:listGuide, clients:clients});
});

app.get('/add', function(req, res) {
    try {
        var query = require('querystring').parse(require('url').parse(req.url).query);
        var task = addTask(query['url']);
        log('task added: ' + task.taskId);
        res.redirect('/?path='+task.path);
    } catch(e) {
        log('task add failed: ' + e, 'err');
        res.send("error\n");
    }
});

app.get('/get/:type', function(req, res) {
    var type = req.params.type;
    sessions[type] = new Date();
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
            log('upload failed', 'err');
            return next();
        }
        
        for (var k in files) {
            var f = files[k];
            var task = tasks[taskId];
            log('file uploaded: ' + f.path + ' , ' + f.name);
            if (task) {
                var p = path.join(IMG_DIR, task.path + '/');
                exec('mkdir -p ' + p, function(err) {
                    if (err) {
                        log('mkdir -p error: ' + err, 'err');
                        return;
                    }
                    var newFilePath = p + type + path.extname(f.name);
                    exec('mv ' + f.path + ' ' + newFilePath, function(err) {
                        if (err) {
                            log('mv error: ' + err, 'err');
                        }
                    });
                });
            }
        }
        
        res.send("ok\n");
    });
});

app.get('/list/:path', function(req, res) {
    var p = req.params.path.split('-');
    var date = p.slice(0,3).join('/');
    var id = p.slice(3).join('-');
    p = path.join(IMG_DIR, date, id);

    fs.readdir(p, function(err, files) {
        if (err) {
            res.render('list.jade', {layout:false, imgs:'client is rendering, please refresh after 5 seconds..'});
            return;
        }

        var imgs = '';
        files.sort();
        files.forEach(function(f) {
            var filePath = path.join(p, f).split('imgs')[1];
            imgs += '<div><h3>' + f + '</h3>';
            imgs += '<a href="'+filePath+'" target="_blank"><img src="'+filePath+'" alt="'+f+'" /></a></div>';
        });
        res.render('list.jade', {layout: false, imgs:imgs});
    });
});


///////////////////////////////////////////////////////////////////
// Task

function addTask(url) {
    var taskId = uuid();
    var n = new Date();
    var y = n.getFullYear();
    var m = n.getMonth() + 1 + '';
    var d = n.getDate();
    m = m.length === 1 ? ('0'+m) : m;

    if (url.indexOf('http://') !== 0 || url.indexOf('https://') !== 0) {
        url = 'http://' + url;
    }

    var task = {
        taskId: taskId,
        url: url,
        status: {},
        path: y+'/'+m+'/'+d+'/'+taskId,
        date: n
    };
    tasks[taskId] = task;
    return task;
}

function getTasks(type) {
    var ret = [];
    for (var k in tasks) {
        // task in 1 hour and not be getted
        if (new Date() - tasks[k]['date'] < 3600000 && !tasks[k]['status'][type]) {
            tasks[k]['status'][type] = true;
            ret.push([tasks[k]['url'], tasks[k]['taskId']]);
        }
    }
    return ret;
}

// TODO:
// 如果一个小时内执行过，直接返回执行过的任务的结果
function checkTasks(url) {
    for (var k in tasks) {
        if (tasks[k].url === url && new Date() - tasks[k] < 3600000) {
            return tasks[k].path;
        }
    }
}
