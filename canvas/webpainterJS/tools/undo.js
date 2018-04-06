var layerHistory = {'layer0':[]};
var totalHistory = [];
var cStep = -1;
var layerSteps = {'layer0':-1};

function cPush(canvas) {
	cStep++;
	layerSteps[curlayer]++;
	if (cStep < totalHistory.length) {totalHistory.length = cStep; }
	if (layerSteps[curlayer] < layerHistory[curlayer].length) {layerHistory[curlayer].length = layerSteps[curlayer]; }
	totalHistory.push({target: curlayer, step: layerSteps[curlayer]});
	layerHistory[curlayer].push(canvas.toDataURL());
	if(document.querySelector('img[layerName=' + curlayer) != null) {
		document.querySelector('img[layerName=' + curlayer).src = canvas.toDataURL();
	}
	
	/* var canPic = new Image();
	canPic.src = curcanvas.toDataURL();
	canPic.onload = function() {
		cHistory.push({target: curlayer, data: canvas.toDataURL()});
	} */
	//console.log('push',cStep, cHistory);
}

function cUndo() {
	var curHistory = totalHistory[cStep];
	if(curHistory != undefined){
		var curLayer = layers.filter(function(el) { return el.name == curHistory.target})[0];
		curLayer.ctx.clearRect(0, 0, curLayer.canvas.width, curLayer.canvas.height);
		if(document.querySelector('img[layerName=' + curHistory.target) != null) {
			document.querySelector('img[layerName=' + curHistory.target).src = curLayer.canvas.toDataURL();
		}

		cStep--;
		layerSteps[curHistory.target]--;

		var undoHistory = totalHistory[cStep];
		if(undoHistory != undefined) {
			if(curHistory.target != undoHistory.target){
				var curPic = new Image();
				curPic.src = layerHistory[curHistory.target][layerSteps[curHistory.target]];
				curPic.onload = function() {
					curLayer.ctx.drawImage(curPic, 0, 0);
					if(document.querySelector('img[layerName=' + curHistory.target) != null) {
						document.querySelector('img[layerName=' + curHistory.target).src = curPic.src;
					}
				}
			}
			if(layerSteps[undoHistory.target] >= 0){
				var undoLayer = layers.filter(function(el) { return el.name == undoHistory.target})[0];
				var canPic = new Image();
				canPic.src = layerHistory[undoHistory.target][layerSteps[undoHistory.target]];
				canPic.onload = function() {
					undoLayer.ctx.clearRect(0, 0, undoLayer.canvas.width, undoLayer.canvas.height);
					undoLayer.ctx.drawImage(canPic, 0, 0);
					if(document.querySelector('img[layerName=' + undoHistory.target) != null) {
						document.querySelector('img[layerName=' + undoHistory.target).src = canPic.src;
					}
				}
			}
		}
	}
}

function cRedo() {
	var curHistory = totalHistory[cStep];

	if(cStep < totalHistory.length-1){
		if(curHistory != undefined) {
			var curLayer = layers.filter(function(el) { return el.name == curHistory.target})[0];
			curLayer.ctx.clearRect(0, 0, curLayer.canvas.width, curLayer.canvas.height);
			if(document.querySelector('img[layerName=' + curHistory.target) != null) {
				document.querySelector('img[layerName=' + curHistory.target).src = curLayer.canvas.toDataURL();
			}
		}
		cStep++;

		var redoHistory = totalHistory[cStep];
		if(redoHistory != undefined) {
			if(layerSteps[redoHistory.target] < layerHistory[redoHistory.target].length - 1) {
				layerSteps[redoHistory.target]++;

				if(curHistory != undefined && curHistory.target != redoHistory.target){
					var curPic = new Image();
					curPic.src = layerHistory[curHistory.target][layerSteps[curHistory.target]];
					curPic.onload = function() {
						curLayer.ctx.drawImage(curPic, 0, 0);
						if(document.querySelector('img[layerName=' + curHistory.target) != null) {
							document.querySelector('img[layerName=' + curHistory.target).src = curPic.src;
						}
					}
				}
				if(layerSteps[redoHistory.target] >= 0){
					var redoLayer = layers.filter(function(el) { return el.name == redoHistory.target})[0];
					var canPic = new Image();
					canPic.src = layerHistory[redoHistory.target][layerSteps[redoHistory.target]];
					canPic.onload = function() {
						redoLayer.ctx.clearRect(0, 0, redoLayer.canvas.width, redoLayer.canvas.height);
						redoLayer.ctx.drawImage(canPic, 0, 0);
						if(document.querySelector('img[layerName=' + redoHistory.target) != null) {
							document.querySelector('img[layerName=' + redoHistory.target).src = canPic.src;
						}
					}
				}
			}
		}
	}
}

function insertURBtn(toolbox, jc) {
	var udbtn = document.createElement('div');
	var rdbtn = document.createElement('div');

	udbtn.addEventListener('click',function(e) {
		e.preventDefault();cUndo();
	});

	rdbtn.addEventListener('click',function(e) {
		e.preventDefault();cRedo();
	});

	udbtn.appendChild(document.createTextNode('Undo'));
	rdbtn.appendChild(document.createTextNode('Redo'));

	toolbox.appendChild(udbtn);
	toolbox.appendChild(rdbtn);
}
