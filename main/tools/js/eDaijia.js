var storage = window.localStorage;
var _tl = getTLInstance();
var _top = 1.36 * parseInt($('html').css('font-size'));
var userInfo = JSON.parse(storage.getItem('userInfo'));

$(function() {
	if(mui.os.ios&&mui.os.plus){
		$('body').addClass('ios-body');
		_top = 1.8 * parseInt($('html').css('font-size'));
	}
	mui.init({
		statusBarBackground: '#fc3434',
		subpages: [{
			url: 'http://h5.edaijia.cn/newapp/index.html?os=ios&lng=116.478534&lat=40.018756&from=01050042&phone=' + userInfo.mobile,
			id: 'daijia',
			styles: {
				top: _top+'px', //mui标题栏默认高度为45px；
				bottom: '0px' //默认为0px，可不定义；
			}
		}]
	});
})