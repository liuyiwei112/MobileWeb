var storage = window.localStorage;
var _tl = getTLInstance();
var faultDetail = JSON.parse(storage.getItem('faultDetail'));

mui.plusReady(function() {})

$(function() {
	if(mui.os.ios&&mui.os.plus) {
		$('body').addClass('ios-body');
	}
	var faultCode = faultDetail.faultCode;
	var faultId = faultDetail.faultId;
	var address = faultDetail.faultAddress;
	var checkTime = faultDetail.checkTime;

	$('.text-date').html(_tl.getYMD(checkTime) + ' ' + _tl.getHMS(checkTime));
	$('.text-address').html(address);

	var dataUrl = _tl.api + 'terminals/check/getSysFaultsVO?dtcId=' + faultId + '&dtcCode=' + faultCode;

	$.get(dataUrl, function(d) {

		$('.fault-code').html(faultCode);
		$('.fault-desc').html(d.dtcDesc);
		$('.fault-express').html(d.goloDtcHelp.replace(/(\r\n)|(\n)/g, '<br/>'));
		$('.fault-reason').html(d.goloDtcAdvice.replace(/(\r\n)|(\n)/g, '<br/>'));

	})

	loadGaodeMap();

})

function loadGaodeMap() {
	var lng = faultDetail.longitude;
	var lat = faultDetail.latitude;
	//动态加载地图
	var oHead = document.getElementsByTagName('HEAD').item(0);
	var oScript = document.createElement("script");
	oScript.type = "text/javascript";
	oScript.src = _tl.mapUrl;
	oHead.appendChild(oScript);
	oScript.onload = function() {
		if(window.AMap && window.AMap.Map) {
			var mapObj = new AMap.Map('alert_map', {
				zoom: 14,
				center: [lng, lat],
				dragEnable: true,
				resizeEnable: true
			});

			mapObj.plugin(['AMap.ToolBar'], function() {
				//设置地位标记为自定义标记
				var toolBar = new AMap.ToolBar();
				mapObj.addControl(toolBar);
			});

			var marker = new AMap.Marker({
				map: mapObj,
				position: [lng, lat],
				icon: new AMap.Icon({
					image: '../../images/obd/obd_safe_icon4.png',
					size: new AMap.Size(45, 62)
				})
			});

			var infoWindow = new AMap.InfoWindow({});

			marker.content = '<div class="info-content-large">' + $('.info-content').html() + '</div>';
			infoWindow.setContent(marker.content);
			infoWindow.open(mapObj, marker.getPosition());

			_tl.hide($('.loading-tip'));
			//			_tl.show($('.x-panel-content'));

			//			mapObj.setFitView();

		} else {
			//解决加载了但无法创建地图问题
			setTimeout(function() {
				loadGaodeMap();
			}, 1000)
		}
	}
}