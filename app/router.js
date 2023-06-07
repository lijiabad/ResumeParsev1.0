'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // router.get('/new', controller.ejs.view);
  router.get('/rg', controller.rg.recognize);

  //文本解析
  router.post('/nlpHandler', controller.nlp.textParse);

  //图片识别ocr
  router.post('/upload', controller.upload.upload);
  router.post('/imgOcr', controller.ocr.imgocr);
  //pdf识别ocr
  router.post('/pdfOcr', controller.ocr.pdfocr);
  router.post('/iO', controller.ocr.test);

  //info 数据库操作路由
  router.get('/getInfo', controller.resumeInfo.getInfo);
  router.post('/addInfo', controller.resumeInfo.addInfo);
  router.post('/updateInfo', controller.resumeInfo.updateInfo);
  router.post('/delInfo', controller.resumeInfo.delInfo);

  //测试路径
  router.get('/test', controller.rg.test);

};
