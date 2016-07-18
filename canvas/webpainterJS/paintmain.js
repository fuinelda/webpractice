//tools 등록
var jsSrcs = ['/tools/palette.js'];

for (jsSrc in jsSrcs) {
	document.write('<script src="./webpainterJS' + jsSrcs[jsSrc] + '"></script>');
}

//본편
window.onload = function() {
	var can2 = document.getElementById('c2');
	var ctx = can2.getContext('2d');
	
	var draw = false;
	var color = '#000000';

	var colors = ['000000','0000ff','ffff00','ff0000','606060','ffffff'];
	
	var colorpick = document.getElementById('tools');

	var cp = cpallette(colors);
	colorpick.appendChild(cp);
	//document.getElementById('colorpick').innerHTML = cpallette(colors);
	
	document.getElementById('pcurcolor').style.background = color;

	//색상 고르고 팔레트 가장 아래에 표시까지
	for(c in colors){
		document.getElementById(colors[c]).addEventListener('click',function(e) {
				console.log(e.target.id);
				color = '#' + e.target.id;
				document.getElementById('pcurcolor').style.background = color;
				});
	}
	
	//자유선 그리기 - stroke를 이용함
	can2.addEventListener('mousedown', function(e) {
			var cx = (e.offsetX)?e.offsetX:0;
			var cy = (e.offsetY)?e.offsetY:0;
			
			ctx.beginPath();
			draw = true;
			console.log(color);
			ctx.strokeStyle = color;
			});
	can2.addEventListener('mousemove',function(e) {
			var cx = (e.offsetX)?e.offsetX:0;
			var cy = (e.offsetY)?e.offsetY:0;
			
			document.getElementById('coords').innerHTML = 'X : ' + cx + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Y : ' + cy;
			if(draw){
			ctx.lineTo(cx,cy);
			ctx.stroke();
			}
	});
	can2.addEventListener('mouseup',function(e) {
			draw = false;
			});

	var can = document.getElementById('c1');
	var ctx2 = can.getContext('2d');
			ctx2.fillStyle = '#aabb11';
			ctx2.fillRect(70,80,120,210);
	can.addEventListener('click',function(e) {
			console.log(ctx2.getImageData(e.layerX,e.layerY,1,1));
			});
	
};
/*
//color pallete 만들기
function cpallette(colors){
	var table = '<table><tr>';
	for(c in colors){
		table += '<td id = "' + colors[c] + '" style = "background:#' + colors[c] + ';width:1em;border:1px solid #aaa">&nbsp;</td>';
		
		if(c%2 == 1){
			table += '</tr><tr>';
		}
	}
	table += '</tr><tr><td colspan = 2 id="pcurcolor" style="border:1px solid black;">&nbsp;</td>';
	table += '</tr></table>';

	return table;
}*/
