'use strict';

const Service = require('egg').Service;

class ResumeInfoService extends Service {
    async addInfo(name, age) {
        try {
            const param={
                name,
                age
            }
            const result = await this.app.mysql.insert('resumeinfo',param);
            const insertSuccess = result.affectedRows===1;
            if(insertSuccess) {
                return result;
            } else {
                return null;
            }
        } catch (error) {
            console.log('出错！');
            console.log(error)
        }
    }
    async delInfo() {
        
    }
    async updateInfo() {
        
    }
    async getInfo() {
        
    }
}

module.exports = ResumeInfoService;
