//使用 fetch API 向服务器发送一个 POST 请求，以删除某些资源。请求的 URL 是 "/del"
//<button onclick="del()"></button> 实现调用 
function del() {
    fetch("/del", {
        method:"post",
        headers: {
            "Content-type": "aplication/json" //传递file文件时 不应该用这个而是
        }
    });
} 

//数据库 如果4.0不兼容 安装 npm i egg-mysql@3.4.0

//使用python脚本
在Egg.js中使用Python需要借助于Python子进程的模块。以下是一个简单的例子，其中Python文件接收一个参数并返回处理好的参数：

javascript
// 引入python子进程模块
const { PythonShell } = require('python-shell');

// 创建一个PythonShell实例，并指定要执行的Python文件路径
const pythonScript = new PythonShell('/path/to/your/python/script.py');

// 给Python脚本传递参数
pythonScript.send('your argument');

// 监听Python脚本的输出
pythonScript.on('message', (message) => {
  console.log(`Received message from Python script: ${message}`);
});

// 监听Python脚本的错误
pythonScript.on('error', (error) => {
  console.error(`Error occurred in Python script: ${error}`);
});

// 在Python脚本执行完毕后触发
pythonScript.on('close', () => {
  console.log('Python script finished.');
});


// 在上述代码中，我们创建了一个PythonShell实例，并指定了要执行的Python文件的路径。然后，我们使用send()方法向Python脚本发送参数。Python脚本可以通过读取标准输入来获取这个参数。当Python脚本输出一些内容时，message事件就会触发，我们可以在回调函数中处理Python脚本输出的数据。如果Python脚本出现错误，error事件会触发。最后，close事件会在Python脚本执行完毕后触发。

// 下面是一个简单的Python脚本，它接收一个参数并返回处理好的参数：

// python
import sys

// # 读取参数
arg = sys.stdin.readline().strip()

// # 处理参数
result = arg.upper()

// # 输出处理后的结果
print(result)
// 该Python脚本会将接收到的参数转换为大写字母，并将处理后的结果输出。在Egg.js中运行这个Python脚本，可以得到以下结果：


// app/controller/api.js
const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

class ApiController extends Controller {
  // 接收图片数据并进行 OCR 处理
  async ocr() {
    const { ctx } = this;
    
    // 获取图片数据
    const file = ctx.request.files[0];
    const image = fs.createReadStream(file.filepath);
    
    // 创建一个 FormData 实例，用于提交图片数据到 OCR API
    const formData = new FormData();
    formData.append('image', image, {
      filename: file.filename,
      contentType: file.mime
    });
    
    // 发送 POST 请求到 OCR API
    const apiKey = 'your_api_key'; // 百度 OCR API Key
    const apiSecret = 'your_api_secret'; // 百度 OCR API Secret
    
    const accessToken = await this.getAccessToken(apiKey, apiSecret); // 获取百度 OCR 的 access_token
    const response = await fetch(`https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=${accessToken}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // 解析 OCR 返回的 JSON 数据
    const data = await response.json();
    const text = data.words_result.map(item => item.words).join('\n');
    
    // 将识别结果返回给前端
    ctx.body = { text };
  }
  
  // 获取百度 OCR 的 access_token
  async getAccessToken(apiKey, apiSecret) {
    const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${apiSecret}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.access_token) {
      return data.access_token;
    } else {
      throw new Error('Failed to get access token from Baidu OCR API.');
    }
  }
}

module.exports = ApiController;


'use strict';

const Controller = require('../../core/base_controller');
const path = require('path');
const fs = require('mz/fs');
const sendToWormhole = require('stream-wormhole');

/**
 * Controller - utils upload
 * @class
 * @author ruiyong-lee
 */
class UtilsUploadController extends Controller {
  /**
   * 测试上传
   */
  async upload() {
    const { app, ctx } = this;
    const parts = ctx.multipart();
    let part;
    let result;

    while ((part = await parts()) != null) {
      // part 是上传的文件流
      if (part.length) {
        // 这是 busboy 的字段
        console.log('field: ' + part[0]);
        console.log('value: ' + part[1]);
        console.log('valueTruncated: ' + part[2]);
        console.log('fieldnameTruncated: ' + part[3]);
      } else {
        if (!part.filename) {
          // 这时是用户没有选择文件就点击了上传(part 是 file stream，但是 part.filename 为空)
          return this.fail(ctx.ERROR_CODE, '请选择文件');
        }

        // 文件处理，本地环境上传到本地磁盘，生产环境上传到云存储
        try {
          if (app.config.env === 'production') {
            // result = await ctx.oss.put('egg-multipart-test/' + part.filename, part);
          } else {
            const fileName = `local-upload-image-${ctx.helper.uuidv1()}.${part.mime.split('/')[1]}`;
            // 创建可写流
            const writerStream = fs.createWriteStream(path.join(this.config.baseDir, `app/public/upload/${fileName}`));

            // 目标写入流
            part.pipe(writerStream);
            result = `http://127.0.0.1:7001/public/upload/${fileName}`;
          }
        } catch (err) {
          // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
          await sendToWormhole(part);
          throw err;
        }
      }
    }

    this.success(result);
  }
}

