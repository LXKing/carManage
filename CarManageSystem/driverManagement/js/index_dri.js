var flag = false;
var g_depart;
var lastTime;
$(function(){	
	//头像
  	$.ajax({
		type:"get",
		url: "http://192.168.1.120:2238/handler/GetCurrentUser.ashx",
		data:{ "from":0},
		xhrFields:{withCredentials:true},
		dataType:"json",
		success:function(data){
	        if (data.state == "success") {
				$(".personPho img").attr("src",data.info.imgsrc);
	            $(".myName").text(data.info.myname);
	            $(".branchName").text(data.info.branch);
	            lastTime = data.info.LastLoginDate;
	            g_depart = data.info.branch;
//	            $("#container").load('driverManagement/homePage/driverHome.html');debugger
//	            setCss($(".oHome"));
//	            $(".oHome").addClass("p_pg1");
				$(".oHome").trigger("click");
			}else if(data.state=="1"){
					alert("请重新登录");
					location.href="./login.html"
			}else{
				alert(data.state);
			}
		}
	});	
		//退出
  	$(".thrIcon").click(function () {
      	$.get("../handler/Quit.ashx", function (res) {
          	var data = JSON.parse(res);
          	if (data.state == "success") {
				location.href="./login.html"
			}else if(data.state=="1"){
				alert("请重新登录");
				location.href="login.html"
			}else{
				alert(data.state);
			}
		});
	})
	
	$(".firList p").on('click',function(){
		$(this).siblings().toggle();
		$(this).addClass('p_pg1');
		if($(this).siblings().css('display')=='block'||$(this).siblings().length==0){
			$(this).parent().siblings().find('p').hover(function(){
				$(this).addClass('p_pg2');
			},function(){
				$(this).removeClass('p_pg2');
			})			
			$(this).parent().siblings().find('p').removeClass('p_pg1')		
			$(this).parent().siblings().find('.secList').css('display','none');
		}
	});
//	$("#carManage_dri>p").trigger("click");
	//关闭预约信息框
	$(".closed").click(function(){
		$(".orderBg").addClass("hideBg");
		$(".orderBg1").addClass("hideBg");
	})
	//左侧列表样式变化
	function setCss(_this){
		//_this.parents('.lists').css('color','gray');
		$(".secList li").css('color','gray');
		$('.firList > p').css('color','gray');
		_this.css('color','#4275f8');
		$(".secList").css('display','none');
		_this.parent().css('display','block');
	}		
	
	//首页 //消息提醒
	$(".oHome").click(function(){
		$("#container").load('driverManagement/homePage/driverHome.html');
		setCss($(this));
	});
//	$(".oHome").trigger("click");
	//个人中心
	$(".personInf").click(function(){
		flag = false;
		$("#container").load('driverManagement/driverPersonCenter/driverPersonCenter.html');
	})
	//司机查询
	$(".query_dri").click(function(){
		$("#container").load('driverManagement/driverTask/driverTask.html');
		setCss($(this));
	});
	//车辆管理
	//车辆查询
	$(".clcx_dri").click(function(){
		$("#container").load('driverManagement/carsManage/carsManagement.html');
		setCss($(this));
	})
	//还车
	$(".ycsq_dri").click(function(){
		$("#container").load('driverManagement/carsManage/returnCar.html');
		setCss($(this));		
	})
	//轨迹管理
	//历史轨迹
	$(".lsgj").click(function(){
		$("#container").load('driverManagement/historyLocus/history.html');
		setCss($(this));
	})
		
	$(".instituteYN").change(function(){
		if($(".instituteYN").val() == "院外"){
			$(".resontext").removeAttr("readonly");
		}else{
			$(".resontext").attr("readonly","readonly");
		}
	})
	$(".maintainyn").change(function(){		
		var repair = $(".maintainyn:checked").val();
		if(repair == 1){
			$(".maintaintext").removeAttr("readonly");
		}else{
			$(".maintaintext").attr("readonly","readonly");
		}
	})
})

function ifmload(ifm) {
    debugger
    var tempHtml = $(ifm.contentWindow.document.body).find('pre').html();
    if (tempHtml == undefined)
    {
        return;
    }
    var val = JSON.parse($(ifm.contentWindow.document.body).find('pre').html());
    
    if (val.state == "success") {
        alert('录入成功！');
    } else if (val.state == "1") {
        alert('请重新登录');
        window.location.href = './login.html';
    } else {
        alert('录入失败：' + val.state);
    }
}