'use strict';
const { Controller } = require('egg');
const { FormData } = require('form-data');
const { rg } = require('./rg');
const Data = require("./rg");
var AipNlpClient = require("baidu-aip-sdk").nlp;
class NlpController extends Controller {
    async nameParse(result, input_text ,new_json) {
        console.log('this this this ');
        console.log(typeof new_json);
        const baijiaxing = ['赵','荆','刘','钱','洪','林','赖','孙','吉','叶','李', '周', '吴', '郑', '王', '冯', '陈', '褚', '卫', '蒋', '沈', '韩', '杨', '朱', '秦', '尤', '许', '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏', '陶', '姜', '戚', '谢', '邹', '喻', '柏', '水', '窦', '章', '云', '苏', '潘', '葛', '奚', '范', '彭', '郎', '鲁', '韦', '昌', '马', '苗', '凤', '花', '方', '俞', '任', '袁', '柳', '酆', '鲍', '史', '唐', '费', '廉', '岑', '薛', '雷', '贺', '倪', '汤', '滕', '殷', '罗', '毕', '郝', '邬', '安', '常', '乐', '于', '时', '傅', '皮', '卞', '齐', '康', '伍', '余', '元', '卜', '顾', '孟', '平', '黄', '和', '穆', '萧', '尹', '姚', '邵', '湛', '汪', '祁', '毛', '禹', '狄', '米', '贝', '明', '臧', '计', '伏', '成', '戴', '谈', '宋', '茅', '庞', '熊', '纪', '舒', '屈', '项', '祝', '董', '梁'];
        let foundName = false;  // 姓或名是否已找到的标志
        const NAME = [];
        console.log(new_json);
        console.log(typeof new_json);

        if(typeof new_json !== "function"){
            console.log(new_json);
            const data = JSON.parse(new_json);
            const wordsResult = data.result.words_result;
            for (let item of wordsResult){
                const words = item.words;
                if (words && (words.includes('姓') || words.includes('名') || words.includes('姓名'))){
                    const index = words.indexOf('：');
                    if (index !== -1){
                        const result = words.slice(index + 1).trim();
                        if (!NAME.includes(result)){
                            NAME.push(result);
                        }
                    }
                    foundName = true;
                    break;
                }
            }
            for (let i of result.items) {
                if (i['ne'] === 'PER' || i['pos'] === 'nr') {
                    NAME.push(i['item']);
                }
            }
        } else {
            for (let i of result.items) {
                if (i['ne'] === 'PER' || i['pos'] === 'nr') {
                    NAME.push(i['item']);
                }
            }
            const items = result.items;
            for (const item of items) {
                const words = item.item;
                if (words && (words.includes('姓') || words.includes('名') || words.includes('姓名'))){
                    const index = words.indexOf('：');
                    if (index !== -1){
                        const result = words.slice(index + 1).trim();
                        if (!NAME.includes(result)){
                            NAME.push(result);
                        }
                    }
                    foundName = true;
                    break;
                }
            }
        }
        const parts = input_text.split(' ');
        const filteredParts = parts.filter(part => part.length === 2 || part.length === 3 );
        console.log(filteredParts);
        for (let i = 0; i < filteredParts.length; i++){
            const firstChar = filteredParts[i][0];
            if (baijiaxing.includes(firstChar)){
                NAME.push(filteredParts[i]);
            }
        }
        console.log('----------------');
        console.log(NAME);
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
        var got_years = matches.filter(match => parseInt(match) >= 1950 && parseInt(match) <= 9999);
        console.log("got_years的类型", typeof got_years);
        return got_years;
    }

