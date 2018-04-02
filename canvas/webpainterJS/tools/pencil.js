//자유선 그리기 - stroke를 이용함
function pencil(jc){
	// jc = layerToJc(jc);
	jc.canvas.addEventListener('mousedown', function(e) {
		jc.ctx.moveTo(jc.starts.x,jc.starts.y);
		
	});
	jc.canvas.addEventListener('mousemove',function(e) {
		var cx = (e.offsetX)?e.offsetX:0;
		var cy = (e.offsetY)?e.offsetY:0;
			
		if(jc.draw && jc.curtool == 'pencil'){
			jc.ctx.lineTo(cx,cy);
			jc.ctx.stroke();
		}
	});
	jc.canvas.addEventListener('touchstart', function(e) {
		jc.ctx.moveTo(jc.starts.x,jc.starts.y);
	});
	jc.canvas.addEventListener('touchmove',function(e) {
		e.preventDefault();
		var touches = e.changedTouches;
		var targetRect = e.target.getBoundingClientRect();
		var cx = (touches[0].pageX && touches[0].pageX - (targetRect.left + window.scrollX) > 0)?touches[0].pageX - (targetRect.left + window.scrollX):0;
		var cy = (touches[0].pageY && touches[0].pageY - (targetRect.top + window.scrollY) > 0)?touches[0].pageY - (targetRect.top + window.scrollY):0;
		if(jc.draw && jc.curtool == 'pencil'){
			jc.ctx.lineTo(cx,cy);
			jc.ctx.stroke();
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
