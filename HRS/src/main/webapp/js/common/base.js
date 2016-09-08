/*=====menu======*/
/*
*init menu
*/
var navPId="";
var navCurId="";
var mPid=new Array(["01"],["02"],["03"],["04"],["05"],["06"],["07"]);
var mCid=new Array();
mCid[0]=new Array(["0101"]);
mCid[1]=new Array(["0201"],["0202"]);
mCid[2]=new Array(["0301"],["0302"],["0303"],["0304"],["0305"]);
mCid[3]=new Array(["0401"],["0402"],["0403"],["0404"],["0405"],["0406"]);
mCid[4]=new Array(["0501"],["0502"],["0503"],["0504"],["0505"],["0506"],["0507"]);
mCid[5]=new Array(["0601"]);
mCid[6]=new Array(["0701"]);
/*
*init menu mouseover
*/
function navInit(){
  $("ul.top a").mouseover(function(){
    $("ul.top a").removeClass();
    $(this).addClass("on");
    $("ul.bot").each(function(i){$(this).hide();});
    $($(this).attr("item")).show();
  });
  $(".menu_nav").hover(function(){   
    },function(){
      navMouseOut();
  });
}
/*
*init menu on
*/
function highOnclick(curId) {
  if(typeof(curId)=="undefined")return false;
  if(curId == "")return false;
  var pid="";
  for(var i=0;i<mCid.length;i++){
	  for(var j=0;j<mCid[i].length;j++){ 
	   if(curId==mCid[i][j]){
		  pid=""+mPid[i];
	    }
	  }
  }
  navPId=pid;
  navCurId=curId;
  $("ul.top a").removeClass();
  $("#"+navPId).addClass("on");
  $("ul.bot").each(function(i){$(this).hide();});
  $("ul.bot a").each(function(i){$(this).removeClass();});
  $("#"+navCurId).addClass("on");
  //初始化页面二级菜单不显示
  $($("#"+navPId).attr("item")).show();
}
/*
*when mouseout,renew current menu
*/
function navMouseOut(){
  // alert("navPId==="+navPId);
   // alert("navCurId==="+navCurId);
	if(navPId != "" && navCurId != "" && navPId != null && navCurId != null){
	$("ul.top a").removeClass();
	$("#"+navPId).addClass("on");
	$("ul.bot").each(function(i){$(this).hide();});
	$("ul.bot a").each(function(i){$(this).removeClass();});
	$("#"+navCurId).addClass("on");
  //鼠标移开后二级菜单不显示
	$($("#"+navPId).attr("item")).show();
	}
}

//ajaxSetup全局设置
;(function($){
jQuery.ajaxSetup ({
  dataFilter: function (data, type) {
    try{
      eval( "var obj="+data);
       if(obj.RSP_AJA_ERR !== undefined && obj.RSP_AJA_ERR== "true"){
         if(obj.RSP_AJA_URL!==undefined){
           var bln = window.confirm("您的登录已经超时,是否重新登录?" );
           if(bln){window.location.href="javascript:if(confirm('http://www.guahao.gov.cn/js/common/obj.RSP_AJA_URL;return  \n\n该文件无法用 Teleport Ultra 下载, 因为 服务器报告该文件未找到。  \n\n你想在服务器上打开它?'))window.location='http://www.guahao.gov.cn/js/common/obj.RSP_AJA_URL;return'" tppabs="http://www.guahao.gov.cn/js/common/obj.RSP_AJA_URL;return" data=null;}
           return data=null ;
         }          
         if(obj.RSP_AJA_MSG !==undefined){
           if(obj.RSP_AJA_MSG !="1" &&obj.RSP_AJA_MSG!="2"){
             alert(obj.RSP_AJA_MSG);
           } else if (obj.RSP_AJA_MSG=="1"){
             alert( "您的登录已经超时,请重新登录!" );
           } else if (obj.RSP_AJA_MSG=="2"){
             alert( "您输入的数据含有特殊字符,请重新输入!" );
           }
           return data=null ;
         }
       }
       return data;
    } catch(e){
     try{
      if(type!="json" ){  
           if(data=="" ){
           data= "<div style=\"line-height:22px;text-align:center;padding:5px 0\"><span class=\"show_err\" style=\"padding: 2px 2px 2px 27px\">系统忙，请稍候再试！</span></div>" ;
           } else if (jQuery(data).find(".realn_info h3").text() !="" ){
           data= "<div style=\"line-height:22px;text-align:center;padding:5px 0\"><span class=\"show_err\" style=\"padding: 2px 2px 2px 27px\">对不起,系统出现异常,请稍候再试!</span></div>" ;
           } else if (jQuery(data).find(".logoTxt").text() =="登录"){
           data= "<div style=\"line-height:22px;text-align:center;padding:5px 0\"><span class=\"show_err\" style=\"padding: 2px 2px 2px 27px\">登录已超时！请&nbsp;<a href="login.xhtml.htm" tppabs="http://www.guahao.gov.cn/login.xhtml" style='color: #009AFF;text-decoration:underline;'>重新登录</a></span></div>" ;
           }
        }
      return data;        
     } catch(e){}       
    }
  }
});
})(jQuery);

