'use strict';

const { Controller } = require('egg');
const { FormData } = require('form-data');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const mkdirp = require('mkdirp');
// 引入python子进程模块
const { PythonShell } = require('python-shell');

// const fs = require('mz/fs');
const sendToWormhole = require('stream-wormhole');

class FileController extends Controller {
  async imgUpload() {
    const { ctx } = this;
    // const stream = ctx.getFileStream();
    let file = ctx.request.files[0];
    let filename = path.basename(file.filepath);

    let filedata = await fs.readFileSync(file.filepath);
    fs.writeFileSync(path.join('./', 'app/public/upload/img', filename), filedata);
    
    ctx.body = {
      code: 200,
      filename, filename,
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

module.exports = FileController;
