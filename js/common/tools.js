//定义需要引入的JS 模块
require.config({　　　　
	baseUrl: "js",
	paths: {　　　　　
		"jquery":"common/jquery",
		"flexible":"common/flexible/flexible",
		"circle":"common/circle-progress"
	},
	shim:{
		jquery: {
            exports: 'jquery'
        },
		circle: {
            deps: ['jquery']
        }
	}　　
});


define(['jquery', 'flexible','circle'],function ($,_flex,_circle){
　　　　return {
　　　　　　	$: $,


			//地图类工具
			//由于json的经纬度序列反了，因此需要切换
			changeLatLng:function(pointList){
				var newPointList = [];
				for(var i=0;i<pointList.length;i++){
					var pointArray = [pointList[i][1],pointList[i][0]];
					newPointList.push(pointArray);
				}
				return newPointList;
			},	
			calcenter:function(pointList){
				var minLat,maxLat,minLng,maxLng;
				for(var i=0;i<pointList.length;i++){
					var lng = parseFloat(pointList[i][0]);
					var lat = parseFloat(pointList[i][1]);
					if(!minLat){
						minLng = lng;
						maxLng = lng;
						minLat = lat;
						maxLat = lat;
					}else{
						if(lng>maxLng){
							maxLng = lng;
						}
						if(lng<minLng){
							minLng = lng;
						}
						if(lat>maxLat){
							maxLat = lat;
						}
						if(lat<minLat){
							minLat = lat;
						}
					}
				}
				return [(minLng+maxLng)/2,(minLat+maxLat)/2];
			},
			//circle公用方法
			initCircle : function(c_id,size,value,maxValue,fillColor,thickness){
				var circleValue = value/maxValue;
				$('.'+c_id).circleProgress({
			        value: circleValue,
			        size: size,
			        fill: fillColor,
			        startAngle:4.7,
			        thickness:thickness
			    });
			},
　　　　};
　　});