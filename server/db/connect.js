var config = require('./config');
var mongoose = require('mongoose');

// 数据库连接
module.exports = function() {
    // 创建数据库链接
    mongoose.connect(config.db.conn);
    var db = mongoose.connection;

    db.on('error', console.error.bind(console, '连接数据库错误'));

    // 打开数据库链接
    db.once('open', function() {
        console.log('打开数据库连接');
    }); 

    //载入实体
    require('./models/activies');

}