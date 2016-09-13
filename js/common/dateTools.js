define(function(require){
	var $ = require("jquery");

	//处理yyyymmddhhmmss格式的字符串
	return {
		//获取年
		getYear:function(dateStr){
			return dateStr.substring(0,4);
		},
		//获取月
		getMonth:function(dateStr){
			return dateStr.substring(4,6);
		},
		//获取日
		getDay:function(dateStr){
			return dateStr.substring(6,8);
		},
		//获取时
		getHH:function(dateStr){
			return dateStr.substring(8,10);
		},
		//获取分
		getMM:function(dateStr){
			return dateStr.substring(10,12);
		},
		//获取秒
		getSS:function(dateStr){
			return dateStr.substring(12,14);
		},
		//获取年-月-日
		getYMD:function(dateStr){
			return this.getYear(dateStr)+'-'+this.getMonth(dateStr)+'-'+this.getDay(dateStr);
		},
		//获取时:分:秒
		getHMS:function(dateStr){
			return this.getHH(dateStr)+':'+this.getMM(dateStr)+':'+this.getSS(dateStr);
		}
	}
	
	
});