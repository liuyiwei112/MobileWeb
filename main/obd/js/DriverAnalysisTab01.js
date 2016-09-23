var storage = window.localStorage;
var _tl = getTLInstance();
var tripSerial = storage.getItem('tripSerial');

$(function() {
	loadData();
	$('#driver_map_container').on('tap',function(){
		var params = {
			'from':0
		}
		storage.setItem('driverTrackParam',JSON.stringify(params));
		_tl.toUrl('DriverAnalysisTabTrack.html')	;
	})
})

function loadData() {
//	var dataUrl = '../../data/obd/tripDetail01.json';
	var dataUrl = _tl.api+'detailsGeneralDrivingReport/'+tripSerial
	$.getJSON(dataUrl, function(data) {
		//头部汇总数据
		$('.driver-normal-score-point').html(data.safePoint);
		$('.sharp-turn-text').html(data.sharpTurn);
		$('.sharp-speedup-text').html(data.sharpSpeedup);
		$('.sharp-change-text').html(data.sharpChange);
		$('.sharp-speeddown-text').html(data.sharpSlow);
		$('.driver-overtime-text').html(data.fatigueTime);
		$('.driver-overspeed-text').html(data.overspeedTime);

		//地图

		loadGaodeMap(_tl.changeLatLng(data.pointList), data.pointDetailsList, data.specialPointList);

		//底部常规数据
		$('.driver-data-text1').html(data.driverTime);
		$('.driver-data-text2').html(data.driverMile);
		$('.driver-data-text3').html(data.averageSpeed);
		$('.driver-data-text4').html(data.totalOil);
		$('.driver-data-text5').html(data.averageOil);
		$('.driver-data-text6').html(data.totalCost);

	})

}

loadGaodeMap = function(pointList, detailPointList, specialPointList) {
	//动态加载地图
	var oHead = document.getElementsByTagName('HEAD').item(0);
	var oScript = document.createElement("script");
	oScript.type = "text/javascript";
	oScript.src = _tl.mapUrl;
	oHead.appendChild(oScript);
	oScript.onload = function() {
		console.log("amap loaded");
		if(window.AMap && window.AMap.Map) {
			//获取中心点
			var center = _tl.calcenter(pointList);

			//将数据存入本地缓存
			var storage = window.localStorage;
			storage['driverPointList'] = JSON.stringify(pointList);
			storage['driverDetailPointList'] = JSON.stringify(detailPointList);
			storage['driverDetailCenter'] = JSON.stringify(center);
			storage['driverSpecialPointList'] = JSON.stringify(specialPointList);

			var mapObj = new AMap.Map('driver_map_container', {
				dragEnable: true
			});

			//画行驶轨迹
			var polyline = new AMap.Polyline({
				path: pointList, //设置线覆盖物路径
				strokeColor: "#00FF00", //线颜色
				strokeOpacity: 1, //线透明度
				strokeWeight: 2, //线宽
				strokeStyle: "solid" //线样式
			});
			polyline.setMap(mapObj);

			//标记起始点
			var markerStart = new AMap.Marker({
				position: pointList[0],
				icon: new AMap.Icon({
					image: '../../images/obd/obd_hxz_health_sha_kai.png'
				})
			});
			markerStart.setMap(mapObj);
			var markerEnd = new AMap.Marker({
				position: pointList[pointList.length - 1],
				icon: new AMap.Icon({
					image: '../../images/obd/obd_hxz_health_sha_stop.png'
				})
			});
			markerEnd.setMap(mapObj);

			if(specialPointList){
				//标记特殊点
				for(var j = 0; j < specialPointList.length; j++) {
					var icon = {},
						spPoint = specialPointList[j];
					if(spPoint.sharpSlow == 1) {
						icon = new AMap.Icon({
							image: '../../images/obd/obd_hxz_health_sha.png'
						})
					} else if(spPoint.sharpSpeedup == 1) {
						icon = new AMap.Icon({
							image: '../../images/obd/obd_hxz_health_jia.png'
						})
					}
	
					var specialMarker = new AMap.Marker({
						position: [spPoint.trackLng, spPoint.trackLat],
						icon: icon
					});
					specialMarker.setMap(mapObj);
				}
			}
			mapObj.setFitView();
		}
	}
	oScript.onunload = function(){
		console.log("amap unload");
		alert(3);
	}
}