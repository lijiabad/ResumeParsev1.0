'use strict';
const { Controller } = require('egg');
const { FormData } = require('form-data');
var AipNlpClient = require("baidu-aip-sdk").nlp;

class NlpController extends Controller {

    async nameParse(result, input_text) {
       var NAME = [];
        for (let i of result.items) {
            if (i['ne'] === 'PER' || i['pos'] === 'nr') {
                NAME.push(i['item']);
            }
        }

        return NAME;
    }

    async getTimeStamp(result, input_text) {
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
        var got_years = [];
        if(matches === null) { //如果文件中没有任何数字年月 要填充0
            got_years.push(0);
        } else { 
            got_years = matches.filter(match => parseInt(match) >= 1950 && parseInt(match) <= 9999);
        }
        
        console.log("got_years的类型", typeof got_years);
        return got_years;
    }

    async ageParse(result, input_text) {
        var got_years = [];
        var AGE = [];
        got_years = await this.getTimeStamp(result, input_text);
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
        return AGE;
    }

    async graduateParse(result, input_text) {
        var GRADUATE = [];
        for (let i of result.items) {
            if (i['ne'] === 'ORG') {
                if (i['item'].length >= 4) {
                    GRADUATE.push(i['item']);
                }
            }
        }
        return GRADUATE;
    }

    async eduParse(result, input_text) { //查找院校字典对应的属性  小学0、初中1、中专2、高中3、专科4、本科5、(硕士)研究生6、(博士研究生)博士7 
        var EDUCTION = [];
        //方式1 在简历中直接找属性 显示最大的
        // 创建学历map 注意还有海外研究生 硕士 
        const educationMap = new Map([['无', 0], ['小学', 1], ['初中', 2], ['高中', 3], ['中专', 4], ['大专', 5],
            ['本科', 6], ['硕士', 7], ['博士', 8]]);

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

        return EDUCTION;
    }
    async workAgeParse(result, input_text) {

        let text = input_text;

        if (!text.includes('工作经历')){
             return [0];
        }
        let startindex = text.indexOf("工作经历")+"工作经历".length + 1;
         // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++")
         // console.log(startindex);
        let substring = text.slice(startindex);
        const pattern = /\d{4}\.\d{1,2}-\d{4}\.\d{1,2}|\d{4}\.\d{1,2}～至今|\d{4}-\d{4}|\d{4}\.\d{1,2}-至今/g;
        let dateranges = substring.match(pattern) || [];
        let datelist = [];
        for (let i = 0; i < dateranges.length; i++){
            const date = dateranges[i];
            const strings = substring.split(date);
            const nextString = strings[1]; // 获取日期后面的第一个字符串
            const nextTwoStrings = strings.slice(1, 3).join(''); // 获取日期后面的第一个和第二个字符串，合并为一个字符串
            const keywords = ['集团', '公司', '俱乐部']; // 定义关键词
            const hasKeyword = keywords.some(keyword => nextString.includes(keyword) || nextTwoStrings.includes(keyword));
            if (hasKeyword){
                datelist.push(date)
            }
        }
        console.log('shuzuwei')
        console.log(datelist);
        let WORKAGE = [];
        let totalYears = 0;
        let tatol = 0;
        const currentYear = 2023; // 设定当前年份为 2023
        const currentDate = '2023.4'; // 将当前日期设为2023年4月
        let daterangesArr = []; // 用于存放日期范围的变量
        for (const date of datelist){
            const [startYear, endYear] = date.split('-');
            if (startYear.length === 4 && (endYear === '至今' || endYear.length === 4)){
                 daterangesArr.push(date);
            }
        }
        for (const currentDate of daterangesArr){
            if (currentDate.includes('-')){
                const [startDate, endDate] = currentDate.split('-');
                if (startDate.length === 4 && endDate.toLowerCase() === '至今'){
                    const startYear = parseInt(startDate);
                    const diffYears = currentYear - startYear;
                    totalYears += diffYears;
                }else if (startDate.length === 4 && endDate.length === 4){
                    const startYear = parseInt(startDate);
                    const endYear = parseInt(endDate);
                    const diffYears = endYear - startYear;
                    totalYears += diffYears;
                }
            }
        }
        for (const dateRange of datelist){
            const [startDate, endDate] = dateRange.split('-');
            const [startYear, startMonth] = startDate.split('.');
            const [endYear, endMonth] = endDate.split('.');
            const isCurrent = endDate === '至今';
            const calculatedEndDate = isCurrent ? currentDate.split('.') : [endYear, endMonth];
            const diffYears = calculatedEndDate[0] - startYear;
            const diffMonths = calculatedEndDate[1] - startMonth;
            const workYears = Math.ceil((diffYears * 12 + diffMonths) / 12);
            tatol += workYears;
            if (diffMonths > 0){
                tatol+=1;
            }
        }
        let a = totalYears+tatol;
        WORKAGE.push(a);
        return WORKAGE;
    }

    async textParse() {
        const { ctx } = this;

        // ctx.body = "------后端 nlp处理------"
        const got_text = ctx.request.body;
        // console.log("----接收到的内容：---");
        console.log("got_text内容");
        console.log(got_text);
        console.log("got_text类型");
        console.log(typeof got_text);
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
            const result = await client.lexer(input_text);
            // console.log(result);


            /**提取人名**/
            NAME = await this.nameParse(result, input_text); //使用await获取异步操作返回的结果数组 否则是promise对象
            /*提取年龄*/
            AGE = await this.ageParse(result, input_text);
            /*提取毕业院校*/
            GRADUATE = await this.graduateParse(result, input_text);
            /*提取学历：查找院校字典对应的属性  小学0、初中1、中专2、高中3、专科4、本科5、(硕士)研究生6、(博士研究生)博士7 */
            EDUCTION = await this.eduParse(result, input_text);
            console.log("学历：");
            console.log(EDUCTION);

            WORKAGE =  await this.workAgeParse(result, input_text);


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