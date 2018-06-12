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

    /*点击品牌*/
  $("#showBrand").click(function(){
    host = getGoodsHost();
    token = getCookie("token");
    $("#brandId_query").selectpicker({  
      noneSelectedText : '请选择'  
    });
    $.ajax({
      url : host+'erp-svc-goods/goodsBrand/list',
      type: 'post',
      dataType: 'json',
      data: "{}",
      contentType: 'application/json; charset=utf-8',
      beforeSend: function(request) {
          request.setRequestHeader("Authorization", 'Bearer ' + token);  
      },
      success: function(result) {
        if (result.status == 0) {
          var select = $("#brandId_query");
          select.toggle();
          select.empty();
          var resultList = result.data;
          select.append("<option value=''>"+""+"</option>"); 
          resultList.forEach(function(ele, index){
            select.append("<option value='"+resultList[index].id+"'>"+resultList[index].brandName+"</option>"); 
          });
          //初始化刷新数据  
          $("#brandId_query").selectpicker('refresh');
          $("#brandId_query").show();
        } else {
          toastr.error('获取品牌失败！');
        }
      },
      error: function() {
        toastr.error('获取品牌失败！');
      }
    })
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
          $("#supplierId_query").selectpicker('refresh');
          $("#supplierId_query").show();
        } else {
          toastr.error('获取供应商失败！');
        }
      },
      error: function() {
        toastr.error('获取供应商失败！');
      }
    })
  })

    /*点击类目一*/
  $("#showCategoryOneId").click(function(){
    host = getGoodsHost();
    token = getCookie("token");
    $("#categoryOneId_query").selectpicker({  
      noneSelectedText : '请选择'  
    });
    $.ajax({
      url : host+'erp-svc-goods/goodsCategory/listByLevel?level=1',
      type: 'post',
      dataType: 'json',
      data: "{}",
      contentType: 'application/json; charset=utf-8',
      beforeSend: function(request) {
          request.setRequestHeader("Authorization", 'Bearer ' + token);  
      },
      success: function(result) {
        if (result.status == 0) {
          var select = $("#categoryOneId_query");
          select.toggle();
          select.empty();
          var resultList = result.data;
          select.append("<option value=''>"+""+"</option>"); 
          resultList.forEach(function(ele, index){
            select.append("<option value='"+resultList[index].id+"'>"+resultList[index].categoryName+"</option>"); 
          })
          //初始化刷新数据  
          $("#categoryOneId_query").selectpicker('refresh');
          $("#categoryOneId_query").show();
        } else {
          toastr.error('获取类目失败！');
        }
      },
      error: function() {
        toastr.error('获取类目失败！');
      }
    })
  })    
  /*点击类目二*/
  $("#showCategoryTwoId").click(function(){
    host = getGoodsHost();
    token = getCookie("token");
    $("#categoryTwoId_query").selectpicker({  
      noneSelectedText : '请选择'  
    });
    $.ajax({
      url : host+'erp-svc-goods/goodsCategory/listByLevel?level=2',
      type: 'post',
      dataType: 'json',
      data: "{}",
      contentType: 'application/json; charset=utf-8',
      beforeSend: function(request) {
          request.setRequestHeader("Authorization", 'Bearer ' + token);  
      },
      success: function(result) {
        if (result.status == 0) {
          var select = $("#categoryTwoId_query");
          select.toggle();
          select.empty();
          var resultList = result.data;
          select.append("<option value=''>"+""+"</option>"); 
          resultList.forEach(function(ele, index){
            select.append("<option value='"+resultList[index].id+"'>"+resultList[index].categoryName+"</option>"); 
          })
          //初始化刷新数据  
          $("#categoryTwoId_query").selectpicker('refresh');
          $("#categoryTwoId_query").show();
        } else {
          toastr.error('获取类目失败！');
        }
      },
      error: function() {
        toastr.error('获取类目失败！');
      }
    })
  })

      /*点击类目三*/
  $("#showCategoryThreeId").click(function(){
    host = getGoodsHost();
    token = getCookie("token");
    $("#categoryThreeId_query").selectpicker({  
      noneSelectedText : '请选择'  
    });
    $.ajax({
      url : host+'erp-svc-goods/goodsCategory/listByLevel?level=3',
      type: 'post',
      dataType: 'json',
      data: "{}",
      contentType: 'application/json; charset=utf-8',
      beforeSend: function(request) {
          request.setRequestHeader("Authorization", 'Bearer ' + token);  
      },
      success: function(result) {
        if (result.status == 0) {
          var select = $("#categoryThreeId_query");
          select.toggle();
          select.empty();
          var resultList = result.data;
          select.append("<option value=''>"+""+"</option>"); 
          resultList.forEach(function(ele, index){
            select.append("<option value='"+resultList[index].id+"'>"+resultList[index].categoryName+"</option>"); 
          })
          //初始化刷新数据  
          $("#categoryThreeId_query").selectpicker('refresh');
          $("#categoryThreeId_query").show();
        } else {
          toastr.error('获取类目失败！');
        }
      },
      error: function() {
        toastr.error('获取类目失败！');
      }
    })
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
      url: host + "erp-svc-goods/goods/listGoods",
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
            "data": "goodsName"
          }, {
            "data": "brandName"
          }, {
            "data": "weight"
          }, {
            "data": "costPrice"
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
  $("#addBtn").click(function() {
    host = getGoodsHost();
    token = getCookie("token");
    $("#addLabel").text("新增");
    $('#myModal').modal();
    $(".selectpicker").selectpicker({  
      noneSelectedText : '请选择'  
      });  
    host = getGoodsHost();
    token = getCookie("token");
    $("#brandId_add").selectpicker({  
      noneSelectedText : '请选择'  
    });
    $.ajax({
      url : host+'erp-svc-goods/goodsBrand/list',
      type: 'post',
      dataType: 'json',
      data: "{}",
      contentType: 'application/json; charset=utf-8',
      beforeSend: function(request) {
          request.setRequestHeader("Authorization", 'Bearer ' + token);  
      },
      success: function(result) {
        if (result.status == 0) {
          var select = $("#brandId_add");
          select.toggle();
          select.empty();
          var resultList = result.data;
          select.append("<option value=''>"+""+"</option>"); 
          resultList.forEach(function(ele, index){
            select.append("<option value='"+resultList[index].id+"'>"+resultList[index].brandName+"</option>"); 
          })
          //初始化刷新数据  
          $("#brandId_add").selectpicker('refresh');
        } else {
          toastr.error('获取品牌失败！');
        }
      },
      error: function() {
        toastr.error('获取品牌失败！');
      }
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
          select.toggle();
          select.empty();
          var resultList = result.data;
          select.append("<option value=''>"+""+"</option>"); 
          resultList.forEach(function(ele, index){
            select.append("<option value='"+resultList[index].id+"'>"+resultList[index].supplierName+"</option>"); 
          })
          //初始化刷新数据  
          $("#supplierId_add").selectpicker('refresh');
        } else {
          toastr.error('获取供应商失败！');
        }
      },
      error: function() {
        toastr.error('获取供应商失败！');
      }
    });
    $.ajax({
      url : host+'erp-svc-goods/goodsCategory/listByLevel?level=1',
      type: 'post',
      dataType: 'json',
      data: "{}",
      contentType: 'application/json; charset=utf-8',
      beforeSend: function(request) {
          request.setRequestHeader("Authorization", 'Bearer ' + token);  
      },
      success: function(result) {
        if (result.status == 0) {
          var select = $("#categoryOneId_add");
          select.toggle();
          select.empty();
          var resultList = result.data;
          select.append("<option value=''>"+""+"</option>"); 
          resultList.forEach(function(ele, index){
            select.append("<option value='"+resultList[index].id+"'>"+resultList[index].categoryName+"</option>"); 
          })
          //初始化刷新数据  
          $("#categoryOneId_add").selectpicker('refresh');
        } else {
          toastr.error('获取类目失败！');
        }
      },
      error: function() {
        toastr.error('获取类目失败！');
      }
    });
    $.ajax({
      url : host+'erp-svc-goods/goodsCategory/listByLevel?level=2',
      type: 'post',
      dataType: 'json',
      data: "{}",
      contentType: 'application/json; charset=utf-8',
      beforeSend: function(request) {
          request.setRequestHeader("Authorization", 'Bearer ' + token);  
      },
      success: function(result) {
        if (result.status == 0) {
          var select = $("#categoryTwoId_add");
          select.toggle();
          select.empty();
          var resultList = result.data;
          select.append("<option value=''>"+""+"</option>"); 
          resultList.forEach(function(ele, index){
            select.append("<option value='"+resultList[index].id+"'>"+resultList[index].categoryName+"</option>"); 
          })
          //初始化刷新数据  
          $("#categoryTwoId_add").selectpicker('refresh');
        } else {
          toastr.error('获取类目失败！');
        }
      },
      error: function() {
        toastr.error('获取类目失败！');
      }
    });
    $.ajax({
      url : host+'erp-svc-goods/goodsCategory/listByLevel?level=3',
      type: 'post',
      dataType: 'json',
      data: "{}",
      contentType: 'application/json; charset=utf-8',
      beforeSend: function(request) {
          request.setRequestHeader("Authorization", 'Bearer ' + token);  
      },
      success: function(result) {
        if (result.status == 0) {
          var select = $("#categoryThreeId_add");
          select.toggle();
          select.empty();
          var resultList = result.data;
          select.append("<option value=''>"+""+"</option>"); 
          resultList.forEach(function(ele, index){
            select.append("<option value='"+resultList[index].id+"'>"+resultList[index].categoryName+"</option>"); 
          })
          //初始化刷新数据  
          $("#categoryThreeId_add").selectpicker('refresh');
        } else {
          toastr.error('获取类目失败！');
        }
      },
      error: function() {
        toastr.error('获取类目失败！');
      }
    });
    $.ajax({
      url : host+'erp-svc-goods/goodsStyle/list',
      type: 'post',
      dataType: 'json',
      data: "{}",
      contentType: 'application/json; charset=utf-8',
      beforeSend: function(request) {
          request.setRequestHeader("Authorization", 'Bearer ' + token);  
      },
      success: function(result) {
        if (result.status == 0) {
          var select = $("#styleId_add");
          select.toggle();
          select.empty();
          var resultList = result.data;
          select.append("<option value=''>"+""+"</option>"); 
          resultList.forEach(function(ele, index){
            select.append("<option value='"+resultList[index].id+"'>"+resultList[index].styleName+"</option>"); 
          })
          //初始化刷新数据  
          $("#styleId_add").selectpicker('refresh');
        } else {
          toastr.error('获取款式失败！');
        }
      },
      error: function() {
        toastr.error('获取款式失败！');
      }
    });
  })

  $("#add_submit").click(function(event) {
    host = getGoodsHost();
    token = getCookie("token");
    var form = $('#addForm').serializeObject();
    var tableForm = JSON.stringify(form);
    $.ajax({
      url: host + 'erp-svc-goods/goods/add',
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
            type: "delete",
            url: host + 'erp-svc-goods/goods/delete/' + deleteId,
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
    // window.location.href = 'goods_update.html?id=' + deleteId;
        // $("#test").val("nihaoa");
    // $("#updateLabel").text("修改");
    // $('#myUpdateModal').modal();
    // $(".selectpicker").selectpicker({  
    //   noneSelectedText : '请选择'  
    // }); 
    $.ajax({
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      url: host + "erp-svc-goods/goods/" + deleteId,
      beforeSend: function(request) {
        request.setRequestHeader("Authorization", 'Bearer ' + token);  
      },
      success: function(result) {
        if (result.status == 0) {
          var resultData = result.data;
          localStorage.setItem("data",JSON.stringify(resultData));
          window.location.href = 'goods_update.html';
        }else {
          toastr.error('获取商品详情失败！');
        }
      },
      error: function() {
        toastr.error('获取商品详情失败！');
      }

    })

  })
  $('#update_submit').click(function(event) {
    var updateObject = $("#updateForm").serializeObject();
    var updateForm = JSON.stringify(updateObject);
    $.ajax({
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      url: host + "erp-svc-goods/store/update/" + deleteId,
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
      url: host + "erp-svc-goods/goods/list",
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
            "data": "goodsCode"
          }, {
            "data": "goodsName"
          }, {
            "data": "brandName"
          }, {
            "data": "weight"
          }, {
            "data": "costPrice"
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

  }
})