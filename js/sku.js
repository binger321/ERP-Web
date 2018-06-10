// Call the dataTables jQuery plugin
$(document).ready(function() {
// 在这里引入了config.js
  new_element=document.createElement("script"); 
  new_element.setAttribute("type","text/javascript"); 
  new_element.setAttribute("src","js/util.js"); 
  document.body.appendChild(new_element);
  // To style all <select>
  // $('select').selectpicker();

  var host;

  var token;

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

  /*查找数据*/
  $("#selectBtn").click(function() {
    host = getGoodsHost();
    token = getCookie("token");
    var para = $('#query').serializeObject();
    var tableQuery = JSON.stringify(para);
    lastQuery = tableQuery;
    var fs =  $("#dataTable").dataTable().fnSettings();
    $.ajax({
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      url: host + "erp-svc-goods/goodsSku/list",
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
          result.data.forEach(function(ele,index){
            ele.status = ele.status ? '正常':'停用';            
            ele.createTime = formatTime(ele.createTime);
          })
          DataTable = $("#dataTable").DataTable({
          data: result.data,
          columns: [{
            "data": "id"
          }, {
            "data": "goodsCode"
          }, {
            "data": "skuCode"
          }, {
            "data": "colorName"
          }, {
            "data": "colorCode"
          }, {
            "data": "sizeName"
          }, {
            "data": "sizeCode"
          }, {
            "data": "weight"
          }, {
            "data": "status"
          }, {
            "data": "comments"
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

    /*刷新数据*/

  function refreshTable(data) {

    var flag = false;
    host = getGoodsHost();
    token = getCookie("token");
    $.ajax({
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      url: host + "erp-svc-goods/goodsSku/list",
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
        })

        DataTable = $("#dataTable").DataTable({

          data: result.data,
          columns: [{
            "data": "id"
          }, {
            "data": "goodsCode"
          }, {
            "data": "skuCode"
          }, {
            "data": "colorName"
          }, {
            "data": "colorCode"
          }, {
            "data": "sizeName"
          }, {
            "data": "sizeCode"
          }, {
            "data": "weight"
          }, {
            "data": "status"
          }, {
            "data": "comments"
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

  /*增加数据*/
  $("#addBtn").click(function() {
    host = getGoodsHost();
    token = getCookie("token");
    $("#addLabel").text("新增");
    $('#myModal').modal();
    $(".selectpicker").selectpicker({  
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
          var select = $("#goodsId_add");
          select.empty();
          var dataList = result.data;
          dataList.forEach(function(ele, index){
            select.append("<option value='"+dataList[index].id+"'>"+dataList[index].goodsCode+"</option>"); 
          })
          //初始化刷新数据  
          $('#goodsId_add').selectpicker('refresh');  
        } else {
          toastr.error('获取商品失败！');
        }
      },
      error: function() {
        toastr.error('获取商品失败！');
      }
    });
    $.ajax({
      url : host+'erp-svc-goods/goodsColor/list',
      type: 'post',
      dataType: 'json',
      data: "{}",
      contentType: 'application/json; charset=utf-8',
      beforeSend: function(request) {
          request.setRequestHeader("Authorization", 'Bearer ' + token);  
      },
      success: function(result) {
        if (result.status == 0) {
          var select = $("#colorId_add");
          select.empty();
          var dataList = result.data;
          dataList.forEach(function(ele, index){
            select.append("<option value='"+dataList[index].id+"'>"+dataList[index].colorName+"</option>"); 
          })
          //初始化刷新数据  
          $('#colorId_add').selectpicker('refresh');  
        } else {
          toastr.error('获取颜色失败！');
        }
      },
      error: function() {
        toastr.error('获取颜色失败！');
      }
    });    
    $.ajax({
      url : host+'erp-svc-goods/goodsSize/list',
      type: 'post',
      dataType: 'json',
      data: "{}",
      contentType: 'application/json; charset=utf-8',
      beforeSend: function(request) {
          request.setRequestHeader("Authorization", 'Bearer ' + token);  
      },
      success: function(result) {
        if (result.status == 0) {
          var select = $("#sizeId_add");
          select.empty();
          var dataList = result.data;
          dataList.forEach(function(ele, index){
            select.append("<option value='"+dataList[index].id+"'>"+dataList[index].sizeName+"</option>"); 
          })
          //初始化刷新数据  
          $('#sizeId_add').selectpicker('refresh');  
        } else {
          toastr.error('获取尺寸失败！');
        }
      },
      error: function() {
        toastr.error('获取尺寸失败！');
      }
    });
  });

  $("#add_submit").click(function(event) {
    host = getGoodsHost();
    token = getCookie("token");
    var form = $('#addForm').serializeObject();
    var tableForm = JSON.stringify(form);
    $.ajax({
      url: host + 'erp-svc-goods/goodsSku/add',
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
            url: host + 'erp-svc-goods/supplier/delete/' + deleteId,
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
    // $(".selectpicker").selectpicker({  
    //   noneSelectedText : '请选择'  
    // }); 
    $.ajax({
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      url: host + "erp-svc-goods/supplier/" + deleteId,
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
          $("#supplierCode").val(resultData.supplierCode);
          $("#supplierName").val(resultData.supplierName);
          $("#contact").val(resultData.contact);
          $("#phoneNumber").val(resultData.phoneNumber);
          $("#bank").val(resultData.bank);
          $("#bankAccount").val(resultData.bankAccount);
          $("#country").val(resultData.country);
          $("#state").val(resultData.state);
          $("#city").val(resultData.city);
          $("#address").val(resultData.address);
        }else {
          toastr.error('获取人员失败！');
        }
      },
      error: function() {
        toastr.error('获取人员失败！');
      }

    });

  })
  $('#update_submit').click(function(event) {
    var updateObject = $("#updateForm").serializeObject();
    var updateForm = JSON.stringify(updateObject);
    $.ajax({
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      url: host + "erp-svc-goods/supplier/update/" + deleteId,
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

})