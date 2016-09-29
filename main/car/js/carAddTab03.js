var storage = window.localStorage;
var _tl = getTLInstance();
var insertedCar = JSON.parse(storage.getItem('insertedCar'));
var seriesId = insertedCar.seriesId,
	seriesName = insertedCar.seriesName,
	brandName = insertedCar.brandName;

$(function() {
	$('.car-serial').html(brandName + '—'+seriesName);
	_tl.loadImg(insertedCar.brandImg, $('.brand-img').find('img'))
	var dataUrl = _tl.api + 'huijia/getCrmCarTypeBySeriesId?seriesId=' + seriesId;
	$.get(dataUrl, function(d) {
		for(var i = 0; i < d.length; i++) {
			$('.mui-table-view').append('<li class="mui-table-view-cell"><a class="mui-navigate-right">' + d[i].sweptVolume + '</a></li>');
			$('.mui-table-view li:last').attr('sweptVolume', d[i].sweptVolume);
		}
		
		$('.mui-table-view-cell').on('tap', function() {
			insertedCar.sweptVolume = $(this).attr('sweptVolume');
			storage.setItem('insertedCar', JSON.stringify(insertedCar));
			_tl.toUrl('carAddTab04.html');
		})
	})

})