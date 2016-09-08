/**=======================formValidator==============================**/
jQuery(document).ready(function() {
  $("#usrAct").blur(function(){ajx_chk_usrAct("usrAct")});
  $("#usrNm").blur(function(){chk_usrNm("usrNm")});
  $("#usrNm").focus(function(){showTipInfo("usrNm");return true;});
  $("#pwd").blur(function(){check_pwd("pwd")});
  $("#pwd").focus(function(){showTipInfo("pwd");return true;});
  $("#newPwd").blur(function(){check_pwd("newPwd")});
  $("#newPwd").focus(function(){showTipInfo("newPwd");return true;});
  $("#rePwd").blur(function(){check_rePwd("rePwd")});
  $("#rePwd").focus(function(){showTipInfo("rePwd");return true;});
  $("#cerNo").blur(function(){ajx_chk_cerNo("cerNo")});
  $("#cerNo").focus(function(){showTipInfo("cerNo");return true;});
  $("#mblNo").blur(function(){chk_mblNo("mblNo")});
  $("#mblNo").focus(function(){showTipInfo("mblNo");return true;});
  $("#verCdMsg").blur(function(){chk_verCdMsg("verCdMsg")});
  $("#verCdMsg").focus(function(){showTipInfo("verCdMsg");return true;});
  // $("#usrAdd").blur(function(){chk_usrAdd("usrAdd")});
  $("#usrAdd").focus(function(){showTipInfo("usrAdd");return true;});
  $("#usrJkk").blur(function(){ajx_chk_usrJkk()});
  $("#usrJkk").focus(function(){showTipInfo("usrJkk");return true;});
});

$(function(){
/*js=======login*/
$(".inputTxt").blur(function () {
  if($(this).val() == ''){
    if($(this).attr("id") == 'cardNo'){
      var msg = "";
      msg = "用户名/健康卡/证件号/市民卡";
      $(this).val(msg);
      $(this).addClass("c_gray9");
    }else if($(this).attr("id") == 'pwd'){
      msg = "登录密码不能为空！"
    }
    $(this).parent().removeClass("inputLgBg_on");
    $(this).parent().addClass("inputLgBg");
    $("#errortip").html("请输入账号！");
  }
});
$(".inputTxt").focus(function () {
  var msg = "用户名/健康卡/证件号/市民卡";
  if($(this).val() == msg){
    $(this).val("");
    $(this).removeClass("c_gray9");
  }
  $(this).parent().removeClass("inputLgBg");
  $(this).parent().addClass("inputLgBg_on");
  $("#errortip").hide();
  $("#errortip").html("");
} );
});
/*登录提交*/
function submitLogForm(){
  if(!chk_submit_log()){
    return false;
  }
  var usr_nm = getCookie("usr_nm");
  var usr_pwd = getCookie("usr_pd");
  if($("#autologin").attr("checked")==true){//自动登录
  	loginCookie();
  }else if(usr_nm&&usr_pwd){
  }else{
  	noLoginCookie();
  }
  $("#PWD_MD5").val(hex_md5($("#PWD").val()));
  var dat=$("form[name=login_form]").serialize();
  $.ajax({
    url: "/logined.xhtml?r="+Math.random(),
    type: 'POST',
    dataType: 'json',
    data: dat,
    success: function(data) {
      if(data.GWA.MSG_CD == 'PTS00000'){
        if(data.NEW_FLG == "0"){//判断是否为新用户登录
          if(data.USR_INF.USR_ACT == null || data.USR_INF.USR_ACT =="" || data.USR_INF.USR_ACT == "0" || data.USR_INF.USR_ACT == data.USR_INF.CER_NO){//判断新用户名是否为空（为空,为零,等于身份证号，需补充；不为空不可改）
            $("#usrAct").hide();
            $("#usrActInput").show();
          }else{
            $("#usrActInput").hide();
            $("#usrAct").html(data.USR_INF.USR_ACT);
            $("#usrAct").show();
          }
          if(data.USR_INF.IS_REAL != "1"){//判断是否为实名(1为实名，非1为非实名)
            $("#usrNmIsReal").hide();
            $("#USR_NM").val(data.USR_INF.USR_NM);
            $("#usrNmNotReal").show();
          }else if(data.USR_INF.IS_REAL == "1"){
            $("#usrNmNotReal").hide();
            $("#usrNmIsReal").html(data.USR_INF.USR_NM);
            $("#usrNmIsReal").show();
          }
          $("#mblNo").val(data.USR_INF.MBL_NO);
          $("#CER_NO").html(data.USR_INF.CER_NO);//显示
          $("#cerNo").val(data.USR_INF.CER_NO);//传值
          if(data.USR_INF.USR_SEX == 'M'){
            $("#sex").text("男");
          }else if(data.USR_INF.USR_SEX == 'F'){
            $("#sex").text("女");
          }
          $("#USR_MAL").val(data.USR_INF.USR_MAL);
          popUserInfoDialog();
        }else if(data.NEW_FLG == "1"){
          if(data.RSP_MAP == "GOTO"){
            var gotourl = $("#goto").val();
            if($.browser.msie) { //如果为ie浏览器，需转义&
              var reg=new RegExp("&","g"); //创建正则RegExp对象 
              gotourl=gotourl.replace(reg,"&amp;"); 
            }
            window.location.href=gotourl;
            return false;
          }
          if($("#loginChannel").val() == "pop"){
            document.regForm.submit();
            return false;
          }else{
            window.location.href="/index.xhtml";//如果不是弹出框登录，则登录后跳到首页
            return false;
          }
        }
        $("#errortip").hide();
      }else{
        $("#errortip").html(data.GWA.MSG_DAT);
        $("#errortip").show();
      }
    }
  });
}

