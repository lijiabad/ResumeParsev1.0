/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1684831167224_6288';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  //关闭拦截器 egg 框架内置了安全系统，默认开启防止 XSS 攻击 和 CSRF 攻击。
  //默认会开启CSRF处理，判断请求是否携带了token，如果没有就拒绝访问。并且，在请求为(GET|HEAD|TRACE|OPTIONS)时，则不会开启。
  config.security = {
    csrf: {
      enable: false
    },
  }

  exports.view = {
    mapping: {
      '.html': 'ejs',
    },
  };

  exports.multipart = {
    mode: 'file',
    whitelist: [
      '.pdf', // 允许上传的文件类型，这里设置为只允许上传的文件
      '.png',
      '.jpg',
      '.jpeg'
    ],
  };

  exports.pythonShell = {
    pythonPath: 'C:\\Users\\Administrator\\AppData\\Local\\Microsoft\\WindowsApps\\python.exe', // 替换为您的 Python 解释器路径
    args: ['-u'], // 添加命令行参数，例如 -u 表示使用 unbuffered I/O
  };
  

  exports.mysql = {
    // database configuration
    client: {
      // host
      host: '127.0.0.1',
      // port
      port: '3306',
      // username
      user: 'root',
      // password
      password: '123456',
      // database
      database: 'test',
    },
    // load into app, default is open
    app: true,
    // load into agent, default is close
    agent: false,
  };

  exports.session = {
    key: 'SESSION_KEY', // session 对象的 key，用于存储在 cookie 中
    maxAge: 24 * 3600 * 1000, // session 的最大有效时间，单位为毫秒
    httpOnly: true, // 是否只允许服务器修改 cookie
    encrypt: true, // 是否对 cookie 进行加密
    renew: true, // 每次访问页面都会给 session 取一个新的过期时间，这样可以保持用户登录状态
  };

  return {
    ...config,
    ...userConfig,
  };
};