    async ageParse(result, input_text, new_json) {
        let AGE = [];
        const regex1 = /(?:出生年月|生日|出生|生)[:：]\s*([\d./-]+)/;
        // const regex2 = /[^岁]*(\d{2})[^岁]*/g;
        let regexAge = /年龄：(\d{2})/;
        let regexYears = /(\d{2})岁/;
        const regex3 = /\b(\d{2})\b/g;
        const regex4 = /\b(\d{4}(?:[-./]\d{2}){2})\b/;
        if(typeof new_json !== "function"){
            const data = JSON.parse(new_json);
            const wordsResult = data.result.words_result;
            for (let i = 0; i < wordsResult.length; i++){
                const words = wordsResult[i].words;
                const match1 = words.match(regex1);
                if (match1 && match1[1]){
                    const birthDate = match1[1];
                    const year = parseInt(birthDate.split(/[./-]/)[0]);
                    const currentYear = new Date().getFullYear();
                    const age = currentYear - year + 1;
                    AGE.push(age);
                    break;
                }
            }
            if (AGE.length === 0){
                for (let i = 0; i < wordsResult.length; i++){
                    const words = wordsResult[i].words;
                    const matchAge = words.match(regexAge);
                    if (matchAge && matchAge[1]){
                        const age = parseInt(matchAge[1]);
                        AGE.push(age);
                        break;
                    }
                    const matchYears = words.match(regexYears);
                    if (matchYears && matchYears[1]){
                        const age = parseInt(matchYears[1]);
                        AGE.push(age);
                        break;
                    }
                }
            }
    
            if (AGE.length === 0){
                for (let i = 0; i < wordsResult.length; i++){
                    const words = wordsResult[i].words;
                    const matches3 = words.match(regex3);
                    if (matches3){
                        for (let j = 0; j < matches3.length; j++){
                            const ageMatch = matches3[j].match(/\d{2}/);
                            if (ageMatch){
                                const age = parseInt(ageMatch[0]);
                                AGE.push(age);
                            }
                        }
                    }
                    if (AGE.length === 0){
                        break;
                    }
                }
            }
    
            if (AGE.length === 0){
                for (let i = 0; i < wordsResult.length; i++){
                    const words = wordsResult[i].words;
                    const match4 = words.match(regex4);
                    if (match4 && match4[1]){
                        const birthDate = match4[1];
                        const year = parseInt(birthDate.split(/[./-]/)[0]);
                        const currentYear = new Date().getFullYear();
                        const age = currentYear - year + 1;
                        AGE.push(age);
                        break;
                    }
                }
            }
        } else {
            var got_years = [];
            const items = result.items;
            for (const item of items) {
                const words = item.item;
                const match1 = words.match(regex1);
                if (match1 && match1[1]){
                    const birthDate = match1[1];
                    const year = parseInt(birthDate.split(/[./-]/)[0]);
                    const currentYear = new Date().getFullYear();
                    const age = currentYear - year + 1;
                    AGE.push(age);
                    break;
                }
            }
            got_years = await this.getTimeStamp(result, input_text);
            for (let i = 0; i < got_years.length; i++) {
                var age = 2023 - got_years[i];
                if (age > 0) {
                    AGE.push(age);
                }
            }
        }
        console.log('nianling',AGE);
        return AGE;
    }