/*新用户登录  ---弹出框*/
function popUserInfoDialog(){
  $("#usrInfoDiv").attr("display","block");
  $("#usrInfoDiv").dialog('open');
}

/*新用户登录 完善用户信息表单提交*/
function sumbitUsrForm(){
  if(!checkUsrInfoForm()){
    return false;
  }
  // disabledBtn();
  var param=$("form[name=usrInfoForm]").serialize();
  $.ajax({
    url: "/comp_usrinfo.xhtml?r="+Math.random(),
    type: 'post',
    dataType: 'json',
    data: param,
    contentType:"application/x-www-form-urlencoded;charset=UTF-8",
    success: function(data) {
      if(data.GWA.MSG_CD == 'PTS00000'){
        if(data.RSP_MAP == "GOTO"){
          var gotourl = $("#goto").val();
          var reg=new RegExp("&","g"); //创建正则RegExp对象 
          gotourl=gotourl.replace(reg,"&amp;");  
          window.location.href=gotourl;
        }if($("#loginChannel").val() == "pop"){
          document.regForm.submit();
        }else{
          window.location.href="/index.xhtml";//如果不是弹出框登录，则登录后跳到首页
        }
      }else{
        alert(data.GWA.MSG_DAT);
        enabledBtn();
      }
    }
  });
}

/*====login form submit====*/
function chk_submit_log(){
  var errTip = $("#errortip").html();
  if(errTip != "" && errTip != null){
    $("#errortip").show();
    return false;
  }
  if($("#PWD").val() == "" || $("#PWD").val() == null){
    $("#errortip").show().html("登录密码不能为空！");
    return false;
  }
  if($("#VER_CD").length != "0"){
    var verCd = $.trim($("#VER_CD").val()).replace(/\s/g, '');
    var _cdreg = /^\d{4}$/;
    if(verCd == "" || verCd == null || !_cdreg.test(verCd)){
      $("#errortip").show().html("请输入4位数字的图形验证码！");
      return false;
    }
  }

  return true;
}
/*====register form submit====*/
function chk_submit_reg(){
  if(!chk_usrAct("usrAct")){
    return false;
  }
  if(!check_pwd("pwd")){
    return false;
  }
  if(!check_rePwd("rePwd")){
    return false;
  }
  if(!chk_usrNm("usrNm")){
    return false;
  }
  if(!chk_cerNo("cerNo")){
    return false;
  }
  if(!chk_mblNo("mblNo")){
    return false;
  }
  if(!ajx_chk_msgCd("verCdMsg","1")){
    return false;
  }
  if(!chk_usrAdd("usrAdd")){
    return false;
  }
  if($("#usrJkk").is(":visible")){
    if(!ajx_chk_usrJkk("usrJkk")){
      return false;
    }
  }
  
  if($("#smkNo").is(":visible")){
    if(!chk_usrSmk("smkNo")){
      return false;
    }
  }
  
  if(!chkAgree()){
    return false;
  }
  return true;  
}
/*====信息补录====*/
function chk_submit_cmp(){
  if(!chk_usrAct("USR_ACT")){
    return false;
  }
  if(!check_pwd("pwd")){
    return false;
  }
  if(!check_rePwd("rePwd")){
    return false;
  }
  if(!chk_mblNo("mblNo")){
    return false;
  }
  if(!ajx_chk_msgCd("verCdMsg","5")){
    return false;
  }
  
  return true;  
}
/*check userInfo form新用户登录完善用户信息表单*/
function checkUsrInfoForm(){
  if(!chk_mblNo("mblNo")){
    return false;
  }
  if(!ajx_chk_msgCd("verCdMsg","3")){
    return false;
  }
  if(!chk_usrNm("USR_NM")){
    return false;
  }
  if(!chk_usrAct("USR_ACT")){
    return false;
  }
  return true;
}
/*check modify-user-information form资料修改表单提交验证*/
function checkUsrInfoForm_mod(){
  if(!chk_mblNo("mblNo")){
    return false;
  }
  if($("#verCdMsg").is(":visible")){
    if(!ajx_chk_msgCd("verCdMsg","4")){
      return false;
    }
  }
  if(!chk_usrNm("usrNm")){
    return false;
  }
  if($(".usrAddLi").is(":visible")){
    if(!chk_usrAdd("usrAdd")){
      return false;
    }
  }
  if(!chk_usrJkk("usrJkk")){
    return false;
  }
  if($("#modPwd").is(":visible")){
    if(!check_pwd("pwd")){
      return false;
    }
    if(!check_pwd("newPwd")){
      return false;
    }
    if(!check_rePwd("rePwd")){
      return false;
    }
  }
  return true;
}

