var isFirstClear=1;
var HasCarNumbers = [];
function clickY(carNumber){
		$.each($(".mapsecList li"), function() {
			if($(this).text()==carNumber){
				$(this).css({					
					"cursor":"point",
					"point-events":"auto",
					"opacity":1
				});	
				$(this).click(function(){					
					$(".mapsecList li").css("color","#000000");	
					$(this).css("color","#ff0060");
					setPosition(carNumber);
		 		});
			}			
		});
	}
function clickN(carNumber){
	$.each($(".mapsecList li"), function() {
		if($(this).text()==carNumber){
			$(this).css({
				"cursor":"default",
				"point-events":"none",
				"opacity":0.3
			})
		}
	});				
}
$(function () {
	if(userType==1){
		getLicence();
	}else{
		getDepartment();
		$("#maplists").show();debugger
		mapList();
		$("#mycurrentmap").css("width","80%");		
	}
//  $(".mapsecList li").click(function(){
//  	setlistCss($(this));
//  })
    //getDepartment1();
    $('#mycurrentmap').load('html/trajectlog/realtime.html');
    $('#myhistorymap').load('html/trajectlog/history.html');
	function setlistCss(_this){		
		$(".mapsecList li").css('color','gray')
		_this.css('color','blue');
		$(".mapsecList").css('display','none');
		_this.parent().css('display','block');
	}
	function mapList(){debugger
		$.ajax({
	  		type:"get",
			url:"../handler/Trajectory/GetCarNumberTree.ashx",
			data:{from:0},
			xhrFields:{withCredentials:true},
			async:true,
            success: function (data) {
            	var data=JSON.parse(data);
	  			if(data.state=="success"){  				
					var maplist=data.maplist;
	  				var listhtml="";
	  				for(var i = 0;i < maplist.length;i++){
	  					var carnum="";
	  					for(var k=0;k<maplist[i].carNum.length;k++){
                        	carnum+='<li class="">'+maplist[i].carNum[k]+'</li>'                        	
                        }
	  					listhtml += '<li id="mapcarManage" class="mapfirList"><p>'+maplist[i].department+'</p><ul class="mapsecList ohide">'+carnum+'</ul></li>';	  					                                             
	  				}
	  				$(".maplists").html(listhtml);
	  				listclick();
//	  				clickY(carNumber);
	  				clickN("京A00003");
				}else if(data.state=="1"){
					alert("请重新登录");
					location.href="./login.html"
				}else{
					alert(data.state);
				}
			},
			error: function () {
	  			console.log("信息加载失败");
	  		}
		})
	}
	function listclick(){
		$(".mapfirList p").click(function(){
			$(this).siblings().toggle();	
			$(this).parent().siblings().find('.mapsecList').css('display','none');
		});				
	}
	
	function getLicence(){
        var option = $('.allLicence').html();
		$.ajax({
	  		type: "post",
			dataType: "json",
			url: "../handler/GetCarNumbers.ashx",
			data:{from:0},
			xhrFields:{withCredentials:true},
            success: function (data) {
	  			var obj = data;
	  			for (var i = 0; i < obj.length; i++) {
                        option += '<option value="' + obj[i] + '">' + obj[i] + '</option>';
                        HasCarNumbers.push(obj[i]);
	 			}
                $('.allLicence').html(option);
			},
			error: function () {
	  			console.log("车辆获取失败");
	  		}
		})		
    }
	//获取部门
      function getDepartment() {debugger
           $('.allBranch').show();
          var option = $('.allBranch').html();
          $.ajax({
              type: "post",
              dataType: "json",
              url: "../handler/GetDepartment.ashx",
              data: { from: 0 },
              xhrFields: { withCredentials: true },
              success: function (data) {
                  var obj = data;
                  for (var i = 0; i < obj.length; i++) {
                      option += '<option value="' + obj[i].Id + '">' + obj[i].Name + '</option>';
                  }
                  $('.allBranch').html(option);
				  getLicence();
              },
              error: function () {
                  console.log("部门获取失败");
              }
          })
      }
		//根据部门加载车牌
      $('.allBranch').on('change', function () {debugger
          var department=$(".allBranch").val();
          var option = '<option value="">请选择车牌</option>';
          $.ajax({
              type: "post",
              dataType: "json",
              url: "../handler/GetCarNumbers.ashx",
              data: { from: 0, "department": department},
              xhrFields: { withCredentials: true },
              success: function (data) {
                  var obj = data;
	  			for (var i = 0; i < obj.length; i++) {
                        option += '<option value="' + obj[i] + '">' + obj[i] + '</option>';
                        HasCarNumbers.push(obj[i]);
	 			}
                $('.allLicence').html(option);
			},
              error: function () {
                  console.log("车辆获取失败");
              }
          })	
      });

	function currentTime(){
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth()+1;
		var day = date.getDate();
//		var hours=date.getHours();
//		var minutes=date.getMinutes();
//		var seconds=date.getSeconds();
		if(month>=1 && month<=9){
			month="0"+month;
		}
		if(day>=1 && day<=9){
			day="0"+day;
		}
//		var currentdate=year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds;
	var currentdate=year+'-'+month+'-'+day;
		return currentdate;
	}		
	//历史
	$("#historyDate").val(currentTime());
	function moveLR(){
		var driLength=$(".driInf").length;
//		$(".driInfs").width(($(".historyInf").width()*0.98-15)*0.9-2);
		if(window.screen.width<1366){	
			if($(".driInf").length<2){
				$(".moveLeft").addClass("ohide");
				$(".moveRight").addClass("ohide");
			}else{
				$(".moveLeft").removeClass("ohide");
				$(".moveRight").removeClass("ohide");
			}
			$(".driInfs_wrap").width(($(".driInfs").width()*driLength));
			$(".driInf").width($(".driInfs").width());
			//信息左右切换
			var i=1;
			$(".moveRight").click(function(){
				if(i<driLength){
					$(".driInfs_wrap").css("left",-i*100+"%");
					i++;
					if(i==driLength){return;}
	//				console.log(i)	
				}		
			})
			$(".moveLeft").click(function(){console.log(i)		
				if(i==driLength){
					i--;
				}
				if(i>0){
					i--;
					$(".driInfs_wrap").css('left',-i*100+'%');
					if(i==0){i=1;}
				}			
			})
		}else{
			if($(".driInf").length>2){
				$(".moveLeft").removeClass("ohide");
				$(".moveRight").removeClass("ohide");				
			}else{
				$(".moveLeft").addClass("ohide");
				$(".moveRight").addClass("ohide");
			}
			$(".driInfs_wrap").width(($(".driInfs").width()*driLength)/2)
			$(".driInf").width($(".driInfs").width()/2);
			var i=1;
			$(".moveRight").click(function(){
				if(i<driLength-1){
					$(".driInfs_wrap").css("left",-i*50+"%");
					i++;
					if(i==driLength-1){return;}
				}		
			})
			$(".moveLeft").click(function(){console.log(i)		
				if(i==driLength-1){
					i--;
				}
				if(i>0){
					i--;
					$(".driInfs_wrap").css('left',-i*50+'%');
						if(i==0){
							i=1;
					}
				}			
			})
		}
	}
	//历史轨迹查看
//	historyDriInf();
	$(".allLicence").change(function(){
		historyDriInf();
//		historyDate();
	});
//	$("#historyDate").blur(function(){
//		if($("body>div:last-child").css("display")=="none"){//时间框隐藏了触发事件
//			historyDriInf();
//		}		
//	});
	
//标注日期
	var specialDate=[];
//	function historyDate(){
//		var carNumber = $(".allLicence").val();debugger
//		$.ajax({
//			type:"get",
//			url:"../handler/Trajectory/GetUseData.ashx",
//			data:{"carNumber":carNumber,from:0},
//			xhrFields:{withCredentials:true},
//			async:true,
//			success:function(data){
//				var data=JSON.parse(data);
////				if(data.state=="success"){
//					 specialDate=data;
////				}else if(data.state=="1"){
////					alert("请重新登录");
////					location.href="./login.html"
////				}else{
////					alert(data.state);
////				}
//			},error:function(e1,e2,e3){
//				console.log("请求失败")
//			}
//		});
//	}
	$("#historyDate").bind("focus",function(){
		WdatePicker({specialDates:specialDate,dchanged:historyDriInf,Mchanged:historyDriInf,ychanged:historyDriInf});		
		$("#historyDate").blur();
		});
	
    function historyDriInf() {
    	$(".loadingGif").toggle();debugger
        var historyDate = $("#historyDate").val();
        var allLicence = $(".allLicence").val();
        var c;
        if($dp.cal!=undefined){debugger
        	c = $dp.cal;
        	historyDate=c.newdate.y+'-'+c.newdate.M+'-'+c.newdate.d;        	
        }
		$.ajax({
			type:"get",
            url:"../handler/Trajectory/GetTrajectory.ashx",
			data:{"allLicence":allLicence,"historyDate":historyDate,from:0},
			xhrFields:{withCredentials:true},
			async:true,
            success: function (datajson) {
                var data = JSON.parse(datajson);
                specialDate=data.useDate;

                if (data.state == "success") {
                    if (isFirstClear != 1)
                    {
                        clear();
                    }
                    isFirstClear = 2;
					var driInf=data.info;
					var driInfhtml="";
                    for (var i = 0; i < driInf.length; i++){
                        var color = randomColor();
                        driInfhtml += '<div class="driInf"><img src="' + driInf[i].driImg + '" class="driImg"/>' + '<ul class="detInf">'
                            + '<li class="detInf1"><span class="driName" style="color:' + color + '">' + driInf[i].driName + '</span><span class="branchName">' + driInf[i].carNumber + '</span></li><li class="detInf2">' + driInf[i].detInf2 + '</li>'
                            + '<li class="detInf3">用途：<span class="effect">' + driInf[i].effect + '</span></li><li class="detInf4">目的地：<span class="destination">' + driInf[i].destination + '</span></li>'
                            + '<li class="detInf5">用车时间：<span class="usedTime">' + driInf[i].usedTime + '</span></li>'
                            + '</ul></div>'
                       setHistory(driInf[i].position, color);
                    }
					$(".driInfs_wrap").html(driInfhtml);
					moveLR();
                    console.log(1,historyDate,specialDate);
					//$.each($(".detInf1 .driName"), function() {
					//	$(this).css("color",color);
					//});
					$(".loadingGif").toggle();
				}else if(data.state=="1"){
					alert("请重新登录");
					location.href="./login.html"
				}else{
					alert(data.state);
				}			
			},error:function(e1,e2,e3){
				console.log("请求失败")
			}
		})
	}
	
//	var infColor=function(){
//		function randomColor(){
//			return "rgb("+parseInt(Math.random()*256)+","+parseInt(Math.random()*256)+","+parseInt(Math.random()*256)+")";
////			return "rgb("+a+","+b+","+c+")";	
//		}
//		$.each($(".detInf1 .driName"), function() {
//			$(this).css("color",randomColor());
//		});
//	}
//  infColor();
})

var randomColor = function() {
    return "rgb(" + parseInt(Math.random() * 256) + "," + parseInt(Math.random() * 256) + "," + parseInt(Math.random() * 256) + ")";
}