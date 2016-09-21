var storage = window.localStorage;
var _tl = getTLInstance();

$(function() {
	loadData();
})

function loadData() {
	var dataUrl = '../../data/obd/tripDetail02.json';
	$.getJSON(dataUrl, function(data) {
		//头部汇总数据
		$('.driver-oil-score-point').html(data.mpgscore);
		$('.driver-data-text7').html(data.totalOil);
		$('.driver-data-text8').html(data.idleTime);
		$('.driver-data-text9').html(data.sharpSpeedup);
		$('.driver-data-text10').html(data.sharpSlow);
	});
}