//자유선 그리기 - stroke를 이용함
function pencil(jc){

	jc.canvas.addEventListener('mousedown', function(e) {
		var cx = (e.offsetX)?e.offsetX:0;
		var cy = (e.offsetY)?e.offsetY:0;
			
		jc.ctx.beginPath();
		if (jc.curtool == 'pencil') jc.draw = true;
		jc.ctx.strokeStyle = jc.color;
	});
	jc.canvas.addEventListener('mousemove',function(e) {
		var cx = (e.offsetX)?e.offsetX:0;
		var cy = (e.offsetY)?e.offsetY:0;
			
		document.getElementById('coords').innerHTML = 'X : ' + cx + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Y : ' + cy;
		if(jc.draw && jc.curtool == 'pencil'){
			jc.ctx.lineTo(cx,cy);
			jc.ctx.stroke();
		}
	});
	jc.canvas.addEventListener('mouseup',function(e) {
		if (jc.curtool == 'pencil') {
			jc.draw = false;
			cPush(jc.octx, jc.ocanvas, jc.canvas);
			jc.ctx.clearRect(0, 0, jc.canvas.width, jc.canvas.height);
		}
	});

}

//연필툴 추가
function insertPCBtn(toolbox, jc) {
	var pcbtn = document.createElement('div');
	pcbtn.className = 'tool';
	
	pcbtn.addEventListener('click', function(e) {
		if(jc.curtool != 'pencil') {
			toolSelected(this);
			jc.curtoolfunc = pencil;
			jc.curtool = 'pencil';
			pencil(jc);
		}
	});

	pcbtn.appendChild(document.createTextNode('P'));

	toolbox.appendChild(pcbtn);

	return jc;
}
