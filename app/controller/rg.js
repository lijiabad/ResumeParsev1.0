'use strict';

const { Controller } = require('egg');

class RgController extends Controller {
  async recognize() {
    const { ctx } = this;
    // ctx.body = 'hi, egg, egg, egg';
    await ctx.render('recognize.html');
  }

  async test() {
    const { ctx } = this;
    await ctx.render('test.html');
  }
}

module.exports = RgController;
