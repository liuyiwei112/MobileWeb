var storage = window.localStorage;
var _tl = getTLInstance();

$(function() {
	getDailyTotal();
	getDailyList();
})

function getDailyTotal(){
		var dataUrl = '../../data/obd/dailyTotal.json';
		$.getJSON(dataUrl, function(data) {
			$('.total-area-mile-text').html(data.driverMile);
			$('.total-area-speedup-text').html(data.sharpSpeedup);
			$('.total-area-time-text').html(data.driverTime);
			$('.total-area-speeddown-text').html(data.sharpSlow);
			$('.total-area-oil-text').html(data.totalOil);
			$('.total-area-turn-text').html(data.sharpChange);
			
		})
	
	}
	
	
	function getDailyList(){
		var dataUrl = '../../data/obd/dailyTripList.json';
		$.getJSON(dataUrl, function(data) {
			$('.driver-list').html('');
			var model = '<div class="driver-item">'+$('.driver-item-model').html()+'</div>';
			for(var i=0;i<data.content.length;i++){
				var trip = data.content[i];
				$('.driver-list').append(model);
				
				//赋值
				$('.driver-list .driver-item:last').find('.start-time').html(_tl.getHMS(trip.startTime));
				$('.driver-list .driver-item:last').find('.start-address').html(trip.startPoint);
				$('.driver-list .driver-item:last').find('.driver-detail-time .detail-text').html(trip.driverTime);
				$('.driver-list .driver-item:last').find('.driver-detail-mile .detail-text').html(trip.driverMile);
				$('.driver-list .driver-item:last').find('.driver-detail-speed .detail-text').html(trip.averageSpeed);
				$('.driver-list .driver-item:last').find('.driver-detail-oil .detail-text').html(trip.totalOil);
				$('.driver-list .driver-item:last').find('.driver-detail-cost .detail-text').html(trip.totalCost);
				$('.driver-list .driver-item:last').find('.driver-detail-max-speed .detail-text').html(trip.maxVelocity);
				$('.driver-list .driver-item:last').find('.end-time').html(_tl.getHMS(trip.endTime));
				$('.driver-list .driver-item:last').find('.end-address').html(trip.endPoint);
			}
			
			$('.driver-item').click(function(){
				//var alertSerial = $(this).find('.alert-serial').val();
				var params = {};
//				justep.Shell.showPage(require.toUrl('./DriverAnalysisTabFrame.w'),params);
				_tl.toUrl('DriverAnalysisTabFrame.html');
			})
			
		})
	}