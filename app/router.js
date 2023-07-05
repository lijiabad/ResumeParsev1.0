'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // router.get('/new', controller.ejs.view);
  router.get('/rg', controller.rg.recognize);

  //文本自然语言解析
  router.post('/nlpHandler', controller.nlp.textParse);

  //文件上传
  router.post('/upload', controller.file.Upload);
  
  //图片识别ocr
  router.post('/imgocr', controller.rg.imgocr);
  //pdf识别ocr
  router.post('/pdfocr', controller.rg.pdfocr);

  //info 数据库操作路由
  router.get('/getInfo', controller.db.getInfo);
  router.post('/addInfo', controller.db.addInfo);
  router.post('/updateInfo', controller.db.updateInfo);
  router.post('/delInfo', controller.db.delInfo);

  //信息统计
  router.get('/showData', controller.showdata.dataGather);

  //页面跳转
  router.get('/jumpData', controller.home.jumpData);
  router.get('/jumpParse', controller.home.jumpParse);

  //测试路径
  router.post('/ocr', controller.rg.pdfocr);
};
