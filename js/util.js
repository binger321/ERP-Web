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