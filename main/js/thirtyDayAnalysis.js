var storage = window.localStorage;
var _tl = getTLInstance();
var carId = storage.getItem('carId');
var xAxis1 = [],
	yAxis1 = [],
	yAxis2 = [],
	yAxis3 = [];

$(function() {
	if(mui.os.ios && mui.os.plus) {
		$('body').addClass('ios-body');
	}
	loadData();

})

function loadData() {

//	_tl.showCarLoading();

	var dataUrl = _tl.api + 'get30DayDataAnalysis?carId=' + carId;
	$.get(dataUrl,function(d) {
		for(var i = 0; i < d.length; i++) {
			var ymd = _tl.getYMD(d[i].tripDate);
			xAxis1.push(ymd.substring(5,ymd.length));
			yAxis1.push(d[i].avgSpeed);
			yAxis2.push(d[i].avgTime);
			yAxis3.push(d[i].avgOil);
		}
		setChart(xAxis1,yAxis3, '#fc3434', 'oilChart');
		setChart(xAxis1,yAxis2, 'darkorange', 'timeChart');
		setChart(xAxis1,yAxis1, '#228B22', 'mileChart');
	})

}

function setChart(_x,_y,_color,_id) {
	var mm = getMinMax(_y);
	var chartOption = {
		grid: {
			x: 30,
			x2: 10,
			y: 20,
			y2: 25
		},
		toolbox: {
			feature: {}
		},
		calculable: false,
		xAxis: [{
			data: _x,
			axisLabel: {
				textStyle: {
					color: '#969696'
				}
			}
		}],
		yAxis: [{
			type: 'value',
			splitArea: {
				show: true
			},
			axisLabel: {
				textStyle: {
					color: '#969696'
				}
			},
			min:mm[0],
			max:mm[1]
		}],
		series: [{
			type: 'line',
			data: _y,
			label: {
				normal: {
					show: true,
					textStyle:{
						color:_color
					}
				}
			},
			lineStyle: {
				normal: {
					color: _color,
					width:3
				}
			},
			itemStyle:{
				normal:{
					borderColor:_color,
					borderWidth:7
				}
			}
		}]
	};
	var lineChart = echarts.init(document.getElementById(_id));
	lineChart.setOption(chartOption);
}

function getMinMax(_arr){
	var _b = _arr.clone();
	_b.sort(function(x, y) {
		if(x > y) {
			return 1;
		}
		return -1;
	})
	return [parseInt(_b[0]*0.8),parseInt(_b[_b.length-1]*1.2)];
}
