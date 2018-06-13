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

  var stockHost;

  var token;
  // var token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1Mjc5NTYyMDEsInVzZXJfbmFtZSI6InN5c3RlbSIsImF1dGhvcml0aWVzIjpbImVycFByaW5jaXBhbDpleUppWVhOcFkxVnpaWElpT25zaWRYTmxja2xrSWpveExDSjFjMlZ5UTI5a1pTSTZJbk41YzNSbGJTSXNJblZ6WlhKT1lXMWxJam9pYzNsemRHVnRJaXdpY0dWeWMyOXVUbUZ0WlNJNmJuVnNiQ3dpY0dWeWMyOXVTV1FpT2pGOWZRPT0iXSwianRpIjoiZjM1ZjhkZWQtYWE1ZC00NzgyLTg3NTMtZDNmYTllYWMyODcyIiwiY2xpZW50X2lkIjoiZXJwLWNsb3VkIiwic2NvcGUiOlsib3BlbmlkIl19.mRODYcySJitGU3wGksUkr5YHMTW2bHHSIi7Ft9DoBdLyXZ6oaH3nceRyb0fyVTQEuk0V1MqCpRjfjU7SGR07aLXUotpf78nnrgdQj6RfJFvHV9MmFaWSfFlimqE-3YwEUCCyc_ATCDWgrHftMlTQuZYNnS9-4YGJ4WWbe2oXjxAnJ1gYW3gMMlmwCW5zEmKSUPPczC_3VqfD_G5W_tsOTMvGJsCqJe0Z8Id5XLY_JTV41SJFLpJjPAwXgIalFSjtf-8uQswIy8e3Q-iZaTJrM2wnliqtHiz3mzMBQLeXtAm4ZgY6oOlUNRolw_ZrGNFVCStvgSksT7Wri06HXrYYPg";
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
    host = getGoodsHost();
    token = getCookie("token");
    var rowData = DataTable.row(this).data();
    var fs =  $("#dataTable").dataTable().fnSettings();
    if(firstIdx == null) {
      $(this).addClass('highlight');
      firstIdx = DataTable.row(this)[0];
      deleteId = DataTable.row(this).data().id;
      $('#updateBtn').removeAttr('disabled');
      $('#deleteBtn').removeAttr('disabled');
    } else {
      if (firstIdx.equals(DataTable.row(this)[0])) {
        $(this).removeClass('highlight');
        deleteId = null;
        firstIdx = null;
        $('#updateBtn').attr('disabled','true');
        $('#deleteBtn').attr('disabled','true');
      } else {
        $('#dataTable tbody tr').eq(firstIdx%fs._iDisplayLength).removeClass('highlight');
        firstIdx = DataTable.row(this)[0];
        deleteId = DataTable.row(this).data().id;
        $(this).addClass('highlight');
        $('#updateBtn').removeAttr('disabled'); 
        $('#deleteBtn').removeAttr('disabled');
      }
    }
  })

  /*点击仓库*/
  $("#showWarehouse").click(function(){
    stockHost = getStockHost();
    token = getCookie("token");
    $("#storeId").selectpicker({  
      noneSelectedText : '请选择'  
    });
    $.ajax({
      url : stockHost+'erp-svc-stock/warehouse/list',
      type: 'post',
      dataType: 'json',
      data: "{}",
      contentType: 'application/json; charset=utf-8',
      beforeSend: function(request) {
          request.setRequestHeader("Authorization", 'Bearer ' + token);  
      },
      success: function(result) {
        if (result.status == 0) {
          var select = $("#warehouseId_query");
          select.toggle();
          select.empty();
          var resultList = result.data;
          select.append("<option value=''>"+""+"</option>"); 
          resultList.forEach(function(ele, index){
            select.append("<option value='"+resultList[index].id+"'>"+resultList[index].warehouseName+"</option>"); 
          })
          //初始化刷新数据  
          $("#warehouseId_query").removeAttr('disabled');
          $("#warehouseId_query").selectpicker('refresh');
        } else {
          toastr.error('获取仓库失败！');
        }
      },
      error: function() {
        toastr.error('获取仓库失败！');
      }
    })
    return false;
  });


  /*点击商品*/
  $("#showGoods").click(function(){
    host = getGoodsHost();
    token = getCookie("token");
    $("#goodsId_query").selectpicker({  
      noneSelectedText : '请选择'  
    });
    $.ajax({
      url : host+'erp-svc-goods/goods/listGoods',
      type: 'post',
      dataType: 'json',
      data: "{}",
      contentType: 'application/json; charset=utf-8',
      beforeSend: function(request) {
          request.setRequestHeader("Authorization", 'Bearer ' + token);  
      },
      success: function(result) {
        if (result.status == 0) {
          var select = $("#goodsId_query");
          select.toggle();
          select.empty();
          var resultList = result.data;
          select.append("<option value=''>"+""+"</option>"); 
          resultList.forEach(function(ele, index){
            select.append("<option value='"+resultList[index].id+"'>"+resultList[index].goodsCode+"</option>"); 
          })
          //初始化刷新数据  
          $("#goodsId_query").removeAttr('disabled');
          $("#goodsId_query").selectpicker('refresh');
        } else {
          toastr.error('获取商品失败！');
        }
      },
      error: function() {
        toastr.error('获取商品失败！');
      }
    })
    return false;
  });


  /*查找数据*/
  $("#selectBtn").click(function() {
    host = getGoodsHost();
    stockHost = getStockHost();
    token = getCookie("token");
    var para = $('#query').serializeObject();
    var tableQuery = JSON.stringify(para);
    lastQuery = tableQuery;
    var fs =  $("#dataTable").dataTable().fnSettings();
    $.ajax({
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      url: stockHost + "erp-svc-stock/warehouse/currentStock/list",
      data: tableQuery,
      beforeSend: function(request) {
        request.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: function(result) {

        if (result.status == 0) {
          toastr.success(result.msg);
          if (dataTable) {
          dataTable.fnClearTable(); //清空数据
          dataTable.fnDestroy(); //销毁datatable
          }
          result.data.forEach(function(ele,index){
            ele.status = ele.status ? '正常':'停用';            
            ele.createTime = formatTime(ele.createTime);
          })
          DataTable = $("#dataTable").DataTable({
          data: result.data,
          columns: [{
            "data": "id"
          }, {
            "data": "warehouseName"
          }, {
            "data": "goodsCode"
          }, {
            "data": "colorCode"
          }, {
            "data": "colorName"
          }, {
            "data": "sizeCode"
          }, {
            "data": "sizeName"
          }, {
            "data": "skuCode"
          }, {
            "data": "costPrice"
          }, {
            "data": "useNumber"
          }, {
            "data": "reserveNumber"
          }, {
            "data": "totalNumber"
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
  $("#addBtn").click(function() {
    host = getGoodsHost();
    token = getCookie("token");
    $("#addLabel").text("新增");
    $('#myModal').modal();
    // $(".selectpicker").selectpicker({  
    //   noneSelectedText : '请选择'  
    //   });  
    // $.ajax({
    //   url : host+'erp-svc-goods/person/list',
    //   type: 'post',
    //   dataType: 'json',
    //   contentType: 'application/json; charset=utf-8',
    //   beforeSend: function(request) {
    //       request.setRequestHeader("Authorization", 'Bearer ' + token);  
    //   },
    //   success: function(result) {
    //     if (result.status == 0) {
    //       var personSelect = $("#storeManagerId_add");
    //       personSelect.empty();
    //       var personList = result.data;
    //       personList.forEach(function(ele, index){
    //         personSelect.append("<option value='"+personList[index].id+"'>"+personList[index].personName+"</option>"); 
    //       })
    //       //初始化刷新数据  
    //       $('#storeManagerId_add').selectpicker('refresh');  
    //     } else {
    //       toastr.error('获取人员失败！');
    //     }
    //   },
    //   error: function() {
    //     toastr.error('获取人员失败！');
    //   }
    // })
  });

  $("#add_submit").click(function(event) {
    host = getGoodsHost();
    token = getCookie("token");
    var form = $('#addForm').serializeObject();
    var tableForm = JSON.stringify(form);
    $.ajax({
      url: host + 'erp-svc-goods/goodsColor/add',
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
  $('#deleteBtn').click(function(event) {
    host = getGoodsHost();
    token = getCookie("token");
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
            type: "post",
            url: host + 'erp-svc-goods/goodsColor/delete/' + deleteId,
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

  $("#updateBtn").click(function(event) {
    host = getGoodsHost();
    token = getCookie("token");
    $("#updateLabel").text("修改");
    $('#myUpdateModal').modal();
    $(".selectpicker").selectpicker({  
      noneSelectedText : '请选择'  
    }); 
    $.ajax({
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      url: host + "erp-svc-goods/goodsColor/" + deleteId,
      beforeSend: function(request) {
        request.setRequestHeader("Authorization", 'Bearer ' + token);  
      },
      success: function(result) {
        if (result.status == 0) {
          // $.ajax({
          //   url : host+'erp-svc-goods/person/list',
          //   type: 'post',
          //   dataType: 'json',
          //   contentType: 'application/json; charset=utf-8',
          //   beforeSend: function(request) {
          //       request.setRequestHeader("Authorization", 'Bearer ' + token);  
          //   },
          //   success: function(result) {
          //     if (result.status == 0) {
          //       var personSelect = $("#storeManagerId_update");
          //       personSelect.empty();
          //       var personList = result.data;
          //       personList.forEach(function(ele, index){
          //         personSelect.append("<option value='"+personList[index].id+"'>"+personList[index].personName+"</option>"); 
          //       })
          //       $('#storeManagerId_update').selectpicker('refresh');  
          //       //初始化刷新数据
          //       // $('.selectpicker').selectpicker('val', ''l);
          //     } else {
          //       toastr.error('获取人员失败！');
          //     }
          //   },
          //   error: function() {
          //     toastr.error('获取人员失败！');
          //   }
          // });
          resultData = result.data;
          $("#colorCode").val(resultData.colorCode);
          $("#colorName").val(resultData.colorName);
          $("#remark").val(resultData.remark);
        }else {
          toastr.error('获取人员失败！');
        }
      },
      error: function() {
        toastr.error('获取人员失败！');
      }
    })
  })

  $('#update_submit').click(function(event) {
    var updateObject = $("#updateForm").serializeObject();
    var updateForm = JSON.stringify(updateObject);
    $.ajax({
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      url: host + "erp-svc-goods/goodsColor/update/" + deleteId,
      data: updateForm,
      beforeSend: function(request) {
        request.setRequestHeader("Authorization", 'Bearer ' + token);  
      },
      success: function(result) {
        if (result.status == 0) {
            toastr.success(result.msg);
            refreshTable(lastQuery);
          }else{
            toastr.error(result.msg);
          }
        },
      error: function(){
        toastr.error("服务器出错，需联系管理员！");
      }
    });
  })


  /*刷新数据*/

  function refreshTable(data) {

    var flag = false;
    host = getGoodsHost();
    token = getCookie("token");
    $.ajax({
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      url: host + "erp-svc-goods/goodsColor/list",
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
          ele.status = ele.status ? '正常':'停用';
          ele.createTime = formatTime(ele.createTime);
        })

        DataTable = $("#dataTable").DataTable({

          data: result.data,
          columns: [{
            "data": "id"
          }, {
            "data": "colorCode"
          }, {
            "data": "colorName"
          }, {
            "data": "remark"
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
})