/*find back password重置密码*/
function chk_submit_pwd(){
  var findWay=$("#findWay option:selected").val();
  if(findWay == 1){
    if(!chk_usrAct("login_name") || !chk_mblNo("phoneOrmail")){
      return false;
    }
  }
  if(findWay == 3){
    if(!chk_cerNo("login_name") || !chk_mblNo("phoneOrmail")){
      return false;
    }
  }
  if(!check_pwd("pwd")){
    return false;
  }
  if(!check_rePwd("rePwd")){
    return false;
  }
  if(!chk_verCdMsg("verCdMsg")){
    return false;
  }
  return true;
}

/*被监护人信息验证---add*/
function chkKidForm(){
  //验证姓名---add
  if(!chk_usrNm("kidNm")){
    return false;
  }
  //验证证件号码--add
  if(!chk_cerNo("kidCerNo","cerTypKid")){
      return false;
  }
  //验证出生日期---add
  if($("#birthday").val() == ""){
    showTipInfo("birthday","出生日期不能为空");
    return false;
  }
  //验证性别---add
  if($("#kidSex").val() == ""){
    showTipInfo("kidSex","性别不能为空");
    return false;
  }
  return true;
}
/*被监护人信息验证---mod*/
function chkKidFormM(){
  //验证姓名---mod
  if(!chk_usrNm("kidNmM")){
      return false;
  }
  //验证证件号码--mod
  if(!chk_cerNo("kidCerNoM","cerTypM")){
      return false;
  }
  //验证出生日期---mod
  if($("#birthdayM").val() == ""){
    showTipInfo("birthdayM","出生日期不能为空");
    return false;
  }
  //验证性别---mod
  if($("#kidSexM").val() == ""){
    showTipInfo("kidSexM","性别不能为空");
    return false;
  }
  return true;
}
/*常用就诊人信息验证---add*/
function chkConnForm(){
  //验证姓名---add
  if(!chk_usrNm("connNm")){
      return false;
  }
  // //验证证件号码--add
  if(!chk_cerNo("connCerNo","cerTyp")){
      return false;
  }
  if($("#cerTyp").val() == "02" || $("#cerTyp").val() == "03"){
    if($("#birthDt").val()==""){
      showTipInfo("birthDt","出生日期不能为空");
      return false;
    }
  }
  return true;
}
/*常用就诊人信息验证---mod*/
function chkConnFormM(){
  //验证姓名---mod
  if(!chk_usrNm("connNmM")){
      return false;
  }
  //验证身份证号码---mod
  if(!chk_cerNo("connCerNoM","cerTypM")){
      return false;
  }
  if($("#cerTypM").val() == "02" || $("#cerTypM").val() == "03"){
    if($("#birthDtM").val()==""){
      showTipInfo("birthDtM","出生日期不能为空");
      return false;
    }
  }
  return true;
}
/*提交投诉表单时验证*/
function chkComForm(){
  if(!onblur_chkInfo("COM_TIT")){
    return false;
  }
  if(!onblur_chkInfo("typId")){
    return false;
  }
  if(!onblur_chkInfo("hisCd")){
    return false;
  }
  if(!onblur_chkInfo("comRm")){
    return false;
  }
  return true;
}

