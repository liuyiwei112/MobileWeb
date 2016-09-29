var storage = window.localStorage;
var _tl = getTLInstance();
var insertedCar = JSON.parse(storage.getItem('insertedCar'));
var brandId = insertedCar.brandId,
	brandName = insertedCar.brandName;

$(function() {
	$('.car-serial').html(brandName);
	_tl.loadImg(insertedCar.brandImg, $('.brand-img').find('img'))
	var dataUrl = _tl.api + 'huijia/getCrmCarSeriesByBrandId?brandId=' + brandId;
	$.get(dataUrl, function(d) {
		for(var i = 0; i < d.length; i++) {
			$('.mui-table-view').append('<li class="mui-table-view-cell"><a class="mui-navigate-right">' + d[i].seriesName + '</a></li>')
			$('.mui-table-view li:last').attr('seriesId', d[i].seriesId);
			$('.mui-table-view li:last').attr('seriesName', d[i].seriesName);
		}

		$('.mui-table-view-cell').on('tap', function() {
			insertedCar.seriesId = $(this).attr('seriesId');
			insertedCar.seriesName = $(this).attr('seriesName');
			storage.setItem('insertedCar', JSON.stringify(insertedCar));
			_tl.toUrl('carAddTab03.html');
		})
	})

})