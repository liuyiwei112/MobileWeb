var storage = window.localStorage;
var _tl = getTLInstance();
var insertedCar = JSON.parse(storage.getItem('insertedCar'));
var seriesId = insertedCar.seriesId,
	seriesName = insertedCar.seriesName,
	brandName = insertedCar.brandName,
	sweptVolume = insertedCar.sweptVolume,
	typeYear = insertedCar.typeYear,
	typeId = insertedCar.typeId,
	typeName = insertedCar.typeName;
var sweptVolumeStr = sweptVolume;
var _plus;

mui.plusReady(function() {
	_plus = plus;
})

$(function() {
	$('.car-serial').html(brandName + '—' + seriesName);
	if(sweptVolumeStr.indexOf('T') == -1) {
		sweptVolumeStr = sweptVolume + 'L';
	}
	$('.car-year').html(typeName);
	_tl.loadImg(insertedCar.brandImg, $('.brand-img').find('img'))

	$('.btn-save').on('tap', function() {
		var carNo = $.trim($('.input-carno').val());
		var currentMile = $.trim($('.input-mile').val());
		if(!carNo) {
			$('.input-carno').addClass('input-error');
		}
		if(!currentMile && currentMile != 0) {
			$('.input-mile').addClass('input-error');
			return;
		}
		var param = {
			carNo: carNo,
			carSeries: seriesId,
			sweptVolume: sweptVolume,
			currentMile: currentMile,
			carType: typeId
		}

		_tl.show($('.pop-up'));

		var dataUrl = _tl.api + 'huijia/carRegister';
		$.ajax({
			'url': dataUrl,
			'type': 'post',
			'dataType': 'json',
			'data': JSON.stringify(param),
			headers: {
				'Content-Type': 'application/json'
			},
			'success': function(d) {
				if(d.retCode == 200) {
					mui.alert('新增成功');
					if(_plus) {
						//关闭所有新增窗口
						plus.webview.close(plus.webview.getWebviewById('car/carAddTab01.html'));
						plus.webview.close(plus.webview.getWebviewById('carAddTab02.html'));
						plus.webview.close(plus.webview.getWebviewById('carAddTab03.html'));
						plus.webview.close(plus.webview.getWebviewById('carAddTab04.html'));
						plus.webview.close(plus.webview.getWebviewById('carAddTab05.html'));
						plus.webview.close(plus.webview.getWebviewById('carAddTab06.html'));
						plus.webview.getWebviewById("main/carList.html").reload();
					}else{
						window.location.href="../carList.html";
					}
				}
			}

		})
	})

})