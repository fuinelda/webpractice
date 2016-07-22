//일직선 그리기
function line(jc){
	var startX, startY;

	jc.canvas.addEventListener('mousemove',function(e) {
		var cx = (e.offsetX)?e.offsetX:0;
		var cy = (e.offsetY)?e.offsetY:0;
		
		if(jc.draw==true && jc.curtool == 'drawline') {
			jc.ctx.beginPath();
			jc.ctx.moveTo(jc.starts.x, jc.starts.y);
			jc.ctx.clearRect(0, 0, jc.canvas.width, jc.canvas.height);
			jc.ctx.lineTo(cx, cy);
			jc.ctx.stroke();
			jc.ctx.closePath();
		}
	});
}

//일직선 추가
function insertLnBtn(toolbox, jc) {
	var lnbtn = document.createElement('div');
	lnbtn.className = 'tool';
	
	lnbtn.addEventListener('click', function(e) {
		if(jc.curtool != 'drawline') {
			toolSelected(this);
			jc.curtool = 'drawline';	
		}
	});
	line(jc);
	
	lnbtn.appendChild(document.createTextNode('Line'));

	toolbox.appendChild(lnbtn);

	return jc;
}
