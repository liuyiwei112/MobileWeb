

$(function(){
	alert(navigator.userAgent);
	var storage = window.localStorage;
	var _tl = getTLInstance();
	//	加载头部内容区域　　
//	var dataUrl = './data/obd/defaultCar.json';
	var dataUrl = _tl.api+'getUserDefaultCar?userId=223';
//	alert(dataUrl);
	$.getJSON(dataUrl, function(resp) {
		storage.setItem('defaultCar', JSON.stringify(resp));
		storage.setItem('carId',resp.carId);
		$('.car-no').html(resp.carNo);
		$('.car-type').html(resp.seriesName);
		$('.brand img').attr('src', resp.picUrl);

//		var dataUrl2 = './data/obd/carMessage.json';
		var dataUrl2 = _tl.api+'carMessage/'+resp.carId;
		$.getJSON(dataUrl2, function(resp2) {
			storage.setItem('carMessage', JSON.stringify(resp2));

			//里程数据
			$('.now-mile-text').html(resp2.nowMile);
			$('.next-maintain-text').html(resp2.maintainMile);
			$('.next-date-text').html(resp2.nextDay);

			//平均油耗动画
			$('.avg-chart-oil span').html(resp2.avgOil);
			_tl.initCircle('avg-chart-oil', 140, resp2.avgOil == 0 ? resp2.avgOilMax : resp2.avgOil, resp2.avgOilMax, {
				gradient: ["#ee762b"]
			}, 8);
			//平均时长动画
			$('.avg-chart-time span').html(resp2.avgTime);
			_tl.initCircle('avg-chart-time', 140, resp2.avgTime == 0 ? resp2.avgTimeMax : resp2.avgTime, resp2.avgTimeMax, {
				gradient: ["#66b52e"]
			}, 8);
			//平均速度动画
			$('.avg-chart-speed span').html(resp2.avgSpeed);
			_tl.initCircle('avg-chart-speed', 140, resp2.avgSpeed == 0 ? resp2.avgSpeedMax : resp2.avgSpeed, resp2.avgSpeedMax, {
				gradient: ["#40b0a9"]
			}, 8);
			//车辆体检动画
			$('.avg_inspect strong').html(resp2.lastCheckScore);
			_tl.initCircle('avg_inspect', 100, resp2.lastCheckScore, 100, {
				gradient: ["#e4393c", "#ffa800", "#a2ff00", "#5ccc30"]
			}, 10);
		})
	});　　

	//加载菜单
	var menuUrl = './data/obd/menuList.json';
	$.getJSON(menuUrl, function(resp) {
		for(i = 0; i < resp.length; i++) {
			if(i % 6 == 0) {
				$('.swiper-wrapper').append('<div class="swiper-slide">');
			}
			if(i % 3 == 0) {
				$('.swiper-wrapper .swiper-slide:last').append('<div class="menu-line">');
			}
			$('.swiper-wrapper .menu-line:last').append('<div class="menu-item"><div class="menu-image"><img src="images/obd/homeloading.png"/></div><div class="menu-text"></div></div>');
			if(i%3==2){
				$('.swiper-wrapper .swiper-slide:last').append('<div class="blank1">');
			}
			_tl.loadImg(resp[i].menuPic, $('.swiper-wrapper .menu-item:last').find('img'))
			$('.swiper-wrapper .menu-item:last').find('.menu-text').html(resp[i].menuName);
			$('.swiper-wrapper .menu-item:last').attr('page', resp[i].className)

		}
		$('.swiper-wrapper .menu-item').on('click', function() {
//			//window.location.href = $(this).attr('page');
//			window.parent.toUrl($(this).attr('page'));
//			top.location.href  = $(this).attr('page') ;
			_tl.toUrl($(this).attr('page'));
		})

		var menu_swiper = new Swiper('.swiper-container', {
			pagination: '.swiper-pagination',
			paginationClickable: false
		});
		
	})
	
})
