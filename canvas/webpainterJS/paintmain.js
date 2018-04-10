//tools 등록
var jsSrcs = ['/tools/pallette.js',
	'/tools/pencil.js',
	'/tools/rect.js',
	'/tools/line.js',
	'/tools/circle.js',
	'/tools/bucket.js',
	'/tools/undo.js',
	'/tools/layer.js'];

for (jsSrc in jsSrcs) {
	document.write('<script src="./webpainterJS' + jsSrcs[jsSrc] + '"></script>');
}

var layers = [];
var layer_cnt = 1;
var curlayer = 'layer0';

//본편
window.onload = function() {
	var canvas = document.getElementById('c2');
	var ctx = canvas.getContext('2d');

	var curtool;
	var drawcanvas = document.createElement('canvas');
	drawcanvas.id = 'draw';
	drawcanvas.width = canvas.width;
	drawcanvas.height = canvas.height;
	drawcanvas.style = 'border:1px solid gray;position:absolute;top:0px;left:0px;z-index:50000;';
	canvas.parentNode.insertBefore(drawcanvas,document.getElementById('tools'));
	var drawctx = drawcanvas.getContext('2d');
	var draw = false;
	var color = '#000000';
	var strokewidth = 3;
	var linecap = 'round';
	var linejoin = 'round';
	
	var curcanvas = document.createElement('canvas');
	curcanvas.id = 'layer0';
	curcanvas.width = canvas.width;
	curcanvas.height = canvas.height;
	curcanvas.style = 'border:1px solid gray;position:absolute;top:0px;left:0px;';
	canvas.parentNode.insertBefore(curcanvas,document.getElementById('draw'));
	var curctx = curcanvas.getContext('2d');
	layers.push({name: 'layer0', canvas: curcanvas, ctx: curctx});
	
	var colors = ['000000','0000ff','ffff00','ff0000','606060','ffffff'];
	var jsonCanvas = {'ocanvas' : canvas,
			'octx' : ctx,
			'canvas': drawcanvas, 
			'ctx' : drawctx,
			'draw' : draw,
			'color' : color,
			'colors' : colors,
			'curtool' : curtool,
			'strokewidth' : strokewidth,
			'linecap' : linecap,
			'linejoin' : linejoin,
			'starts' : {'x' : 0 , 'y' : 0}
		};

	toolCtrl(jsonCanvas);
	
	document.getElementById('pcurcolor').style.background = color;
};

//툴박스에 툴 추가 및 제어 쯤
function toolCtrl(jc) {
	var toolbox = document.getElementById('tools');
	var cp = cpallette(jc);
	toolbox.appendChild(cp);

	toolCommonEvents(jc);

	insertPCBtn(toolbox, jc);
	insertRectBtn(toolbox, jc);
	insertLnBtn(toolbox, jc);
	insertCircleBtn(toolbox, jc);
	insertBucketBtn(toolbox,jc);
	insertURBtn(toolbox,jc);
	insertLayerTool();
	lWidth(toolbox, jc);
}


//선택된 툴 표시
function toolSelected(Element) {
	var toolbtns = document.getElementById('tools').getElementsByClassName('tool');
	for (i in toolbtns) {
		toolbtns[i].style = 'background:;';	
	}
	Element.style = 'background:#bbb';
}

