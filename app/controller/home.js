'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    await ctx.render('submit-one.html');
    //  ctx.body = 'Hello World';
  }
}

module.exports = HomeController;
