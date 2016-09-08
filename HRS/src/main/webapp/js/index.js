jQuery(document).ready(function() {
  addDatepicker("sta_dat");//初始化日期控件
  var nextDay = getNextDay();
  $("#sta_dat").val(nextDay);
});
/*获取下一天日期*/
function getNextDay(){
  // var date = new Date();
  // var nextDate = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+(date.getDate()+1);
  // alert(dayChanged(-1,'-'));
  return dayChanged(1,'-');
}

function dayChanged(n,f) {
  var date = new Date();          
  var year = date.getFullYear();
  var month = date.getMonth()+1;
  var day = date.getDate();
  var nextDay = day+n;
  var oneMonth_days=getDaysInMonth(year,month);
  if(nextDay>oneMonth_days){
  if(month>=12){
    month=month-12;
    year=year+1;
  }
    month=month+1;
    nextDay=nextDay-oneMonth_days;  
  }
  return year+f+formMonth(month)+f+formDay(nextDay);
}
//当日、月为一位数是补零
function formMonth(month){
  if(month>0&month<10){month="0"+month;}
  return month;
}
function formDay(day){
  if(day>0&day<10){day="0"+day;}
  return day;
}
/*得到任意月的天数*/
function getDaysInMonth(year,month){
  return new Date(year,month,0).getDate();
}

//添加日期控件
function addDatepicker(id){
  var dateOne = $("#"+id).datepicker({
  defaultDate: "+1w",
  changeMonth: true,
  numberOfMonths: 1,
  dateFormat:"yy-mm-dd",
  onSelect: function(selectedDate) {
    var option = this.id == "id" ? "minDate" : "maxDate";
    var instance = $(this).data("datepicker");
    var date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings);
    dateOne.not(this).datepicker("option", option,date);
    }       
  });
}

//获取地区列表
function loadArea(){
  $("#areaId").empty();
  $("#areaId").html("<option value=''>-- 全部 --</option>\n");
  $("#hospitalId").empty();
  $("#hospitalId").html("<option value=''>-- 请选择 --</option>\n");
  $("#pDeptId").empty();
  $("#pDeptId").html("<option value=''>-- 请选择 --</option>\n");
  $("#deptId").empty();
  $("#deptId").html("<option value=''>-- 请选择 --</option>\n");  
    $.ajax({
    url:"/ajxarea.xhtml?r="+Math.random(), 
    type: 'get',
    dataType: 'json',
    data:"",
    success: function(data) {
      var htmlContent="<option value=''>-- 全部 --</option>\n";
      if(data.REC == "" || data.REC == null){
        return false;
      }
      for( var i = 0; i < data.REC.length; i++ ) {
          htmlContent = htmlContent + " <option value='"+data.REC[i].ARE_ID+"'>"+data.REC[i].HIS_ARE+" </option >\n";
      }
      $("#areaId").html(htmlContent);
    }
    });
}
//获取医院信息列表
function loadHosp(){
  $("#hospitalId").empty();
  $("#hospitalId").html("<option value=''>-- 请选择 --</option>\n");
  $("#pDeptId").empty();
  $("#pDeptId").html("<option value=''>-- 请选择 --</option>\n");
  $("#deptId").empty();
  $("#deptId").html("<option value=''>-- 请选择 --</option>\n");
  var ARE_ID = $("select[name='ARE_ID']").find("option:selected").val();
  $.ajax({
  url:"/ajxhospitals.xhtml?ARE_ID="+ARE_ID+"&r="+Math.random(), 
  type: 'get',
  dataType: 'json',
  data:"",
  success: function(data) {
    var htmlContent="<option value=''>-- 请选择 --</option>\n";
    if(data.REC == "" || data.REC == null){
      return false;
    }
    var deptId ="";
    for( var i = 0; i < data.REC.length; i++ ) {
      //deptId = data.REC[i].DEP_ID;
      htmlContent = htmlContent + " <option value='"+data.REC[i].HIS_CD+"'> "+data.REC[i].HIS_NM+" </option >\n";
    }
    $("#hospitalId").html(htmlContent);
  }
  });
}