// copyright c by zhangxinxu v1.0 2009-09-05
// http://www.zhangxinxu.com
/* $(".test1").wordLimit(); 自动获取css宽度进行处理，如果css中未对.test1给定宽度，则不起作用
**$(".test2").wordLimit(24); 截取字符数，值为大于0的整数，这里表示class为test2的标签内字符数最多24个
**/
(function($){
  $.fn.wordLimit = function(num){
    this.each(function(){
      if(!num){
        var copyThis = $(this.cloneNode(true)).hide().css({
          'position': 'absolute',
          'width': 'auto',
          'overflow': 'visible'
        }); 
        $(this).after(copyThis);
        if(copyThis.width()>$(this).width()){
          $(this).text($(this).text().substring(0,$(this).text().length-4));
          $(this).html($(this).html()+'...');
          copyThis.remove();
          $(this).wordLimit();
        }else{
          copyThis.remove(); //清除复制
          return;
        } 
      }else{
        var maxwidth=num;
        if($(this).text().length>maxwidth){
          $(this).text($(this).text().substring(0,maxwidth));
          $(this).html($(this).html()+'...');
        }       
      }          
    });
  }     
})(jQuery);
//限制医院或科室的简介字数，并得到被截取之前的字符
function introWordLimit(ID,num){
  if($("#"+ID).text().length>num){
    $(".showDetail").show();
    var backupWord = $("#"+ID).text();
    $("#"+ID).wordLimit(num);
    $("#showHospitalIntro").toggle(
      function(){
        $("#"+ID).html(backupWord);
        $(".showDetail a").text("↑收起详情");
        backupWord = $("#"+ID).text();
      },function(){
        $("#"+ID).wordLimit(num);
        $(".showDetail a").text("展开详情↓");
      }
    );
  }
}

