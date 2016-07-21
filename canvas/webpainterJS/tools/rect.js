//사각형 그리
function rect(jc){
	var startX, startY;
	jc.canvas.addEventListener('mousedown', function(e) {
		jc.draw = true;
		startX = (e.offsetX)?e.offsetX:0;
		startY = (e.offsetY)?e.offsetY:0;
			
		jc.ctx.strokeStyle = jc.color;
	});

	jc.canvas.removeEventListener('mousemove', function(e) {});
	jc.canvas.addEventListener('mousemove',function(e) {
		var cx = (e.offsetX)?e.offsetX:0;
		var cy = (e.offsetY)?e.offsetY:0;
		
		if(jc.draw==true && jc.curtool == 'drawrect') {
			jc.ctx.beginPath();
			jc.ctx.clearRect(0, 0, jc.canvas.width, jc.canvas.height);
			jc.ctx.rect(startX, startY, e.offsetX-startX, e.offsetY-startY);
			jc.ctx.stroke();
			jc.ctx.closePath();
		}
			
		document.getElementById('coords').innerHTML = 'X : ' + cx + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Y : ' + cy;
	});
	jc.canvas.addEventListener('mouseup',function(e) {
		jc.draw = false;
		if (jc.curtool == 'drawrect') {
			//jc.ctx.rect(startX, startY, e.offsetX-startX, e.offsetY-startY);
			jc.ctx.stroke();
			cPush(jc.octx, jc.ocanvas, jc.canvas);
			jc.ctx.clearRect(0, 0, jc.canvas.width, jc.canvas.height);
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
			rect(jc);			
		}
	});

	bxbtn.appendChild(document.createTextNode('Rect'));

	toolbox.appendChild(bxbtn);

	return jc;
}
