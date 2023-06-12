//调用百度文字识别ocr得到当前手机截屏文字
// function Baidu_ocr(imgFile){
    // log("调用百度ocr开始识图");
    //var imag64 = images.toBase64(imgFile);//转换截屏图片
    // var imgFile = './2023-06-11-21-25-46' 
    // var imag64 = images.toBase64(imgFile, "png", 100);//转换截屏图片
    //log(imag64.string());
    //该APIKey和Secret为"这是谁的爽歪歪"所有
    var APP_ID = "32759346";

    var API_Key="F9HMhS2kUnUkmLGb30Ttdhbt";
    var Secret_Key="N7thpp7rSy1cjo6Gxu7c4daGEO5OPW17";
    //access_token获取地址。
    var getTokenUrl="https://aip.baidubce.com/oauth/2.0/token";
    var token_Res = http.post(getTokenUrl, {
        grant_type: "client_credentials",
        client_id: API_Key,
        client_secret: Secret_Key,
    });
    var access_token=token_Res.body.json().access_token;

    var image = fs.readFileSync('2023-06-11-21-25-46.png');
    var base64Img = new Buffer(image).toString('base64');


    //通用文字识别，50000次/天免费
    var ocrUrl = "https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic";
    var ocr_Res = http.post(ocrUrl, {
        headers: {
            "Content - Type": "application/x-www-form-urlencoded"
        },
        access_token: access_token,
        image: base64Img,
        language_type:"CHN_ENG"
    });
    var json = ocr_Res.body.json();
    //log(json);
    return json;
// }