const fileInput = document.getElementById("file-input");
const submitBtn = document.getElementById("submit-btn");
const previewImg = document.getElementById("image-preview");   

fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
        previewImg.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

submitBtn.addEventListener("click", (event) => {
    // event.preventDefault();
    // 提交表单逻辑
    const fileInput = document.querySelector('#file-input');

    const file = fileInput.files[0];
    console.log("file：",file)
    
    const formData = new FormData();
    formData.append('image', file);
    console.log(formData);

    //post时要把图片转为blob 后端再将blob转化成图片
    fetch('/imgOcr', {
        method: 'POST',
        body: formData ,
        headers: {
        'Content-Type': 'multipart/form-data'
        }
    })
    .then(response => {
        let data = response.text()
        console.log(data)
        return data
        // response.json()
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error(error);
    });
});