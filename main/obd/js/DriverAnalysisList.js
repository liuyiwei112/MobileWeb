var storage = window.localStorage;
var _tl = getTLInstance();
var carId = storage.getItem('carId');
var selectDate, selectDateStr;

mui.plusReady(function() {

})

$(function() {
	if(mui.os.ios&&mui.os.plus) {
		$('body').addClass('ios-body');
	}
	selectDate = _tl.getNow(1);
	selectDateStr = _tl.getNow(0);
	loadData();

	//初始化时间控件
	var dtpicker = new mui.DtPicker({
		"type": "date"
	})

	$('.now-date').click(function() {
		dtpicker.show(function(e) {
			//		    console.log(e);
			selectDate = _tl.changeDateF1(e + '');
			selectDateStr = e + '';
			loadData();
		})
	})

	$('.btn-date-left').click(function() {
		var pre = _tl.getPreDay(selectDateStr, 1);
		var preStr = _tl.getPreDay(selectDateStr, 0);
		selectDate = pre;
		selectDateStr = preStr;
		loadData();
	})

	$('.btn-date-right').click(function() {
		var next = _tl.getNextDay(selectDateStr, 1);
		var nextStr = _tl.getNextDay(selectDateStr, 0);
		selectDate = next;
		selectDateStr = nextStr;
		loadData();
	})

	$('.button-daily-track').click(function() {
		var params = {
			'from': 1,
			'nowDate': selectDateStr
		}
		storage.setItem('driverTrackParam', JSON.stringify(params));
		_tl.toUrl('DriverAnalysisTabTrack.html');

	})

	doOther();

})

function loadData() {
	_tl.hide($('.error-tip'));
	_tl.hide($('.driver-list'));
	_tl.show($('.loading-tip'));
	$('.now-date').html(selectDateStr);
	getDailyTotal(selectDate);
	getDailyList(selectDate);
}

function getDailyTotal() {
	//		var dataUrl = '../../data/obd/dailyTotal.json';
	var dataUrl = _tl.api + 'dailyDrivingReport/' + carId + '?date=' + selectDate;
	$.get(dataUrl, function(data) {
		if(data) {
			$('.total-area-mile-text').html(data.driverMile);
			$('.total-area-speedup-text').html(data.sharpSpeedup);
			$('.total-area-time-text').html(data.driverTime);
			$('.total-area-speeddown-text').html(data.sharpSlow);
			$('.total-area-oil-text').html(data.totalOil);
			$('.total-area-turn-text').html(data.sharpChange);
		} else {
			$('.total-area-mile-text').html('0');
			$('.total-area-speedup-text').html('0');
			$('.total-area-time-text').html('0');
			$('.total-area-speeddown-text').html('0');
			$('.total-area-oil-text').html('0');
			$('.total-area-turn-text').html('0');
		}

	})

}

function getDailyList() {
	//		var dataUrl = '../../data/obd/dailyTripList.json';
	var dataUrl = _tl.api + 'drivingReports/' + carId + '?date=' + selectDate + '&page=0&size=10000'
	$.get(dataUrl, function(data) {
		$('.driver-list').html('');
		if(data.content.length == 0) {
			$('.error-tip').removeClass('hide');
		} else {
			$('.error-tip').addClass('hide');
		}
		var model = '<div class="driver-item">' + $('.driver-item-model').html() + '</div>';
		for(var i = 0; i < data.content.length; i++) {
			var trip = data.content[i];
			$('.driver-list').append(model);

			//赋值
			$('.driver-list .driver-item:last').find('.start-time').html(_tl.getHMS(trip.startTime));
			$('.driver-list .driver-item:last').find('.st-value').val(trip.startTime);
			$('.driver-list .driver-item:last').find('.start-address').html(trip.startPoint);
			$('.driver-list .driver-item:last').find('.driver-detail-time .detail-text').html(trip.driverTime);
			$('.driver-list .driver-item:last').find('.driver-detail-mile .detail-text').html(trip.driverMile);
			$('.driver-list .driver-item:last').find('.driver-detail-speed .detail-text').html(trip.averageSpeed);
			$('.driver-list .driver-item:last').find('.driver-detail-oil .detail-text').html(trip.totalOil);
			$('.driver-list .driver-item:last').find('.driver-detail-cost .detail-text').html(trip.totalCost);
			$('.driver-list .driver-item:last').find('.driver-detail-max-speed .detail-text').html(trip.maxVelocity);
			$('.driver-list .driver-item:last').find('.end-time').html(_tl.getHMS(trip.endTime));
			$('.driver-list .driver-item:last').find('.end-address').html(trip.endPoint);
		}

		$('.driver-item').click(function() {
			//var alertSerial = $(this).find('.alert-serial').val();

			storage.setItem('tripSerial', $(this).find('.st-value').val() + '-' + carId);
			//				justep.Shell.showPage(require.toUrl('./DriverAnalysisTabFrame.w'),params);
			_tl.toUrl('DriverAnalysisTabFrame.html');
		})
		_tl.show($('.driver-list'));
		_tl.hide($('.loading-tip'));

	})
}

window.addEventListener('initParam', function(e) {
		doOther();
	})
	//回到驾驶分析列表后需处理的事项
function doOther() {
	//删除单次行程的缓存数据
	storage.removeItem('driverDetailCenter');
	storage.removeItem('driverDetailPointList');
	storage.removeItem('driverPointList');
	storage.removeItem('driverSpecialPointList');
	storage.removeItem('driverTrackParam');
	storage.removeItem('tripSerial');
}