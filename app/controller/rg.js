'use strict';
const { Controller } = require('egg');
const { FormData } = require('form-data');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const mkdirp = require('mkdirp');
var http = require('http');
// 引入python子进程模块
const { PythonShell } = require('python-shell');
// const fs = require('mz/fs');
const sendToWormhole = require('stream-wormhole');
var AipOcr = require("baidu-aip-sdk").ocr;

class RgController extends Controller {
  async recognize() {
    const { ctx } = this;
    // ctx.body = 'hi, egg, egg, egg';
    await ctx.render('recognize.html');
  }

  async imgocr() {
    const { ctx } = this;
    let timestamp = ctx.request.body.timestamp;

    //设置APPID/AK/SK（前往百度云控制台创建应用后获取相关数据）
    var APP_ID = "32759346";
    var API_KEY = "F9HMhS2kUnUkmLGb30Ttdhbt";
    var SECRET_KEY = "N7thpp7rSy1cjo6Gxu7c4daGEO5OPW17";
    
    var client = new AipOcr(APP_ID, API_KEY, SECRET_KEY);
    
    // fs.writeFileSync(path.join('./', 'app/public/upload/img', filename), filedata);
    // var image = fs.readFileSync('app/public/upload/img/测试不删2023-06-12-10-53-23.png');

    //读取文件有问题
    var filepath = 'app/public/upload/img/' + timestamp + '.png';
    var image = fs.readFileSync(filepath);

    try {
      var base64Img = new Buffer(image).toString('base64');
      const result = await client.generalBasic(base64Img);

      ctx.body = {
        success: true,
        result: result
      };

    } catch(err) {
      // 如果发生网络错误
      console.log(err);
      ctx.status = 500;
      ctx.body = {
          success: false,
          message: '服务器异常，请稍后再试。',
      };
    }
  }


}

module.exports = RgController;
