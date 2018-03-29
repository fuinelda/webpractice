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
	jc.canvas.addEventListener('touchmove',function(e) {
		e.preventDefault();
		var touches = e.changedTouches;
		var targetRect = e.target.getBoundingClientRect();
		var cx = (touches[0].pageX && touches[0].pageX - (targetRect.left + window.scrollX) > 0)?touches[0].pageX - (targetRect.left + window.scrollX):0;
		var cy = (touches[0].pageY && touches[0].pageY - (targetRect.top + window.scrollY) > 0)?touches[0].pageY - (targetRect.top + window.scrollY):0;
		if(jc.draw==true && jc.curtool == 'drawrect') {
			jc.ctx.beginPath();
			jc.ctx.clearRect(0, 0, jc.canvas.width, jc.canvas.height);
			jc.ctx.rect(jc.starts.x, jc.starts.y, cx-jc.starts.x, cy-jc.starts.y);
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
	bxbtn.addEventListener('touchstart', function(e) {
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
