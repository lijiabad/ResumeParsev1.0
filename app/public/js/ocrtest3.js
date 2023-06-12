var API_Key="F9HMhS2kUnUkmLGb30Ttdhbt";
var Secret_Key="N7thpp7rSy1cjo6Gxu7c4daGEO5OPW17";

fetch('https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id='+ API_Key +'&client_secret='+Secret_Key)
  .then(response => response.json())
  .then(mydata => {
    let access_token = mydata.access_token;
    let url = "https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic" + "?access_token=" + access_token;
    let imag64 = images.toBase64(images.read(imgFile));
    let data = new FormData();
    data.append('image', imag64);
    data.append('image_type', 'BASE64');
    data.append('language_type', 'JAP');
    fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: data
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
  })
  .catch(error => console.error(error));