/*check checkHkongMacao*/
function checkHkMc(id){
  var value = $.trim($('#'+id).val()).replace(/\s/g, '');
  var len = value.length;
  if((id == "kidCerNo" && len==0) || (id == "kidCerNoM" && len==0)){
    showTipInfo(id);
    return true;
  }
  $("#"+id).val(value.toUpperCase());
  var _cdreg = /^[HMhm]{1}([0-9]{10}|[0-9]{8})$/;
  if(!_cdreg.test(value)){
    showTipInfo(id,"请输入有效的港澳居民通行证号码");
    return false;
  }
  showTipInfo(id);
  return true;
}

/*check checkHkongMacao*/
function checkTw(id){
  var value = $.trim($('#'+id).val()).replace(/\s/g, '');
  var len = value.length;
  if((id == "kidCerNo" && len==0) || (id == "kidCerNoM" && len==0)){
    showTipInfo(id);
    return true;
  }
  $("#"+id).val(value.toUpperCase());
  var _cdreg = /^([0-9]{8}|[0-9]{8}[a-zA-Z_0-9]{2}|[0-9]{8}[a-zA-Z_0-9]{5,6})$/;
  if(!_cdreg.test(value)){
    showTipInfo(id,"请输入有效的台湾居民通行证号码");
    return false;
  }
  showTipInfo(id);
  return true;
}

/*check user jkk*/
function chk_usrJkk(id){
  var value = $.trim($('#'+id).val()).replace(/\s/g, '');
  var _cdreg = /^\d{16}$/;
  if(value.length==0){
    showTipInfo(id);
    return true;
  }
  if(!_cdreg.test(value)){
    showTipInfo(id,'请输入有效的健康卡号');
    return false;
  }
  showTipInfo(id);
  return true;
}
/*ajax check user jkk*/
function ajx_chk_usrJkk(){
  if(!chk_idCard("cerNo")){
    return false;
  }
  if(!chk_usrJkk("usrJkk")){
    return false;
  }
  var CER_NO = $.trim($("#cerNo").val()).replace(/\s/g, '');
  var flag = true;
  var usrJkk = $.trim($('#usrJkk').val()).replace(/\s/g, '');
  if(usrJkk.length==0){
    showTipInfo("usrJkk");
    return true;
  }
  $.ajax({
    type: "POST",
    url:"/chkjkk.xhtml?USR_JKK="+usrJkk+"&CER_NO="+CER_NO+"&r="+Math.random(),
    data: "",
    async: false,
    dataType: "json",
    success: function(data){
      if(data.GWA.MSG_CD == "PTS00000"){
        showTipInfo("usrJkk",'');
        flag = true;
      }else{
        showTipInfo("usrJkk",data.GWA.MSG_DAT);
        flag = false
      }
    }
  });
  return flag;
}

/*找回密码 重置方式选择*/
function changeMess(way){
  if(way=='1'){
    //$("#resetPwd ul li:eq(1) label").text('用户名：');
    $("#idNoLabel").hide();
    $("#usrActLabel").show();
    $("#u_info").text('为注册时填写的用户名');
    $("#resetPwd ul li:eq(2) label").text('手机号码：');
    $("#phone_info").text('为注册时填写的手机号码');
    $("#login_name").blur(function(){chk_usrAct("login_name");});
    $("#phoneOrmail").blur( function () {chk_mblNo("phoneOrmail");  }); 
    $("#login_name").unbind("keyup");
  }else if(way=='3'){
    $("#usrActLabel").hide();
    $("#idNoLabel").show();
    //$("#resetPwd ul li:eq(1) label").text('证件号：');  
    $("#u_info").text('为注册时填写的证件号码');
    $("#resetPwd ul li:eq(2) label").text('手机号码：');
    $("#phone_info").text('为注册时填写的手机号码');
    $("#login_name").blur(function(){chk_cerNo("login_name")});
    $("#phoneOrmail").blur( function () {chk_mblNo("phoneOrmail");  }); 
    $("#login_name").keyup(function(){
      var text = $(this).val();
      text = text.toUpperCase();
      $("#login_name").val(text);
    });
  }
}

