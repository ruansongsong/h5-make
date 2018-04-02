var express = require('express');
var path = require('path');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var http = require('http');
var session = require('express-session');
var connect = require('./server/db/connect');

//连接数据库
connect();
var port = 3000;
process.rootPath = __dirname;
process.port = port;
var app = express();

// 设置模板引擎
app.set('view engine', 'html');
app.engine('html', nunjucks.render);
// nunjucks 设置
nunjucks.configure(path.join(__dirname, 'server/views'), {
    autoescape: true,
    express: app,
    watch: true
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'output')));

// 引入路由
require('./server/routers/index.js')(app);

// 创建服务器
var server = http.createServer(app);
server.listen(port, '0.0.0.0', function onStart(err) {
    if (err) {
        console.log(err);
    }
    console.log('服务器启动成功');
});

