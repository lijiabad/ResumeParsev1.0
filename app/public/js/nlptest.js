var AipNlpClient = require("baidu-aip-sdk").nlp;

// 设置APPID/AK/SK
var APP_ID = "34434607";
var API_KEY = "N8pHqNH39aBMON4S2i7WwbFw";
var SECRET_KEY = "tkbAqcTz8oRWfj3YHxGQqc3ALYUA7rtV";

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipNlpClient(APP_ID, API_KEY, SECRET_KEY);

var text = "邱贞伟 2000/08/12 2000-08-12 2000年08月12日 2022.8-至今        深圳同琛科技       市场经理助理 2021.8-2022.8    洋环南方基地  和彩云产品策划";

// 调用词法分析
client.lexer(text).then(function(result) {
    //提取人名
    let extra_result = [];
    for (let i of result.items) {
        if (i['ne'] === 'PER' || i['pos'] === 'nr') {
            extra_result.push(i['item']);
        }
    }
    //结果可能是空格 为什么？
    console.log(extra_result);

    console.log(result);

    //提取年龄
    // let time_result = []
    // for (let i of result.items) {
    //     if (i['ne'] === 'TIME') {
    //         time_result.push(i['item']);
    //     }
    // }
    // console.log(time_result);

}).catch(function(err) {
    // 如果发生网络错误
    console.log(err);
});