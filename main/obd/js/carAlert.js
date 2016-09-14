//定义需要引入的JS 模块
require.config({　　　
	baseUrl: "../../js",
	paths: {　　　　　
		"jquery": "common/jquery",
		"flexible": "common/flexible/flexible",
		"tools": "common/tools"
	}　　
});

require(['jquery', 'flexible', 'tools'], function($, _fl, _tl) {
	var storage = window.localStorage;
//	var dataUrl = '../../data/obd/carAlert.json';
	var carId = storage.getItem('carId');
	var dataUrl = _tl.api+'alerm/alermCount?carId='+carId;
	$.getJSON(dataUrl, function(data) {
		//objData.loadData(data);
		//alert(data);
		$('.car-alert-items').html('');
		var alertModel = '<div class="car-alert-item">' + $('.car-alert-item-model').html() + '</div>';
		for(i = 0; i < data.length; i++) {
			$('.car-alert-items').append(alertModel);
			//赋值
			$('.car-alert-item:last .alert-type').val(data[i].alermType);
			$('.car-alert-item:last img').attr('src', data[i].alermPhoto);
			$('.car-alert-item:last .alert-name').html(data[i].alermName);
			if(data[i].alermCount == 0) {
				$('.car-alert-item:last .alert-num').hide();
			} else {
				$('.car-alert-item:last .alert-num').html(data[i].alermCount);
			}
		}

		$('.car-alert-item').on('click',function(){
			var alertType = $(this).find('.alert-type').val();
			var alertName = $(this).find('.alert-name').html();
			var params = {
				carId : '1',
				alermType : alertType,
				alermName : alertName
			}
			storage.setItem("carAlertParam",JSON.stringify(params));
			window.location.href="carAlertList.html"
		})

	});
})