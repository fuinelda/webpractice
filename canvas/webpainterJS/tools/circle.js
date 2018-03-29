//원 그리기
function circle(jc){
	jc.canvas.addEventListener('mousemove',function(e) {
		var cx = (e.offsetX)?e.offsetX:0;
		var cy = (e.offsetY)?e.offsetY:0;
		
		if(jc.draw==true && jc.curtool == 'drawcircle') {
			jc.ctx.beginPath();
			jc.ctx.clearRect(0, 0, jc.canvas.width, jc.canvas.height);
			var r = Math.sqrt(Math.pow(cx-jc.starts.x,2) + Math.pow(cy-jc.starts.y,2));
			jc.ctx.arc(jc.starts.x, jc.starts.y, r, 0, 2*Math.PI);
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
		
		if(jc.draw==true && jc.curtool == 'drawcircle') {
			jc.ctx.beginPath();
			jc.ctx.clearRect(0, 0, jc.canvas.width, jc.canvas.height);
			var r = Math.sqrt(Math.pow(cx-jc.starts.x,2) + Math.pow(cy-jc.starts.y,2));
			jc.ctx.arc(jc.starts.x, jc.starts.y, r, 0, 2*Math.PI);
			jc.ctx.stroke();
			jc.ctx.closePath();
		}
	});
}

//원툴 추가
function insertCircleBtn(toolbox, jc) {
	var crbtn = document.createElement('div');
	crbtn.className = 'tool';
	
	crbtn.addEventListener('click', function(e) {
		if(jc.curtool != 'drawcircle') {
			toolSelected(this);
			jc.curtool = 'drawcircle';
						
		}
	});
	crbtn.addEventListener('touchstart', function(e) {
		if(jc.curtool != 'drawcircle') {
			toolSelected(this);
			jc.curtool = 'drawcircle';
						
		}
	});
	circle(jc);
	
	crbtn.appendChild(document.createTextNode('Circle'));

	toolbox.appendChild(crbtn);

	return jc;
}
