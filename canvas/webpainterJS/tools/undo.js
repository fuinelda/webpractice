var cHistory = [];
var cStep = -1;

function cPush(ctx, canvas, curcanvas) {
	cStep++;
	if (cStep < cHistory.length) {cHistory.length = cStep; }
	var canPic = new Image();
	canPic.src = curcanvas.toDataURL();
	ctx.drawImage(canPic, 0, 0);
	cHistory.push(canvas.toDataURL());
	//console.log('push',cStep, cHistory);
}

function cUndo(ctx, canvas) {
	if(cStep > 0){
		cStep--;
		var canPic = new Image();
		canPic.src = cHistory[cStep];
		canPic.onload = function() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(canPic, 0, 0);
		}
	}else if (cStep == 0) {
		cStep--;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
	
	//console.log('undo',cStep, cHistory);
}

function cRedo(ctx, canvas) {
	if(cStep < cHistory.length-1){
		cStep++;
		var canPic = new Image();
		canPic.src = cHistory[cStep];
		canPic.onload = function() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(canPic, 0, 0);
		}
	}
	//console.log('redo',cStep, cHistory);
}

function insertURBtn(toolbox, jc) {
	var udbtn = document.createElement('div');
	var rdbtn = document.createElement('div');

	udbtn.addEventListener('click',function(e) {
		cUndo(jc.octx, jc.ocanvas);
	});

	rdbtn.addEventListener('click',function(e) {
		cRedo(jc.octx, jc.ocanvas);
	});

	udbtn.appendChild(document.createTextNode('Undo'));
	rdbtn.appendChild(document.createTextNode('Redo'));
	
	/*udbtn.addEventListener('click',function(e) {
		console.log('cHistory',cHistory);
		cUndo(ctx);
	});*/

	toolbox.appendChild(udbtn);
	toolbox.appendChild(rdbtn);
}
