//일직선 그리기
function line(jc){
	var startX, startY;

	jc.canvas.addEventListener('mousemove',function(e) {
		e.preventDefault();
		var cx = (e.offsetX)?e.offsetX:0;
		var cy = (e.offsetY)?e.offsetY:0;
		
		if(jc.draw==true && jc.curtool == 'drawline') {
			jc.ctx.lineWidth = 0;
			jc.ctx.beginPath();
			jc.ctx.moveTo(jc.starts.x, jc.starts.y);
			jc.ctx.clearRect(0, 0, jc.canvas.width, jc.canvas.height);
			jc.ctx.lineTo(cx, cy);
			jc.ctx.stroke();
			jc.ctx.closePath();
		}
	});
	jc.canvas.addEventListener('mouseup',function(e) {
		e.preventDefault();
		var cx = (e.offsetX)?e.offsetX:0;
		var cy = (e.offsetY)?e.offsetY:0;

		if(jc.curtool == 'drawline') {
			var curLayer = returnCanvas();
			curLayer.ctx.moveTo(jc.starts.x, jc.starts.y);
			curLayer.ctx.lineTo(cx, cy);
			curLayer.ctx.stroke();
			curLayer.ctx.closePath();
			cPush(curLayer.canvas);
		}
	});
	jc.canvas.addEventListener('touchmove',function(e) {
		e.preventDefault();
		var touches = e.changedTouches;
		var targetRect = e.target.getBoundingClientRect();
		var cx = (touches[0].pageX && touches[0].pageX - (targetRect.left + window.scrollX) > 0)?touches[0].pageX - (targetRect.left + window.scrollX):0;
		var cy = (touches[0].pageY && touches[0].pageY - (targetRect.top + window.scrollY) > 0)?touches[0].pageY - (targetRect.top + window.scrollY):0;
		
		if(jc.draw==true && jc.curtool == 'drawline') {
			jc.ctx.beginPath();
			jc.ctx.moveTo(jc.starts.x, jc.starts.y);
			jc.ctx.clearRect(0, 0, jc.canvas.width, jc.canvas.height);
			jc.ctx.lineTo(cx, cy);
			jc.ctx.stroke();
			jc.ctx.closePath();
		}
	});
	jc.canvas.addEventListener('touchend',function(e) {
		e.preventDefault();
		var touches = e.changedTouches;
		var targetRect = e.target.getBoundingClientRect();
		var cx = (touches[0].pageX && touches[0].pageX - (targetRect.left + window.scrollX) > 0)?touches[0].pageX - (targetRect.left + window.scrollX):0;
		var cy = (touches[0].pageY && touches[0].pageY - (targetRect.top + window.scrollY) > 0)?touches[0].pageY - (targetRect.top + window.scrollY):0;

		if(jc.curtool == 'drawline') {
			var curLayer = returnCanvas();
			curLayer.ctx.moveTo(jc.starts.x, jc.starts.y);
			curLayer.ctx.lineTo(cx, cy);
			curLayer.ctx.stroke();
			curLayer.ctx.closePath();
			cPush(curLayer.canvas);
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
