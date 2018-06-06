$(document).ready(function() {
  // 加载config.js
  new_element=document.createElement("script"); 
  new_element.setAttribute("type","text/javascript"); 
  new_element.setAttribute("src","js/util.js");// 在这里引入了cookies.js 
  document.body.appendChild(new_element);

  toastr.options.positionClass = 'toast-top-center';
	$("#loginBtn").click(function(){
    var host = getGoodsHost();
    $.ajax({
          // url: host + 'auth/login?userName='+un+'&password='+pw,
          url: host + 'auth/login?userName=system&password=123456',
          type: 'post',
          // dataType: 'json',
          contentType: 'application/json; charset=utf-8',
          // async: false,
          // data: formJson,
          success: function(result) {
            if (result.status == 0) {
              toastr.success(result.msg);
              setCookie("token",result.data);
              window.location.href = 'default.html';
            } else {
              toastr.error(result.msg);
            }
          },
          error: function() {
            toastr.error('登入失败');
      }
    });
    return false; 
  });

})