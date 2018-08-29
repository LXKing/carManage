$(document).ready(function() {

	getDepartment();
//	checkInfo();
	odelSearch();
});

function getDepartment(){
	var option = $('.mtBranch').html().trim();
    $.ajax({
        type: "post",
        dataType: "json",
        url: "../handler/GetDepartment.ashx",
        data:{from:0},
        xhrFields:{withCredentials:true},
        success: function (data) {
            var obj = data;
            for (var i = 0; i < obj.length; i++) {
                option += '<option value="' + obj[i].Name + '">' + obj[i].Name + '</option>';
            }
            $('.mtBranch').html(option);   
            var currentBranch = $(".branchName").text();
			$(".mtBranch").val(currentBranch);
			if(userType==1){
				$(".mtBranch").attr("disabled","disabled");
			}
			checkInfo();
        },
        error: function () {
            console.log("部门获取失败");
        }
    });
}

//获取
function checkInfo(){
	var content = this;
	var department = $('.mtBranch').val();
	var status="";
	var mtTime1=$("#mtTime1").val();
	var mtTime2 = $("#mtTime2").val();
	var status = $(".status").val();
	debugger
	$.ajax({
		type:"get",
		url:"../handler/Statistics/ViewCarsMaintain.ashx",
		xhrFields:{withCredentials:true},
		data: { "department": department, "status": status, "startDate": mtTime1, "endDate": mtTime2,from:0 },
		dataType:"json",
		success:function(data){
			if(data.state=="success"){
				$(".maintenanceCosts").text(data.maintenanceCosts);
				$(".serviceCosts").text(data.serviceCosts);
				$(".maintenanceCount").text(data.maintenanceCount);	
				$(".refuelingFee").text(data.refuelingFee);	
				content.getMaintenance(data.maintenanceInfo);
				//debugger
			}else if(data.state=="1"){
				alert("请重新登录");
				location.href="./login.html"
			}else{
				alert(data.state);
			}
		},error:function(e1,e2,e3){
			console.log("加载失败")
		}
	});
	
	this.getMaintenance = function(_data){
		var maintenanceNode = "";
		for (var i = 0; i<_data.length;i++) {
			maintenanceNode += '<ul class="carInfo">'+
				'<li class="carsImg"><img src="' + _data[i].carImg + '"/></li>' +
				'<li class="brands"><span class="firstBrand">'+_data[i].firstBrand+'</span></li>'+
				'<li class="license"><span class="carLicense">车牌：<span class="plateNum">' + _data[i].licence + '</span></span><span class="seat">' + _data[i].seat + '</span></li>' +
				'<li class="stateInf"><div class="tripMile"><span class="miles">'+_data[i].price+'</span>元</div><div class="tripCount"><span class="count">'+_data[i].count+'</span>次</div></li>'+
			'</ul>';
		}
//		document.getElementById("driverInfo").innerHTML = maintenanceNode;
		$(".driversInfo").html(maintenanceNode)
		picSize();
	}
	
}

//改变图片尺寸
function picSize(){
	var picWidth = $(".carsImg>img").width();
	var picHeight = picWidth * 5/7;
	$(".carsImg>img").height(picHeight);
}

window.onresize = picSize;

function odelSearch(){
	$(".mtBranch").change(function(){
		checkInfo();
	})
	$(".status").change(function(){
		checkInfo();
	})
//	$(".olength").blur(function(){
//		if($("body>div:last-child").css("display")=="none"){//时间框隐藏了触发事件
//			checkInfo();debugger
//		}
//	})
//	$("#mtTime1").focus(function(){debugger
//		WdatePicker({maxDate:'#F{$dp.$D(\'mtTime2\')}',dchanged:checkInfo,Mchanged:checkInfo,ychanged:checkInfo});
//		$("#mtTime1").blur();
//	})
	$("#mtTime1").click(function(){
		$("#mtTime1").focus(function(){
			checkInfo();
		});
	})	
	$("#mtTime2").click(function(){
		$("#mtTime2").focus(function(){
			checkInfo();
			$("#mtTime2").blur();
		});
	})
}