function chk_kidIdCard(cerNoId,birthdayId,sexId,cerTypId){
  var cerTyp = $("#"+cerTypId).val();
  if(cerTyp != "01"){//当证件类型不为身份证时，只需要作基本验证
    chk_cerNo(cerNoId,cerTypId);
    return false;
  }
  if(!chk_idCard(cerNoId)){
    $("#"+birthdayId+"Auto").val("").hide();
    $("#"+birthdayId).val("").show();
    $("#"+sexId+"Auto").val("").hide();
    $("#"+sexId).val("").show();
    return false;
  }
  var kidCerNo = $("#"+cerNoId).val();
  var birthday = "";
  var sex = "";
  if(kidCerNo.length == '0'){
    $("#"+birthdayId+"Auto").val("").hide();
    $("#"+birthdayId).show();
    $("#"+sexId+"Auto").val("").hide();
    $("#"+sexId).show();
  }else{
    var year = kidCerNo.substring(6,10);
    var month = kidCerNo.substring(10,12);
    var day = kidCerNo.substring(12,14);
    var sexDay = kidCerNo.substring(16,17);
    var birthday = year+'-'+month+'-'+day;
    var curYear = new Date().getFullYear();
    $("#"+birthdayId).val("").hide().val(birthday);
    $("#"+birthdayId+"Auto").val(birthday).show();
    $("#"+sexId).val("").hide();
    if (sexDay % 2 != 0) { 
      sex = "M";
      $("#"+sexId+"Auto").text("男");
    } else {  
      sex = "F";
      $("#"+sexId+"Auto").text("女");
    }
    $("#"+sexId).val(sex);
    $("#"+sexId+"Auto").show();
    if(curYear-year>16){
      showTipInfo(birthdayId,"为方便就诊，若子女的年龄大于16岁请添加至就诊人。");
    }
  }
}
/*check kid birthday*/
function chkBirthday(){
  if(new Date($("#birthday").val()).getFullYear()<new Date().getFullYear()-16){
    showTipInfo("birthday","若子女的年龄大于16岁请添加至就诊人。");
    return false;
  }
  return true;
}

function chkConnIdCard(cerNoId,connSex,cerTypId){
  var cerTyp = $("#"+cerTypId).val();
  if(cerTyp != "01"){//当证件类型不为身份证时，只需要作基本验证
    chk_cerNo(cerNoId,cerTypId);
    return false;
  }
  if(!chk_cerNo(cerNoId)){//当证件类型为身份证时，基本验证通过之后，显示该就诊人的性别
    $("#"+connSex+"Div").hide();
    return false;
  }
  $("#"+connSex+"Div").show();
  var kidCerNo = $("#"+cerNoId).val();
  var sexDay,sex;
  if(kidCerNo.length=="18"){
    sexDay = kidCerNo.substring(16,17);
  }else if(kidCerNo.length=="15"){
    sexDay = kidCerNo.substring(14,15);
  }
  if (sexDay % 2 != 0) { 
      sex = "M";
      $("#"+connSex+"Auto").text("男");
    } else {  
      sex = "F";
      $("#"+connSex+"Auto").text("女");
    }
    $("#"+connSex).val(sex);
}

