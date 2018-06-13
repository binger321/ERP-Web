function getGoodsHost() {
	return "http://localhost:20001/";
}

function getStockHost() {
	return "http://localhost:20003/"
}

function formatDate(timestamp) {
	var date = new Date(timestamp);

	var y = date.getFullYear();  //获取年

   	var m = date.getMonth() + 1;  //获取月

   	var d = date.getDate();  //获取日

   	return y + '-' + add0(m) + '-' + add0(d);  //返回时间格式
}

function add0(m){return m<10?'0'+m:m }

//时间戳转化成时间格式

function formatTime(timestamp){
  if (!timestamp) {
    return '';
  }
  //timestamp是整数，否则要parseInt转换,不会出现少个0的情况
    var time = new Date(timestamp);
    var year = time.getFullYear();
    var month = time.getMonth()+1;
    var date = time.getDate();
    var hours = time.getHours();
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();
    return year+'-'+add0(month)+'-'+add0(date)+' '+add0(hours)+':'+add0(minutes)+':'+add0(seconds);
}
//cookie设置
function setCookie(name, value) {  
    var exp = new Date();  
    exp.setTime(exp.getTime() + 60 * 60 * 1000 * 2);  
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";  
}    

//读取cookies  
function getCookie(name) {  
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");  
    if (arr = document.cookie.match(reg))  
        return unescape(arr[2]);  
    else  
        return null;  
}

//删除cookies  
function delCookie(name) {  
    var exp = new Date();  
    exp.setTime(exp.getTime() - 60 * 60 * 1000);  
    var cval = getCookie(name);  
    if (cval != null)  
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/";  
}  
//form转为json
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

//扩展方法获取url参数  
$.getUrlParam = function (name) {  
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");  
    var r = window.location.search.substr(1).match(reg);  
    if (r != null) return unescape(r[2]); return null;  
};

function logout() {
  localStorage.removeItem("data");
  delCookie("token");
  console.log("logout success!");
}