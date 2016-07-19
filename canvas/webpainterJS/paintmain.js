//tools 등록
var jsSrcs = ['/tools/pallette.js','/tools/pencil.js','/tools/undo.js'];

for (jsSrc in jsSrcs) {
	document.write('<script src="./webpainterJS' + jsSrcs[jsSrc] + '"></script>');
}

//본편
window.onload = function() {
	var canvas = document.getElementById('c2');
	var ctx = canvas.getContext('2d');
	
	var draw = false;
	var color = '#000000';

	var colors = ['000000','0000ff','ffff00','ff0000','606060','ffffff'];
	var jsonCanvas = {'canvas': canvas, 
			'ctx' : ctx, 
			'draw' : draw,
			'color' : color,
			'colors' : colors};

	toolCtrl(jsonCanvas);
	
	document.getElementById('pcurcolor').style.background = color;
	
	
	//색상 고르고 팔레트 가장 아래에 표시까지
	for(c in colors){
		document.getElementById(colors[c]).addEventListener('click',function(e) {
			color = '#' + e.target.id;
			document.getElementById('pcurcolor').style.background = color;
			jsonCanvas.color = color;
		});
	}
};

//툴박스에 툴 추가 및 제어 쯤
function toolCtrl(jc) {
	var toolbox = document.getElementById('tools');
	var cp = cpallette(jc.colors);
	toolbox.appendChild(cp);

	pencil(jc);
	insertURBtn(toolbox,jc);
}
