var sso_debug = false;
var sso_frame_id = 'sso_background_frame';
var aspid = '1234567890';

function sso_helper_createiframe(url, func_loaded){
  var f = document.createElement("iframe");
  f.id=sso_frame_id;
  f.src=url;
  if(sso_debug){ 
  	f.width =600;
  	f.height =400;
  	document.write('<br />');
  	document.write('<br />');
  	document.write(url);
  	document.write('<br />');
  	document.write('<br />');
  }else{ 
	f.width =0;
	f.height =0;
  // $(f).attr("frameborder","0");
	f.onload=func_loaded;
	}
	document.body.appendChild(f);
}

function sso_helper_cleariframe(){
  var f=document.getElementById(sso_frame_id);
  f.onload=null;
  f && f.src!="about:blank" ? f.src="about:blank":f=null;
}

var sso_goto = '/';
function sso_check_login(goto){
  sso_goto=goto;
  var url = "/sso-client-user.jsp";
  sso_helper_createiframe(url, sso_helper_cleariframe);
  // sso_helper_cleariframe();
  // sso_helper_createiframe(url);
  
}

/** 可覆写该方法 */
function sso_logined(){
  if(sso_debug){
	alert('已获取单点登录信息');
  }
  location.href= '/';
}

function sso_notify_center(username, loginway){}

function sso_logout(){
  var url = "http://health.gzmed.gov.cn/cuteframework-sso-server/logout";
  sso_helper_createiframe(url, sso_logout_finish);
}

function sso_logout_finish(){
  sso_helper_cleariframe();
  if(sso_debug){
	alert("退出成功，点击返回首页");
  }
  location.href = "/";
}