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
	
	var storage = window.localStorage;
	var carId = storage.getItem('carId');
	var carAlertParam = JSON.parse(storage.getItem('carAlertParam')) ;
	var notReadUrl = _tl.api+'alerm/alermDetail?carId='+carId+'&alermType='+carAlertParam.alermType;
	var readUrl = _tl.api+'alerm/alermHistory?carId='+carId+'&alermType='+carAlertParam.alermType;
	$('.x-title-bar').html(carAlertParam.alermName);
	
	$.when(
		getNotRead(_tl,notReadUrl), getRead(_tl,readUrl)
	).done(
		addItemEvent()
	)

})

function addItemEvent() {
	$('.not-read').on('click', function() {
		if(!$(this).hasClass('tap-checked')) {
			$('.has-read').removeClass('tap-checked');
			$(this).addClass('tap-checked');
			
			if($('.car-alert-not-read-list').html()){
				$('.error-tip').addClass('hide');
			}else{
				$('.error-tip').removeClass('hide');
			}
			
			$('.car-alert-read-list').addClass('hide');
			$('.car-alert-not-read-list').removeClass('hide');
		}
	})
	$('.has-read').on('click', function() {
		if(!$(this).hasClass('tap-checked')) {
			$('.not-read').removeClass('tap-checked');
			$(this).addClass('tap-checked');
			
			if($('.car-alert-read-list').html()){
				$('.error-tip').addClass('hide');
			}else{
				$('.error-tip').removeClass('hide');
			}
			
			$('.car-alert-read-list').removeClass('hide');
			$('.car-alert-not-read-list').addClass('hide');
		}
	})

}

var notReadData = {},
	readData = {}

function getNotRead(_tl,apiUrl) {
//	var dataUrl = require.toUrl('../../data/obd/carAlertNotRead.json');
	$.getJSON(apiUrl, function(data) {
		$('.car-alert-not-read-list').html('');
		if(data.length==0){
			$('.error-tip').removeClass('hide');
		}else{
			$('.error-tip').addClass('hide');
		}
		var alertNotReadModel = '<div class="car-alert-detail">' + $('.car-alert-not-read-detail-model').html() + '</div>';
		for(var i = 0; i < data.length; i++) {
			notReadData[data[i].serial] = data[i];
			$('.car-alert-not-read-list').append(alertNotReadModel);
			//赋值
			$('.car-alert-not-read-list .car-alert-detail:last .alert-serial').val(data[i].serial);
			$('.car-alert-not-read-list .car-alert-detail:last .alert-desc').html('检测到您的爱车' + data[i].alermName);
			$('.car-alert-not-read-list .car-alert-detail:last .alert-date').html(_tl.getYMD(data[i].alermTime) + ' ' + _tl.getHMS(data[i].alermTime));
		}
		$('.car-alert-detail').on('click', function() {
			var alertSerial = $(this).find('.alert-serial').val();
			var params = notReadData[alertSerial];
			window.location.href="carAlertDetail.html";
		})
	})
}

function getRead(_tl,apiUrl) {
//	var dataUrl = require.toUrl('../../data/obd/carAlertRead.json');
	$.getJSON(apiUrl, function(data) {
		$('.car-alert-read-list').html('');
		var alertReadModel = '<div class="car-alert-detail">' + $('.car-alert-read-detail-model').html() + '</div>';
		var content = data.content;
		for(var i = 0; i < content.length; i++) {
			readData[content[i].serial] = content[i];
			$('.car-alert-read-list').append(alertReadModel);
			//赋值
			$('.car-alert-read-list .car-alert-detail:last .alert-serial').val(content[i].serial);
			$('.car-alert-read-list .car-alert-detail:last .alert-desc').html('检测到您的爱车' + content[i].alermName);
			$('.car-alert-read-list .car-alert-detail:last .alert-date').html(_tl.getYMD(content[i].alermTime) + ' ' + _tl.getHMS(content[i].alermTime));
		}

		$('.car-alert-detail').on('click', function() {
			var alertSerial = $(this).find('.alert-serial').val();
			var params = readData[alertSerial];
			window.location.href="carAlertDetail.html";
		})

	})
}