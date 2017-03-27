var myScroll,
	pullUpEl, pullUpOffset,
	generatedCount = 0;

var storage = window.localStorage;
var session = window.sessionStorage;
var _tl = getTLInstance();
var carId = storage.getItem('carId');
var carAlertParam = JSON.parse(storage.getItem('carAlertParam'));

mui.plusReady(function() {})

$(function() {
	if(mui.os.ios&&mui.os.plus) {
		$('body').addClass('ios-body');
	}
	var readData2 = session.getItem('readData');
	var notReadUrl = _tl.api + 'alerm/alermDetail?carId=' + carId + '&alermType=' + carAlertParam.alermType;
	$('.x-title-bar').html(carAlertParam.alermName);

	$.when(
		getNotRead(_tl, notReadUrl), pullUpAction()
	).done(
		addItemEvent()
	)

})

function addItemEvent() {
	$('.not-read').on('click', function() {
		if(!$(this).hasClass('tap-checked')) {
			$('.has-read').removeClass('tap-checked');
			$(this).addClass('tap-checked');

			if($('.car-alert-not-read-list').html()) {
				$('.error-tip').addClass('hide');
			} else {
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

			if($('.car-alert-read-list').html()) {
				$('.error-tip').addClass('hide');
			} else {
				$('.error-tip').removeClass('hide');
			}

			$('.car-alert-read-list').removeClass('hide');
			$('.car-alert-not-read-list').addClass('hide');
		}
	})

}

function loaded() {
	pullUpEl = document.getElementById('pullUp');
	pullUpOffset = pullUpEl.offsetHeight;

	myScroll = new iScroll('wrapper', {
		scrollbarClass: 'myScrollbar',
		useTransition: false,
		hScroll: false,
		hScrollbar: false,
		onRefresh: function() {
			if(pullUpEl.className.match('loading')) {
				pullUpEl.className = '';
				if(isLoadAll) {
					pullUpEl.querySelector('.pullUpLabel').innerHTML = '已加载全部数据';
				} else {
					pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
				}
			}
		},
		onScrollMove: function() {
			if(this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
				pullUpEl.className = 'flip';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '松手开始更新...';
				this.maxScrollY = this.maxScrollY;
			} else if(this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
				this.maxScrollY = pullUpOffset;
			}
		},
		onScrollEnd: function() {
			if(!isLoadAll) {
				pullUpEl.className = 'loading';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
				pullUpAction(); // ajax call
			} else {
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '已加载全部数据';
			}
		}
	});

	setTimeout(function() {
		document.getElementById('wrapper').style.left = '0';
	}, 800);
}

var pageIndex = 0,
	isLoadAll = false;
/**
 * 滚动翻页 （自定义实现此方法）
 * myScroll.refresh();      // 数据加载完成后，调用界面更新方法
 */
function pullUpAction() {
	setTimeout(function() { // <-- Simulate network congestion, remove setTimeout from production!
		var readUrl = _tl.api + 'alerm/alermHistory?carId=' + carId + '&alermType=' + carAlertParam.alermType + '&page=' + pageIndex + '&size=10';
		$.getJSON(readUrl, function(data) {
			var content = data.content;
			if(data.content.length == 0) {
				isLoadAll = true;
				myScroll.refresh();
			} else {
				var alertReadModel = '<li> <div class="car-alert-detail">' + $('.car-alert-read-detail-model').html() + '</div></li>';
				for(var i = 0; i < content.length; i++) {
					readData[content[i].serial] = content[i];
					$('.car-alert-read-list #thelist').append(alertReadModel);
					//赋值
					$('.car-alert-read-list .car-alert-detail:last .alert-serial').val(content[i].serial);
					$('.car-alert-read-list .car-alert-detail:last .alert-desc').html('检测到您的爱车' + content[i].alermName);
					$('.car-alert-read-list .car-alert-detail:last .alert-date').html(_tl.getYMD(content[i].alermTime) + ' ' + _tl.getHMS(content[i].alermTime));
				}
				$('.car-alert-detail').on('click', function() {
						var alertSerial = $(this).find('.alert-serial').val();
						var params = readData[alertSerial];
						storage.setItem('alertDetail', JSON.stringify(params));
						//history.pushState({ readData: readData }, 'carAlertRead', "?goDetail=1");
						session.setItem('readData', JSON.stringify(readData));
						_tl.toUrl("carAlertDetail.html");
					})
					//				mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
				pageIndex++;
				myScroll.refresh();
			}
		})
	}, 1000);
}

//初始化绑定iScroll控件
document.addEventListener('touchmove', function(e) {
	e.preventDefault();
}, false);
document.addEventListener('DOMContentLoaded', loaded, false);

var notReadData = {},
	readData = {}

function getNotRead(_tl, apiUrl) {
	//	var dataUrl = require.toUrl('../../data/obd/carAlertNotRead.json');
	$.getJSON(apiUrl, function(data) {
		$('.car-alert-not-read-list').html('');
		if(data.length == 0) {
			$('.error-tip').removeClass('hide');
		} else {
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
			storage.setItem('alertDetail', JSON.stringify(params));
			_tl.toUrl("carAlertDetail.html");
		})
	})
}