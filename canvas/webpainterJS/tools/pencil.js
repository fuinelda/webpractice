//자유선 그리기 - stroke를 이용함
function pencil(jc){
	jc.canvas.addEventListener('mousedown', function(e) {
		var cx = (e.offsetX)?e.offsetX:0;
		var cy = (e.offsetY)?e.offsetY:0;
			
		jc.ctx.beginPath();
		jc.draw = true;
		jc.ctx.strokeStyle = jc.color;
	});
	jc.canvas.addEventListener('mousemove',function(e) {
		var cx = (e.offsetX)?e.offsetX:0;
		var cy = (e.offsetY)?e.offsetY:0;
			
		document.getElementById('coords').innerHTML = 'X : ' + cx + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Y : ' + cy;
		if(jc.draw){
			jc.ctx.lineTo(cx,cy);
			jc.ctx.stroke();
		}
	});
	jc.canvas.addEventListener('mouseup',function(e) {
		jc.draw = false;
		cPush(jc.canvas);
	});
}
