var storage = window.localStorage;
var _tl = getTLInstance();
var carId = storage.getItem('carId');

$(function() {

	$('.inspect-fault-items .list-item').click(function() {
		_tl.toUrl('CarInspectFaultDetail.html');
	})

})