/*====check USR_ACT====*/
function chk_usrAct(id){
  var value = $.trim($('#'+id).val()).replace(/\s/g, '');
  var msg = '';
  var _cdreg =/[a-zA-Z][a-zA-Z_0-9]{5,}/;
  if($( "#"+id ).is(":hidden" )){//如果用户名为不可输，则无需验证
    return true;
  }
  if(value == '' || value == null){
    showTipInfo(id,"用户名不能为空！");
    return false;
  }
  if(value.length < 6 || value.length >18 || !_cdreg.test(value)){
    showTipInfo(id,"用户名须以字母开头，以字母，数字和下划线组成，长度为6到18位之间！");
    return false;
  }
  showTipInfo(id,"");
  return true;
}
/*====check USR_ACT (Ajax)====*/
function ajx_chk_usrAct(id){
  if(chk_usrAct(id)){
    var usrAct = $("#"+id).val();
    // alert("usrAct===="+usrAct);
    var flag = false;
    $.ajax({
      url: "/ajx_chkreg.xhtml?USR_ACT="+usrAct+"&r="+Math.random(),
      type: "get",
      dataType: "json",
      data: "",
      async: false,
      success: function(data) {
        if(data.GWA.MSG_CD == "PTS00000"){
          showTipInfo(id,"");
          flag = true;
        }else if(data.GWA.MSG_CD == "PTS30820"){
          showTipInfo(id,"该用户名已经被注册");
          flag = false;
        }else{
          showTipInfo(id,data.GWA.MSG_DAT);
          flag = false;
        }
      }
    });
  }
  return flag;
}
/*====check PWD====*/
function check_pwd(id){
    var value = $.trim($('#'+id).val()).replace(/\s/g, '');
    var reg = /((?=.*[a-z])(?=.*\d)|(?=[a-z])(?=.*[#@!~%^&*])|(?=.*\d)(?=.*[#@!~%^&*]))[a-z\d#@!~%^&*]{6,20}/i;
    if(value == '' || value == null){
        showTipInfo(id,"用户密码不能为空！");
        return false;
    }
    if(value.length < 6 || value.length >20){
        showTipInfo(id,"密码长度不对，请输入6-20位长度的密码！");
        return false;
    }
    if(!reg.test(value)){
    		showTipInfo(id,"密码应包含数字、字母、特殊字符中的任意两种！");
        return false;
    }
    showTipInfo(id,"");
    return true;
}
/*====check RE_PWD====*/
function check_rePwd(id){
    var value = $.trim($('#'+id).val()).replace(/\s/g, '');
    var pwd = $("#pwd").val();
    if($("#newPwd").length!=0){
      pwd = $("#newPwd").val();
    }
    if(value == '' || value == null){
        showTipInfo(id,"确认密码不能为空!");
        return false;
    }
    if(value != pwd){
        showTipInfo(id,"两次密码输入不一致");
        return false;
    }
    showTipInfo(id,"");
    return true;
}
/*====check USR_NM====*/
function chk_usrNm(id){
  var value = $.trim($('#'+id).val()).replace(/\s/g, '');
  var msg ="";
  if($("#"+id ).is(":hidden" ) || $("#"+id ).length==0){//如果真实姓名为不可输，则无需验证
    return true;
  }
  if(value.length==0 || value==null){
    if(id == "usrNm"){
      msg = "用户姓名不能为空!";
    }else if(id == "connNm" || id == "connNm"){
      msg = "就诊人姓名不能为空!";
    }else if(id == "kidNm" || id == "kidNmM"){
      msg = "被监护人姓名不能为空!";
    }
    showTipInfo(id,msg);
    return false;
  }
  if(strlen(value) >12 || strlen(value) <4){
    showTipInfo(id,'姓名须是2－6个汉字录入或英文字母4－12个');
    return false;
  }
  if(strangecode(value) == false || value.indexOf(' ') != -1){
    if(id == "USR_NM"){
        msg = "用户姓名不能含有特殊字符或者空格！";
    }else if(id == "connNm" || id == "connNm"){
        msg = "就诊人姓名不能含有特殊字符或者空格！";
    }else if(id == "kidNm" || id == "kidNmM"){
        msg = "被监护人姓名不能含有特殊字符或者空格！";
    }
    showTipInfo(id,msg);
    return false;
  }
  showTipInfo(id,'');
  return true;
}
/*check certificate no by certificate type*/
function chk_cerNo(id,cerTypId){
  if(arguments.length == 1){
    cerTypId = "cerTyp";
  }
  var cerTyp = $("#"+cerTypId).val();
  if(cerTyp=="01"){
    return chk_idCard(id);
  }else if(cerTyp=="02"){
    return checkHkMc(id);
  }else if(cerTyp=="03"){
    return checkTw(id);
  }
}

/*====check CER_NO====*/
function chk_idCard(id){
    var value = $.trim($('#'+id).val()).replace(/\s/g, '');
    var len = value.length;
    if((id == "kidCerNo" && len==0) || (id == "kidCerNoM" && len==0)){
      showTipInfo(id);
      return true;
    }
    value = value.toUpperCase();
    if (len!=18&&len!=15){
        showTipInfo(id,'请输入15或18位身份证号码');
        return false;
    }
    if(len == 15){//15位的身份证，验证了生日是否有效
        var year =  value.substring(6,8);  
        var month = value.substring(8,10);  
        var day = value.substring(10,12);  
        var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));  
        if(temp_date.getYear()!=parseFloat(year) || temp_date.getMonth()!=parseFloat(month)-1 || temp_date.getDate()!=parseFloat(day)){
          showTipInfo(id,'请输入有效的身份证号码');
          return false;  
        }  
          showTipInfo(id,'');
          return true;  
    }
    if(len == 18){//18位的身份证，验证最后一位校验位
      var endChar=value.charAt(len-1);//身份证的最后一为字符   
      value=value.substr(0,17);
      var table = new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2);
      var table2 =new Array('1','0','X','9','8','7','6','5','4','3','2');
      var cNum=toCharArray(value);
      var sum = 0;
      var rs=0;
      for(var i =0;i<cNum.length;i++){
          // 其中(cNum[i]-48)表示第i位置上的身份证号码数字值，table[i]表示第i位置上的加权因子，
          var num=cNum[i].charCodeAt(0); 
          var num1=parseInt(table[i]);  
          sum=sum*1+(num-48) * num1;                     
      }
      // 以11对计算结果取模
      var index =Number(sum%11);
      // 根据模的值得到对应的校验码,即身份证上的最后一位为校验码
      var verfiyCode=table2[index];
      if (endChar!=verfiyCode){
          showTipInfo(id,'请输入有效的身份证号码');
          return false;
      }
      showTipInfo(id,'');
      return true;
  }
}
/*====验证身份证是否被注册====*/
function ajx_chk_cerNo(id){
  var CER_NO = $.trim($('#'+id).val()).replace(/\s/g, '');
  if((id == "kidCerNo" && CER_NO.length==0) || (id == "kidCerNoM" && CER_NO.length==0)){
    showTipInfo(id);
    return true;
  }
  if(chk_cerNo(id)){
    var flag = false;
    var cerTyp = $("#cerTyp").val();
    $.ajax({
      type: "GET",
      url:"/ajx_chkreg.xhtml?CER_NO="+CER_NO+"&CER_TYP="+cerTyp+"&r="+Math.random(),
      cache: false,
      dataType:"json",
      async: false,
      success: function(data){
        if(data.GWA.MSG_CD == "PTS00000"){
          showTipInfo(id,"");
          flag = true;
        }else{
          showTipInfo(id,data.GWA.MSG_DAT);
          flag = false;
        }
      }
    });
  return flag;
  }
}

