var AipOcr = require("baidu-aip-sdk").ocr;
const fs = require('fs');

//设置APPID/AK/SK（前往百度云控制台创建应用后获取相关数据）
var APP_ID = "32759346";
var API_KEY = "F9HMhS2kUnUkmLGb30Ttdhbt";
var SECRET_KEY = "N7thpp7rSy1cjo6Gxu7c4daGEO5OPW17";

var client = new AipOcr(APP_ID, API_KEY, SECRET_KEY);

// fs.writeFileSync(path.join('./', 'app/public/upload/img', filename), filedata);
// var image = fs.readFileSync('app/public/upload/img/测试不删2023-06-12-10-53-23.png');

//读取文件有问题
// var filepath = 'app/public/upload/img/' + timestamp + '.pdf';
var timestamp = '2023-06-23-21-48-25';
var filepath = '../upload/pdf/' + timestamp + '.pdf';
// var pdf = fs.readFileSync(filepath);
var pdf_file = new Buffer(fs.readFileSync(filepath)).toString('base64');

// var pdf_file =  getFileContentAsBase64(filepath);
// var base64Img = new Buffer(pdf).toString('base64');
// const result =  client.docAnalysisOfficeV1Pdf(pdf_file);
const result =  client.vatInvoicePdf(pdf_file);

// const result =  client.docAnalysisOfficeV1Pdf(pdf_file);

console.log(result);

