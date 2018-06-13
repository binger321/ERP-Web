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
  var DataTable1;

  var dataTable = $("#dataTable").dataTable();
  var dataTable1 = $("#dataTable1").dataTable();

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
      $('#auditBtn').removeAttr('disabled');
      refreshTable1();
    } else {
      if (firstIdx.equals(DataTable.row(this)[0])) {
        $(this).removeClass('highlight');
        deleteId = null;
        firstIdx = null;
        $('#auditBtn').attr('disabled','true');
      } else {
        $('#dataTable tbody tr').eq(firstIdx%fs._iDisplayLength).removeClass('highlight');
        firstIdx = DataTable.row(this)[0];
        deleteId = DataTable.row(this).data().id;
        $(this).addClass('highlight');
        $('#auditBtn').removeAttr('disabled'); 
        refreshTable1();
      }
    }
  })

  /*点击供应商*/
  $("#showSupplier").click(function(){
    host = getGoodsHost();
    token = getCookie("token");
    $("#supplierId_query").selectpicker({  
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
          var select = $("#supplierId_query");
          select.toggle();
          select.empty();
          var resultList = result.data;
          select.append("<option value=''>"+""+"</option>"); 
          resultList.forEach(function(ele, index){
            select.append("<option value='"+resultList[index].id+"'>"+resultList[index].supplierName+"</option>"); 
          })
          //初始化刷新数据  
          $("#supplierId_query").removeAttr('disabled');
          $("#supplierId_query").selectpicker('refresh');
        } else {
          toastr.error('获取供应商失败！');
        }
      },
      error: function() {
        toastr.error('获取供应商失败！');
      }
    })
    return false;
  })

  /*查找数据*/
  $("#selectBtn").click(function() {
    if (dataTable1) {
      dataTable1.fnClearTable(); //清空数据
      dataTable1.fnDestroy(); //销毁datatable
    }
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
      url: stockHost + "erp-svc-stock/productPlan/list",
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
            if (ele.planStatus == 0) {
              ele.planStatus = "未审核";
            } else if (ele.planStatus == 50) {
              ele.planStatus = "已过期";
            } else {
              ele.planStatus = "已审核";            
            }
            ele.auditTime = formatTime(ele.auditTime);
            ele.createTime = formatTime(ele.createTime);
          })
          DataTable = $("#dataTable").DataTable({
          data: result.data,
          columns: [{
            "data": "id"
          }, {
            "data": "productPlanCode"
          }, {
            "data": "planStatus"
          }, {
            "data": "supplierName"
          }, {
            "data": "auditTime"
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


    /*刷新数据*/

  function refreshTable(data) {

    var flag = false;
    host = getStockHost();
    token = getCookie("token");
    $.ajax({
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      url: host + "erp-svc-stock/productPlan/list",
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
            if (ele.planStatus == 0) {
              ele.planStatus = "未审核";
            } else if (ele.planStatus == 50) {
              ele.planStatus = "已过期";
            } else {
              ele.planStatus = "已审核";            
            }
            ele.auditTime = formatTime(ele.auditTime);
            ele.createTime = formatTime(ele.createTime);   
        })

        DataTable = $("#dataTable").DataTable({
          data: result.data,
          columns: [{
            "data": "id"
          }, {
            "data": "productPlanCode"
          }, {
            "data": "planStatus"
          }, {
            "data": "supplierName"
          }, {
            "data": "auditTime"
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

 

  $('#auditBtn').click(function(event) {
    stockHost = getStockHost();
    $.ajax({
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      url: stockHost + "erp-svc-stock/productPlan/audit/" + deleteId,
      data: "{}",
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





  $('#stockBtn').click(function(event) {
    stockHost = getStockHost();
    $.ajax({
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      url: stockHost + "erp-svc-stock/productPlan/stockPlan",
      data: "{}",
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

  function refreshTable1() {

    var flag = false;
    stockHost = getStockHost();
    host = getGoodsHost();
    token = getCookie("token");
    $.ajax({
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      url: stockHost + "erp-svc-stock/productPlan/findById/"+deleteId,
      data: "{}",
      beforeSend: function(request) {
        request.setRequestHeader("Authorization", 'Bearer ' + token);  
      },
      success: function(result) {
        if (dataTable1) {
          dataTable1.fnClearTable(); //清空数据
          dataTable1.fnDestroy(); //销毁datatable
        }
        result.data.forEach(function(ele,index){
          if (ele.planStatus == 0) {
            ele.planStatus = "未审核";
          } else if (ele.planStatus == 50) {
            ele.planStatus = "已过期";
          } else {
            ele.planStatus = "已审核";            
          }
          ele.auditTime = formatTime(ele.auditTime);
          ele.createTime = formatTime(ele.createTime);
        })
        DataTable1 = $("#dataTable1").DataTable({
          data: result.data,
          columns: [{
            "data": "id"
          }, {
            "data": "goodsCode"
          }, {
            "data": "goodsName"
          }, {
            "data": "skuCode"
          }, {
            "data": "skuName"
          }, {
            "data": "colorName"
          }, {
            "data": "sizeName"
          }, {
            "data": "stockQuantity"
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
  }
})