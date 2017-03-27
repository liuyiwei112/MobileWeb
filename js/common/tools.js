//check Auth in Web
$(function() {
		var _url = window.location.href;
		var storage = window.localStorage;
		var _tl = getTLInstance();
		var userInfo = JSON.parse(storage.getItem('userInfo'));
		if(!userInfo) {
			if(_url.indexOf('login.html') == -1) {
				window.location.href = getRootPath() + '/main/login.html';
			}
		}
	})
	//定义需要引入的JS 模块
function getTLInstance() {
	return {
		mapUrl: 'http://webapi.amap.com/maps?v=1.3&key=1a7e2aec7f2a1b21b38ee9c88d652adb',
		api: 'http://115.28.22.146:9090/ytcrm/rest/',
		//		api: '/ytcrm/rest/',
		//		api: 'http://192.168.1.115:8080/ytcrm/rest/',
		show: function(obj) {
			obj.removeClass('hide');
		},
		hide: function(obj) {
			obj.addClass('hide');
		},
		showLoading: function() {
			$('body').append('<div class="pop-up pop-up-loading"><div class="pop-up-panel pop-up-panel-img"></div><div class="pop-up-mask"></div></div>');
		},
		hideLoading: function() {
			$('body').find('.pop-up-loading').remove();
		},
		showCarLoading:function(){
			$('body').append('<div class="loading-tip"><span class="loading-tip-text">正在加载中...</span></div>');
		},
		hideCarLoading:function(){
			$('body').find('.loading-tip').remove();
		},
		//从底部弹出选择框，比如拍照等
		//传入数组({value:'1',text:'test'})及回调方法，回调传入点击的对象
		showSelect:function(_d,_fn){
			$('body').append('<div class="pop-up hide pop-up-select"><div class="pop-up-panel"><div class="item-select-panel"></div><div class="item-cancel"><div class="button">取消</div></div></div><div class="pop-up-mask"></div></div>');
			for(var i=0;i<_d.length;i++){
				$('.pop-up-select').find('.item-select-panel').append('<div class="button" data="'+i+'">'+_d[i].text+'</div>')
			}
			$('.pop-up-select').fadeIn(200);
			//绑定事件
			$('.pop-up-select').find('.item-select-panel .button').on('tap',function(){
				var data = $(this).attr('data');
				fn(_d[data]);
			})
			$('.pop-up-select').find('.item-cancel').on('tap',function(){
				$('.pop-up-select').fadeOut(200);
			})
		},
		setTrans: function(_obj, position) {
			var style = _obj.style;
			style.webkitTransform = 'translate3d(' + position + '%,0,0)';
			style.webkitTransitionDuration = '0ms';
		},
		//		地图类工具
		//经纬度 高德（火星坐标系） 转 百度（BD－09） ； return [lat,lng]
		bd_decrypt: function(gd_lat, gd_lng) {
			var x = gd_lat,
				y = gd_lng;
			var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * Math.PI);
			var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * Math.PI);
			var a = [z * Math.cos(theta) + 0.0065, z * Math.sin(theta) + 0.006]
			return a;
		},
		//由于json的经纬度序列反了，因此需要切换
		changeLatLng: function(pointList) {
			var newPointList = [];
			for(var i = 0; i < pointList.length; i++) {
				var pointArray = [pointList[i][1], pointList[i][0]];
				newPointList.push(pointArray);
			}
			return newPointList;
		},
		toKm: function(_d) {
			if(_d < 1000) {
				return _d + ' m';
			} else {
				return(_d / 1000).toFixed(2) + ' km';
			}
		},
		//circle公用方法
		initCircle: function(c_id, size, value, maxValue, fillColor, thickness) {
			var circleValue = value / maxValue;
			$('.' + c_id).circleProgress({
				value: circleValue,
				size: size,
				fill: fillColor,
				startAngle: 4.7,
				thickness: thickness
			});
		},
		loadImg: function(src, imgObj) {
			var img = new Image();
			img.onload = function() {
				img.onload = null;
				imgObj.attr('src', src);
			}
			img.src = src;
		},
		loadBgImg: function(src, imgObj) {
			var img = new Image();
			img.onload = function() {
				img.onload = null;
				imgObj.css('backgroundImage', 'url(' + src + ')');
			}
			img.src = src;
		},
		//日期类公用方法
		//传参:Date对象;
		//type = 0 return 2016-01-01
		//type = 1 return 20160101
		//type = 2 return 2016-01-01 00:00:00
		//type = 3 return 20160101000000
		getDateStr: function(_dateObj, type) {
			var d = _dateObj
			if(!d) {
				d = new Date();
			}
			var year = d.getFullYear(),
				day = addZero(d.getDate());
			var month = addZero(d.getMonth() + 1);
			var hour = addZero(d.getHours()),
				minute = addZero(d.getMinutes()),
				second = addZero(d.getSeconds());
			if(type == 0) {
				return year + '-' + month + '-' + day;
			} else if(type == 1) {
				return year + '' + month + '' + day;
			} else if(type == 2) {
				return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
			} else if(type==3){
				return year + month + day + hour + minute + second;
			}
		},
		//传参方式2016-01-01
		toDateObj: function(_date) {
			var a = _date.split('-');
			return new Date(a[0], a[1] - 1, a[2]);
		},
		//YYYY-MM-DD to YYYYMMDD
		changeDateF1: function(_date) {
			var d = this.toDateObj(_date);
			return this.getDateStr(d, 1);
		},
