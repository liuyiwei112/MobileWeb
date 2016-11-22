var storage = window.localStorage;
var _tl = getTLInstance();
var userInfo = JSON.parse(storage.getItem('userInfo'));
var carId;

//APP 升级检查
//检查当前版本号
var wgtVer = null;

mui.plusReady(function() {
	plus.navigator.setStatusBarBackground("fc3434");
	plus.screen.lockOrientation("portrait-primary");
	plus.navigator.setStatusBarStyle("UIStatusBarStyleBlackTranslucent");
	//关闭登陆界面
	var view = plus.webview.all();
	//进入首页后关闭登陆页
	setTimeout(function() {
		if(view.length > 1) {
			plus.webview.close(view[0]);
		}
	}, 1000)

	if(mui.os.android) {
		var first = null;
		mui.back = function() {
			//首次按键，提示‘再按一次退出应用’
			if(!first) {
				first = new Date().getTime();
				mui.toast('再按一次退出应用');
				setTimeout(function() {
					first = null;
				}, 2000);
			} else {
				if(new Date().getTime() - first < 2000) {
					plus.runtime.quit();
				}
			}
		}
	}

})

$(function() {
	if(mui.os.ios&&mui.os.plus) {
		$('body').addClass('ios-body');
	}
	//	alert(navigator.userAgent);
	//	加载头部内容区域　　
	//	var dataUrl = './data/obd/defaultCar.json';
	var dataUrl = _tl.api + 'getUserDefaultCar?userId=' + userInfo.userId;
	//	alert(dataUrl);
	$.getJSON(dataUrl, function(resp) {
		if(mui.os.plus) {
			//检查更新
			checkUpdate(resp.version, resp.appUrl);
		}

		storage.setItem('defaultCar', JSON.stringify(resp));
		storage.setItem('carId', resp.carId);
		$('.car-no').html(resp.carNo);
		$('.car-type').html(resp.seriesName);
		$('.brand img').attr('src', resp.picUrl);

		loadCarMessage();
	});　　

	loadMenu();

	doOther();

})

window.addEventListener('refresh', function(e) {
	loadCarMessage();
})

function loadMenu() {
	//加载菜单
	var menuUrl = '../data/obd/menuList.json';
	$.getJSON(menuUrl, function(resp) {
		for(i = 0; i < resp.length; i++) {
			if(i % 6 == 0) {
				$('.swiper-wrapper').append('<div class="swiper-slide">');
			}
			if(i % 3 == 0) {
				$('.swiper-wrapper .swiper-slide:last').append('<div class="menu-line">');
			}
			$('.swiper-wrapper .menu-line:last').append('<div class="menu-item"><div class="menu-image"><img src="../images/obd/homeloading.png"/></div><div class="menu-text"></div></div>');
			if(i % 3 == 2) {
				$('.swiper-wrapper .swiper-slide:last').append('<div class="blank1">');
			}
			_tl.loadImg(resp[i].menuPic, $('.swiper-wrapper .menu-item:last').find('img'))
			$('.swiper-wrapper .menu-item:last').find('.menu-text').html(resp[i].menuName);
			$('.swiper-wrapper .menu-item:last').attr('page', resp[i].className);
			$('.swiper-wrapper .menu-item:last').attr('m_name', resp[i].menuName);

		}
		//检查最后一个menu菜单是否满3个,如不满则补充空格
		while($('.swiper-wrapper .menu-line:last').find('.menu-item').length < 3) {
			$('.swiper-wrapper .menu-line:last').append('<div class="menu-item none"></div>');
		}

		$('.swiper-wrapper .menu-item').on('click', function() {
			if(!$(this).hasClass('none')) {
				var menuName = $(this).attr('m_name');
				if(menuName == '震动告警') {
					var params = {
						alermType: '61433',
						alermName: '驻车震动告警'
					}
					storage.setItem("carAlertParam", JSON.stringify(params));
				} else if(menuName.indexOf('周边') > -1) {
					var params = {
						title: menuName,
					}
					storage.setItem("mapUrlParam", JSON.stringify(params));
				} else if(menuName.indexOf('专家咨询') > -1) {
					_tl.phone('400-400-4000');
					return;
				}
				_tl.toUrl($(this).attr('page'));
			}
		})

		var menu_swiper = new Swiper('.swiper-container', {
			pagination: '.swiper-pagination',
			paginationClickable: false
		});

	})

}

