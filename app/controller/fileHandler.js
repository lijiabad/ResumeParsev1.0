'use strict';

const { Controller } = require('egg');
const { FormData } = require('form-data');
const { path } = require('path');
const { fs } = require('fs');
// 引入python子进程模块
const { PythonShell } = require('python-shell');

// const fs = require('mz/fs');
const sendToWormhole = require('stream-wormhole');

class FileHandlerController extends Controller {
    async imgUpload() {
        const { ctx } = this;
        // const stream = await ctx.getFileStream();

        // const filePath = './';
        // const writeStream = fs.createWriteStream(filePath);
        
        // // 将文件流管道写入到本地文件，并返回 Promise 对象
        // await new Promise((resolve, reject) => {
        //   stream.pipe(writeStream)
        //         .on('finish', resolve)
        //         .on('error', reject);
        // });

        // 返回成功结果
        ctx.body = {
            code: 101,
            message: '上传成功！',
        };
    }
}

module.exports = FileHandlerController;
