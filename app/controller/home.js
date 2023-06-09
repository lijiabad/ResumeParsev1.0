'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    await ctx.render('submit-one.html');
    //  ctx.body = 'Hello World';
  }

  async jumpData() {
    const { ctx } = this;
    await ctx.render('data-view.html');
  }

  async jumpParse() {
    const { ctx } = this;
    await ctx.render('submit-one.html');
  }

}

module.exports = HomeController;