/*获取父科室信息*/
function loadPDept(){
  $("#pDeptId").empty();
  $("#deptId").empty();
  $("#pDeptId").html("<option value=''>-- 请选择 --</option>\n");
  $("#deptId").html("<option value=''>-- 请选择 --</option>\n");
  var HIS_CD = $("select[name='HIS_CD']").find("option:selected").val();
  //var DEP_ID = $("select[name='HIS_CD']").find("option:selected").attr("deptId");
  $.ajax({
  url:"/ajxPdepartments.xhtml?HIS_CD="+HIS_CD+"&r="+Math.random(),
  type:'get',
  data:"",
  dataType:'json',
  success: function(data) {
    var htmlContent="<option value=''>-- 请选择 --</option>\n";
    if(data.REC == "" || data.REC == null){
      return false;
    }
    for( var i = 0; i < data.REC.length; i++ ) {
    htmlContent = htmlContent + " <option value='"+data.REC[i].DEP_ID+"'>"+data.REC[i].DEP_NM+" </option >\n";
    }
    $("#pDeptId").html(htmlContent);
  }
  });
}

//获取科室信息列表
function loadDept(){
  $("#deptId").empty();
  $("#deptId").html("<option value=''>-- 请选择 --</option>\n");
  var HIS_CD = $("select[name='HIS_CD']").find("option:selected").val();
  var PAR_DEP_ID = $("select[name=PAR_DEP_ID]").find("option:selected").val();
  if(HIS_CD!=""){   
    $.ajax({
    url:"/ajxdepartments.xhtml?HIS_CD="+HIS_CD+"&PAR_DEP_ID="+PAR_DEP_ID+"&r="+Math.random(), 
    type: 'get',
    dataType: 'json',
    data:"",
    success: function(data) {
      var htmlContent="<option value=''>-- 请选择 --</option>\n";
      if(data.REC == "" || data.REC == null){
        return false;
      }
      for( var i = 0; i < data.REC.length; i++ ) {
          htmlContent = htmlContent + " <option value='"+data.REC[i].DEP_ID+"'>"+data.REC[i].DEP_NM+" </option >\n";
      }
      $("#deptId").html(htmlContent);
      }
    });
  }else{
    $("#deptId").html("<option value=''>-- 请选择 --</option>");
  }
}
/*医生出诊查询*/
function submitForm(){
  if(chkSubmit()){
    document.searchDocForm.submit();
  }
}
//出诊日期查询条件是否输入值
function chkSubmit(){
  // var areaId = $("#areaId").val();
  var hospitalId = $("#hospitalId").val();
  var pDeptId = $("#pDeptId").val();
  var deptId = $("#deptId").val();
  var searchDate = $("#sta_dat").val();
  // if(areaId=="" || areaId==null){
  //   alert("请选择区域！");
  //   return false;
  // }
  if(hospitalId=="" || hospitalId==null){
    alert("请选择医院！");
    return false;
  }
  if(pDeptId=="" || pDeptId==null ){
    alert("请选择一级科室！");
    return false;
  }
  if(deptId=="" || deptId==null ){
    alert("请选择二级科室！");
    return false;
  }
  if(searchDate=="" || searchDate==null){
    alert("请选择查询日期！");
    return false;
  }
  return true;
}
/*获取当前月第一天的日期后最后一天的日期*/
function getLastDay(){
  var DATE = new Date();
  var year = DATE.getFullYear();
  var month = DATE.getMonth()+1;
  var lastDate = new Date(year,month,0).getDate();
  return year+"-"+formMonth(month)+"-"+formDay(lastDate);
}
function getFirstDay(){
  var DATE = new Date();
  return DATE.getFullYear()+"-"+(DATE.getMonth()+1)+"-01";
}
/*当日、月为一位数时补零*/
function formMonth(month){
     if(month>0&month<10){month="0"+month;}
     return month;
}
function formDay(day){
     if(day>0&day<10){day="0"+day;}
     return day;
}
/*幻灯片js*/
$(function(){
     var len  = $(".flashSlider .num > li").length;
   var index = 0;
   var adTimer;
   $(".flashSlider .num li").mouseover(function(){
    index  =   $(".flashSlider .num li").index(this);
    showImg(index);
   }).eq(0).mouseover();  
  
   $('.flashSlider').hover(function(){
       clearInterval(adTimer);
     },function(){
       adTimer = setInterval(function(){
          index++;
        if(index==len){index=0;}
        showImg(index); 
        } , 5000);
   }).trigger("mouseleave");
})
      
function showImg(index){
  var adHeight = $(".flashSlider").height();
  $(".flashSlider .slider").stop(true,false).animate({top : -adHeight*index},"normal");
  $(".flashSlider .num li").removeClass("on")
    .eq(index).addClass("on");
}
