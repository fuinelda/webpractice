var cHistory = [];
var cStep = -1;

function cPush(canvas) {
	cStep++;
	if (cStep < cHistory.length) {cHistory.length = cStep; }
	cHistory.push(canvas.toDataURL());
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
}

function cRedo(ctx, canvas) {
	if(cStep < cHistory.length - 1){
		cStep++;
		var canPic = new Image();
		canPic.src = cHistory[cStep];
		canPic.onload = function() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(canPic, 0, 0);
		}
	}
}

function insertURBtn(toolbox, jc) {
	var udbtn = document.createElement('div');
	var rdbtn = document.createElement('div');

	udbtn.addEventListener('click',function(e) {
		cUndo(jc.ctx, jc.canvas);
	});

	rdbtn.addEventListener('click',function(e) {
		cRedo(jc.ctx, jc.canvas);
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