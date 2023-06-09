'use strict';

const Service = require('egg').Service;

class ResumeInfoService extends Service {
    async getInfo() {
        
    }

    async addInfo(name, age, edu, graduate, workage) {
        try {
            const param={ name, age, edu, graduate, workage }
            const result = await this.app.mysql.insert('resumeinfo',param);
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
