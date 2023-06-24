'use strict';
const { Controller } = require('egg');
const { FormData } = require('form-data');
const path = require('path');
const fs = require('fs');
const request = require('request')
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

  async pdfocr() {
    const { ctx } = this;
    var result;

    let timestamp = ctx.request.body.timestamp;
    var filepath = 'app/public/upload/pdf/' + timestamp + '.pdf';

    console.log("filepath is");
    console.log(filepath);
    var pdf_file = await this.getFileContentAsBase64(filepath);

    var options = {
      'method': 'POST',
      'url': 'https://aip.baidubce.com/rest/2.0/ocr/v1/doc_analysis_office?access_token=' + await this.getAccessToken(),
      'headers': {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json'
      },
      form: {
              'pdf_file': pdf_file
      }
    };

    /*这是因为 Egg.js 的控制器(controller)中默认将 this 绑定到了请求(request)对象上，而不是你定义的对象。*/
    // request(options, function (error, response) {
    //     if (error) throw new Error(error);
    //     result = typeof response.body;
    //     // console.log(response.body);
    //     this.getRespResult(result);
    // });
    result = await this.requestAsync(options);
    // console.log('out rst');
    // console.log(typeof result);
    // let jsonStr = JSON.stringify(result);
    // console.log(jsonStr);

    ctx.body = {
      success: true,
      result: result
    };

  }

  requestAsync(options) {
    return new Promise((resolve, reject) => {
      request(options, function (error, response) {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }

  async pdfocr2() {
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
    var filepath = 'app/public/upload/pdf/' + timestamp + '.pdf';
    // var pdf = fs.readFileSync(filepath);

    var pdf_file = new Buffer(fs.readFileSync(filepath)).toString('base64');

    try {
      // var base64Pdf = new Buffer.alloc(pdf).toString('base64'); // Buffer() is deprecated due to security and usability issues. 
      // var base64Pdf = new Buffer(pdf).toString('base64'); // Buffer() is deprecated due to security and usability issues. 
      console.log("tttttttt------------------------tttttttttt");
      console.log("在接口调用之前");
      const result = await client.docAnalysisOfficeV1Pdf(pdf_file);
      console.log("在接口调用之后");

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

  /**
 * 使用 AK，SK 生成鉴权签名（Access Token）
 * @return string 鉴权签名信息（Access Token）
 */
async getAccessToken() {
  const AK = "ryqBGUQ4pt0i9GitgSws8LHI";
  const SK = "qcF9nQirDAGSZDnRUZTAYAoF4SI1AxiA"
  let options = {
      'method': 'POST',
      'url': 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + AK + '&client_secret=' + SK,
  }
  return new Promise((resolve, reject) => {
      request(options, (error, response) => {
          if (error) { reject(error) }
          else { resolve(JSON.parse(response.body).access_token) }
      })
  })
}

/**
 * 获取文件base64编码
 * @param string  path 文件路径
 * @return string base64编码信息，不带文件头
 */
async getFileContentAsBase64(path) {
  const fs = require('fs');
  try {
      return fs.readFileSync(path, { encoding: 'base64' });
  } catch (err) {
      throw new Error(err);
  }
}

}

module.exports = RgController;
