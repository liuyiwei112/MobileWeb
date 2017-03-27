var storage = window.localStorage;
var _tl = getTLInstance();
var imgSource;

mui.init({
	gestureConfig: {
		longtap: true //默认为false
	}
});

$(function() {
	if(mui.os.ios && mui.os.plus) {
		$('body').addClass('ios-body');
	}
	initImg();

	//点击拍照
	$('.init').on('tap', function() {
		if(mui.os.plus) {
			captureImage();
		}
	})
	$('.pop-up-mask').on('tap', function() {
		$('.image-view').hide();
	})
})

function initImg() {
	if(!mui.os.plus) {
		mui.alert('Web端暂不支持照相机，请在APP中使用此功能');
	}
	var dataUrl = '../../data/shigu.json';
	$.getJSON(dataUrl, function(d) {
		imgSource = d;
		changeType(0);
	})
}

function changeType(_index) {
	$('.tap-checked').removeClass('tap-checked');
	$('.tap-not-checked:eq(' + _index + ')').addClass('tap-checked');
	setImg(_index);
	if(mui.os.plus) {
		if(_index == 0) {
			showPic('bx');
		} else if(_index == 1) {
			showPic('zw');
		} else {
			showPic('qt');
		}
	}
}

function setImg(_index) {
	var imgArr;
	if(_index == 0) {
		imgArr = imgSource.bx;
	} else if(_index == 1) {
		imgArr = imgSource.zw;
	} else {
		imgArr = imgSource.qt;
	}
	$('.left-sider').html('');
	for(var i = 0; i < imgArr.length; i++) {
		$('.left-sider').append('<div class="menu-item"><div class="menu-image"><img src="../../images/tools/shigu/' + imgArr[i].img + '" /></div><div class="menu-text">' + imgArr[i].text + '</div></div>');
	}
	$('.left-sider').find('.menu-item').on('tap', function() {
		$('.select').removeClass('select');
		$(this).addClass('select');
		$('.img-example').find('img').attr('src', $(this).find('img').attr('src'));
	})
	$('.left-sider').find('.menu-item:first').addClass('select').trigger('tap');
	mui.previewImage();
}

// 拍照
function captureImage() {
	var cmr = plus.camera.getCamera();
	var res = cmr.supportedImageResolutions[0];
	var fmt = cmr.supportedImageFormats[0];
	console.log("Resolution: " + res + ", Format: " + fmt);
	var _type = $('.tap-checked').attr('iden');
	var _now = _tl.getNow(0);
	var cameraUrl = "_doc/camera/" + _type + "/photo" + parseInt(Math.random() * 1000000) + "_" + _tl.getNow(1) + '.jpg';
	cmr.captureImage(function(path) {
		console.log(path);
		plus.io.resolveLocalFileSystemURL(path, function(entry) {
			var localurl = entry.toLocalURL(); //把拍照的目录路径，变成本地url路径，例如file:///........之类的。
			console.log(localurl);
			$('.take-photos .init').after('<div class="menu-item pic"><div class="menu-image"><img src="' + localurl + '" data-preview-src="" data-preview-group="3"/></div><div class="menu-text">' + _now + '</div></div>');
			mui.previewImage();
			bindDelete();
		});
	}, function(error) {}, {
		filename: cameraUrl
	});
}

function showPic(_type) {
	$('.take-photos').find('.pic').remove();
	var cameraUrl = "_doc/camera/" + _type + '/';
	plus.io.resolveLocalFileSystemURL(cameraUrl, function(entry) {
		var reader = entry.createReader();
		var imgArr = [];
		reader.readEntries(function(subFiles) {
			for(var i = 0, len = subFiles.length; i < len; i++) {
				var _p = subFiles[i].fullPath;
				var _d = _p.substring(_p.lastIndexOf('_') + 1, _p.lastIndexOf('.jpg'));
				console.log('_d:' + _tl.getYMD(_d));
				$('.take-photos .init').after('<div class="menu-item pic"><div class="menu-image"><img src="' + subFiles[i].fullPath + '" data-preview-src="" data-preview-group="3"/></div><div class="menu-text">' + _tl.getYMD(_d) + '</div></div>');
			}
			mui.previewImage();
			bindDelete();
		})
	})
}

function bindDelete() {
	mui('.take-photos').off();
	mui('.take-photos').on('longtap', '.pic', function() {
		var that = $(this);
		var btnArray = ['取消', '确定'];
		var _type = $('.tap-checked').attr('iden');
		var _src = that.find('img').attr('src');
		var filePath = 'camera/' + _type + '/' + _src.substring(_src.lastIndexOf('/') + 1, _src.length);
		console.log('filePath:' + filePath);
		mui.confirm('是否删除？', '', btnArray, function(e) {
			if(e.index == 1) {
				plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function(fs) {
					fs.root.getFile(filePath, {}, function(entry) {
						entry.remove();
						that.remove();
					})
				})
			}
		})

	})

}