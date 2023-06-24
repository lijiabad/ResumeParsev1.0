'use strict';
const { Controller } = require('egg');

class ShowdataController extends Controller {
    async dataGather() {
        const { ctx } = this;

        let NAME = []; //姓名
        let AGE = []; //年龄
        let EDUCTION = []; //学历
        let GRADUATE = []; //毕业院校
        let WORKAGE =[]; //工作年限

        // //调用数据库数据 返回前端
        const fieldNames = await ctx.service.resumeInfo.getInfo();
        ctx.body = fieldNames;
        // ctx.body = "返回结果200"

        // ctx.body = {
        //     success: true,
        //     data: {
        //         testdata: 404,
        //         name: NAME, 
        //         age: AGE,
        //         edu: EDUCTION,
        //         graduate: GRADUATE,
        //         workage: WORKAGE
        //     },
        // }
    }

    async dataShow() {

    }

    async hello() {
        const { ctx } = this;
        ctx.body = "hello"
    }
}

module.exports = ShowdataController;