
//定义需要引入的JS 模块
require.config({　　　
	baseUrl: "js",　
	paths: {　　　　　
		"tools":"common/tools"
	}　　
});


//定义需要引入的JS 模块
require(['tools'], function (_tl){
	var storage = window.localStorage;
　　var dataUrl='./data/obd/defaultCar.json';
	$.getJSON(dataUrl, function(resp) {
		storage.setItem('defaultCar', JSON.stringify(resp));
		$('.car_no_name').html(resp.carNo);
		$('.car_type_name').html(resp.seriesName);
		$('.car_brand_pic img').attr('src',resp.picUrl);
		
		var dataUrl2='./data/obd/carMessage.json';
		$.getJSON(dataUrl2, function(resp2) {
			storage.setItem('carMessage', JSON.stringify(resp2));
			
			//里程数据
			$('.car_mile').html(resp2.nowMile);
			$('.car_next_mile').html(resp2.maintainMile);
			$('.car_next_time').html(resp2.nextDay);
			
			//平均油耗动画
			$('.avg_oil label').html(resp2.avgOil);
			_tl.initCircle('avg_oil',75,resp2.avgOil==0?resp2.avgOilMax:resp2.avgOil,resp2.avgOilMax,{
	            gradient: ["#ee762b"]
	        },4);
			//平均时长动画
			$('.avg_time label').html(resp2.avgOil);
			_tl.initCircle('avg_time',75,resp2.avgTime==0?resp2.avgTimeMax:resp2.avgTime,resp2.avgTimeMax,{
	            gradient: ["#66b52e"]
	        },4);
			//平均速度动画
			$('.avg_speed label').html(resp2.avgOil);
			_tl.initCircle('avg_speed',75,resp2.avgSpeed==0?resp2.avgSpeedMax:resp2.avgSpeed,resp2.avgSpeedMax,{
	            gradient: ["#40b0a9"]
	        },4);
			//车辆体检动画
			$('.avg_inspect strong').html(resp2.lastCheckScore);
			_tl.initCircle('avg_inspect',100,resp2.lastCheckScore,100,{
	            gradient: ["#e4393c","#ffa800","#a2ff00","#5ccc30"]
	        },10);
		})		
	});　　
});

