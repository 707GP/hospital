jQuery(document).ready(function() {
  addDatepicker("sta_dat");//��ʼ�����ڿؼ�
  var nextDay = getNextDay();
  $("#sta_dat").val(nextDay);
});
/*��ȡ��һ������*/
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
//���ա���Ϊһλ���ǲ���
function formMonth(month){
  if(month>0&month<10){month="0"+month;}
  return month;
}
function formDay(day){
  if(day>0&day<10){day="0"+day;}
  return day;
}
/*�õ������µ�����*/
function getDaysInMonth(year,month){
  return new Date(year,month,0).getDate();
}

//������ڿؼ�
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

//��ȡ�����б�
function loadArea(){
  $("#areaId").empty();
  $("#areaId").html("<option value=''>-- ȫ�� --</option>\n");
  $("#hospitalId").empty();
  $("#hospitalId").html("<option value=''>-- ��ѡ�� --</option>\n");
  $("#pDeptId").empty();
  $("#pDeptId").html("<option value=''>-- ��ѡ�� --</option>\n");
  $("#deptId").empty();
  $("#deptId").html("<option value=''>-- ��ѡ�� --</option>\n");  
    $.ajax({
    url:"/ajxarea.xhtml?r="+Math.random(), 
    type: 'get',
    dataType: 'json',
    data:"",
    success: function(data) {
      var htmlContent="<option value=''>-- ȫ�� --</option>\n";
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
//��ȡҽԺ��Ϣ�б�
function loadHosp(){
  $("#hospitalId").empty();
  $("#hospitalId").html("<option value=''>-- ��ѡ�� --</option>\n");
  $("#pDeptId").empty();
  $("#pDeptId").html("<option value=''>-- ��ѡ�� --</option>\n");
  $("#deptId").empty();
  $("#deptId").html("<option value=''>-- ��ѡ�� --</option>\n");
  var ARE_ID = $("select[name='ARE_ID']").find("option:selected").val();
  $.ajax({
  url:"/ajxhospitals.xhtml?ARE_ID="+ARE_ID+"&r="+Math.random(), 
  type: 'get',
  dataType: 'json',
  data:"",
  success: function(data) {
    var htmlContent="<option value=''>-- ��ѡ�� --</option>\n";
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

/*��ȡ��������Ϣ*/
function loadPDept(){
  $("#pDeptId").empty();
  $("#deptId").empty();
  $("#pDeptId").html("<option value=''>-- ��ѡ�� --</option>\n");
  $("#deptId").html("<option value=''>-- ��ѡ�� --</option>\n");
  var HIS_CD = $("select[name='HIS_CD']").find("option:selected").val();
  //var DEP_ID = $("select[name='HIS_CD']").find("option:selected").attr("deptId");
  $.ajax({
  url:"/ajxPdepartments.xhtml?HIS_CD="+HIS_CD+"&r="+Math.random(),
  type:'get',
  data:"",
  dataType:'json',
  success: function(data) {
    var htmlContent="<option value=''>-- ��ѡ�� --</option>\n";
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

//��ȡ������Ϣ�б�
function loadDept(){
  $("#deptId").empty();
  $("#deptId").html("<option value=''>-- ��ѡ�� --</option>\n");
  var HIS_CD = $("select[name='HIS_CD']").find("option:selected").val();
  var PAR_DEP_ID = $("select[name=PAR_DEP_ID]").find("option:selected").val();
  if(HIS_CD!=""){   
    $.ajax({
    url:"/ajxdepartments.xhtml?HIS_CD="+HIS_CD+"&PAR_DEP_ID="+PAR_DEP_ID+"&r="+Math.random(), 
    type: 'get',
    dataType: 'json',
    data:"",
    success: function(data) {
      var htmlContent="<option value=''>-- ��ѡ�� --</option>\n";
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
    $("#deptId").html("<option value=''>-- ��ѡ�� --</option>");
  }
}
/*ҽ�������ѯ*/
function submitForm(){
  if(chkSubmit()){
    document.searchDocForm.submit();
  }
}
//�������ڲ�ѯ�����Ƿ�����ֵ
function chkSubmit(){
  // var areaId = $("#areaId").val();
  var hospitalId = $("#hospitalId").val();
  var pDeptId = $("#pDeptId").val();
  var deptId = $("#deptId").val();
  var searchDate = $("#sta_dat").val();
  // if(areaId=="" || areaId==null){
  //   alert("��ѡ������");
  //   return false;
  // }
  if(hospitalId=="" || hospitalId==null){
    alert("��ѡ��ҽԺ��");
    return false;
  }
  if(pDeptId=="" || pDeptId==null ){
    alert("��ѡ��һ�����ң�");
    return false;
  }
  if(deptId=="" || deptId==null ){
    alert("��ѡ��������ң�");
    return false;
  }
  if(searchDate=="" || searchDate==null){
    alert("��ѡ���ѯ���ڣ�");
    return false;
  }
  return true;
}
/*��ȡ��ǰ�µ�һ������ں����һ�������*/
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
/*���ա���Ϊһλ��ʱ����*/
function formMonth(month){
     if(month>0&month<10){month="0"+month;}
     return month;
}
function formDay(day){
     if(day>0&day<10){day="0"+day;}
     return day;
}
/*�õ�Ƭjs*/
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