module.exports = UtilsUploadController;

//测试用文本
李四 18岁 湖南工业大学计算机学院 


//可参考的地址解析逻辑
{
    let defaultData = [];

            const mCity = {};

            const mArea = {};

            /**
             * 处理原始地址数据转换成专用数据
             * @param list  原始数据
             * @param init  是否初始化 如传空 已转换过不会再次转换
             * @returns {boolean}
             */
            function parseArea(list, init) {
            if (!init && defaultData.length) {
                return true;
            }
            defaultData = list;
            defaultData.forEach(province => {
                if (province.city) {
                province.city.forEach(city => {
                    if (city.name !== '其他') {
                    if (!mCity[city.name]) {
                        mCity[city.name] = [];
                    }
                    mCity[city.name].push({
                        p: province.name,
                        c: city.name,
                        a: city.area || []
                    });
                    }
                    if (city.area) {
                    city.area.forEach(area => {
                        if (area !== '其他') {
                        if (!mArea[area]) {
                            mArea[area] = [];
                        }
                        mArea[area].push({
                            p: province.name,
                            c: city.name
                        })
                        }
                    })
                    }
                })
                }
            });
            }
            
            /**
             * 解析
             * @param address 任意地址字符串
             * @returns {{name: string, mobile: string, detail: string, zip_code: string, phone: string}}
             */
             function parse(address) {
                address = address || '';
                const parse = {
                    name: '',
                    //age: '',
                    //education: '',
                    //graduateInstitutions: '',
                    //workingSeniority: '',
                    mobile: '',
                    detail: '',
                    zip_code: '',
                    phone: '' //--电话格式 可以保留
                };

                //去除空格...
                /*   address = address.replace(/\r\n/g, ' ').replace(/\n/g, ' ').replace(/\t/g, ' ');
                address = address.replace(/\s+/g, ""); */
                //自定义去除关键字，可自行添加
                const search = ['地址', '收货地址', '收货人', '收件人', '收货', '邮编', '电话', '：', ':', '；', ';', '，', ',', '。',' '];
                // const search = ['地址', '收货地址', '收货人', '收件人', '收货', '邮编', '电话', '：', ':', '；', ';', '，', ',', '。',' '];
                search.forEach(str => {
                    address = address.replace(new RegExp(str, 'g'), ' ')
                });
                //多个空格replace为一个
                address = address.replace(/ {2,}/g, ' ');
                //整理电话格式
                address = address.replace(/(\d{3})-(\d{4})-(\d{4})/g, '$1$2$3');

                address = address.replace(/(\d{3}) (\d{4}) (\d{4})/g, '$1$2$3');

                const mobileReg = /(86-[1][0-9]{10})|(86[1][0-9]{10})|([1][0-9]{10})/g;
                const mobile = mobileReg.exec(address);
                if (mobile) {
                    parse.mobile = mobile[0];
                    address = address.replace(mobile[0], ' ')
                }
                //电话
                const phoneReg = /(([0-9]{3,4}-)[0-9]{7,8})|([0-9]{12})|([0-9]{11})|([0-9]{10})|([0-9]{9})|([0-9]{8})|([0-9]{7})/g;
                const phone = phoneReg.exec(address);
                if (phone) {
                    parse.phone = phone[0];
                    address = address.replace(phone[0], ' ')
                }

                //邮编(加入门牌号；考虑到重复邮编问题；去除之前简单的六位数字校验)


                address = address.replace(/ {2,}/, ' ');

                let detail = detail_parse_forward(address.trim());
                var ignoreArea = detail.province;
                if (!detail.city) {
                    detail = detail_parse(address.trim());
                    if (detail.area && !detail.city) {
                    detail = detail_parse(address.trim(), {
                        ignoreArea: true
                    });
                    console.log('smart_parse->ignoreArea（忽略区）');
                    } else {
                    // console.log('smart_parse');
                    }
                    //这个待完善
                    const list = address.replace(detail.province, '').replace(detail.city, '').replace(detail.area, '').split(' ').filter(str => str);
                    //详细住址划分关键字
                    //注意：只需要填写关键字最后一位即可：比如单元填写元即可！
                    const address_detail_list = ['室', '楼', '元', '号', '幢', '门', '户'];
                    if (list.length > 1) {
                    list.forEach(str => {
                        if (!parse.name || str && str.length < parse.name.length) {
                        parse.name = str.trim()
                        }
                    });
                    if (parse.name) {
                        detail.addr = detail.addr.replace(parse.name, '').trim()
                    }
                    } else {//若名字写在详细地址后面，根据address_detail_list进行分割；
                    let key = [];
                    address_detail_list.forEach((el) => {
                        key.push(detail.addr.indexOf(el))
                    })
                    var max = key.sort(function (a, b) {
                        return b - a;
                    })[0];
                    if (detail.name) {
                        parse.name = detail.name
                    }
                    if (max != -1) {
                        let addrBuild = detail.addr.slice(0, max + 1);
                        let addrNum = detail.addr.replace(addrBuild, '').replace(/[^0-9]+/g, '');
                        let userName = detail.addr.replace(addrBuild + addrNum, '')
                        detail.addr = addrBuild + addrNum
                        parse.name = userName
                    }
                    }
                } else {
                    if (detail.name) {
                    parse.name = detail.name
                    } else {
                    const list = detail.addr.split(' ').filter(str => str);
                    if (list.length > 1) {
                        parse.name = list[list.length - 1]
                    }
                    if (parse.name) {
                        detail.addr = detail.addr.replace(parse.name, '').trim()
                    }
                    }
                }
                parse.province = detail.province == '' ? ignoreArea : detail.province;
                parse.city = detail.city;
                parse.area = detail.area;
                parse.addr = detail.addr;
                parse.result = detail.result;
                //添加省以及市（2019.6.21）输出字段后填入省市等等
                foramtProvince.forEach(el => {
                    if (el.name.indexOf(parse.province) == 0) {
                    parse.province = el.name
                    }
                })
                zipCode.forEach(provice => {
                    if (parse.province.indexOf(provice.name) == 0) {
                    provice.child.forEach(city => {
                        if (city.name.indexOf(parse.city) == 0) {
                        parse.city = city.name
                        }
                    })
                    }
                })
                
                return parse;
            }

            /**
             * 正向解析模式
             * 从前到后按 province city addr 逐级筛选
             * 有city的值即可说明解析成功
             * 此模式对地址顺序有要求
             * @param address
             * @returns {{province: string, city: string, area: string, addr: string}}
             */

            //--改为从院校字典读取 院校的信息

            function detail_parse_forward(address) {
            const parse = {
                province: '',
                city: '',
                area: '',
                addr: '',
                name: '',
            };

            const provinceKey = ['特别行政区', '古自治区', '维吾尔自治区', '壮族自治区', '回族自治区', '自治区', '省省直辖', '省', '市'];
            const cityKey = ['布依族苗族自治州', '苗族侗族自治州', '自治州', '州', '市', '县'];

            for (let i in defaultData) {
                const province = defaultData[i];
                let index = address.indexOf(province.name);
                if (index > -1) {
                if (index > 0) {
                    //省份不是在第一位，在省份之前的字段识别为名称
                    parse.name = address.substr(0, index).trim();
                }
                parse.province = province.name;
                address = address.substr(index + province.name.length);
                for (let k in provinceKey) {
                    if (address.indexOf(provinceKey[k]) === 0) {
                    address = address.substr(provinceKey[k].length);
                    }
                }
                for (let j in province.city) {
                    const city = province.city[j];
                    index = address.indexOf(city.name);
                    if (index > -1 && index < 3) {
                    parse.city = city.name;
                    address = address.substr(index + parse.city.length);
                    for (let k in cityKey) {
                        if (address.indexOf(cityKey[k]) === 0) {
                        address = address.substr(cityKey[k].length);
                        }
                    }
                    if (city.area) {
                        for (let k in city.area) {
                        const area = city.area[k];
                        index = address.indexOf(area);
                        if (index > -1 && index < 3) {
                            parse.area = area;
                            address = address.substr(index + parse.area.length);
                            break;
                        }
                        }
                    }
                    break;
                    }
                }
                parse.addr = address.trim();
                break;
                }
            }
            return parse;
            }

            /**
             * 逆向解析 从后【县，区，旗】往前解析
             * 有地区就能大概返回地址了
             * @param address
             * @param ignoreArea 是否忽视区 因为地址中含有区容易导致匹配错误 例：山东省蓬莱市黄海花园东区西门宝威学堂 曲荣声收15753572456
             * @returns {{province: string, city: string, area: string, name: string, _area: string, addr: string}}
             */
            function detail_parse(address, {
            ignoreArea = false
            } = {}) {
            const parse = {
                province: '',
                city: '',
                area: '',
                name: '',
                _area: '',
                addr: '',
            };
            let areaIndex = -1,
                cityIndex = -1;

            address = address.replace('  ', ' ');

            if (!ignoreArea && address.indexOf('县') > -1 || !ignoreArea && address.indexOf('区') > -1 || !ignoreArea && address.indexOf('旗') > -1) {
                if (address.indexOf('旗') > -1) {
                areaIndex = address.indexOf('旗');
                parse.area = address.substr(areaIndex - 1, 2);
                }
                if (address.indexOf('区') > -1) {
                areaIndex = address.indexOf('区');
                if (address.lastIndexOf('市', areaIndex) > -1) {
                    cityIndex = address.lastIndexOf('市', areaIndex);
                    parse.area = address.substr(cityIndex + 1, areaIndex - cityIndex);
                } else {
                    parse.area = address.substr(areaIndex - 2, 3);
                }
                }
                if (address.indexOf('县') > -1) {
                areaIndex = address.lastIndexOf('县');
                if (address.lastIndexOf('市', areaIndex) > -1) {
                    cityIndex = address.lastIndexOf('市', areaIndex);
                    parse.area = address.substr(cityIndex + 1, areaIndex - cityIndex);
                } else {
                    parse.area = address.substr(areaIndex - 2, 3);
                }
                }
                parse.addr = address.substr(areaIndex + 1);

            } else {
                if (address.indexOf('市') > -1) {
                areaIndex = address.indexOf('市');
                console.log(address.split(" "))
                if (address.split(" ")[0].indexOf("市") > -1) {
                    let areindex = address.split(" ")[0].indexOf("市")
                    parse.area = address.split(" ")[0].substr(0, areindex + 1);
                    parse.addr = address.split(" ")[0].substr(areindex + 1);
                    parse.name  = address.split(" ")[1]
                } else {
                    let areindex = address.split(" ")[1].indexOf("市")
                    parse.area = address.split(" ")[1].substr(0, areindex + 1);
                    parse.addr = address.split(" ")[1].substr(areindex + 1);
                    parse.name  = address.split(" ")[0]
                }
                } else {
                parse.addr = address
                }
            }

            if (address.indexOf('市') > -1 || address.indexOf('盟') > -1 || address.indexOf('州') > -1) {
                if (address.indexOf('市') > -1) {
                parse._area = address.substr(address.indexOf('市') - 2, 2);
                }
                if (address.indexOf('盟') > -1 && !mCity[parse._area]) {
                parse._area = address.substr(address.indexOf('盟') - 2, 2);
                }
                if (address.indexOf('州') > -1 && !mCity[parse._area]) {
                parse._area = address.substr(address.indexOf('州') - 2, 2);
                }
            }

            parse.area = parse.area.trim();
            if (parse.area && mArea[parse.area]) {
                if (mArea[parse.area].length === 1) {
                parse.province = mArea[parse.area][0].p;
                parse.city = mArea[parse.area][0].c
                } else {
                parse._area = parse._area.trim();
                const addr = address.substr(0, areaIndex);
                const d = mArea[parse.area].find(item => {
                    return item.p.indexOf(addr) > -1 || item.c === parse._area;
                });
                if (d) {
                    parse.province = d.p;
                    parse.city = d.c
                } else {
                    parse.result = mArea[parse.area];
                }
                }
            } else {
                if (parse._area) {
                const city = mCity[parse._area];
                if (city) {
                    parse.province = city[0].p;
                    parse.city = city[0].c;
                    parse.addr = address.substr(address.indexOf(parse.city) + parse.city.length + 1);
                    parse.area = '';
                    for (let i in city[0].a) {
                    if (parse.addr.indexOf(city[0].a[i]) === 0) {
                        parse.area = city[0].a[i];
                        parse.addr = parse.addr.replace(city[0].a[i], '');
                        break;
                    }
                    }
                }
                } else {
                parse.area = '';
                }
            }
            parse.addr = parse.addr.trim();
            return parse
            }
}