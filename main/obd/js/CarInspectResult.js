var storage = window.localStorage;
var _tl = getTLInstance();
var inspectResult = JSON.parse(storage.getItem('inspectResult'));

mui.plusReady(function() {
	mui.init({
		beforeback: function() {
			var wobj = plus.webview.getWebviewById("index");
//			wobj.reload(true);
			mui.fire(wobj, 'refresh');  
			return true;
		}
	})
})

$(function() {

	if(inspectResult) {
		_tl.show($('.x-panel-checked'));
		_tl.hide($('.x-panel-not-check'));

		//初始化
		var inspectFault = inspectResult['inspectFault'];
		$('.normal-num').html(6000 - inspectFault.length);
		$('.error-num').html(inspectFault.length);
		$('.inspect-time').html(inspectResult.inspectTime);

		//体检报告动画
		$('.avg_inspect strong').html(inspectResult.inspectScore);
		_tl.initCircle('avg_inspect', 110, parseInt(inspectResult.inspectScore), 100, {
			gradient: ["#2ecc71", "#3498db"]
		}, 18);

		if(inspectFault.length > 0) {
			$('.inspect-error-items').html('');
			var itemModel = '<div class="list-item">' + $('.list-item-model').html() + '</div>';
			for(var i = 0; i < inspectFault.length; i++) {
				$('.inspect-error-items').append(itemModel);
				$('.inspect-error-items .list-item:last').find('.inspect-error').html(inspectFault[i].faultCode);
				$('.inspect-error-items .list-item:last').attr('faultId', inspectFault[i].faultId);
				$('.inspect-error-items .list-item:last').attr('faultCode', inspectFault[i].faultCode);
			}

			$('.inspect-error-items .list-item').on('tap', function() {
				var param = {
					'faultId': $(this).attr('faultId'),
					'faultCode': $(this).attr('faultCode')
				};
				storage.setItem('faultDetail', JSON.stringify(param));
				_tl.toUrl('CarInspectFaultDetail.html');
			})

			_tl.show($('.common-title-has-error'));
			_tl.show($('.inspect-error-items'));
			_tl.hide($('.common-title-no-error'));
		} else {
			_tl.hide($('.common-title-has-error'));
			_tl.hide($('.inspect-error-items'));
			_tl.show($('.common-title-no-error'));
		}

	}

	//体检按钮
	$('.inspect-button').click(function() {
		_tl.toUrl('CarInspectProcess.html');
	})

})