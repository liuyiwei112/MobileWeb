var storage = window.localStorage;
var _tl = getTLInstance();

$(function() {
	loadData();
})

function loadData(){
		var dataUrl = '../../data/obd/tripDetail03.json';
		$.getJSON(dataUrl, function(data) {
			//头部汇总数据
			//$('.driver-oil-score-point').html(data.mpgscore);
			$('.driver-data-text11').html(data.totalOil);
			$('.driver-data-text12').html(data.driverTime);
			$('.driver-data-text13').html(data.driverMile);
			$('.driver-data-text14').html(data.co2Emission);
			$('.driver-data-text15').html(data.averageCO2Emission);
		});
	}