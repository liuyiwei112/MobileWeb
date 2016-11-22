var storage = window.localStorage;
var _tl = getTLInstance();
var userInfo = JSON.parse(storage.getItem('userInfo'));

mui.plusReady(function() {
	//关闭除登陆以外的界面
	var view = plus.webview.all();
	if(view.length && view.length > 1) {
		for(var i = 0; i < view.length; i++) {
			if(view[i].id.indexOf('login') == -1) {
				plus.webview.close(view[i]);
			}
		}
	}
	if(mui.os.android) {
		$('.x-panel-bottom').addClass('x-panel-bottom-android');
	}
})

$(function() {
	//如果存储的有user信息
	if(userInfo) {
		$('#mobile').val(userInfo.mobile);
		doLogin(userInfo.mobile, userInfo.pwd);
	}

	$('#login_btn').on('click', function() {
		var mobj = $('#mobile'),
			pobj = $('#pwd')
		mobj.removeClass('input-error');
		pobj.removeClass('input-error');
		$('.tip-text').html('');
		var mobile = $.trim(mobj.val());
		var pwd = $.trim(pobj.val());
		var flag = true;
		if(!mobile) {
			mobj.addClass('input-error').attr('placeholder', mobile_null_tip);
			flag = false;
		}
		if(!pwd) {
			pobj.addClass('input-error').attr('placeholder', pwd_null_tip);
			flag = false
		}
		if(flag) {
			doLogin(mobile, hex_md5(pwd));
		}
	})

})

function doLogin(_mobile, _pwd) {
	_tl.show($('.pop-up'));
	setTimeout(function() {
		var dataUrl = _tl.api + 'customerUser/login?mobile=' + _mobile + '&password=' + _pwd;
		$.post(dataUrl, function(d) {
			if(d && d.retCode == 200) {
				d.pwd = _pwd;
				storage.setItem('userInfo', JSON.stringify(d));

				mui.openWindow({
					url: 'index.html',
					id: 'index',
					waiting: {
						autoShow: false
					}
				});
			} else {
				mui.toast('用户名或密码错误！');
				_tl.hide($('.pop-up'));
			}
		})
	}, 500)

}