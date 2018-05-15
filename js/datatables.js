// Call the dataTables jQuery plugin
$(document).ready(function() {



  var host = "http://localhost:20001/";

  var token = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MjYzOTM4MzAsInVzZXJfbmFtZSI6InN5c3RlbSIsImF1dGhvcml0aWVzIjpbImVycFByaW5jaXBhbDpleUppWVhOcFkxVnpaWElpT25zaWRYTmxja2xrSWpveExDSjFjMlZ5UTI5a1pTSTZJbk41YzNSbGJTSXNJblZ6WlhKT1lXMWxJam9pYzNsemRHVnRJaXdpY0dWeWMyOXVUbUZ0WlNJNmJuVnNiQ3dpY0dWeWMyOXVTV1FpT2pGOWZRPT0iXSwianRpIjoiNzg0N2RmNDgtOGU4YS00NmNiLWIxYzgtMTQxNDljZWMwMjM5IiwiY2xpZW50X2lkIjoiZXJwLWNsb3VkIiwic2NvcGUiOlsib3BlbmlkIl19.b22WH-9uAwQDPybCH1AqDojPKKFmE3-6S-h9PMKfml_w4dWQt2f1jHML14TTnKTdgL0wjqwO09ptk4g7dVOKdYZiherKmjauQ5NXFjyYdLaDRahg9M9PORnIbPudYUdV_A2FiIwR3SPGk1F_dfy9OZhX1CQc2dXXjUmo722bBXVogcdK5iL-pRdt0waQKqUsDgDc4p81J5peuQYNLwZMNlIXJvx4AAQPy8tLPaVZkLIA8FKFmt_9Wl2NgQJ_ue2MyNwOFJfvsNNfaxjh5MX2jzZMHtLRM-zAy9WdNjjn1mH3BLYm4EprhAotTYPk4AQvBydMshvS4hcpOAONcDsf-g";
  // var lastIdx = null;
  var DataTable;

  var dataTable = $("#dataTable").dataTable();

  var deleteId = null;

  var firstIdx = null;

  var lastQuery = null;


  var setting = dataTable.fnSettings();
  var pageNo = setting._iDisplayStart + 1;
  var pageSize = setting._iDisplayLength;

  toastr.options.positionClass = 'toast-top-center';

  $('#dataTable tbody').on('click', 'tr', function() {

    if (firstIdx == null) {
      $('#userDeleteBtn').removeAttr('disabled');
      $('#userUpdateBtn').removeAttr('disabled');

      var rowData = DataTable.row(this).data();
      deleteId = rowData.id;

      if (deleteId !== null) {
        $(this).removeClass('highlight');
        $(this).addClass('highlight');
      }
    } else {
      if (firstIdx.equals(DataTable.row(this))) {
        if ($(this).hasClass('highlight')) {
          $(this).removeClass('highlight')
          deleteId = null;
          $('#userDeleteBtn').attr('disabled', 'false');
          $('#userUpdateBtn').attr('disabled', 'false');
        } else {
          $('#userDeleteBtn').removeAttr('disabled');
          $('#userUpdateBtn').removeAttr('disabled');

          var rowData = DataTable.row(this).data();
          deleteId = rowData.id;

          if (deleteId !== null) {
            $(this).removeClass('highlight');
            $(this).addClass('highlight');
          }
        }
      } else {
        $('#userDeleteBtn').removeAttr('disabled');
        $('#userUpdateBtn').removeAttr('disabled');

        var rowData = DataTable.row(this).data();
        deleteId = rowData.id;

        if (deleteId !== null) {
          $(this).removeClass('highlight');
          $(this).addClass('highlight');
        }

        $('#dataTable tbody tr').eq(firstIdx).removeClass('highlight');
      }
    }

    firstIdx = DataTable.row(this)[0];
  })

  /*增加数据*/
  $("#userAddBtn").click(function() {
    $("#myModalLabel").text("新增");
    $('#myModal').modal();
  });

  $("#user_submit").click(function(event) {

    var form = $('#userForm').serializeObject();
    var userSelectForm = JSON.stringify(form);
    alert(userSelectForm);

    $.ajax({
      url: host + 'erp-svc-goods/user/add',
      type: 'post',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: userSelectForm,
      beforeSend: function(request) {
        request.setRequestHeader("Authorization", token);
      },
      success: function() {
        toastr.success('数据新增成功');
      },
      error: function() {
        toastr.error('数据新增失败');
      }
    })

  });

  /*删除数据*/
  $('#userDeleteBtn').click(function(event) {
    swal({
        title: "操作提示",
        text: "确定删除该条数据么？",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        $('#dataTable tbody tr').eq(firstIdx).removeClass('highlight')

        if (willDelete) {
          $.ajax({
            type: "delete",
            url: host + 'erp-svc-goods/user/delete/' + deleteId,
            beforeSend: function(request) {
              request.setRequestHeader("Authorization", token);
            },
            success: function(data) {
              // DataTable.row($('#dataTable tbody tr').eq(firstIdx)).remove().draw(false);
              // dataTable.fnDraw(false);
              userSelect(lastQuery);
              toastr.success('数据删除成功');
            },
            error: function() {
              toastr.error('数据删除失败');
            }
          });
        }
      });
  })

  /*查找数据*/
  $("#userSelectBtn").click(function() {

    var para = $('#userQuery').serializeObject();
    var userSelectQuery = JSON.stringify(para);

    lastQuery = userSelectQuery;

    $.ajax({
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      url: host + "erp-svc-goods/user/list" + "?pageNo=" + pageNo + "&pageSize=" + pageSize,
      data: userSelectQuery,
      beforeSend: function(request) {
        request.setRequestHeader("Authorization", token);
      },
      success: function(result) {

        if (dataTable) {
          dataTable.fnClearTable(); //清空数据
          dataTable.fnDestroy(); //销毁datatable
        }
        DataTable = $("#dataTable").DataTable({

          data: result.data,
          columns: [{
            "data": "id"
          }, {
            "data": "userCode"
          }, {
            "data": "userName"
          }, {
            "data": "personId"
          }, {
            "data": "status"
          }, {
            "data": "createTime"
          }],
          columnDefs: [{
            "visible": false,
            "targets": 0
          }]
        });
        toastr.success('数据查询成功');
      },
      error: function() {
        toastr.error('数据查询失败');
      }
    });

    return false;

  });

  /*修改数据*/

  function userSelect(data) {

    var flag = false;

    $.ajax({
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      url: host + "erp-svc-goods/user/list" + "?pageNo=" + pageNo + "&pageSize=" + pageSize,
      data: data,
      success: function(result) {

        if (dataTable) {
          dataTable.fnClearTable(); //清空数据
          dataTable.fnDestroy(); //销毁datatable
        }
        DataTable = $("#dataTable").DataTable({

          data: result.data,
          columns: [{
            "data": "id"
          }, {
            "data": "userCode"
          }, {
            "data": "userName"
          }, {
            "data": "personId"
          }, {
            "data": "status"
          }, {
            "data": "createTime"
          }],
          columnDefs: [{
            "visible": false,
            "targets": 0
          }]
        });

      },
      error: function() {
        toastr.error('出错');
      }
    });

  };

  $.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
      if (o[this.name]) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });
    return o;
  };

  // Warn if overriding existing method
  if (Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
  // attach the .equals method to Array's prototype to call it on any array
  Array.prototype.equals = function(array) {
    // if the other array is a falsy value, return
    if (!array)
      return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
      return false;

    for (var i = 0, l = this.length; i < l; i++) {
      // Check if we have nested arrays
      if (this[i] instanceof Array && array[i] instanceof Array) {
        // recurse into the nested arrays
        if (!this[i].equals(array[i]))
          return false;
      } else if (this[i] != array[i]) {
        // Warning - two different object instances will never be equal: {x:20} != {x:20}
        return false;
      }
    }
    return true;
  }
  // Hide method from for-in loops
  Object.defineProperty(Array.prototype, "equals", {
    enumerable: false
  });
})