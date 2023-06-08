'use strict';
const { Controller } = require('egg');
const { FormData } = require('form-data');
var AipNlpClient = require("baidu-aip-sdk").nlp;

class NlpController extends Controller {

    async textParse() {
        const { ctx } = this;

        // ctx.body = "------后端 nlp处理------"
        const got_text = ctx.request.body;
        // console.log("----接收到的内容：---");
        console.log(got_text);
        // console.log("----↑ 接收到的内容 ↑---");
        
        // 设置APPID/AK/SK
        var APP_ID = "34434607";
        var API_KEY = "N8pHqNH39aBMON4S2i7WwbFw";
        var SECRET_KEY = "tkbAqcTz8oRWfj3YHxGQqc3ALYUA7rtV";

        // 新建一个对象，建议只保存一个对象调用服务接口
        var client = new AipNlpClient(APP_ID, API_KEY, SECRET_KEY);

        // var text = "邱贞伟 2000/08/12 2000-08-12 2000年08月12日 2022.8-至今        深圳同琛科技       市场经理助理 2021.8-2022.8    洋环南方基地  和彩云产品策划";
        
        var input_text = got_text.text;
        let NAME = []; //姓名
        let AGE = []; //年龄
        let EDUCTION = []; //学历
        let GRADUATE = []; //毕业院校
        let WORKAGE =[]; //工作年限

        // 调用词法分析
        try {
            const result = await client.lexer(input_text)

            /**
            提取人名
            **/
            for (let i of result.items) {
                if (i['ne'] === 'PER' || i['pos'] === 'nr') {
                    NAME.push(i['item']);
                }
            }
            //结果可能是空格 为什么？
            // console.log(NAME);
            
            /*
            提取年龄
            */
            //先提取时间戳 NLP或正则提取
            let time_result = []
            //nlp标签提取 很有可能提取不到
            for (let i of result.items) {
                if (i['ne'] === 'TIME' || i['pos'] === 't' || i['pos'] === 'w') {
                    time_result.push(i['item']);
                }
            }
            //正则表达式提取
            const pattern = /\b\d{4}\b/g; // 匹配四位数字 超过四位不匹配
            const matches = input_text.match(pattern);
            const got_years = matches.filter(match => parseInt(match) >= 1950 && parseInt(match) <= 9999);

            // console.log(result);

            //获取当前时间
            const now = new Date();
            const year = now.getFullYear(); // 年份
            const month = now.getMonth() + 1; // 月份（注意加1）
            const day = now.getDate(); // 当月第几天
            // 格式化时间字符串
            // const formattedTime = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
            // console.log(formattedTime); // 输出格式化后的时间字符串，例如 "2023-06-08 02:55:40"
            
            for (let i = 0; i < got_years.length; i++) {
                var age = year - got_years[i];
                if (age > 0) {
                    AGE.push(age);
                }
            }
            
            /*
            提取毕业院校
            */
            for (let i of result.items) {
                if (i['ne'] === 'ORG') {
                    if (i['item'].length >= 4) {
                        GRADUATE.push(i['item']);
                    }
                }
            }

            /*
            提取学历：查找院校字典对应的属性  小学0、初中1、中专2、高中3、专科4、本科5、(硕士)研究生6、(博士研究生)博士7
            */
            //方式1 在简历中直接找属性 显示最大的
            // 创建学历map 注意还有海外研究生 硕士 
            const educationMap = new Map([['小学', 0],['初中', 1],['中专', 2],['高中', 3],['专科', 4],
                ['本科', 5],['硕士研究生', 6],['硕士', 6],['研究生', 6],['博士研究生', 7],['博士', 7]]);

            for (const [keyword, value] of educationMap.entries()) {
                const regex = new RegExp(keyword, "g");
                const result = input_text.match(regex);
                if (result) {
                    EDUCTION.push(...result.map(() => keyword));
                }
            }
            //将学历列表逆序排列
            EDUCTION.sort((a, b) => {
                return educationMap.get(b) - educationMap.get(a);
            });


            ctx.body = {
                success: true,
                data: {
                    testdata: 404,
                    name: NAME, 
                    age: AGE,
                    edu: EDUCTION,
                    graduate: GRADUATE,
                    workage: WORKAGE
                },
              };
            } catch(err) {
                // 如果发生网络错误
                console.log(err);
                ctx.status = 500;
                ctx.body = {
                    success: false,
                    message: '服务器异常，请稍后再试。',
                };
            }
    }

    
    
}

module.exports = NlpController;