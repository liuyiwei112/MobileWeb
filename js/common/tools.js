//定义需要引入的JS 模块
function getTLInstance() {
	return {
		mapUrl: 'http://webapi.amap.com/maps?v=1.3&key=1a7e2aec7f2a1b21b38ee9c88d652adb',
		api: 'http://115.28.22.146:9090/ytcrm/rest/',
//		api: 'http://192.168.1.115:8080/ytcrm/rest/',
		show:function(obj){
			obj.removeClass('hide');
		},
		hide:function(obj){
			obj.addClass('hide');
		},
		setTrans:function(_obj,position){
			var style = _obj.style;
			style.webkitTransform = 'translate3d(' + position + '%,0,0)';
			style.webkitTransitionDuration = '0ms';
		},
//		地图类工具
		//经纬度 高德（火星坐标系） 转 百度（BD－09） ； return [lat,lng]
		bd_decrypt:function(gd_lat,gd_lng){
			var x = gd_lat,y = gd_lng;
			var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * Math.PI);
			var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * Math.PI);
			var a = [z * Math.cos(theta) + 0.0065,z * Math.sin(theta) + 0.006]
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
		calcenter: function(pointList) {
			var minLat, maxLat, minLng, maxLng;
			for(var i = 0; i < pointList.length; i++) {
				var lng = parseFloat(pointList[i][0]);
				var lat = parseFloat(pointList[i][1]);
				if(!minLat) {
					minLng = lng;
					maxLng = lng;
					minLat = lat;
					maxLat = lat;
				} else {
					if(lng > maxLng) {
						maxLng = lng;
					}
					if(lng < minLng) {
						minLng = lng;
					}
					if(lat > maxLat) {
						maxLat = lat;
					}
					if(lat < minLat) {
						minLat = lat;
					}
				}
			}
			return [(minLng + maxLng) / 2, (minLat + maxLat) / 2];
		},
		toKm:function(_d){
			if(_d<1000){
				return _d +' m';
			}else{
				return (_d/1000).toFixed(2) + ' km';
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
				imgObj.css('backgroundImage', 'url('+src+')');
			}
			img.src = src;
		},

		//日期类公用方法
		//传参:Date对象;
		//type = 0 return 2016-01-01
		//type = 1 return 20160101
		//type = 2 return 2016-01-01 00:00:00
		getDateStr:function(_dateObj,type){
			var d = _dateObj
			if(!d){
				d = new Date();
			}
			var year = d.getFullYear(),day = addZero(d.getDate());
			var month = addZero(d.getMonth()+1);
			var hour = addZero(d.getHours()),minute = addZero(d.getMinutes()),second = addZero(d.getSeconds());
			if(type==0){
				return year+'-'+month+'-'+day;
			}else if(type==1){
				return year+''+month+''+day;
			}else if(type==2){
				return year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;
			}
		},
		//YYYY-MM-DD to YYYYMMDD
		changeDateF1:function(_date){
			var d = this.toDateObj(_date);
			return this.getDateStr(d,1);
		},
		getNow:function(type){
			return this.getDateStr(new Date(),type);
		},
		//传参方式2016-01-01
		toDateObj:function(_date){
			var a = _date.split('-');
			return new Date(a[0],a[1]-1,a[2]);
		},
		//传参方式2016-01-01
		getPreDay:function(_date,type){
			var d = this.toDateObj(_date);
			var preDate = new Date(d.getTime() - 24*60*60*1000); 
			return this.getDateStr(preDate,type);
		},
		getNextDay:function(_date,type){
			var d = this.toDateObj(_date);
			var nextDate = new Date(d.getTime() + 24*60*60*1000); 
			return this.getDateStr(nextDate,type);
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
				id: url,
				show: {
					autoShow: true, //页面loaded事件发生后自动显示，默认为true
					aniShow: 'slide-in-right' //页面显示动画，默认为”slide-in-right“；
				}
			});
			console.log(webview.id + '@@'); //输出mui字符串
		},
		
		//图片旋转方法
		turnARImg:function(img,speed){
			if(!speed){
				speed = 1500;
			}
			rotateStop = false;
			var rotate = function(){
				img.animate({rotate: '360'}, speed, 'linear', function() {
					if(!rotateStop){
						rotate();
					}
				});
			}
			rotate();
		},
		setRotateStop:function(flag){
			rotateStop = flag;
		}　　　　
	};　
}　　　

function addZero(_a){
	if(_a<10){
		_a = '0'+_a;
	}
	return _a;
}