/*===check MBL_NO=====*/
function chk_mblNo(id){
  var value = $.trim($('#'+id).val()).replace(/\s/g, '');
  var _cdreg = /^\d{11}$/;
  if(value.length==0){
    showTipInfo(id,'手机号码不能为空！');
    return false;
  }
  if(!_cdreg.test(value) || value =="11111111111"){
    showTipInfo(id,'手机号输入有误！请填写正确的手机号码！');
    return false;
  }
  showTipInfo(id,"");
  return true;
}

/*check user address*/
function chk_usrAdd(id){
   var value = $.trim($('#'+id).val()).replace(/\s/g, '');
   if(value.length==0){
    showTipInfo(id,"为方便就诊，请输入详细的现居地址。");
    return false;
   }
   if(strlen(value) >100){
    showTipInfo(id,'家庭住址文字长度超限');
    return false;
  }
  showTipInfo(id,'');
  return true;
}

/*ajax check user smk*/
function chk_usrSmk(){
  var CER_NO = $.trim($("#cerNo").val()).replace(/\s/g, '');
  var flag = true;
  var smkNo = $.trim($('#smkNo').val()).replace(/\s/g, '');
  var twmNo = $.trim($('#twmNo').val()).replace(/\s/g, '');
  if(smkNo.length==0){
    showTipInfo("smkNo");
    return true;
  }
  $.ajax({
    type: "POST",
    url:"/chksmk.xhtml?SMK_NO="+smkNo+"&CER_NO="+CER_NO+"&TWM_NO="+twmNo+"&r="+Math.random(),
    data: "",
    async: false,
    dataType: "json",
    success: function(data){
      if(data.GWA.MSG_CD == "PTS00000"){
        // alert("市民卡绑定成功！");
        showTipInfo("smkNo",'');
        flag = true;
      }else{
        showTipInfo("smkNo",data.GWA.MSG_DAT);
        flag = false
      }
    }
  });
  return flag;
}

/*发送短信验证码*/
$("#sendMSCD").click(function(){
  var MBL_NO = $("#mblNo").val();
  var CER_NO = $("#cerNo").val();
  if(!chk_idCard("cerNo") || !chk_mblNo("mblNo")){
    return false;
  }
  $.ajax({
    type: "POST",
    url:"/sendMsg.xhtml?MBL_NO="+MBL_NO+"&CER_NO="+CER_NO+"&r="+Math.random(),
    data: "",
    dataType: "json",
    success: function(data){
      if(data.GWA.MSG_CD == "PTS00000"){
        showTipInfo("verCdMsg",'验证码已发送至您的手机，请查看。','show_rule');
      }else{
        showTipInfo("verCdMsg",data.GWA.MSG_DAT);
      }
    }
  });
  ddpack.sendMSCD('sendMSCD','60');
});