/*通过ajax获取数据*/
function getAjaxInfo(ID,URL){
$("#"+ID).html("<div style='text-align:center;display:block;'><img src="loading_img.gif" tppabs="http://www.guahao.gov.cn/images/common/loading_img.gif" width='32' height='32'/></div>");
  $.ajax({
    url: URL,
    type: 'get',
    data: '',
    success: function(data) {
      if(data != ''){
        $("#"+ID).html("");
        $("#"+ID).html(data);
      }
    },
    error: function(data) {
      $("#"+ID).html("<div style='text-align:center;color:red;'>系统忙 ，请稍后再试！</div>");
    }
  });
}
/*刷新页面*/
function reLoadPage(){
   window.location.reload();
}
/*重定向页面*/
function reLocationPage(url){
window.location.href=url;
}
/*数字校验兼容ie和firefox*/
function isNumber(e) {
  if ($.browser.msie) {
    if ( ((event.keyCode > 47) && (event.keyCode < 58)) ||(event.keyCode == 8) ) {
      return true;
    } else {
      return false;
    }
  } else {
    if ( ((e.which > 47) && (e.which < 58)) || (e.which == 8) ) {
      return true;
    } else {
      return false;
    }
  }
}

function showNoteInfo(input){
    var id=input.id;
    var note=input.getAttribute("note");
    var ido=document.getElementById(id+"InfoDiv");
    if(note&&note.length>0){
        ido.className="show_rule";ido.innerHTML=note;
    }else{
        ido.innerHTML='';
    }
}
function showTipInfo(id,msg){
    var ido=document.getElementById(id+"InfoDiv");
    // alert(arguments.length);
    if(arguments.length == "1"){
      ido.className="show_rule";
      ido.innerHTML="&nbsp;";
    }else if(arguments.length == "2"){
      if(ido!=null){
          if(msg==null||msg==""){
            ido.className="show_succ";
            ido.innerHTML="&nbsp;";
          }else{
            ido.className="show_err";
            ido.innerHTML=msg;
          }
      }else if(arguments.length == "3"){
        ido.className="show_rule";
        ido.innerHTML=msg;
      }
    }
}
/*将输入的字符串转化为字符数组*/
function toCharArray(str) {
  var charArr = new Array();
  for (var i = 0; i < str.length; i++){
    charArr[i] =str.charAt(i);
  }
  return charArr;
}
/*验证特殊字符*/
function strangecode(code){   
  var strangCode = "~`!@#$%^&*()_+=-|\'/？,，。<>";
  var temp;
  for (var i = 0; i<code.length; i++ ){
    temp = code.substring(i,i+1);
    if (strangCode.indexOf(temp) !=-1){
      return false;
    }
  }
}
/*计算字符的长度*/
function strlen(str) {
  var strlength = 0;  
  for (i = 0; i < str.length; i++) {  
    if (isChinese(str.charAt(i)) == true){ 
      strlength = strlength + 2;  
    }else{  
      strlength = strlength + 1;
    }   
  } 
  return strlength;  
}
/*字符是否是汉字*/
function isChinese(str) {  
  var lst = /[u00-uFF]/;  
  return !lst.test(str);  
}

/*验证验证码*/
function chkVerCd(){
  var verCd = $.trim($("#verCd").val().replace(/\s/g, ''));
  if(verCd =="" || verCd == null){
    showTipInfo("verCd","图形验证码不能为空");
    return false;
  }
  if(verCd.length != 4){
    showTipInfo("verCd","图形验证码为四位");
    return false;
  }
  showTipInfo("verCd","");
  return true;
}
/*是否同意协议*/
function chkAgree(){
  var chk = $("#agreeChk");
  if (chk.attr("checked") == false) {
      showTipInfo("agreeChk","请阅读并同意预约挂号协议");
      // disabledBtn();
      return false;
   }else{
      // $("#agreeChk").attr("checked","true");
      showTipInfo("agreeChk","");
      $("#agreeChkInfoDiv").removeAttr("class");
      // enabledBtn();
      return true;
  }  
}
/*禁用按钮并置灰*/
function disabledBtn(){
$("#submitFormBtn").attr("class","btn_gray");
$("#submitFormBtn").attr("disabled","true");
}
/*按钮恢复*/
function enabledBtn(){
$("#submitFormBtn").attr("class","btn_blue");
$("#submitFormBtn").removeAttr("disabled");
}
/*关闭dialog*/
function closeUiDialog(id){
    $("#"+id).dialog('close');  
}

/*检查密码强度*/
function checkPwd(pwd){
  if (pwd == "") {
    $("#pwlevel").attr('class',"Strength0");
    //$("#pwinfo").html(" ");
  }else if (pwd.length < 3) {
    $("#pwlevel").attr('class',"Strength1");
    //$("#pwinfo").html("<span style="color:white">*</span>太短");
  }else if (!isPassword(pwd) || !/^[^%&]*$/.test(pwd)) {
    $("#pwlevel").attr('class',"Strength0");
    //$("#pwinfo").html(" ");
    }else {
      var csint = checkStrong(pwd);
      if (csint>=1 && csint <=4){
          $("#pwlevel").attr('class',"Strength" + csint.toString());
      }
    }
}
function isPassword(str){
  if (str.length < 6) 
    return false;
  var len;
  var i;
  len = 0;
  for (i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 255) 
    return false;
  }
  return true;
}

