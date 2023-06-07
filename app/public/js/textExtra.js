const request = require('request')

async function main() {
    var options = {
        'method': 'POST',
        'url': 'https://aip.baidubce.com/rpc/2.0/nlp/v1/txt_keywords_extraction?access_token=24.12de01f22dfa110564b9a9f8125e4b0b.2592000.1688567216.282335-34434607',
        'headers': {
                'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: '{"text":["{     \\"text\\":[         \\"邱贞伟 2000/08/12 2022.8-至今         深圳同琛科技           市场经理助0          2019.8-2021.8           唯星信息科技     UI设计 2018.9-2021.7           长沙民政职业技术学院       大专\\"     ],     \\"num\\":4 }"],"num":5}'
    };

    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
    });
}

main();