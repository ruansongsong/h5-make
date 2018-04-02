'use strict';

var build = require('../factory/build.js');
var parseRes = require('../utils/parseRes.js');
var actDao = require('../db/dao/activies');
var utils = require('../utils/utils.js');
var zip = require('express-zip');


// 让前端可以看到图片
function dueDataImage(data) {
    var pages = data.pages;
    for (var i = 0; i < pages.length; i++) {
        var page = pages[i];
        page.burl = page.burl.replace('../images', '/upload');
        var items = page.items;
        for (var j = 0; j < items.length; j++) {
            var item = items[j];
            if (item.imgUrl) {
                if (item.imgUrl.indexOf('default.png') >= 0) {
                    item.imgUrl = item.imgUrl.replace('images', '/client/images');
                } else {
                    item.imgUrl = item.imgUrl.replace('images', '/upload');
                }
            }

            if(item.textStyle && item.textStyle.color) {
                item.textStyle.color = item.textStyle.color.replace('#', '');
            }
        }
    }

    return data;
};

module.exports = function(app) {
    // 安卓后台接口测试
    app.post('/post_test', function (req, res) { 
        console.log(req.body);
        res.send(parseRes.success({
            id: 2
        }));
     }) 
    // 保存
    app.post('/save', function(req, res) {
        //获取参数
        var data = JSON.parse(req.body.config);
        //保存
        actDao.saveOrUpdate(data, function(result) {
            if (result.code !== 0) {
                res.send(parseRes.error(result));
            } else {

                //以id为目录生成项目代码
                var target = 'projects/' + result.id;

                build(data, function(viewPath) {
                    res.send(parseRes.success({
                        id: result.id
                    }));
                }, target);
            }
        });
    });
    
    // 根据id编辑
    app.get('/edit', function(req, res) {
        var id = req.param('id');
        actDao.findById(id, function(data) {
            res.render('edit.html', {
                viewpath: data.viewpath,
                slug: 'edit',
                data: dueDataImage(data)
            });
        });
    });

    // 查询作品列表
    app.get('/findList', function(req, res) {
        var domain = process.host;
        actDao.findList(function(data) {
            res.send(parseRes.success({
                domain: domain,
                editUrl: '/edit',
                deleteUrl: '/delete',
                addUrl: '/add',
                list: data
            }));
        });
    });

    // 主页
    app.get('/home', function(req, res) {
        var domain = process.host;
        actDao.findList(function(data) {
            res.render('home.html', {
                slug: 'home',
                data: data,
                domain: domain
            });
        });
    });

    // 增加项目
    app.get('/add', function(req, res) {
        res.render('edit.html', {
            slug: 'edit'
        });
    });

    // 删除项目
    app.get('/delete', function(req, res) {
        var id = req.param('id');
        actDao.deleteById(id, function(data) {
            if(data.code != '000000') {
                res.send(parseRes.error(data));
            } else {
                res.send(parseRes.success({}));
            }
        });
    });

}
