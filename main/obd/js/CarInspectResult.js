var storage = window.localStorage;
var _tl = getTLInstance();

$(function(){

	//体检报告动画
	$('.avg_inspect strong').html(80);
	_tl.initCircle('avg_inspect', 110, 80, 100, {
		gradient: ["#2ecc71", "#3498db"]
	}, 18);
	
	//体检按钮
	$('.inspect-button').click(function(){
		_tl.toUrl('CarInspectProcess.html');
	})
	
	//体检结果
	$('.inspect-error-items .inspect-error').on('click tap',function(){
		_tl.toUrl('CarInspectFaultList.html');
	})

})