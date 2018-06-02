$(document).ready(function() {
  	var host = "http://localhost:20001/";
  	toastr.options.positionClass = 'toast-top-center';
	$("#loginBtn").click(function(even){

    	// var formJson = JSON.stringify(form);
    	// alert(un + pw);
    	var un = $('#username').val();
    	var ps = $('#password').val();
		$.ajax({
			// url: host + 'auth/login?userName='+un+'&password='+pw,
			url: 'http://localhost:20001/auth/login?userName=system&password=123456',
      		type: 'post',
      		// dataType: 'json',
      		contentType: 'application/json; charset=utf-8',
      		// data: formJson,
      		success: function(result) {
      		  if (result.status == 0) {
      		  	toastr.success(result.msg);
      		  	window.location.href = 'userTable.html';
      		  } else {
      		  	toastr.error(result.msg);
      		  }
      		},
      		error: function() {
      			toastr.error('登入失败');
			}
		})
	})
})