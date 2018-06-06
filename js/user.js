// Call the dataTables jQuery plugin
$(document).ready(function() {
// 在这里引入了config.js
  new_element=document.createElement("script"); 
  new_element.setAttribute("type","text/javascript"); 
  new_element.setAttribute("src","js/util.js"); 
  document.body.appendChild(new_element);
  // To style all <select>
  $('select').selectpicker();

  var host;

  var token = document.cookie.split(";")[0];
  // var token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1Mjc5NTYyMDEsInVzZXJfbmFtZSI6InN5c3RlbSIsImF1dGhvcml0aWVzIjpbImVycFByaW5jaXBhbDpleUppWVhOcFkxVnpaWElpT25zaWRYTmxja2xrSWpveExDSjFjMlZ5UTI5a1pTSTZJbk41YzNSbGJTSXNJblZ6WlhKT1lXMWxJam9pYzNsemRHVnRJaXdpY0dWeWMyOXVUbUZ0WlNJNmJuVnNiQ3dpY0dWeWMyOXVTV1FpT2pGOWZRPT0iXSwianRpIjoiZjM1ZjhkZWQtYWE1ZC00NzgyLTg3NTMtZDNmYTllYWMyODcyIiwiY2xpZW50X2lkIjoiZXJwLWNsb3VkIiwic2NvcGUiOlsib3BlbmlkIl19.mRODYcySJitGU3wGksUkr5YHMTW2bHHSIi7Ft9DoBdLyXZ6oaH3nceRyb0fyVTQEuk0V1MqCpRjfjU7SGR07aLXUotpf78nnrgdQj6RfJFvHV9MmFaWSfFlimqE-3YwEUCCyc_ATCDWgrHftMlTQuZYNnS9-4YGJ4WWbe2oXjxAnJ1gYW3gMMlmwCW5zEmKSUPPczC_3VqfD_G5W_tsOTMvGJsCqJe0Z8Id5XLY_JTV41SJFLpJjPAwXgIalFSjtf-8uQswIy8e3Q-iZaTJrM2wnliqtHiz3mzMBQLeXtAm4ZgY6oOlUNRolw_ZrGNFVCStvgSksT7Wri06HXrYYPg";
  // var lastIdx = null;
  var DataTable;

  var dataTable = $("#dataTable").dataTable();

  var deleteId = null;

  var selectId = null;

  var firstIdx = null;

  var lastQuery = null;


  var setting = dataTable.fnSettings();
  var pageNo = setting._iDisplayStart + 1;
  var pageSize = setting._iDisplayLength;

  toastr.options.positionClass = 'toast-top-center';

  $('#dataTable tbody').on('click', 'tr', function() {
    host = getGoodsHost();
    // if (firstIdx == null) {
    //   $('#userDeleteBtn').removeAttr('disabled');
    //   $('#userUpdateBtn').removeAttr('disabled');

    //   var rowData = DataTable.row(this).data();
    //   deleteId = rowData.id;

    //   if (deleteId !== null) {
    //     $(this).removeClass('highlight');
    //     $(this).addClass('highlight');
    //   }
    // } else {
    //   if (firstIdx.equals(DataTable.row(this))) {
    //     if ($(this).hasClass('highlight')) {
    //       $(this).removeClass('highlight')
    //       deleteId = null;
    //       $('#userDeleteBtn').attr('disabled', 'false');
    //       $('#userUpdateBtn').attr('disabled', 'false');
    //     } else {
    //       $('#userDeleteBtn').removeAttr('disabled');
    //       $('#userUpdateBtn').removeAttr('disabled');

    //       var rowData = DataTable.row(this).data();
    //       deleteId = rowData;

    //       if (deleteId !== null) {
    //         $(this).removeClass('highlight');
    //         $(this).addClass('highlight');
    //       }
    //     }
    //   } else {
    //     $('#userDeleteBtn').removeAttr('disabled');
    //     $('#userUpdateBtn').removeAttr('disabled');

    //     var rowData = DataTable.row(this).data();
    //     deleteId = rowData.id;

    //     if (deleteId !== null) {
    //       $(this).removeClass('highlight');
    //       $(this).addClass('highlight');
    //     }

    //     $('#dataTable tbody tr').eq(firstIdx).removeClass('highlight');
    //   }
    // }

    // firstIdx = DataTable.row(this)[0];

    var rowData = DataTable.row(this).data();
    if(firstIdx == null) {
      $(this).addClass('highlight');
      firstIdx = DataTable.row(this)[0];
      deleteId = DataTable.row(this).data().id;
      $('#userDeleteBtn').removeAttr('disabled');
      $('#userUpdateBtn').removeAttr('disabled');
    } else {
      if (firstIdx.equals(DataTable.row(this)[0])) {
        $(this).removeClass('highlight');
        deleteId = null;
        $('#userDeleteBtn').attr('disabled','true');
        $('#userUpdateBtn').attr('disabled','true');
      } else {
        $('#dataTable tbody tr').eq(firstIdx).removeClass('highlight');
        firstIdx = DataTable.row(this)[0];
        deleteId = DataTable.row(this).data().id;
        $(this).addClass('highlight');
        $('#userDeleteBtn').removeAttr('disabled'); 
        $('#userUpdateBtn').removeAttr('disabled');
      }
    }
  })

  /*查找数据*/
  $("#userSelectBtn").click(function() {
    host = getGoodsHost();
    var para = $('#userQuery').serializeObject();
    var tableQuery = JSON.stringify(para);
    lastQuery = tableQuery;
    var fs =  $("#dataTable").dataTable().fnSettings();
    $.ajax({
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      url: host + "erp-svc-goods/user/list",
      // +"?pageNo=" +fs._iDisplayStart + "&pageSize=" + fs._iDisplayLength,
      data: tableQuery,
      beforeSend: function(request) {
        request.setRequestHeader("Authorization", "Bearer " + token);
        // request.setRequestHeader("Access-Control-Allow-Origin", "*");
      },
      success: function(result) {

        if (result.status == 0) {
          toastr.success(result.msg);
          if (dataTable) {
          dataTable.fnClearTable(); //清空数据
          dataTable.fnDestroy(); //销毁datatable
          }
          // if (result.data.page) {
          //   result.data.recordsTotal = result.data.page.total;
          //   result.data.recordsFiltered = result.data.page.
          // }
          result.data.forEach(function(ele,index){
            ele.createTime = formatTime(ele.createTime);
          })
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
        } else {
          toastr.error(result.msg);
        }
        
      },
      error: function() {
        toastr.error("服务器出错，需联系管理员！");
      }
    });

    return false;

  });

  /*增加数据*/
  $("#userAddBtn").click(function() {
    host = getGoodsHost();
    $("#addLabel").text("新增");
    $('#myAddModal').modal();
    $(".selectpicker").selectpicker({  
      noneSelectedText : '请选择'  
      });  
    $.ajax({
      url : host+'erp-svc-goods/person/list',
      type: 'post',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      beforeSend: function(request) {
          request.setRequestHeader("Authorization", 'Bearer ' + token);  
      },
      success: function(result) {
        if (result.status == 0) {
          var personSelect = $("#personId_add");
          personSelect.empty();
          var personList = result.data;
          personList.forEach(function(ele, index){
            personSelect.append("<option value='"+personList[index].id+"'>"+personList[index].personName+"</option>"); 
          })
          $('#personId_add').selectpicker('refresh');  
          //初始化刷新数据  
          // $('.selectpicker').selectpicker('val', ''); 
        } else {
          toastr.error('获取人员失败！');
        }
      },
      error: function() {
        toastr.error('获取人员失败！');
      }
    })
  });

  $("#user_submit").click(function(event) {
    host = getGoodsHost();
    var form = $('#userForm').serializeObject();
    var tableForm = JSON.stringify(form);
    alert(tableForm);

    $.ajax({
      url: host + 'erp-svc-goods/user/add',
      type: 'post',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: tableForm,
      beforeSend: function(request) {
          request.setRequestHeader("Authorization", 'Bearer ' + token);  
      },
      success: function(result) {
        if (result.status == 0) {
          refreshTable(lastQuery);
          toastr.success(result.msg);
        } else {
          toastr.error(result.msg);
        }
      },
      error: function() {
        toastr.error('数据新增失败');
      }
    })

  });

  /*删除数据*/
  $('#userDeleteBtn').click(function(event) {
    host = getGoodsHost();
    swal({
        title: "操作提示",
        text: "确定删除该条数据么？",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          $.ajax({
            type: "delete",
            url: host + 'erp-svc-goods/user/delete/' + deleteId,
            beforeSend: function(request) {
              request.setRequestHeader("Authorization", "Bearer "+token);
            },
            success: function(data) {
              // DataTable.row($('#dataTable tbody tr').eq(firstIdx)).remove().draw(false);
              // dataTable.fnDraw(false);
              refreshTable(lastQuery);
              toastr.success('数据删除成功');
            },
            error: function() {
              toastr.error('数据删除失败');
            }
          });
        };
        $('#dataTable tbody tr').eq(firstIdx).removeClass('highlight');
        firstIdx = null;
        deleteId = null;
      });
  })

  /*修改数据*/

  $("#userUpdateBtn").click(function(event) {
    host = getGoodsHost();
    $("#updateLabel").text("新增");
    $('#myUpdateModal').modal();
    $(".selectpicker").selectpicker({  
      noneSelectedText : '请选择'  
    }); 
    $.ajax({
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      url: host + "erp-svc-goods/user/" + deleteId,
      beforeSend: function(request) {
        request.setRequestHeader("Authorization", 'Bearer ' + token);  
      },
      success: function(result) {
        if (result.status == 0) {
          $.ajax({
            url : host+'erp-svc-goods/person/list',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", 'Bearer ' + token);  
            },
            success: function(result) {
              if (result.status == 0) {
                var personSelect = $("#personId_update");
                personSelect.empty();
                var personList = result.data;
                personList.forEach(function(ele, index){
                  personSelect.append("<option value='"+personList[index].id+"'>"+personList[index].personName+"</option>"); 
                })
                $('#personId_update').selectpicker('refresh');  
                //初始化刷新数据
                // $('.selectpicker').selectpicker('val', ''l);
              } else {
                toastr.error('获取人员失败！');
              }
            },
            error: function() {
              toastr.error('获取人员失败！');
            }
          });
          $("#userCode_update").val(result.data.userCode);
          $("#userName_update").val(result.data.userName);

        }
      }

    })

  })
  $('#user_submit_update').click(function(event) {
    var updateObject = $("#userForm_update").serializeObject();
    var updateForm = JSON.stringify(updateObject);
    $.ajax({
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      url: host + "erp-svc-goods/user/update/" + deleteId,
      data: updateForm,
      beforeSend: function(request) {
        request.setRequestHeader("Authorization", 'Bearer ' + token);  
      },
      success: function(result) {
        if (result.status == 0) {
            toastr.success(result.msg);
            refreshTable(data);
          }else{
            toastr.error(result.msg);
          }
        },
      error: function(){
        toastr.error("服务器出错，需联系管理员！");
      }
    });
    $("#userCode_update").val(result.data.userCode);
    $("#userName_update").val(result.data.userName);
  })


  /*刷新数据*/

  function refreshTable(data) {

    var flag = false;
    host = getGoodsHost();
    $.ajax({
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      url: host + "erp-svc-goods/user/list",
      data: data,
      beforeSend: function(request) {
        request.setRequestHeader("Authorization", 'Bearer ' + token);  
      },
      success: function(result) {

        if (dataTable) {
          dataTable.fnClearTable(); //清空数据
          dataTable.fnDestroy(); //销毁datatable
        }
        result.data.forEach(function(ele,index){
          ele.createTime = formatTime(ele.createTime);
        })

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

  $(window).on('load', function () {  
    $('.selectpicker').selectpicker({  
      'selectedText': 'cat'  
    }); 
    // $('.selectpicker').selectpicker('hide');  
  }); 

})