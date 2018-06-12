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
  var dataObject;

  var storeId =  null;

  toastr.options.positionClass = 'toast-top-center';
  $(function(){
    // localStorage.removeItem("data");
    dataObject = JSON.parse(localStorage.getItem("data"));
    $("#stockInBillMainCode_update").val(dataObject.stockInBillMainCode);
    $("#productOrderCode_update").val(dataObject.productOrderCode);
    $("#billTypeStr_update").val(dataObject.billTypeStr);
    $("#stockinStatusStr_update").val(dataObject.stockinStatusStr);
    $("#applyQuantity_update").val(dataObject.applyQuantity);
    $("#quantity_update").val(dataObject.quantity);
    $("#defectiveQuantity_update").val(dataObject.defectiveQuantity);
    $("#receiverName_update").val(dataObject.receiverName);
    $("#remark_update").val(dataObject.remark);
    storeId= dataObject.storeId;
  });


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


    /*点击店铺*/
  $("#showWarehouse").click(function(){
    host = getGoodsHost();
    stockHost = getGoodsHost();
    token = getCookie("token");
    $("#brandId_update").selectpicker({  
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
          var select = $("#warehosueId_update");
          select.toggle();
          select.empty();
          var resultList = result.data;
          resultList.forEach(function(ele, index){
            if(resultList[index].id == dataObject.warehouseId) {
              select.append("<option value='"+resultList[index].id+"' selected='selected'>"+resultList[index].warehouseName+"</option>"); 
            } else {
              select.append("<option value='"+resultList[index].id+"'>"+resultList[index].warehouseName+"</option>"); 
            }
          });
          //初始化刷新数据  
          $("#warehosueId_update").removeAttr("disabled");
          $("#warehosueId_update").selectpicker('refresh');
        } else {
          toastr.error('获取店铺失败！');
        }
      },
      error: function() {
        toastr.error('获取店铺失败！');
      }
    });
    return false;
  })


 /*保存数据*/
  $("#saveBtn").click(function() {
    host = getGoodsHost();
    token = getCookie("token");
    var para = $('#saveForm').serializeObject();
    var saveForm = JSON.stringify(para);
    $.ajax({
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      url: host + "erp-svc-goods/saleOrder/update/"+dataObject.id,
      // +"?pageNo=" +fs._iDisplayStart + "&pageSize=" + fs._iDisplayLength,
      data: saveForm,
      beforeSend: function(request) {
        request.setRequestHeader("Authorization", "Bearer " + token);
        // request.setRequestHeader("Access-Control-Allow-Origin", "*");
      },
      success: function(result) {

        if (result.status == 0) {
          window.location.href = 'order.html';
          toastr.success(result.msg);
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


 $("#showBtn").click(function(event) {
  host = getGoodsHost();
  stockHost = getStockHost();
  token = getCookie("token");
  lastQuery = "{}";
  $.ajax({
    type: 'post',
    contentType: 'application/json; charset=utf-8',
    url: stockHost + "erp-svc-stock/stockIn/findAllDetail/"+dataObject.id,
    // +"?pageNo=" +fs._iDisplayStart + "&pageSize=" + fs._iDisplayLength,
    data: lastQuery,
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
          "data": "quantity"
        }, {
          "data": "inQuantity"
        }, {
          "data": "inferiorQuantity"
        }, {
          "data": "weight"
        }, {
          "data": "price"
        }, {
          "data": "totalPrice"
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
})



  /*刷新数据*/

  function refreshTable(data) {
    var flag = false;
    host = getGoodsHost();
    stockHost = getStockHost();
    token = getCookie("token");
    $.ajax({
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      url: stockHost + "erp-svc-stock/stockIn/findAllDetail/"+dataObject.id,
      data: data,
      beforeSend: function(request) {
        request.setRequestHeader("Authorization", 'Bearer ' + token);  
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
          "data": "quantity"
        }, {
          "data": "inQuantity"
        }, {
          "data": "inferiorQuantity"
        }, {
          "data": "weight"
        }, {
          "data": "price"
        }, {
          "data": "totalPrice"
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
  }



    /*增加数据*/
  $("#addBtn").click(function() {
    host = getGoodsHost();
    stockHost = getStockHost();
    token = getCookie("token");
    $("#addLabel").text("新增");
    $('#myModal').modal();
    $(".selectpicker").selectpicker({  
      noneSelectedText : '请选择'  
      });
    $.ajax({
      url : host+'erp-svc-goods/goodsSku/list',
      type: 'post',
      dataType: 'json',
      data: "{}",
      contentType: 'application/json; charset=utf-8',
      beforeSend: function(request) {
          request.setRequestHeader("Authorization", 'Bearer ' + token);  
      },
      success: function(result) {
        if (result.status == 0) {
          var select = $("#skuId_add");
          select.toggle();
          select.empty();
          var resultList = result.data;
          resultList.forEach(function(ele, index){
            select.append("<option value='"+JSON.stringify(resultList[index])+"'>"+resultList[index].goodsCode+"+"+resultList[index].colorName+"+"+resultList[index].sizeName+"</option>"); 
          })
          //初始化刷新数据  
          $("#skuId_add").selectpicker('refresh');
        } else {
          toastr.error('获取SKU失败！');
        }
      },
      error: function() {
        toastr.error('获取SKU失败！');
      }
    });
  })

  $("#add_submit").click(function(event) {
    host = getGoodsHost();
    stockHost = getStockHost();
    token = getCookie("token");
    var form = $('#addForm').serializeObject();
    var sku = JSON.parse(form.skuId);
    form.goodsId = sku.goodsId;
    form.goodsCode = sku.goodsCode;
    form.goodsName = sku.goodsName;
    form.skuId = sku.id;
    form.skuCode = sku.skuCode;
    form.skuName = sku.skuName;
    form.colorId = sku.colorId;
    form.colorCode = sku.colorCode;
    form.colorName = sku.colorName;
    form.sizeId = sku.sizeId;
    form.sizeCode = sku.sizeCode;
    form.sizeName = sku.sizeName;
    var tableForm = JSON.stringify(form);
    $.ajax({
      url : stockHost+'erp-svc-stock/stockIn/addDetail?mainCode='+dataObject.stockInBillMainCode,
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
    stockHost = getStockHost();
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
            url: stockHost + 'erp-svc-stock/stockIn/deleteDetail/' + deleteId,
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
      return false;
  })

/*修改数据*/

  $("#updateBtn").click(function(event) {
    host = getGoodsHost();
    stockHost = getStockHost();
    token = getCookie("token");
    // window.location.href = 'goods_update.html?id=' + deleteId;
        // $("#test").val("nihaoa");
    $("#updateLabel").text("修改");
    $('#myUpdateModal').modal();
    $(".selectpicker").selectpicker({  
      noneSelectedText : '请选择'  
    }); 
    $.ajax({
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      url: stockHost + "erp-svc-stock/stockIn/findDetail/" + deleteId,
      beforeSend: function(request) {
        request.setRequestHeader("Authorization", 'Bearer ' + token);  
      },
      success: function(result) {
        if (result.status == 0) {
          $("#quantity").val(result.data.quantity);
          $("#inQuantity").val(result.data.inQuantity);
          $("#inferiorQuantity").val(result.data.inferiorQuantity);
          $("#weight").val(result.data.weight);
          $("#price").val(result.data.price);
          $("#remake").val(result.data.remake);
          $("#skuId_update").val(result.data.goodsCode+"+"+result.data.colorName+"+"+result.data.sizeName);
        }else {
          toastr.error('获取订单详情失败！');
        }
      },
      error: function() {
        toastr.error('获取订单详情失败！');
      }

    })

  })

  $('#update_submit').click(function(event) {
    var updateObject = $("#updateForm").serializeObject();
    var updateForm = JSON.stringify(updateObject);
    $.ajax({
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      url: stockHost + "erp-svc-stock/stockIn/updateDetail/" + deleteId+"?mainCode="+dataObject.stockInBillMainCode,
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
