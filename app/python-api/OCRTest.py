from ecloud import CMSSEcloudOcrClient
import json
import base64


accesskey = 'your_ak'
secretkey = 'your_sk'
url = 'https://api-wuxi-1.cmecloud.cn:8443'

def request_smartstructure_file():
    print("请求智能结构化接口")
    requesturl = '/api/ocr/v1/smartstructure'
    imagepath = 'D:\\JG-CMSS\\PaaS_MrZ\\智库2023\\SDK\\PythonSDK\\Python_SDK\\test_code\\sfz.jpg'
    try:
        ocr_client = CMSSEcloudOcrClient(accesskey, secretkey, url)
        response = ocr_client.request_ocr_service_file(requestpath=requesturl, imagepath= imagepath)
        print(response.text)

    except ValueError as e:
        print(e)

def request_webimage_file(imagepath):
    print("请求File参数")
    requesturl = '/api/ocr/v1/webimage'
    # imagepath = 'C:\\Users\\zhuli\\Desktop\\smartlib_python_sdk\\test_code\\sfz.jpg'
    try:
        ocr_client = CMSSEcloudOcrClient(accesskey, secretkey, url)
        response = ocr_client.request_ocr_service_file(requestpath=requesturl, imagepath= imagepath)
        print(response.text)
        
    except ValueError as e:
        print(e)

def request_webimage_base64():
    print("请求Base64参数")
    imagepath = 'D:\\JG-CMSS\\PaaS_MrZ\\智库2023\\SDK\\PythonSDK\\Python_SDK\\test_code\\sfz.jpg'
    requesturl = '/api/ocr/v1/webimage'
    with open(imagepath, 'rb') as f:
        img = f.read()
        image_base64 = base64.b64encode(img).decode('utf-8')
        ocr_client = CMSSEcloudOcrClient(accesskey, secretkey, url)
        response = ocr_client.request_ocr_service_base64(requestpath=requesturl,base64=image_base64)
        print(response.text)


def request_webimage_url():
    print("请求URL参数")
    requesturl = '/api/ocr/v1/webimage'
    imageurl = 'http://10.253.51.155:10086/wangluotupian.jpg'
    try:
        ocr_client = CMSSEcloudOcrClient(accesskey, secretkey, url)
        response = ocr_client.request_ocr_service_url(requesturl, imageurl)
        print(response.text)
    except ValueError as e:
        print(e)



def request_handwriting():
    requesturl = '/api/ocr/v1/handwriting'
    imagepath = './webimage.jpg'
    try:
        ocr_client = CMSSEcloudOcrClient(accesskey, secretkey, url)
        response = ocr_client.request_ocr_service_file(requestpath=requesturl, imagepath= imagepath)
        print(response.text)
    except ValueError as e:
        print(e)

def request_customverify():
    requesturl = '/api/ocr/v1/selfdefinition'
    imagepath = './shenfenzheng.jpg'
    options = {}
    options['TemplateId'] = '76542407608369152'
    try:
        ocr_client = CMSSEcloudOcrClient(accesskey, secretkey, url)
        response = ocr_client.request_ocr_service_file(requestpath=requesturl, imagepath= imagepath, options=options)
        print(response.text)
    except ValueError as e:
        print(e)

if __name__ == "__main__":
    request_webimage_file()
    # request_smartstructure_file()
    # request_webimage_base64()
    #request_webimage_url()
    #request_handwriting()
    #request_customverify()

