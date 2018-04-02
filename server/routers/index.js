// 公用路由器
var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');

// 控制器路由表
var actionList = [];
files = utils.getAllFiles(process.rootPath + '/server/routers');
for (var key in files) {
    if(files[key].indexOf('index.js') < 0) {
        actionList.push(files[key].replace(process.rootPath + '/server/routers/', ''));
    }
}

module.exports = (app) => {
    //循环配置控制器路由表
    Array.from(actionList, (page) => {
        require(page)(app);
        return page;
    });

};