//		type = 0 return 2016-01-01
//		type = 1 return 20160101
//		type = 2 return 2016-01-01 00:00:00
//		type = 3 return 20160101000000
		getNow: function(type) {
			return this.getDateStr(new Date(), type);
		},
		//传参方式2016-01-01
		getPreDay: function(_date, type) {
			var d = this.toDateObj(_date);
			var preDate = new Date(d.getTime() - 24 * 60 * 60 * 1000);
			return this.getDateStr(preDate, type);
		},
		getNextDay: function(_date, type) {
			var d = this.toDateObj(_date);
			var nextDate = new Date(d.getTime() + 24 * 60 * 60 * 1000);
			return this.getDateStr(nextDate, type);
		},
		//获取年
		getYear: function(dateStr) {
			return dateStr.substring(0, 4);
		},
		//获取月
		getMonth: function(dateStr) {
			return dateStr.substring(4, 6);
		},
		//获取日
		getDay: function(dateStr) {
			return dateStr.substring(6, 8);
		},
		//获取时
		getHH: function(dateStr) {
			return dateStr.substring(8, 10);
		},
		//获取分
		getMM: function(dateStr) {
			return dateStr.substring(10, 12);
		},
		//获取秒
		getSS: function(dateStr) {
			return dateStr.substring(12, 14);
		},
		//获取年-月-日
		getYMD: function(dateStr) {
			return this.getYear(dateStr) + '-' + this.getMonth(dateStr) + '-' + this.getDay(dateStr);
		},
		//获取时:分:秒
		getHMS: function(dateStr) {
			return this.getHH(dateStr) + ':' + this.getMM(dateStr) + ':' + this.getSS(dateStr);
		},
		toUrl: function(url) {
			var webview = mui.openWindow({
				url: url,
				id: url
			});
			console.log(webview.id + '@@'); //输出mui字符串
		},
		//图片旋转方法
		turnARImg: function(img, speed) {
			if(!speed) {
				speed = 1500;
			}
			rotateStop = false;
			var rotate = function() {
				img.animate({
					rotate: '360'
				}, speed, 'linear', function() {
					if(!rotateStop) {
						rotate();
					}
				});
			}
			rotate();
		},
		setRotateStop: function(flag) {
			rotateStop = flag;
		},
		phone: function(num) {
			var btnArray = ['否', '是'];
			mui.confirm('即将拨号:' + num + '，是否确认?', '', btnArray, function(e) {
				if(e.index == 1) {
					window.location.href = 'tel://' + num;
				}
			})
		}　　　　
	};　
}　　　

function addZero(_a) {
	if(_a < 10) {
		_a = '0' + _a;
	}
	return _a;
}

function getRootPath() {
	//获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
	var curWwwPath = window.document.location.href;
	//获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
	var pathName = window.document.location.pathname;
	var pos = curWwwPath.indexOf(pathName);
	//获取主机地址，如： http://localhost:8083
	var localhostPaht = curWwwPath.substring(0, pos);
	//获取带"/"的项目名，如：/uimcardprj
	var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
	return(localhostPaht + projectName);
}

//数组克隆,防止地址引用
Array.prototype.clone = function(){
	var _a = [];
	var _t = this;
	for(var i=0;i<_t.length;i++){
		_a.push(_t[i]);
	}
	return _a;
}
Array.prototype.clear = function(){
	this.length = 0;
}
