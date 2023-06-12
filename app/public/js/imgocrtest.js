// var AipOcr = require('./src/index').ocr;
var AipOcr = require("baidu-aip-sdk").ocr;
const { log } = require("console");
var fs = require('fs');
var http = require('http');

//设置APPID/AK/SK（前往百度云控制台创建应用后获取相关数据）
var APP_ID = "32759346";
var API_KEY = "F9HMhS2kUnUkmLGb30Ttdhbt";
var SECRET_KEY = "N7thpp7rSy1cjo6Gxu7c4daGEO5OPW17";

var client = new AipOcr(APP_ID, API_KEY, SECRET_KEY);


var image = fs.readFileSync('2023-06-11-21-25-46.png');

var app = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
    var base64Img = new Buffer(image).toString('base64');
    client.generalBasic(base64Img).then(function (result) {
        res.end(JSON.stringify(result));
    });
});

// var base64Img = new Buffer(image).toString('base64');
// client.generalBasic(base64Img).then(function (result) {
//     res.end(JSON.stringify(result));
// });

app.listen(8000, function () {
    console.log('listening on 8000');
});