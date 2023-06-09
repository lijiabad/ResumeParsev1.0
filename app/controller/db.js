'use strict';

const { Controller } = require('egg');

class DbController extends Controller {
  async addInfo() {
    const { ctx } = this;
    // await ctx.render('index.html');
    const {name, age, edu, graduate, workage} = ctx.request.body;
    // let id = 100;
    const result = await ctx.service.resumeInfo.addInfo(name, age, edu, graduate, workage);
    if(result) {
      ctx.body = {
        status: 200,
        msg: '添加成功',
        data: result,
      };
    } else {
      ctx.body = {
        status: 201,
        msg: '添加失败',
        data: {},
      };
    }
  }
  
  async delInfo() {
    const { ctx } = this;
    ctx.body = {
        status: 200,
        msg: '删除成功',
        data: {},
    };
  }

  async updateInfo() {
    const { ctx } = this;
    ctx.body = {
        status: 200,
        msg: '更新成功',
        data: {},
    };
  }

  async getInfo() {
    const { ctx } = this;
    ctx.body = {
        status: 200,
        msg: '查询成功',
        data: {},
    };
  }
}

module.exports = DbController;
