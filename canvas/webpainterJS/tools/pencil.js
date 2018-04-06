//자유선 그리기 - stroke를 이용함
function pencil(jc){
	jc.canvas.addEventListener('mousedown', function(e) {
		var curLayer = returnCanvas();
		curLayer.ctx.moveTo(jc.starts.x,jc.starts.y);
		
	});
	jc.canvas.addEventListener('mousemove',function(e) {
		var curLayer = returnCanvas();
		var cx = (e.offsetX)?e.offsetX:0;
		var cy = (e.offsetY)?e.offsetY:0;
			
		if(jc.draw && jc.curtool == 'pencil'){
			curLayer.ctx.lineTo(cx,cy);
			curLayer.ctx.stroke();
		}
	});
	jc.canvas.addEventListener('mouseup',function(e) {
		e.preventDefault();
		var curLayer = returnCanvas();
		if(jc.curtool == 'pencil') cPush(curLayer.canvas);
	});
	jc.canvas.addEventListener('touchstart', function(e) {
		var curLayer = returnCanvas();
		curLayer.ctx.moveTo(jc.starts.x,jc.starts.y);
	});
	jc.canvas.addEventListener('touchmove',function(e) {
		var curLayer = returnCanvas();
		e.preventDefault();
		var touches = e.changedTouches;
		var targetRect = e.target.getBoundingClientRect();
		var cx = (touches[0].pageX && touches[0].pageX - (targetRect.left + window.scrollX) > 0)?touches[0].pageX - (targetRect.left + window.scrollX):0;
		var cy = (touches[0].pageY && touches[0].pageY - (targetRect.top + window.scrollY) > 0)?touches[0].pageY - (targetRect.top + window.scrollY):0;
		if(jc.draw && jc.curtool == 'pencil'){
			curLayer.ctx.lineTo(cx,cy);
			curLayer.ctx.stroke();
		}
	});
	jc.canvas.addEventListener('touchend',function(e) {
		e.preventDefault();
		var curLayer = returnCanvas();
		if(jc.curtool == 'pencil') cPush(curLayer.canvas);
	});
}

//연필툴 추가
function insertPCBtn(toolbox, jc) {
	var pcbtn = document.createElement('div');
	pcbtn.className = 'tool';
	
	pcbtn.addEventListener('click', function(e) {
		if(jc.curtool != 'pencil') {
			toolSelected(this);
			jc.curtool = 'pencil';
		}
	});

	pcbtn.addEventListener('touchstart', function(e) {
		if(jc.curtool != 'pencil') {
			toolSelected(this);
			jc.curtool = 'pencil';
		}
	});

	pencil(jc);

	pcbtn.appendChild(document.createTextNode('P'));

	toolbox.appendChild(pcbtn);

	return jc;
}
