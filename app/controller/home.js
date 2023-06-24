'use strict';

const { Controller } = require('egg');
//引入函数
const { dataGather } = require('./showdata');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    await ctx.render('submit-one.html');
    //  ctx.body = 'Hello World';

  }

  async jumpData() {
    const { ctx } = this;
    await ctx.render('data-view.html');

    // this.dataGather();
    this.dataget();

  }

  async jumpParse() {
    const { ctx } = this;
    await ctx.render('submit-one.html');
  }

  async dataget() {
    // const { ctx } = this;

    // const fieldNames = await ctx.service.resumeInfo.getInfo();
    // ctx.body = fieldNames;
  }

}

module.exports = HomeController;