/*====check VER_CD_MSG====*/
function chk_verCdMsg(id){
  var _cdreg = /^(\d+)$/;
  var value = $.trim($('#'+id).val()).replace(/\s/g, '');
  if(value==null||value.length==0){
    showTipInfo(id,'请输入验证码');
    return false;
  }
  if(value.length != 6 || !_cdreg.test(value) ){
    showTipInfo(id,'请输入6位数字的短信验证码');
    return false;
  }
  showTipInfo(id,'');
  return true;
}
/*====check VER_CD_MSG---Ajax====*/
function ajx_chk_msgCd(id,BUS_TYP){
  var value = $.trim($('#'+id).val()).replace(/\s/g, '');
  if(!chk_verCdMsg(id)){
    return false;
  }
  var flag = true;
  var MBL_NO = $.trim($("#mblNo").val()).replace(/\s/g, '');
  var CER_NO = $.trim($("#cerNo").val()).replace(/\s/g, '');
  var CER_TYP = $.trim($("#cerTyp").val()).replace(/\s/g, '');
  var VER_CD = $.trim($("#VER_CD").val()).replace(/\s/g, '');
    $.ajax({
    type: "GET",
    url:"/sendMsg.xhtml?VER_CD_MSG="+value+"&MBL_NO="+MBL_NO+"&CER_NO="+CER_NO+"&CER_TYP="+CER_TYP+"&VER_CD="+VER_CD+"&BUS_TYP="+BUS_TYP+"&r="+Math.random(),
    cache: false,
    dataType:"json",
    async: false,
    success: function(data){
      if(data.GWA.MSG_CD == "PTS00000"){
        showTipInfo(id);
        flag = true;
      }else{
        showTipInfo(id,data.GWA.MSG_DAT);
        flag = false;
      }
    }
  });
  return flag;
}
/*check feedback form*/
function onblur_chkInfo(id){
  var value = $.trim($("#"+id).val()).replace(/\s/g, '');
  if(id=="COM_TIT"){
    if(value=="" || value==null){
      showTipInfo(id,'投诉标题不能为空');
      return false;
    }
    if(strlen(value) >20){
      showTipInfo(id,'投诉标题字数不能超过10个字');
      return false;
    }
    showTipInfo(id,'');
    return true;
  }
  if(id=="COM_TIT2"){
    if(value=="" || value==null){
      showTipInfo(id,'申诉标题不能为空');
      return false;
    }
    if(strlen(value) >20){
      showTipInfo(id,'申诉标题字数不能超过10个字');
      return false;
    }
    showTipInfo(id,'');
    return true;
  }
  if(id=="typId"){
    if(value=="" || value==null){
      showTipInfo(id,'请选择投诉类型');
      return false;
    }
    showTipInfo(id,'');
    return true;
  }
  if(id=="hisCd"){
    if(value=="" || value==null){
      showTipInfo(id,'请选择您要投诉的医院');
      return false;
    }
    showTipInfo(id,'');
    return true;
  }
  if(id=="comRm"){
    if(value=="" || value==null){
      showTipInfo(id,'请填写投诉内容');
      return false;
    }
    if(strlen(value) >400){
      showTipInfo(id,'投诉内容不能超过200个字');
      return false;
    }
    showTipInfo(id,'');
    return true;
  }
  if(id=="comRm2"){
    if(value=="" || value==null){
      showTipInfo(id,'请填写申诉内容');
      return false;
    }
    if(strlen(value) >400){
      showTipInfo(id,'申诉内容不能超过200个字');
      return false;
    }
    showTipInfo(id,'');
    return true;
  }
}
/*====发短息按钮倒计时效果====*/
var ddpack = ddpack||{};
ddpack.param = {speed:1000,wait:0,kj_isinerval:null};
ddpack.wait = function(obj){
  var _id = obj;
  if(ddpack.param.wait == 0){
    $(obj).val("获取验证码");
    $(obj).attr("class","btn btn04");
    $(obj).removeAttr("disabled");
    clearInterval(ddpack.param.isinerval); 
  }else{
    $(obj).attr("class","btn btn_msg_len");
    $(obj).attr("disabled","disabled");
    $(obj).val("("+((ddpack.param.wait<10)?'0'+ddpack.param.wait:ddpack.param.wait)+")秒后重新获取验证码");
    ddpack.param.wait = (ddpack.param.wait -1);
    ddpack.param.isinerval=window.setTimeout("ddpack.wait('"+obj+"')",ddpack.param.speed);
  }
}
ddpack.sendMSCD = function(id,s){
  ddpack.param.wait = s;
  ddpack.wait("#"+id);
};

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
//cookie自动登录
function loginCookie(){
		var usr_nm = $("#cardNo").val();
		var usr_pd = $("#PWD").val();
		setCookie("usr_nm",usr_nm,7);
		setCookie("usr_pd",usr_pd,7);
}
//取消cookie自动登录
function noLoginCookie(){
		removeCookie("usr_nm");
		removeCookie("usr_pd");
}
//设置Cookie
function setCookie(Cookie,Value,Time){
		$.cookie(Cookie,Value,{expires:Time,path:'/'});
}
//获取Cookie
function getCookie(Cookie){
		return $.cookie(Cookie);
}
//删除Cookie
function removeCookie(Cookie){
		$.cookie(Cookie,"",-1);
}