    async graduateParse(result, input_text ,new_json) {

        var graduate = [];
        var GRADUATE = [];
        var lastMatchedItem = null;
        const keywords = ["大学", "学校", "学院"];
        for (let i of result.items) {
            if (i['ne'] === 'ORG') {
                if (i['item'].length >= 4) {
                    graduate.push(i['item']);
                }
            }
        }
        for (let item of graduate){
            for (let keyword of keywords){
                if (item.includes(keyword)){
                    lastMatchedItem = item ;
                }
            }
        }
        GRADUATE.push(lastMatchedItem);
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
    async workAgeParse(result, input_text ,new_json) {
        let text = input_text;
        let startindex = 0;
        if (!text.includes('工作经历') && text.includes('工作经验')){
            const workExperienceIndex = text.indexOf('工作经验');
            startindex = workExperienceIndex + '工作经验'.length + 1;
        }else if (text.includes('工作经历')){
            const workExperienceIndex = text.indexOf('工作经历');
            startindex = workExperienceIndex + '工作经历'.length + 1;
        }else {
            return 0;
        }
        let substring = text.slice(startindex);
        const pattern = /\d{4}\.\d{1,2}-\d{4}\.\d{1,2}|\d{4}\.\d{1,2}～至今|\d{4}-\d{4}|\d{4}\.\d{1,2}-至今|\d{4}\.\d{1,2} 至今|\d{4} 至今/g;
        let dateranges = substring.match(pattern) || [];
        let datelist = [];
        let stopKeywords = ['教育背景', '教育经历','校园经历']; // 定义停止关键词
        for (let i = 0; i < dateranges.length; i++){
            const date = dateranges[i];
            const strings = substring.split(date);
            const nextString = strings[1]; // 获取日期后面的第一个字符串
            const nextTwoStrings = strings.slice(1, 3).join(''); // 获取日期后面的第一个和第二个字符串，合并为一个字符串
            const hasStopKeyword = stopKeywords.some(keyword => nextString.includes(keyword) || nextTwoStrings.includes(keyword));
            if (hasStopKeyword){
                break;
            }
            datelist.push(date);
        }
        console.log('日期数组',datelist);
        let WORKAGE = [];
        let totalYears = 0;
        const currentYear = 2023; // 设定当前年份为 2023
        const currentDate = '2023.4'; // 将当前日期设为2023年4月
        let daterangesArr = []; // 用于存放日期范围的变量
        let totalMonths = 0;
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
            const workMonths = diffYears * 12 + diffMonths;
            totalMonths += workMonths;
        }
        const totalYearsWithDecimal = totalMonths / 12;
        const totalYearsFloored = Math.floor(totalYearsWithDecimal);
        const totalYearsCeiled = Math.ceil(totalYearsWithDecimal);
        let a = totalYears + (totalYearsWithDecimal - totalYearsFloored >= 0.5 ? totalYearsCeiled : totalYearsFloored);
        WORKAGE.push(a);
        return WORKAGE;
    }

    async textParse() {
        const { ctx } = this;

        // ctx.body = "------后端 nlp处理------"
        const got_text = ctx.request.body;
        // console.log("----接收到的内容：---");
        //console.log("got_text内容");
        console.log(got_text);
        //console.log("got_text类型");
        //console.log(typeof got_text);
        // console.log("----↑ 接收到的内容 ↑---");

        // 设置APPID/AK/SK
        var APP_ID = "34434607";
        var API_KEY = "N8pHqNH39aBMON4S2i7WwbFw";
        var SECRET_KEY = "tkbAqcTz8oRWfj3YHxGQqc3ALYUA7rtV";

        // 新建一个对象，建议只保存一个对象调用服务接口
        var client = new AipNlpClient(APP_ID, API_KEY, SECRET_KEY);
        // var text = "邱贞伟 2000/08/12 2000-08-12 2000年08月12日 2022.8-至今        深圳同琛科技       市场经理助理 2021.8-2022.8    洋环南方基地  和彩云产品策划";

        var input_text = got_text.text;
        const Data = require('./rg');
        let new_json = Data;
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
            NAME = await this.nameParse(result, input_text ,new_json); //使用await获取异步操作返回的结果数组 否则是promise对象
            /*提取年龄*/
            AGE = await this.ageParse(result, input_text,new_json);
            /*提取毕业院校*/
            GRADUATE = await this.graduateParse(result, input_text ,new_json);
            console.log(GRADUATE);
            /*提取学历：查找院校字典对应的属性  小学0、初中1、中专2、高中3、专科4、本科5、(硕士)研究生6、(博士研究生)博士7 */
            EDUCTION = await this.eduParse(result, input_text);

            // console.log("学历：");
            // console.log(EDUCTION);

            WORKAGE =  await this.workAgeParse(result, input_text);

            // var imgocrResult = ctx.session.imgocrResult;
            // var imgocrResultJson = JSON.parse(imgocrResult);
            // console.log("imgocrResult--------------------imgocrResult");
            // console.log(imgocrResultJson);
            // const Data = require('./rg');
            // let new_json = Data;
            // console.log('jsonshuju');
            // console.log(new_json);

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