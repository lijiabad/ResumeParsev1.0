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

class FileController extends Controller {
  async Upload() {
    const { ctx } = this;
    let file = ctx.request.files[0]; //获取前端文件
    let timestamp = ctx.request.body.timestamp; //获取时间戳 以命名文件
    var filetype = ctx.request.body.filetype; //获取文件类型
    var filename = '';
    
    if(filetype == 'jpg' || filetype == 'jpeg' || filetype == 'png') {
      filename = timestamp + ".png";
      //文件写入app/public/upload/img
      let filedata = await fs.readFileSync(file.filepath);
      fs.writeFileSync(path.join('./', 'app/public/upload/img', filename), filedata);
    } else if (filetype == 'pdf') {
      console.log("进入进入 -----pdf");
      filename = timestamp + ".pdf";
      //文件写入app/public/upload/pdf
      console.log(file.filepath);
      let filedata = await fs.readFileSync(file.filepath);
      console.log("进入进入--  准备写入");
      fs.writeFileSync(path.join('./', 'app/public/upload/pdf', filename), filedata);
    }
    
    ctx.body = {
      code: 200,
      filename: timestamp,
      filetype: filetype,
      message: '上传成功！',
    };
  }

  async pdfUpload() {
    const { ctx } = this;
    // const stream = ctx.getFileStream();
    let file = ctx.request.files[0];
    let timestamp = ctx.request.body.timestamp;
    // let filename = path.basename(file.filepath);

    var filename =  timestamp + ".pdf";

    console.log('filename = ', filename);
    let filedata = await fs.readFileSync(file.filepath);
    console.log(typeof filedata);
    fs.writeFileSync(path.join('./', 'app/public/upload/pdf', filename), filedata);

    ctx.body = {
      code: 200,
      filename: timestamp,
      type: typeof timestamp,
      message: '上传成功！',
    };
  }

  async fileUpload() {
    const { app, ctx } = this;
    const parts = ctx.multipart();
    let part;
    let result;

    while ((part = await parts()) != null) {
      // part 是上传的文件流
      if (part.length) {
        // 这是 busboy 的字段
        console.log('field: ' + part[0]);
        console.log('value: ' + part[1]);
        console.log('valueTruncated: ' + part[2]);
        console.log('fieldnameTruncated: ' + part[3]);
      } else {
        if (!part.filename) {
          // 这时是用户没有选择文件就点击了上传(part 是 file stream，但是 part.filename 为空)
          return this.fail(ctx.ERROR_CODE, '请选择文件');
        }

        // 文件处理，本地环境上传到本地磁盘，生产环境上传到云存储
        try {
          if (app.config.env === 'production') {
            // result = await ctx.oss.put('egg-multipart-test/' + part.filename, part);
          } else {
            const fileName = `local-upload-image-${ctx.helper.uuidv1()}.${part.mime.split('/')[1]}`;
            // 创建可写流
            const writerStream = fs.createWriteStream(path.join(this.config.baseDir, `app/public/upload/${fileName}`));

            // 目标写入流
            part.pipe(writerStream);
            result = `http://127.0.0.1:7001/public/upload/${fileName}`;
          }
        } catch (err) {
          // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
          await sendToWormhole(part);
          throw err;
        }
      }
    }
  }

  async imgocr3() {
    const { ctx } = this;
    ctx.body = 'imgocr';
  }

  async imgocr2() {
    console.log('图片ocr controller');
    const { ctx } = this;
    
    var AipOcr = require("baidu-aip-sdk").ocr;
    
    //设置APPID/AK/SK（前往百度云控制台创建应用后获取相关数据）
    var APP_ID = "32759346";
    var API_KEY = "F9HMhS2kUnUkmLGb30Ttdhbt";
    var SECRET_KEY = "N7thpp7rSy1cjo6Gxu7c4daGEO5OPW17";
    
    var client = new AipOcr(APP_ID, API_KEY, SECRET_KEY);
    
    // fs.writeFileSync(path.join('./', 'app/public/upload/img', filename), filedata);
    var image = fs.readFileSync('app/public/upload/img/2023-06-11-21-25-46.png');

    try {
      // const result = await client.lexer(input_text);
      var base64Img = new Buffer(image).toString('base64');
      const result = await client.generalBasic(base64Img);

      ctx.body = {
        success: true,
        data: {
            testdata: 404,
            result: result
        },
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

  //pdf识别ocr api调用
  async pdfocr() {
    const { ctx } = this;
    // await ctx.render('index.html');
    ctx.body = 'Hello World pdfocr';
  }

  async test() {
    const { ctx } = this;
    // await ctx.render('index.html');
    ctx.body = 'ocr test!!!!';
  }

}

module.exports = FileController;
