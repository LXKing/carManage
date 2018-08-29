//图片上传
function PreviewImage(imgFile,id){
		var filextension=imgFile.value.substring(imgFile.value.lastIndexOf("."),imgFile.value.length);
		filextension=filextension.toLowerCase();
		if((filextension!='.jpg')){
			alert("请输入jpg格式图片");
			imgFile.focus();
		}else{
			var path;
	//		var fileId = imgFile.getAttribute("id");
			if(document.all){//ie
				imgFile.select();
				path = document.selection.createRange().text;
				document.getElementById(id).innerHTML = "";
			}else{//ff
				path=window.URL.createObjectURL(imgFile.files[0]);
				document.getElementById(id).innerHTML = "<img class='img1' width='100%' height='100%' src='"+path+"' />";
			}
		}
	}console.log(g_carNumber)
$(function () {
//  lcarNumber = localStorage.getItem('carNumber');
    $.ajax({
        type: "get",
        url: "http://192.168.1.111:2238/handler/CarManage/CarQuery/GetCarDetails.ashx",
        dataType: "json",
        data: { 'carNumber': g_carNumber },
        success: function (data) {
            if (data.state = "success") {
                //车辆信息详情               
                var carInf_det = data.carInf_det;
                $(".topBranch").text(carInf_det.topBranch);
                $(".img1").attr("src", carInf_det.imgSrc);
                $(".firBrandDet").val(carInf_det.firBrandDet);
                $(".licenceDet").text(carInf_det.licenceDet);
                $(".buydayDet").val(carInf_det.buydayDet);
                $(".modelDet").val(carInf_det.modelDet);
                $(".typeDet").val(carInf_det.typeDet);
                $("#safeStart").val(carInf_det.safeStartDet);
                $("#safeEnd").val(carInf_det.safeEndDet);
                $(".enginDet").val(carInf_det.enginDet);
                $(".priceDet").val(carInf_det.priceDet);
                $(".annualStartDet").val(carInf_det.annualStartDet);
                $(".annuaEndDet").val(carInf_det.annuaEndDet);
                $(".mileDet").text(carInf_det.mileDet);
                $(".outnumDet").text(carInf_det.outnumDet);
                $(".mtStartDet").val(carInf_det.mtStartDet);
                $(".mtEndDet").val(carInf_det.mtEndDet);
                $(".mtMoneyDet").text(carInf_det.mtMoneyDet == null ? 0 : carInf_det.mtMoneyDet);
                $(".mtNumDet").text(carInf_det.mtNumDet);
                //						//状态信息	
                if (carInf_det.currentState == "1") {
                    $(".currentState").text("已预约");
                } else if (carInf_det.currentState == "2") {
                    $(".currentState").text("外出");
                } else {
                    $(".state_det").remove();
                }
                var state_det = data.state_det;
                $(".currName").text(state_det.currName);
                $(".currBranch").text(state_det.currBranch);
                $(".currUsed").text(state_det.currUsed);
                $(".currBack").text(state_det.currBack);
                $(".currDestination").text(state_det.currDestination);
                $(".currEffect").text(state_det.currEffect);
            } else if (data.state == "1") {
                alert("请重新登录");
                location.href = "/login.html"
            } else {
                alert(data.state);
            }
        },
        error: function () {
            alert('暂无详情可查看！')
        }
    });
		//修改详情信息
	$(".detChange").click(function(){
		$(".detChange").addClass("ohide");
		$(".detSave").removeClass("ohide");
		$(".detailsInfBg").addClass("ohide");
		$(".carInf_det input").css("border","solid 1px lightgray");
		
	});
	//修改信息验证
    function detAmend() {
        for (var i = 0; i < $(".isnull").length; i++){
            
            console.log($(".isnull")[i].value);
            if ($(".isnull")[i].value == "") {
				alert("请填写空缺信息");
				return;
			}
		}
		var regpriceDet=/^[0-9]*\.?[0-9]*$/;
	    var opriceDet = $(".priceDet").val();
	    if (!regpriceDet.test(opriceDet)) {
	        alert("价格为纯数字或数字加小数点");
	        return;
	    }
		
		var regMileage=/^[0-9]*\.?[0-9]*$/;
	    var oMileage = $(".mileDet").val();
	    if (!regMileage.test(oMileage)) {
	        alert("里程为纯数字或数字加小数点");
	        return;
	    }
	   
	    var regmtMoneyDet=/^[0-9]*\.?[0-9]*$/;
	    var omtMoneyDet = $(".mtMoneyDet").val();
	    if (!regmtMoneyDet.test(omtMoneyDet)) {
	        alert("维修金额为纯数字或数字加小数点");
	        return;
	    }
	}
	$(".detSave").click(function(){
		detAmend();
		$(".carInf_det input").css("border","none");
		$(".detSave").addClass("ohide");
		$(".detChange").removeClass("ohide");		
        $(".detailsInfBg").removeClass("ohide");
        var carNumber = $('.licenceDet').text();
		var firBrandDet=$(".firBrandDet").val();
		var buydayDet=$(".buydayDet").val();
		var modelDet=$(".modelDet").val();
		var typeDet=$(".typeDet").val();
		var safeStart=$("#safeStart").val();
		var safeEnd=$("#safeEnd").val();
		var enginDet=$(".enginDet").val();
		var priceDet=$(".priceDet").val();
		var yearStart=$("#yearStart").val();
		var yearEnd=$("#yearEnd").val();
		var mtStartDet=$("#mtStartDet").val();
        var mtEndDet = $("#mtEndDet").val();	
        debugger

        $.get("http://192.168.1.111:2238/handler/CarManage/CarQuery/ChangeCarInfo.ashx", {
            'carNumber': carNumber, "firBrandDet": firBrandDet, "buydayDet": buydayDet, "modelDet": modelDet, "typeDet": typeDet, "safeStart": safeStart, "safeEnd": safeEnd,
            "enginDet": enginDet, "priceDet": priceDet, "yearStart": yearStart, "yearEnd": yearEnd, "mtStartDet": mtStartDet, "mtEndDet": mtEndDet
        }, function (ret) {
                var obj = JSON.parse(ret);
                if (obj.state == 'success') {
                    alert('保存成功');
                } else if (obj.state == '1') {
                    alert('请重新登录');
                    window.location.href = '/login.html';
                } else {
                    alert(obj.state);
                }
            });
		})
		$(".back_title").click(function(){
			$("#container").load("html/carManage/query.html");
		});
})