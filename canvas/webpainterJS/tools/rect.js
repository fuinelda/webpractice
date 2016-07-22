//사각형 그리기
function rect(jc){
	jc.canvas.addEventListener('mousemove',function(e) {
		var cx = (e.offsetX)?e.offsetX:0;
		var cy = (e.offsetY)?e.offsetY:0;
		
		if(jc.draw==true && jc.curtool == 'drawrect') {
			jc.ctx.beginPath();
			jc.ctx.clearRect(0, 0, jc.canvas.width, jc.canvas.height);
			jc.ctx.rect(jc.starts.x, jc.starts.y, e.offsetX-jc.starts.x, e.offsetY-jc.starts.y);
			jc.ctx.stroke();
			jc.ctx.closePath();
		}
	});
}

//사각형툴 추가
function insertRectBtn(toolbox, jc) {
	var bxbtn = document.createElement('div');
	bxbtn.className = 'tool';
	
	bxbtn.addEventListener('click', function(e) {
		if(jc.curtool != 'drawrect') {
			toolSelected(this);
			jc.curtool = 'drawrect';
						
		}
	});
	rect(jc);
	
	bxbtn.appendChild(document.createTextNode('Rect'));

	toolbox.appendChild(bxbtn);

	return jc;
}
