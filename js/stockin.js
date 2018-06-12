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
          var select = $("#warehouseId");
          select.toggle();
          select.empty();
          var resultList = result.data;
          select.append("<option value=''>"+""+"</option>"); 
          resultList.forEach(function(ele, index){
            select.append("<option value='"+resultList[index].id+"'>"+resultList[index].warehouseName+"</option>"); 
          })
          //初始化刷新数据  
          $("#warehouseId").removeAttr('disabled');
          $("#warehouseId").selectpicker('refresh');
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

    /*点击供应商*/
  $("#showSupplier").click(function(){
    host = getGoodsHost();
    token = getCookie("token");
    $("#storeId").selectpicker({  
      noneSelectedText : '请选择'  
    });
    $.ajax({
      url : host+'erp-svc-goods/supplier/list',
      type: 'post',
      dataType: 'json',
      data: "{}",
      contentType: 'application/json; charset=utf-8',
      beforeSend: function(request) {
          request.setRequestHeader("Authorization", 'Bearer ' + token);  
      },
      success: function(result) {
        if (result.status == 0) {
          var select = $("#supplierId");
          select.toggle();
          select.empty();
          var resultList = result.data;
          select.append("<option value=''>"+""+"</option>"); 
          resultList.forEach(function(ele, index){
            select.append("<option value='"+resultList[index].id+"'>"+resultList[index].supplierName+"</option>"); 
          })
          //初始化刷新数据  
          $("#supplierId").removeAttr('disabled');
          $("#supplierId").selectpicker('refresh');          
        } else {
          toastr.error('获取供应商失败！');
        }
      },
      error: function() {
        toastr.error('获取供应商失败！');
      }
    })
    return false;
  });

    /*查找数据*/
  $("#selectBtn").click(function() {
    host = getStockHost();
    token = getCookie("token");
    var para = $('#query').serializeObject();
    var tableQuery = JSON.stringify(para);
    lastQuery = tableQuery;
    var fs =  $("#dataTable").dataTable().fnSettings();
    $.ajax({
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      url: host + "erp-svc-stock/stockIn/list",
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
            ele.auditDate = formatTime(ele.auditDate);
            ele.assignTime = formatTime(ele.assignTime);
          })
          DataTable = $("#dataTable").DataTable({
          data: result.data,
          columns: [{
            "data": "id"
          }, {
            "data": "stockInBillMainCode"
          }, {
            "data": "productOrderCode"
          }, {
            "data": "billTypeStr"
          }, {
            "data": "stockinStatusStr"
          }, {
            "data": "stockinDate"
          },{
            "data": "supplierName"
          }, {
            "data": "warehouseName"
          }, {
            "data": "trackNumber"
          }, {
            "data": "auditDate"
          }, {
            "data": "applyQuantity"
          }, {
            "data": "quantity"
          }, {
            "data": "defectiveQuantity"
          }, {
            "data": "stockInMoney"
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
    host = getStockHost();
    token = getCookie("token");
    $.ajax({
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      url: host + "erp-svc-stock/stockIn/list",
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
            ele.auditDate = formatTime(ele.auditDate);
            ele.stockinDate = formatTime(ele.stockinDate);     
        })

        DataTable = $("#dataTable").DataTable({

          data: result.data,
          columns: [{
            "data": "id"
          }, {
            "data": "stockInBillMainCode"
          }, {
            "data": "productOrderCode"
          }, {
            "data": "billTypeStr"
          }, {
            "data": "stockinStatusStr"
          }, {
            "data": "stockinDate"
          },{
            "data": "supplierName"
          }, {
            "data": "warehouseName"
          }, {
            "data": "trackNumber"
          }, {
            "data": "auditDate"
          }, {
            "data": "applyQuantity"
          }, {
            "data": "quantity"
          }, {
            "data": "defectiveQuantity"
          }, {
            "data": "stockInMoney"
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
    stockHost = getStockHost();
    token = getCookie("token");
    $("#addLabel").text("新增");
    $('#myModal').modal();
    $(".selectpicker").selectpicker({  
      noneSelectedText : '请选择'  
      });

    $.ajax({
      url : host+'erp-svc-goods/supplier/list',
      type: 'post',
      dataType: 'json',
      data: "{}",
      contentType: 'application/json; charset=utf-8',
      beforeSend: function(request) {
          request.setRequestHeader("Authorization", 'Bearer ' + token);  
      },
      success: function(result) {
        if (result.status == 0) {
          var select = $("#supplierId_add");
          select.empty();
          var dataList = result.data;
          dataList.forEach(function(ele, index){
            select.append("<option value='"+JSON.stringify(dataList[index])+"'>"+dataList[index].supplierName+"</option>"); 
          })
          //初始化刷新数据  
          $('#supplierId_add').selectpicker('refresh');  
        } else {
          toastr.error('获取供应商失败！');
        }
      },
      error: function() {
        toastr.error('获取供应商失败！');
      }
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
          var select = $("#warehouseId_add");
          select.empty();
          var dataList = result.data;
          dataList.forEach(function(ele, index){
            select.append("<option value='"+dataList[index].id+"'>"+dataList[index].warehouseName+"</option>"); 
          })
          //初始化刷新数据  
          $('#warehouseId_add').selectpicker('refresh');  
        } else {
          toastr.error('获取店铺失败！');
        }
      },
      error: function() {
        toastr.error('获取店铺失败！');
      }
    });
  });

  $("#add_submit").click(function(event) {
    host = getGoodsHost();
    stockHost = getStockHost();
    token = getCookie("token");
    var form = $('#addForm').serializeObject();
    var supplier = JSON.parse(form.supplierId);
    form.supplierId = supplier.id;
    form.supplierCode = supplier.supplierCode;
    form.supplierName = supplier.supplierName;
    var tableForm = JSON.stringify(form);
    $.ajax({
      url: stockHost + 'erp-svc-stock/stockIn/add',
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
            url: stockHost + 'erp-svc-stock/stockIn/delete/' + deleteId,
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
    stockHost = getStockHost();
    token = getCookie("token");
    // $("#updateLabel").text("修改");
    // $('#myUpdateModal').modal();
    // $(".selectpicker").selectpicker({  
    //   noneSelectedText : '请选择'  
    // }); 
    $.ajax({
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      url: stockHost + "erp-svc-stock/stockIn/find/" + deleteId,
      beforeSend: function(request) {
        request.setRequestHeader("Authorization", 'Bearer ' + token);  
      },
      success: function(result) {
        var resultData = result.data;
        localStorage.setItem("data",JSON.stringify(resultData));
        window.location.href = 'stockin_update.html'; 
      },
      error: function() {
        toastr.error('获取订单失败！');
      }
    });

  })

})