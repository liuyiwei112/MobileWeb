var storage = window.localStorage;
var _tl = getTLInstance();
var hotBrand, allBrand;

mui.plusReady(function() {})

$(function() {
	if(mui.os.ios&&mui.os.plus) {
		$('body').addClass('ios-body');
	}
	loadBrand();

})

function loadBrand() {
	var dataUrl = _tl.api + 'huijia/getCarBrandInfo';
	$.get(dataUrl, function(resp) {
		hotBrand = resp.crmCarHotBrandVOs;
		allBrand = resp.crmCarBrandVOs;
		initHot();
		initIndex();
		initAll();

		$('.menu-item,.mui-indexed-list-item').on('tap', function() {
			var insertedCar = {
				'brandId': $(this).attr('brandId'),
				'brandName': $(this).attr('brandName'),
				'brandImg': $(this).attr('brandImg')
			}
			storage.setItem('insertedCar', JSON.stringify(insertedCar));
			_tl.toUrl('carAddTab02.html');
		})

	})

}

function initHot() {
	for(i = 0; i < hotBrand.length; i++) {
		_tl.loadImg(hotBrand[i].iconPath, $('.hot-brand .menu-item:eq(' + i + ')').find('img'))
		$('.hot-brand .menu-item:eq(' + i + ')').find('.menu-text').html(hotBrand[i].brandName);
		$('.hot-brand .menu-item:eq(' + i + ')').attr('brandId', hotBrand[i].brandId);
		$('.hot-brand .menu-item:eq(' + i + ')').attr('brandName', hotBrand[i].brandName);
		$('.hot-brand .menu-item:eq(' + i + ')').attr('brandImg', hotBrand[i].iconPath);
	}
}

function initAll() {
	var nowLetter = '';
	allBrand.sort(function(x, y) {
		if(x.firstLetter > y.firstLetter) {
			return 1;
		}
		return -1;
	})
	for(var m = 0; m < allBrand.length; m++) {
		var letter = allBrand[m].firstLetter;
		//首字母为空或者切换字母
		if(nowLetter == '' || nowLetter != letter) {
			nowLetter = letter;
			$('.mui-table-view').append('<li data-group="' + nowLetter + '" class="mui-table-view-divider mui-indexed-list-group">' + nowLetter + '</li>');
		}
		$('.mui-table-view').append('<li data-value="' + allBrand[m].brandId + '" data-tags="' + allBrand[m].brandId + '" class="mui-table-view-cell mui-indexed-list-item">' + allBrand[m].brandName + '</li>')
		_tl.loadBgImg(allBrand[m].iconPath, $('.mui-table-view li:last'))
		$('.mui-table-view li:last').attr('brandId', allBrand[m].brandId);
		$('.mui-table-view li:last').attr('brandName', allBrand[m].brandName);
		$('.mui-table-view li:last').attr('brandImg', allBrand[m].iconPath);
	}
	var list = document.getElementById('list');
	window.indexedList = new mui.IndexedList(list);

}

function initIndex() {
	var letterArray = [];
	//循环品牌数据，查询所有的首字母
	for(var i = 0; i < allBrand.length; i++) {
		if(letterArray.indexOf(allBrand[i].firstLetter) == -1) {
			letterArray.push(allBrand[i].firstLetter);
		}
	}
	letterArray.sort();
	for(var j = 0; j < letterArray.length; j++) {
		$('.mui-indexed-list-bar').append('<a>' + letterArray[j] + '</a>');
	}
}