function loadCarMessage() {
	carId = storage.getItem('carId');
	var dataUrl2 = _tl.api + 'carMessage/' + carId;
	$.getJSON(dataUrl2, function(resp2) {
		storage.setItem('carMessage', JSON.stringify(resp2));

		//设置图标闪烁状态
		if(resp2.fault == 0) {
			setAnimation('fault-icon');
		}
		if(resp2.tempAnomaly == 0) {
			setAnimation('temp-icon');
		}
		if(resp2.idlingAnomaly == 0) {
			setAnimation('idling-icon');
		}
		if(resp2.alerm == 0) {
			setAnimation('all-alert-icon');
		}

		//设置图标点击事件
		$('.temp-icon,.idling-icon,.all-alert-icon').on('tap', function() {
			_tl.toUrl('obd/carAlert.html');
		})

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
}

function setAnimation(_class) {
	$("." + _class).fadeOut(500).fadeIn(500);
	setInterval(function() {
		$("." + _class).fadeOut(500).fadeIn(500);
	}, 1000);
}

//监听自定义事件
window.addEventListener('initParam', function(e) {
	doOther();
})

//回到首页后需处理的事项
function doOther() {
	//删除违章查询的缓存数据
	storage.removeItem('illegalTemp0');
	storage.removeItem('illegalTemp1');
	//删除地图的缓存数据
	storage.removeItem('mapUrlParam');
	//删除告警的缓存数据
	storage.removeItem('carAlertParam');
	//删除驾驶统计的缓存数据
	storage.removeItem('summaryTemp0');
	storage.removeItem('summaryTemp1');
	storage.removeItem('summaryTemp2');
}

//检查更新操作,根据服务器获取更新版本,安装成功后删除更新包

function checkUpdate(_version, _url) {
	setTimeout(function() {
		// 获取本地应用资源版本号
		plus.runtime.getProperty(plus.runtime.appid, function(inf) {
			wgtVer = inf.version;
			console.log("当前应用版本：" + wgtVer);
			//检查资源版本号是否升级
			var _localArr = wgtVer.split('.');
			var _local = parseInt(_localArr[0]+_localArr[1]+_localArr[2]);
			var _remoteArr = _version.split('.');
			var _remote = parseInt(_remoteArr[0]+_remoteArr[1]+_remoteArr[2]);
			if(_local < _remote) {
				plus.nativeUI.showWaiting("正在检查更新...");
				setTimeout(function() {
					downWgt(_url);
				}, 1000)
			}
		});
	}, 500)
}

// 下载wgt文件
//var wgtUrl="http://115.28.22.146:8090/ImageServer/APK_Version/woo-update-v1.1.wgt";
function downWgt(wgtUrl) {
	var options = {
		method: "GET",
		filename: "_doc/update/"
	};
	//	//检查文件是否已经下载
	//	var fileName = wgtUrl.substring(wgtUrl.lastIndexOf('/')+1,wgtUrl.length);
	//	console.log('fileName:'+fileName);

	var w = plus.nativeUI.showWaiting("开始下载...");
	var _d;

	dtask = plus.downloader.createDownload(wgtUrl, options, function(d, status) {
		if(status == 200) {
			w.setTitle('正在安装...');
			console.log("下载wgt成功：" + d.filename);
			installWgt(d.filename); // 安装wgt包
		} else {
			console.log("下载wgt失败！");
			plus.nativeUI.alert("更新失败,请检查网络！");
		}
	});
	dtask.start();
	dtask.addEventListener("statechanged", function(task, status) {
		switch(task.state) {
			case 1: // 开始
				w.setTitle("开始下载...");
				break;
			case 2: // 已连接到服务器
				w.setTitle("开始下载...");
				break;
			case 3:
				var a = task.downloadedSize / task.totalSize * 100;
				w.setTitle("已下载" + parseInt(a) + "%　　 ");
				break;
		}
	});

}

// 更新应用资源
function installWgt(path) {
	setTimeout(function() {
		plus.runtime.install(path, {}, function() {
			plus.nativeUI.closeWaiting();
			console.log("安装wgt文件成功！");
			//安装成功后删除安装包
			plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function(fs) {
				fs.root.getDirectory('update', {}, function(entry) {
					entry.removeRecursively(function() {
						console.log('remove update package success');
					}, function() {
						console.log('remove update package error');
					});
				})
			})
			plus.runtime.restart();
		}, function(e) {
			plus.nativeUI.closeWaiting();
			console.log("安装wgt文件失败[" + e.code + "]：" + e.message);
			plus.nativeUI.alert("安装wgt文件失败[" + e.code + "]：" + e.message);
		});
	}, 1500)
}