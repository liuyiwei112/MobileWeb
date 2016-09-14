//定义需要引入的JS 模块
require.config({　　　
	baseUrl: "../../js",
	paths: {　　　　　
		"jquery": "common/jquery",
		"flexible": "common/flexible/flexible",
		"tools": "common/tools"
	}　　
});

require(['jquery', 'flexible', 'tools'], function($, _fl, _tl) {
	require([_tl.mapUrl], function(_amap) {
		if (window.AMap && window.AMap.Map) {
				var	mapObj = new AMap.Map('alert_map', {
					zoom : 14,
					center : [ '118.7212075967','32.0332437435' ],
					dragEnable : true
				});

				var marker = new AMap.Marker({
					map : mapObj,
					position : [ '118.7212075967', '32.0332437435' ],
					icon :  new AMap.Icon({
						image : '../../images/obd/obd_safe_icon4.png',
						size : new AMap.Size(45,62)
					})  
				});
					
				var infoWindow = new AMap.InfoWindow({});
				
				marker.content='<div class="info-content">'+$('.info-content').html()+'</div>';
				infoWindow.setContent(marker.content);
				infoWindow.open(mapObj, marker.getPosition());
				setTimeout(function(){
					
					
					mapObj.setCenter(['118.7212075967', '32.0332437435']);
					
					//赋值
					$('.info-content .text-date').html(_tl.getYMD(params.alermTime)+' '+_tl.getHMS(params.alermTime));
					$('.info-content .text-address').html(params.alermAddress);
				},500)
			}
		
		
	})
	
	
})