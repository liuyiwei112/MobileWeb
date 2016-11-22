var storage = window.localStorage;
var _tl = getTLInstance();
var carId = storage.getItem('carId');

$(function() {
	if(mui.os.ios&&mui.os.plus) {
		$('body').addClass('ios-body');
	}
	queryIllegal(0);

})

mui.plusReady(function() {
	mui.init({
		beforeback: function() {
			var wobj = plus.webview.getWebviewById("index");
			mui.fire(wobj, 'initParam');
			return true;
		}
	})
})

function queryIllegal(_handler) {
	$('.tap-checked').removeClass('tap-checked');
	$('.tap-not-checked:eq(' + _handler + ')').addClass('tap-checked');
	$('.illegal-panel').html('');
	_tl.hide($('.error-tip'));
	_tl.show($('.loading-tip'));
	var dataUrl = _tl.api + 'breakRules/' + carId + '?handled=' + _handler + '&page=0&size=10000';
	setTimeout(function() {
		var temp = JSON.parse(storage.getItem('illegalTemp' + _handler));
		if(temp) {
			setIllegal(temp);
		} else {
			$.get(dataUrl, function(d) {
				storage.setItem('illegalTemp' + _handler, JSON.stringify(d));
				setIllegal(d);
			})
		}
	}, 500)

}

function setIllegal(d) {
	_tl.hide($('.loading-tip'));
	if(d.retCode == 200) {
		if(d.page.numberOfElements == 0) {
			$('.error-tip-text').html('您的爱车没有违章');
			_tl.show($('.error-tip'));
		} else {
			var model = '<div class="illegal-content">' + $('.illegal-content-model').html() + '</div>';
			var arr = d.page.content;
			for(var i = 0; i < arr.length; i++) {
				$('.illegal-panel').append(model);

				$('.illegal-content:last .car-no').html(arr[i].carNo);
				$('.illegal-content:last .illegal-date').html(arr[i].date);
				$('.illegal-content:last .illegal-address label').html(arr[i].address);
				$('.illegal-content:last .illegal-action label').html(arr[i].details);
				$('.illegal-content:last .score label').html(arr[i].score);
				$('.illegal-content:last .money label').html(arr[i].money);
			}
		}
	} else {
		$('.error-tip-text').html('Sorry,违章查询失败');
		_tl.show($('.error-tip'));
	}
}