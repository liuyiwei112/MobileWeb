var storage = window.localStorage;
var _tl = getTLInstance();
var alertDetail = JSON.parse(storage.getItem('alertDetail')) ;
var carAlertParam = JSON.parse(storage.getItem('carAlertParam')) ;
var defaultCar = JSON.parse(storage.getItem('defaultCar')) ;

$(function() {

	//初始化告警详细窗体及标题
	$('.x-title-bar').html(carAlertParam.alermName);
	$('.text-car-no').html(defaultCar.carNo);
	$('.text-date').html(_tl.getYMD(alertDetail.alermTime) + ' ' + _tl.getHMS(alertDetail.alermTime))
	$('.text-address').html(alertDetail.alermAddress);
	
	//动态加载地图
	var oHead = document.getElementsByTagName('HEAD').item(0);
	var oScript = document.createElement("script");
	oScript.type = "text/javascript";
	oScript.src = _tl.mapUrl;
	oHead.appendChild(oScript);
	oScript.onload = function() {
		if(window.AMap && window.AMap.Map) {
			var mapObj = new AMap.Map('alert_map', {
				zoom: 16,
				center: ['118.7212075967', '32.0332437435'],
				dragEnable: true,
				resizeEnable: true
			});
			
			mapObj.plugin(['AMap.ToolBar'],function(){
				//设置地位标记为自定义标记
				var toolBar = new AMap.ToolBar(); 
				mapObj.addControl(toolBar);		
			});	

			var marker = new AMap.Marker({
				map: mapObj,
				position: [alertDetail.longitude, alertDetail.latitude],
				icon: new AMap.Icon({
					image: '../../images/obd/obd_safe_icon4.png',
					size: new AMap.Size(45, 62)
				})
			});

			var infoWindow = new AMap.InfoWindow({});

			marker.content = '<div class="info-content">' + $('.info-content').html() + '</div>';
			infoWindow.setContent(marker.content);
			infoWindow.open(mapObj, marker.getPosition());
//			setTimeout(function() {
//				mapObj.setCenter(['118.7212075967', '32.0332437435']);
//			}, 500)
			
//			mapObj.setFitView(); 

		}

	}

})