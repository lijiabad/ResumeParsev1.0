'use strict';

const { Controller } = require('egg');
const { FormData } = require('form-data');
const { path } = require('path');
const { fs } = require('fs');
// 引入python子进程模块
const { PythonShell } = require('python-shell');

class OcrController extends Controller {
  async imgocr() {
    console.log('图片ocr controller');
    const { ctx } = this;
    ctx.body = '进入ocr';
    const file = ctx.request.files[0];
    const image = fs.createReadStream(file.filepath);
    const formData = new FormData();
    formData.append('image', image, {
      filename: file.filename,
      contentType: file.mime
    });
    console.log(formData.getAll('image'));
    // const { ctx } = this;
    // const file = ctx.request.files[0];
    

    // 将上传的文件保存到本地
    // const filePath = path.join(__dirname, '../public/uploads', file.filename);
    // await ctx.helper.moveFile(file.filepath, filePath);

    // // 使用 Python 进行 OCR 识别
    // const options = {
    //   mode: 'text',
    //   pythonPath: '/usr/bin/python',  // Python 解释器路径
    //   scriptPath: '../python-api',  // OCR 脚本所在目录
    //   args: [filePath]  // 传递给 OCR 脚本的参数
    // };
    
    // PythonShell.run('OCRtest.py', options, (err, results) => {
    //   if (err) {
    //     console.error(err);
    //     ctx.body = { error: err.message };
    //   } else {
    //     const text = results[0];
    //     ctx.body = { text };
    //   }
    // });
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

module.exports = OcrController;
