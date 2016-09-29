var storage = window.localStorage;
var _tl = getTLInstance();
var insertedCar = JSON.parse(storage.getItem('insertedCar'));
var seriesId = insertedCar.seriesId,
	seriesName = insertedCar.seriesName,
	brandName = insertedCar.brandName,
	sweptVolume = insertedCar.sweptVolume,
	typeYear = insertedCar.typeYear;
var sweptVolumeStr = sweptVolume;

$(function() {
	$('.car-serial').html(brandName + '—' + seriesName);
	if(sweptVolumeStr.indexOf('T') == -1) {
		sweptVolumeStr = sweptVolume + 'L';
	}
	$('.car-year').html(sweptVolumeStr + '  |  ' + typeYear + '  |  ' + '请选择车型');
	_tl.loadImg(insertedCar.brandImg, $('.brand-img').find('img'))
	var dataUrl = _tl.api + 'huijia/getCrmCarTypeByTypeYear?seriesId=' + seriesId + '&sweptVolume=' + sweptVolume + '&typeYear=' + typeYear;
	$.get(dataUrl, function(d) {
		for(var i = 0; i < d.length; i++) {
			$('.mui-table-view').append('<li class="mui-table-view-cell"><a class="mui-navigate-right">' + d[i].typeName + '</a></li>');
			$('.mui-table-view li:last').attr('typeId', d[i].typeId);
			$('.mui-table-view li:last').attr('typeName', d[i].typeName);
		}
		$('.mui-table-view-cell').on('tap', function() {
			insertedCar.typeId = $(this).attr('typeId');
			insertedCar.typeName = $(this).attr('typeName');
			storage.setItem('insertedCar', JSON.stringify(insertedCar));
			_tl.toUrl('carAddTab06.html');
		})
	})

})