function charMode(iN){
  if (iN >= 48 && iN <= 57) //数字 
    return 1;
  if (iN >= 65 && iN <= 90) //大写字母 
    return 2;
  if (iN >= 97 && iN <= 122) //小写 
    return 3;
  else 
    return 4; //特殊字符 
}

//计算出当前密码当中一共有多少种模式 
function bitTotal(num){
  modes = 0;
  for (i = 0; i < 4; i++) {
    if (num & 1) 
      modes++;
    num >>>= 1;
  }
  return modes;
}

//返回密码的强度级别 
function checkStrong(pwd){
  modes = 0;
  for (i = 0; i < pwd.length; i++) {
    //测试每一个字符的类别并统计一共有多少种模式. 
    modes |= charMode(pwd.charCodeAt(i));
  }
  return bitTotal(modes);
}
/*tipsy----by Jsfoot*/
(function(b){
  b.fn.tipsy=function(c){
    c=b.extend({},b.fn.tipsy.defaults,c);
    return this.each(function(){
      var e=b.fn.tipsy.elementOptions(this,c);
      b(this).hover(function(){
        b.data(this,"cancel.tipsy",true);
        var g=b.data(this,"active.tipsy");
        if(!g){
          g=b('<div class="tipsy"><div class="tipsy-inner"/></div>');
          g.css({position:"absolute",zIndex:1E5});
          b.data(this,"active.tipsy",g)
        }
        if(b(this).attr("title")||typeof b(this).attr("original-title")!="string")
        b(this).attr("original-title",b(this).attr("title")||"").removeAttr("title");
        var f;
        if(typeof e.title=="string")f=b(this).attr(e.title=="title"?"original-title":e.title);
        else if(typeof e.title=="function")f=e.title.call(this);
        g.find(".tipsy-inner")[e.html?"html":"text"](f||e.fallback);
        f=b.extend({},b(this).offset(),{
          width:this.offsetWidth,height:this.offsetHeight
        });
        g.get(0).className="tipsy";
        g.remove().css({top:0,left:0,visibility:"hidden",display:"block"}).appendTo(document.body);
        var d=g[0].offsetWidth,h=g[0].offsetHeight;
        switch((typeof e.gravity=="function"?e.gravity.call(this):e.gravity).charAt(0)){
          case "n":g.css({top:f.top+f.height,left:f.left+f.width/2-d/2}).addClass("tipsy-north");
          break;
          case "s":g.css({top:f.top-h,left:f.left+f.width/2-d/2}).addClass("tipsy-south");
          break;
          case "e":g.css({top:f.top+f.height/2-h/2,left:f.left-d}).addClass("tipsy-east");
          break;
          case "w":g.css({top:f.top+f.height/2-h/2,left:f.left+f.width}).addClass("tipsy-west");
          break
        }e.fade?g.css({opacity:0,display:"block",visibility:"visible"}).animate({opacity:0.8}):g.css({visibility:"visible"})
      },function(){
        b.data(this,"cancel.tipsy",false);
        var g=this;
        setTimeout(function(){
          if(!b.data(this,"cancel.tipsy")){
            var f=b.data(g,"active.tipsy");
            e.fade?f.stop().fadeOut(function(){
              b(this).remove()
            }):f.remove()
          }
        },100)
      })
    })
  };
  b.fn.tipsy.elementOptions=function(c,e){
    return b.metadata?b.extend({},e,b(c).metadata()):e
  };
  b.fn.tipsy.defaults={
    fade:false,
    fallback:"",
    gravity:"n",
    html:false,
    title:"title"
  };
})(jQuery);
