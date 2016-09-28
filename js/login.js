var storage = window.localStorage;
var _tl = getTLInstance();
var userInfo = JSON.parse(storage.getItem('userInfo'));

mui.plusReady(function() {
	plus.navigator.setStatusBarBackground("f6f7f9")
})

$(function() {

	//如果存储的有user信息
	if(userInfo) {
		$('#mobile').val(userInfo.mobile);
		doLogin(userInfo.mobile,userInfo.pwd);
	}

	$('#login_btn').on('click', function() {
		var mobj = $('#mobile'),
			pobj = $('#pwd')
		mobj.removeClass('input-error');
		pobj.removeClass('input-error');
		$('.tip-text').html('');
		var mobile = $.trim(mobj.val());
		var pwd = $.trim(pobj.val());

		if(!mobile) {
			mobj.addClass('input-error');
			$('.mobile-tip').html(mobile_null_tip);
		}
		if(!pwd) {
			pobj.addClass('input-error');
			$('.pwd-tip').html(pwd_null_tip);
			return;
		}
		doLogin(mobile,hex_md5(pwd));
	})

})

function doLogin(_mobile, _pwd) {
	_tl.show($('.pop-up'));
	setTimeout(function(){
		var dataUrl = _tl.api + 'customerUser/login?mobile=' + _mobile + '&password=' + _pwd;
		$.post(dataUrl, function(d) {
			if(d && d.retCode == 200) {
				d.pwd = _pwd;
				storage.setItem('userInfo', JSON.stringify(d));
				_tl.toUrl('index_test.html');
			} else {
				mui.alert('用户名或密码错误！');
				_tl.hide($('.pop-up'));
			}
		})
	},500)

}