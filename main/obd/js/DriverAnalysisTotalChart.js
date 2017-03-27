var storage = window.localStorage;
var _tl = getTLInstance();
var carId = storage.getItem('carId');
var xAxis1 = [],
	yAxis1 = [], //总里程
	yAxis1Wrap = [],
	yAxis2 = [], //总时长
	yAxis2Wrap = [],
	yAxis3 = [], //总油耗
	yAxis3Wrap = [],
	yAxis4 = [], //急加速
	yAxis5 = [], //急减速
	yAxis6 = [], //急转弯
	yAxis6Wrap = [];

$(function() {
	if(mui.os.ios && mui.os.plus) {
		$('body').addClass('ios-body');
	}
	querySummary(0);
})

function querySummary(_index, startDate, endDate) {
	_tl.showLoading();
	$('.tap-checked').removeClass('tap-checked');
	if(_index == 3) {
		$('.tap-not-checked:eq(' + (_index - 1) + ')').addClass('tap-checked');
	} else {
		$('.tap-not-checked:eq(' + _index + ')').addClass('tap-checked');
	}
	$('.summary-panel').html('');

	if(_index == 0 || _index == 1 || _index == 2) {
		if(_index == 0 || _index == 1) {
			_tl.hide($('.order-date'));
			_tl.show($('.loading-tip-full'));
		} else {
			_tl.show($('.loading-tip'));
		}
		_tl.hide($('.error-tip'));

		var dataUrl = _tl.api + 'listTripStatisticByMonth?carId=' + carId;
		if(_index == 1) {
			dataUrl = _tl.api + 'listTripStatisticByWeek?carId=' + carId;
		} else if(_index == 2) {
			dataUrl = _tl.api + 'listTripStatisticByDay?carId=' + carId + '&startTime=' + startDate + '&endTime=' + endDate;
		}
		xAxis1.clear();
		yAxis1.clear();
		yAxis1Wrap.clear();
		yAxis2.clear();
		yAxis2Wrap.clear();
		yAxis3.clear();
		yAxis3Wrap.clear();
		yAxis4.clear();
		yAxis5.clear();
		yAxis6.clear();
		yAxis6Wrap.clear();
		$.get(dataUrl, function(d) {
			_tl.hideLoading();
			for(var i = 0; i < d.length; i++) {
				if(_index == 0) {
					xAxis1.push(d[i].tripDate.substr(2, 5));
				} else {
					xAxis1.push(d[i].tripDate);
				}
				yAxis1.push(parseFloat(d[i].totleMile));
				yAxis2.push(parseFloat(d[i].totleTime));
				yAxis3.push(parseFloat(d[i].totalOil));
				yAxis4.push(d[i].totleSharpSpeedup);
				yAxis5.push(d[i].sharpSlow);
				yAxis6.push(d[i].sharpTurn);
			}
			yAxis1Wrap.push(yAxis1);
			yAxis2Wrap.push(yAxis2);
			yAxis3Wrap.push(yAxis3);
			yAxis6Wrap.push(yAxis4);
			yAxis6Wrap.push(yAxis5);
			yAxis6Wrap.push(yAxis6);
			setChart(xAxis1, yAxis1Wrap, ['#fc3434'], 'mileChart');
			setChart(xAxis1, yAxis2Wrap, ['darkorange'], 'timeChart');
			setChart(xAxis1, yAxis3Wrap, ['#228B22'], 'oilChart');
			setChart(xAxis1, yAxis6Wrap, ['#fc3434', 'darkorange', '#228B22'], 'sharpChart', ['急加速', '急减速', '急转弯']);
		})
	} else {
		_tl.show($('.order-date'));
	}

}

function setChart(_x, _y, _color, _id, _legend) {
	var mm = ['auto', 'autp'];
	mm = getMinMax(_y);
	var chartOption = {
		color:_color,
		grid: {
			x: 40,
			x2: 10,
			y: 20,
			y2: 25
		},
		toolbox: {
			feature: {}
		},
		calculable: false,
		xAxis: [{
			data: _x
		}],
		yAxis: [{
			type: 'value',
			min: mm[0],
			max: mm[1]
		}]
	};
	var _option = $.extend(true, chartOption, getSerial(_y, _legend, _color));
	if(_legend) {
		_option.legend = {
			data: _legend
		}
		_option.grid.y = 40;
		_option = {};
		_option = $.extend(true, chartOption, getBarSerial(_y, _legend, _color));
	}
	var e = echarts.getInstanceByDom(document.getElementById(_id));
	if(e) {
		e.dispose();
	}
	var lineChart = echarts.init(document.getElementById(_id));
	lineChart.setOption(_option);
}
//循环多指标
function getSerial(_data, _legend) {
	var _opt = {}
	_opt.series = [];
	for(var m = 0; m < _data.length; m++) {
		_opt.series.push({
			name: _legend == undefined ? '' : _legend[m],
			type: 'line',
			data: _data[m],
			label: {
				normal: {
					show: true
				}
			},
			lineStyle: {
				normal: {
					width: 3
				}
			},
			itemStyle: {
				normal: {
					borderWidth: 7
				}
			}
		});
	}
	return _opt;
}

function getBarSerial(_data, _legend, _color) {
	var _opt = {}
	_opt.series = [];
	for(var m = 0; m < _data.length; m++) {
		_opt.series.push({
			name: _legend == undefined ? '' : _legend[m],
			type: 'bar',
			data: _data[m],
			label: {
				normal: {
					show: true,
					position:'top'
				}
			}
		});
	}
	return _opt;
}

function getMinMax(_arr) {
	var _b = [];
	for(var q = 0; q < _arr.length; q++) {
		for(var j = 0; j < _arr[q].length; j++) {
			_b.push(_arr[q][j]);
		}
	}
	_b.sort(function(x, y) {
		if(x > y) {
			return 1;
		}
		return -1;
	})
	return [parseInt(_b[0] * 0.8), parseInt(_b[_b.length - 1] * 1.2)];
}