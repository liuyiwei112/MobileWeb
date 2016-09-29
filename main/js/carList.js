var storage = window.localStorage;
var _tl = getTLInstance();
var userInfo = JSON.parse(storage.getItem('userInfo'));
var mobile = userInfo.mobile;
var isRefresh = false;

$(function() {

	var dataUrl = _tl.api + 'customerCar/cars?phone=' + mobile;
	$.get(dataUrl, function(d) {
		$('.mui-table-view').html('');
		var bindModel = '<li class="mui-table-view-cell">' + $('.bind-model').html() + '</li>';
		var notBindModel = '<li class="mui-table-view-cell">' + $('.not-bind-model').html() + '</li>';

		for(var i = 0; i < d.length; i++) {
			var b = d[i];
			if(b.isBinding == 1) {
				$('.mui-table-view').append(bindModel);
				$('.mui-table-view-cell:last .obd-no').html(b.terminalId);
			} else {
				$('.mui-table-view').append(notBindModel);
			}
			//绑定数据
			if(b.defaultCar == 'n') {
				_tl.hide($('.mui-table-view-cell:last .default-icon'));
			}
			$('.mui-table-view-cell:last').attr('carId',b.carId);
			$('.mui-table-view-cell:last').attr('mile',b.currentMile);
			$('.mui-table-view-cell:last .brand-img img').attr('src', b.picUrl);
			$('.mui-table-view-cell:last .car-no').html(b.carNo);
			$('.mui-table-view-cell:last .car-serial').html(b.typeName);

		}
		bindBtnEvent();

		_tl.hide($('.loading-tip'));
		_tl.show($('.mui-table-view'));

	})

})

function bindBtnEvent() {
	$('.set-defalut').on('tap',function(event) {
		var that = $(this);
		var li = $(this).parent().parent();
		var carId = li.attr('carId');
		
		var dataUrl = _tl.api + 'customerCar/updateDefaultCar?phone='+mobile+'&carId='+carId;
		$.get(dataUrl,function(d){
			_tl.hide($('.default-icon'));
			_tl.show(li.find('.default-icon'));
			that.parent().find('a').removeAttr('style');
			li.find('.mui-slider-handle').removeAttr('style');
			//设置首页刷新请求
			isRefresh = true;
		})
		
	});
	
	$('.btn-delete').on('tap',function(event) {
		var that = $(this);
		var li = $(this).parent().parent();
		var carId = li.attr('carId');
		
		var dataUrl = _tl.api + 'customerCar/deleteCarInfo/'+carId;
		$.get(dataUrl,function(d){
			if(d.retCode==200){
				li.remove();
			}else{
				mui.alert(d.retMsg);
			}
		})
	});
	
	$('.set-mile').on('tap',function(event) {
		var that = $(this);
		var li = $(this).parent().parent();
		var carId = li.attr('carId');
		var mile = li.attr('mile');
		_tl.show($('.pop-up'));
		that.parent().find('a').removeAttr('style');
		li.find('.mui-slider-handle').removeAttr('style');
		
		$('.input-mile').attr('placeholder',mile);
		
		$('.modify-mile').unbind('tap').bind('tap',function(){
			$('.input-mile').removeClass('input-error');
			var curMile = $.trim($('.input-mile').val());
			if(!curMile){
				$('.input-mile').addClass('input-error');
			}
			var dataUrl = _tl.api + 'huijia/mileCalibrationByCarNo?currentMile='+curMile+'&carId='+carId;
			$.get(dataUrl,function(d){
				mui.alert(d.retMsg);
				if(d.retCode==200){
					_tl.hide($('.pop-up'));
					li.attr('mile',curMile);
					$('.input-mile').val('');
					//设置首页刷新请求
					isRefresh = true;
				}
			})
		})
		
	});
	
	

}

mui.plusReady(function() {
	mui.init({
		beforeback: function() {
//			wobj.reload(true);
			if(isRefresh){
				var wobj = plus.webview.getWebviewById("index");
				wobj.reload();
			}
			return true;
		}
	})
})