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

  toastr.options.positionClass = 'toast-top-center';
  $(function(){
    // localStorage.removeItem("data");
    dataObject = JSON.parse(localStorage.getItem("data"));
    $("#goodsCode").val(dataObject.goodsCode);
    $("#goodsName").val(dataObject.goodsName);
    $("#costPrice").val(dataObject.costPrice);
    $("#weight").val(dataObject.weight);
    $("#material").val(dataObject.material);
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


    /*点击品牌*/
  $("#showBrand").click(function(){
    host = getGoodsHost();
    token = getCookie("token");
    $("#brandId_update").selectpicker({  
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
          var select = $("#brandId_update");
          select.toggle();
          select.empty();
          var resultList = result.data;
          select.append("<option value=''>"+""+"</option>"); 
          resultList.forEach(function(ele, index){
            if(resultList[index].id == dataObject.brandId) {
              select.append("<option value='"+resultList[index].id+"' selected='selected'>"+resultList[index].brandName+"</option>"); 
            } else {
              select.append("<option value='"+resultList[index].id+"'>"+resultList[index].brandName+"</option>"); 
            }
          });
          //初始化刷新数据  
          $("#brandId_update").removeAttr("disabled");
          $("#brandId_update").selectpicker('refresh');
        } else {
          toastr.error('获取品牌失败！');
        }
      },
      error: function() {
        toastr.error('获取品牌失败！');
      }
    });
    return false;
  })


  /*点击款式*/
  $("#showStyle").click(function(){
    host = getGoodsHost();
    token = getCookie("token");
    $("#supplierId_update").selectpicker({  
      noneSelectedText : '请选择'  
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
          var select = $("#styleId_update");
          select.toggle();
          select.empty();
          var resultList = result.data;
          select.append("<option value=''>"+""+"</option>"); 
          resultList.forEach(function(ele, index){
            if(resultList[index].id == dataObject.styleId) {              
              select.append("<option value='"+resultList[index].id+"' selected='selected'>"+resultList[index].styleName+"</option>"); 
            } else {
              select.append("<option value='"+resultList[index].id+"'>"+resultList[index].styleName+"</option>"); 
            }          
          })
          //初始化刷新数据  
          $("#styleId_update").selectpicker('refresh');
          $("#styleId_update").show();
        } else {
          toastr.error('获取款式失败！');
        }
      },
      error: function() {
        toastr.error('获取款式失败！');
      }
    });    
    return false;

  })


    /*点击类目一*/
  $("#showCategoryOneId").click(function(){
    host = getGoodsHost();
    token = getCookie("token");
    $("#categoryOneId_update").selectpicker({  
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
          var select = $("#categoryOneId_update");
          select.toggle();
          select.empty();
          var resultList = result.data;
          select.append("<option value=''>"+""+"</option>"); 
          resultList.forEach(function(ele, index){
            if(resultList[index].id == dataObject.categoryOneId) {              
              select.append("<option value='"+resultList[index].id+"' selected='selected'>"+resultList[index].categoryName+"</option>"); 
            } else {
              select.append("<option value='"+resultList[index].id+"'>"+resultList[index].categoryName+"</option>"); 
            }   
          })
          //初始化刷新数据  
          $("#categoryOneId_update").selectpicker('refresh');
          $("#categoryOneId_update").show();
        } else {
          toastr.error('获取类目失败！');
        }
      },
      error: function() {
        toastr.error('获取类目失败！');
      }
    });
    return false;
  })    
  /*点击类目二*/
  $("#showCategoryTwoId").click(function(){
    host = getGoodsHost();
    token = getCookie("token");
    $("#categoryTwoId_update").selectpicker({  
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
          var select = $("#categoryTwoId_update");
          select.toggle();
          select.empty();
          var resultList = result.data;
          select.append("<option value=''>"+""+"</option>"); 
          resultList.forEach(function(ele, index){
            if(resultList[index].id == dataObject.categoryTwoId) {              
              select.append("<option value='"+resultList[index].id+"' selected='selected'>"+resultList[index].categoryName+"</option>"); 
            } else {
              select.append("<option value='"+resultList[index].id+"'>"+resultList[index].categoryName+"</option>"); 
            }          
          })
          //初始化刷新数据  
          $("#categoryTwoId_update").selectpicker('refresh');
          $("#categoryTwoId_update").show();
        } else {
          toastr.error('获取类目失败！');
        }
      },
      error: function() {
        toastr.error('获取类目失败！');
      }
    });
    return false;
  })

      /*点击类目三*/
  $("#showCategoryThreeId").click(function(){
    host = getGoodsHost();
    token = getCookie("token");
    $("#categoryThreeId_update").selectpicker({  
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
          var select = $("#categoryThreeId_update");
          select.toggle();
          select.empty();
          var resultList = result.data;
          select.append("<option value=''>"+""+"</option>"); 
          resultList.forEach(function(ele, index){
            if(resultList[index].id == dataObject.categoryThreeId) {
              select.append("<option value='"+resultList[index].id+"' selected='selected'>"+resultList[index].categoryName+"</option>"); 
            } else {
              select.append("<option value='"+resultList[index].id+"'>"+resultList[index].categoryName+"</option>"); 
            }          
          })
          //初始化刷新数据  
          $("#categoryThreeId_update").selectpicker('refresh');
          $("#categoryThreeId_update").show();
        } else {
          toastr.error('获取类目失败！');
        }
      },
      error: function() {
        toastr.error('获取类目失败！');
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
      url: host + "erp-svc-goods/goods/update/"+dataObject.id,
      // +"?pageNo=" +fs._iDisplayStart + "&pageSize=" + fs._iDisplayLength,
      data: saveForm,
      beforeSend: function(request) {
        request.setRequestHeader("Authorization", "Bearer " + token);
        // request.setRequestHeader("Access-Control-Allow-Origin", "*");
      },
      success: function(result) {

        if (result.status == 0) {
          window.location.href = 'goods.html';
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
  token = getCookie("token");
  lastQuery = {};
  $.ajax({
    type: 'post',
    contentType: 'application/json; charset=utf-8',
    url: host + "erp-svc-goods/goodsSupplier/listSupplierByGoodsId?goodsId="+dataObject.id,
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
          "data": "supplierCode"
        }, {
          "data": "supplierName"
        }, {
          "data": "importPrice"
        }, {
          "data": "contact"
        }, {
          "data": "phoneNumber"
        }, {
          "data": "status"
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
    token = getCookie("token");
    $.ajax({
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      url: host + "erp-svc-goods/goodsSupplier/listSupplierByGoodsId?goodsId="+dataObject.id,
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
          "data": "supplierCode"
        }, {
          "data": "supplierName"
        }, {
          "data": "importPrice"
        }, {
          "data": "contact"
        }, {
          "data": "phoneNumber"
        }, {
          "data": "status"
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
  })

  $("#add_submit").click(function(event) {
    host = getGoodsHost();
    token = getCookie("token");
    var form = $('#addForm').serializeObject();
    form.goodsId = dataObject.id;
    var tableForm = JSON.stringify(form);
    $.ajax({
      url: host + 'erp-svc-goods/goodsSupplier/add',
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
            url: host + 'erp-svc-goods/goodsSupplier/delete/' + deleteId,
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
      url: host + "erp-svc-goods/goodsSupplier/" + deleteId,
      beforeSend: function(request) {
        request.setRequestHeader("Authorization", 'Bearer ' + token);  
      },
      success: function(result) {
        if (result.status == 0) {
          $("#importPrice").val(result.data.importPrice);
          $("#supplierGoodsCode").val(result.data.supplierGoodsCode);

          var sId = result.data.supplierId;
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
                var select = $("#supplierId_update");
                select.toggle();
                select.empty();
                var resultList = result.data;
                resultList.forEach(function(ele, index){
                  if (resultList[index].id == sId) {
                    select.append("<option value='"+resultList[index].id+"'selected = 'selected'>"+resultList[index].supplierName+"</option>"); 
                  } else {
                    select.append("<option value='"+resultList[index].id+"'>"+resultList[index].supplierName+"</option>"); 
                  }
                })
                //初始化刷新数据  
                $("#supplierId_update").selectpicker('refresh');
              } else {
                toastr.error('获取供应商失败！');
              }
            },
            error: function() {
              toastr.error('获取供应商失败！');
            }
          });
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
      url: host + "erp-svc-goods/goodsSupplier/update/" + deleteId,
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
