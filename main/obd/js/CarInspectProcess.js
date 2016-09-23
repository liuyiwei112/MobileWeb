var storage = window.localStorage;
var _tl = getTLInstance();

$(function() {
	_tl.turnARImg($('.inspect-check-point'),1500);
	getFaultList();
	setProgressAnimate();

})

var i = 0,
	faultData;

function getFaultList() {
	var dataUrl = '../../data/obd/faultlist.json';
	$.getJSON(dataUrl, function(data) {
		faultData = data.row;
		setInterval(function() {
			$('.faults-items').html('');
			appendFaults(i);
			appendFaults(i + 1);
			appendFaults(i + 2);
			appendFaults(i + 3);
			appendFaults(i + 4);
			appendFaults(i + 5);
			i = i + 6;
		}, 150)
	})
}

function appendFaults(seq) {
	if(seq < faultData.length) {
		$('.faults-items').append('<div class="faults-item word-break">' + faultData[seq].c + '  ' + faultData[seq].d + '</div>')
	} else {
		$('.faults-items').append('<div class="faults-item word-break">' + faultData[0].c + '  ' + faultData[0].d + '</div>')
		i = 1;
	}
}

function setProgressAnimate() {

	//在开始执行时即可从服务端抓取诊断数据，在结束时将数据存于本地缓存中
	var stepObj = [{
		"stepName": "正在更新诊断数据",
		"stepArray": initStepArray(11)
	}, {
		"stepName": "Diagnose EOBD2",
		"stepArray": initStepArray(5)
	}, {
		"stepName": "Read DTC",
		"stepArray": initStepArray(14)
	}, {
		"stepName": "Diagnose OBD",
		"stepArray": initStepArray(3)
	}, {
		"stepName": "正在上传诊断数据",
		"stepArray": initStepArray(15)
	}]

	var flag1 = 0,
		flag2 = 0;
	var m = setInterval(function() {
		//该组的进度已循环完成
		if(flag2 > stepObj[flag1].stepArray.length - 1) {
			flag1++;
			flag2 = 0;
		}
		//进度已全部执行完成
		if(flag1 > stepObj.length - 1) {
			clearInterval(m);

			//存储更新最近的一次体检数据
			setTimeout(function(){
				mui.back();
			},500)
			
			return;
		}
		var progressValue = stepObj[flag1].stepArray[flag2];
		$('.progress-text').html(stepObj[flag1].stepName + '(' + progressValue + '%)');
		setProgressBar(progressValue);
		flag2++;
	}, 300)

}

//生成随机序列，用以表示加载进度
function initStepArray(gap) {
	var stepArray = [];
	var maxValue = 0;
	while(maxValue < 100) {
		//不足一次间隔
		if(100 - maxValue < gap) {
			stepArray.push(parseInt(Math.random() * (100 - maxValue) + maxValue));
			maxValue = 100;
		} else {
			stepArray.push(parseInt(Math.random() * gap + maxValue));
			maxValue += gap
		}
	}
	return stepArray;
}

function setProgressBar(a) {
	mui(mui('.inspect-progress')).progressbar().setProgress(a);
}