var storage = window.localStorage;
var _tl = getTLInstance();
var carId = storage.getItem('carId');

mui.plusReady(function(){
})

$(function() {
	if(mui.os.ios&&mui.os.plus) {
		$('body').addClass('ios-body');
	}
	
	var dataUrl = _tl.api + 'getCarFaultInfo/' + carId;
	$.get(dataUrl, function(d) {
		$('.loading-tip').hide();
		if(d && d.length > 0) {
			var inspectFault = d;
			$('.inspect-error-items').html('');
			var itemModel = '<div class="list-item">' + $('.list-item-model').html() + '</div>';
			for(var i = 0; i < inspectFault.length; i++) {
				$('.inspect-error-items').append(itemModel);
				$('.inspect-error-items .list-item:last').find('.inspect-error').html(inspectFault[i].faultCode);
				$('.inspect-error-items .list-item:last').find('.fault-desc').html(_tl.getYMD(inspectFault[i].checkTime) + ' ' + _tl.getHMS(inspectFault[i].checkTime));
				$('.inspect-error-items .list-item:last').attr('faultId', inspectFault[i].faultId);
				$('.inspect-error-items .list-item:last').attr('faultCode', inspectFault[i].faultCode);
				$('.inspect-error-items .list-item:last').attr('longitude', inspectFault[i].longitude);
				$('.inspect-error-items .list-item:last').attr('latitude', inspectFault[i].latitude);
				$('.inspect-error-items .list-item:last').attr('faultAddress', inspectFault[i].faultAddress);
				$('.inspect-error-items .list-item:last').attr('checkTime', inspectFault[i].checkTime);
			}

			$('.inspect-error-items .list-item').on('tap', function() {
				var param = {
					'faultId': $(this).attr('faultId'),
					'faultCode': $(this).attr('faultCode'),
					'longitude': $(this).attr('longitude'),
					'latitude': $(this).attr('latitude'),
					'faultAddress': $(this).attr('faultAddress'),
					'checkTime': $(this).attr('checkTime')
				};
				storage.setItem('faultDetail', JSON.stringify(param));
				_tl.toUrl('CarInspectFaultDetail.html');
			})
		}else{
			$('.error-tip').show();
		}
	})

})