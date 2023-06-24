// var API_Key="F9HMhS2kUnUkmLGb30Ttdhbt";
// var Secret_Key="N7thpp7rSy1cjo6Gxu7c4daGEO5OPW17";
//
// access_token = http.get("https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id="+ API_Key +"&client_secret="+Secret_Key).body.json().access_token;
// url = "https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic" + "?access_token=" + access_token;
// imag64 = images.toBase64(images.read(imgFile));
// res = http.post(url, {headers: {'Content-Type': 'application/x-www-form-urlencoded'},image: imag64,image_type: "BASE64",language_type:"JAP"});
// str = JSON.parse(res.body.string()).words_result.map(val => val.words).join('\n');
// return str;