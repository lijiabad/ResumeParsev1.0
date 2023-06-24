'use strict';

const Service = require('egg').Service;

class ResumeInfoService extends Service {
    async getInfo() {
        const { ctx } = this;
        const result = await ctx.app.mysql.query('SELECT name, age, edu, graduate, workage FROM  parseinfo');
        //结果格式
        // [
        //     {
        //         "name": "邱贞伟",
        //         "age": 23,
        //         "edu": null,
        //         "graduate": "长沙民政职业技术学院",
        //         "workage": null
        //     },
        //     {
        //         "name": "邱贞伟",
        //         "age": 23,
        //         "edu": null,
        //         "graduate": "长沙民政职业技术学院",
        //         "workage": null
        //     }
        // ]

        return result;
        // const fieldNames = result.map(item => item.Field); // 获取查询结果中的字段名，并存入数组中
        // return fieldNames;
    }

    async addInfo(name, age, edu, graduate, workage) {
        try {
            const param={ name, age, edu, graduate, workage };
            const result = await this.app.mysql.insert('parseinfo',param);
            const insertSuccess = result.affectedRows===1;
            if(insertSuccess) {
                return result;
            } else {
                return null;
            }
        } catch (error) {
            console.log('数据入库出错！');
            console.log(error)
        }
    }
    async delInfo() {
        
    }
    async updateInfo() {
        
    }
    
}

module.exports = ResumeInfoService;
