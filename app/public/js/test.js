//     getFile:function (type){
//     let id =''
//     if(vm.reportType === 'weekend'){
//         id = 'file-upload-week'+type
//     }else if(vm.reportType === 'month'){
//         id = 'file-upload-month'+type
//     }
//     document.getElementById(id).click()
//     },
// //添加修改图片
//     preview:function (e,type){//imgUpload
//     let files = e.target.files;
//     let imgData=[]
//     for (var i = 0; i < files.length; i++) {
//         imgData.push(files[i]);
//     }
//     this.uploadImage(imgData,type)
//     },
// //上传图
//     uploadImage:function (img,type){
//     showLoading();
//     var formData = new FormData();
//     formData.append("file", img[0]);
//     formData.append('datefrom', this.imageDate[0]);
//     formData.append('dateto', this.imageDate[1]);
//     formData.append('type', type);
//     $.ajax({
//         url: RES_IP + 'xxxx',
//         dataType: 'json',
//         type: 'post',
//         data: formData,
//         cache: false,
//         processData: false,
//         contentType: false,
//         success: function (res) {
//         if (res.status) {
//             if(vm.reportType === 'weekend'){
//             vm.getWeekReport()
//             }else if(vm.reportType === 'month'){
//             vm.getMonthReport()
//             }
//         } else {
//         }
//         }
//     })
// }