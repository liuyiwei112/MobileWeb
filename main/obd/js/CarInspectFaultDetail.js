var storage = window.localStorage;
var _tl = getTLInstance();
var faultDetail = JSON.parse(storage.getItem('faultDetail'));

$(function(){
	
	var faultCode = faultDetail.faultCode;
	var faultId = faultDetail.faultId;
	
	var dataUrl = _tl.api + 'terminals/check/getSysFaultsVO?dtcId='+faultId+'&dtcCode='+faultCode;
	
	$.get(dataUrl,function(d){
		
		$('.fault-code').html(faultCode);
		$('.fault-desc').html(d.dtcDesc);
		$('.fault-express').html(d.goloDtcHelp.replace(/(\r\n)|(\n)/g,'<br/>'));
		$('.fault-reason').html(d.goloDtcAdvice.replace(/(\r\n)|(\n)/g,'<br/>'));
		
	})
	

})