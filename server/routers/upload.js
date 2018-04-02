var multiparty = require('multiparty');
var parseRes = require('../utils/parseRes.js');

module.exports = function(app) {
    // 文件上传
    app.post('/upload-file', function(req, res) {
        var form = new multiparty.Form({
            uploadDir: './output/upload',//文件保存路径
            maxFilesSize: 5000*1024 //最大限制上传1M的图片
        });
        
        form.parse(req, function(err, fields, files) {
            if(err) {
                // 上传错误
                console.log(err);
            } else {
                console.log(files);
                var filePath = files.file[0].path;
                // 注意linux和windows下目录结构不同的
                filePath = 'upload/' + filePath.split('\\')[2];
                var result = {
                    filePath: filePath
                }
                // 上传成功后返回图片URL
                res.send(parseRes.success(result));
            }
        });


    });
};
