var storage = window.localStorage;
var _tl = getTLInstance();
var insertedCar = JSON.parse(storage.getItem('insertedCar'));
var seriesId = insertedCar.seriesId,
	seriesName = insertedCar.seriesName,
	brandName = insertedCar.brandName,
	sweptVolume = insertedCar.sweptVolume;
var 	sweptVolumeStr = sweptVolume;

$(function() {
	if(mui.os.ios&&mui.os.plus){
		$('body').addClass('ios-body');
	}
	$('.car-serial').html(brandName + '—'+seriesName);
	if(sweptVolumeStr.indexOf('T')==-1){
		sweptVolumeStr = sweptVolume + 'L';
	}
	$('.car-year').html(sweptVolumeStr + '  |  ' + '请选择年份');
	_tl.loadImg(insertedCar.brandImg, $('.brand-img').find('img'))
	var dataUrl = _tl.api + 'huijia/getCrmCarTypeBySeriesIdAndSweptVolume?seriesId='+seriesId+'&sweptVolume=' +sweptVolume ;
	$.get(dataUrl, function(d) {
		for(var i = 0; i < d.length; i++) {
			$('.mui-table-view').append('<li class="mui-table-view-cell"><a class="mui-navigate-right">' + d[i].typeYear + '</a></li>');
			$('.mui-table-view li:last').attr('typeYear', d[i].typeYear);
		}
		$('.mui-table-view-cell').on('tap', function() {
			insertedCar.typeYear = $(this).attr('typeYear');
			storage.setItem('insertedCar', JSON.stringify(insertedCar));
			_tl.toUrl('carAddTab05.html');
		})
	})

})