//펜 사이즈
function lWidth(Element, jc) {
	var lwcontainer = document.createElement('div');
	var lwtitle = document.createElement('p');
	var lwidth = document.createElement('input');
	var lwsize = document.createElement('input');

	lwcontainer.style = 'border:0px;';
	
	lwtitle.appendChild(document.createTextNode('SIZE'));
	
	lwidth.name = 'lwidth';
	lwidth.type = 'range';
	lwidth.style = 'width:4em;';
	lwidth.min = 0;
	lwidth.max = 100;
	lwidth.value = 5;

	lwsize.name = 'lwsize';
	lwsize.type = 'text';
	lwsize.style = 'width:4em;text-align:center;';
	lwsize.value = lwidth.value;

	lwidth.addEventListener('mousemove', function(e) {
		lwsize.value = lwidth.value;
		jc.strokewidth = lwsize.value;
	});
	lwidth.addEventListener('touchmove', function(e) {
		e.preventDefault();
		lwsize.value = lwidth.value;
		jc.strokewidth = lwsize.value;
	});
	lwsize.addEventListener('change', function(e) {
		lwidth.value = lwsize.value;
		jc.strokewidth = lwsize.value;
	});

	lwcontainer.appendChild(lwtitle);
	lwcontainer.appendChild(lwidth);
	lwcontainer.appendChild(document.createElement('br'));
	lwcontainer.appendChild(lwsize);
	Element.appendChild(lwcontainer);
}

//canvas tool 공통이벤트
function toolCommonEvents(jc) {
	var startX, startY;

	jc.canvas.addEventListener('mousedown', function(e) {
		var curLayer = returnCanvas();
		var startX = (e.offsetX)?e.offsetX:0;
		var startY = (e.offsetY)?e.offsetY:0;
		jc.starts = {'x' : startX, 'y' : startY};

		curLayer.ctx.beginPath();
		jc.draw = true;
		curLayer.ctx.strokeStyle = jc.color;		
		curLayer.ctx.lineWidth = jc.strokewidth;
		curLayer.ctx.lineCap = jc.linecap;
		curLayer.ctx.lineJoin = jc.linejoin;
	});
	/* jc.canvas.addEventListener('mousemove',function(e) {
		var curLayer = returnCanvas();
		var cx = (e.offsetX)?e.offsetX:0;
		var cy = (e.offsetY)?e.offsetY:0;
			
		document.getElementById('coords').innerHTML = 'X : ' + cx + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Y : ' + cy;
	}); */
	jc.canvas.addEventListener('mouseup',function(e) {
		var curLayer = returnCanvas();
		curLayer.ctx.stroke();
		jc.draw = false;
		jc.ctx.clearRect(0, 0, jc.canvas.width, jc.canvas.height);
		// jc.ctx.stroke();
	});
	//터치 이벤트
	jc.canvas.addEventListener('touchstart', function(e) {
		var curLayer = returnCanvas();
		var touches = e.changedTouches;
		var targetRect = e.target.getBoundingClientRect();
		var startX = (touches[0].pageX && touches[0].pageX - (targetRect.left + window.scrollX) > 0)?touches[0].pageX - (targetRect.left + window.scrollX):0;
		var startY = (touches[0].pageY && touches[0].pageY - (targetRect.top + window.scrollY) > 0)?touches[0].pageY - (targetRect.top + window.scrollY):0;
		jc.starts = {'x' : startX, 'y' : startY};

		curLayer.ctx.beginPath();
		jc.draw = true;
		curLayer.ctx.strokeStyle = jc.color;		
		curLayer.ctx.lineWidth = jc.strokewidth;
		curLayer.ctx.lineCap = jc.linecap;
		curLayer.ctx.lineJoin = jc.linejoin;
	});
	jc.canvas.addEventListener('touchend',function(e) {
		var curLayer = returnCanvas();
		curLayer.ctx.stroke();
		jc.draw = false;
		jc.ctx.clearRect(0, 0, jc.canvas.width, jc.canvas.height);
	});
}

function returnCanvas() {
	var selectedLayer = layers.filter(function(el) { return el.name == curlayer})[0];
	return selectedLayer;
}

function saveImage() {
	console.log('aaa');
	var canvas = document.getElementById('c2');
	var ctx = canvas.getContext('2d');
	for(i = 0; i < layers.length; i++) {
		var canPic = new Image();
		canPic.src = layers[i].canvas.toDataURL();
		ctx.drawImage(canPic, 0, 0);
	}
}