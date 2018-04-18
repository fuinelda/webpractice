var Webgraffity = (function() {
	var layers = [];
	var layer_cnt = 1;
	var curlayer = 'layer0';

	var layerHistory = {'layer0':[]};
	var totalHistory = [];
	var cStep = -1;
	var layerSteps = {'layer0':-1};

	var selector = '';

	//툴박스에 툴 추가 및 제어 쯤
	function toolCtrl(jc) {
		var toolbox = document.getElementById('tools');
		var cp = cpallette(jc);
		toolbox.appendChild(cp);

		toolCommonEvents(jc);

		insertPCBtn(toolbox, jc);
		insertRectBtn(toolbox, jc);
		insertLnBtn(toolbox, jc);
		insertCircleBtn(toolbox, jc);
		insertBucketBtn(toolbox,jc);
		insertURBtn(toolbox,jc);
		insertLayerTool();
		lWidth(toolbox, jc);
	}


	//선택된 툴 표시
	function toolSelected(Element) {
		var toolbtns = document.getElementById('tools').getElementsByClassName('tool');
		for (i in toolbtns) {
			toolbtns[i].style = 'background:;';	
		}
		Element.style = 'background:#bbb';
	}

	//펜 사이즈
	function lWidth(Element, jc) {
		var lwcontainer = document.createElement('div');
		var lwtitle = document.createElement('p');
		var lwidth = document.createElement('input');
		var lwsize = document.createElement('input');

		lwcontainer.style = 'border:0px;';
		
		lwtitle.appendChild(document.createTextNode('SIZE'));
		
		lwidth.name = 'lwidth';
		lwidth.type = 'range';
		lwidth.style = 'width:4em;';
		lwidth.min = 0;
		lwidth.max = 100;
		lwidth.value = 5;

		lwsize.name = 'lwsize';
		lwsize.type = 'text';
		lwsize.style = 'width:4em;text-align:center;';
		lwsize.value = lwidth.value;

		lwidth.addEventListener('mousemove', function(e) {
			lwsize.value = lwidth.value;
			jc.strokewidth = lwsize.value;
		});
		lwidth.addEventListener('touchmove', function(e) {
			e.preventDefault();
			lwsize.value = lwidth.value;
			jc.strokewidth = lwsize.value;
		});
		lwsize.addEventListener('change', function(e) {
			lwidth.value = lwsize.value;
			jc.strokewidth = lwsize.value;
		});

		lwcontainer.appendChild(lwtitle);
		lwcontainer.appendChild(lwidth);
		lwcontainer.appendChild(document.createElement('br'));
		lwcontainer.appendChild(lwsize);
		Element.appendChild(lwcontainer);
	}

	//canvas tool 공통이벤트
	function toolCommonEvents(jc) {
		var startX, startY;

		jc.canvas.addEventListener('mousedown', function(e) {
			var curLayer = returnCanvas();
			var startX = (e.offsetX)?e.offsetX:0;
			var startY = (e.offsetY)?e.offsetY:0;
			jc.starts = {'x' : startX, 'y' : startY};

			curLayer.ctx.beginPath();
			jc.draw = true;
			curLayer.ctx.strokeStyle = jc.color;		
			curLayer.ctx.lineWidth = jc.strokewidth;
			curLayer.ctx.lineCap = jc.linecap;
			curLayer.ctx.lineJoin = jc.linejoin;
		});
		/* jc.canvas.addEventListener('mousemove',function(e) {
			var curLayer = returnCanvas();
			var cx = (e.offsetX)?e.offsetX:0;
			var cy = (e.offsetY)?e.offsetY:0;
				
			document.getElementById('coords').innerHTML = 'X : ' + cx + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Y : ' + cy;
		}); */
		jc.canvas.addEventListener('mouseup',function(e) {
			var curLayer = returnCanvas();
			curLayer.ctx.stroke();
			jc.draw = false;
			jc.ctx.clearRect(0, 0, jc.canvas.width, jc.canvas.height);
			// jc.ctx.stroke();
		});
		//터치 이벤트
		jc.canvas.addEventListener('touchstart', function(e) {
			var curLayer = returnCanvas();
			var touches = e.changedTouches;
			var targetRect = e.target.getBoundingClientRect();
			var startX = (touches[0].pageX && touches[0].pageX - (targetRect.left + window.scrollX) > 0)?touches[0].pageX - (targetRect.left + window.scrollX):0;
			var startY = (touches[0].pageY && touches[0].pageY - (targetRect.top + window.scrollY) > 0)?touches[0].pageY - (targetRect.top + window.scrollY):0;
			jc.starts = {'x' : startX, 'y' : startY};

			curLayer.ctx.beginPath();
			jc.draw = true;
			curLayer.ctx.strokeStyle = jc.color;		
			curLayer.ctx.lineWidth = jc.strokewidth;
			curLayer.ctx.lineCap = jc.linecap;
			curLayer.ctx.lineJoin = jc.linejoin;
		});
		jc.canvas.addEventListener('touchend',function(e) {
			var curLayer = returnCanvas();
			curLayer.ctx.stroke();
			jc.draw = false;
			jc.ctx.clearRect(0, 0, jc.canvas.width, jc.canvas.height);
		});
	}

	function returnCanvas() {
		var selectedLayer = layers.filter(function(el) { return el.name == curlayer})[0];
		return selectedLayer;
	}

	function saveImage() {
		var canvas = document.querySelector(selector);
		var ctx = canvas.getContext('2d');
		for(i = 0; i < layers.length; i++) {
			var canPic = new Image();
			canPic.src = layers[i].canvas.toDataURL();
			ctx.drawImage(canPic, 0, 0);
		}
	}

	function bucket(jc){
		jc.canvas.addEventListener('click', function(e){
			var cx = (e.offsetX)?e.offsetX:0;
			var cy = (e.offsetY)?e.offsetY:0;
			
			if (jc.curtool == 'paintbucket') {
				var curLayer = returnCanvas();
				var imgdata = curLayer.ctx.getImageData(0, 0, curLayer.canvas.width, curLayer.canvas.height);
				var data = imgdata.data;
				var i = (cy * curLayer.canvas.width + cx) * 4;
				var rgba = getRgba(data, cx, cy, curLayer.canvas.width);
				var paintcolor = colorCodetoRGBA(jc.color);
				// console.log(paintcolor,rgba);
				if(rgba[0] == paintcolor[0] && rgba[1] == paintcolor[1] && rgba[2] == paintcolor[2] && rgba[3] == paintcolor[3]) {return;}
				imgdata.data = floodFill(jc, cx, cy, data, rgba, paintcolor);
				
				curLayer.ctx.putImageData(imgdata,0 ,0 );
				
				cPush(curLayer.canvas);
			}
			
		});
		/* jc.canvas.addEventListener('touchstart', function(e){
			var touches = e.changedTouches;
			var targetRect = e.target.getBoundingClientRect();
			var cx = (touches[0].pageX && touches[0].pageX - (targetRect.left + window.scrollX) > 0)?touches[0].pageX - (targetRect.left + window.scrollX):0;
			var cy = (touches[0].pageY && touches[0].pageY - (targetRect.top + window.scrollY) > 0)?touches[0].pageY - (targetRect.top + window.scrollY):0;
			
			if (jc.curtool == 'paintbucket') {
				var imgdata = jc.octx.getImageData(0, 0, jc.ocanvas.width, jc.ocanvas.height);
				var data = imgdata.data;
				var i = (cy * jc.ocanvas.width + cx) * 4;
				var rgba = getRgba(data, cx, cy, jc.ocanvas.width);
				var paintcolor = colorCodetoRGBA(jc.color);
				// console.log(paintcolor,rgba);
				if(rgba[0] == paintcolor[0] && rgba[1] == paintcolor[1] && rgba[2] == paintcolor[2] && rgba[3] == paintcolor[3]) {return;}
				imgdata.data = floodFill(jc, cx, cy, data, rgba, paintcolor);
				
				jc.octx.putImageData(imgdata,0 ,0 );
				
				cPush(jc.octx, jc.ocanvas, jc.canvas);
			}
			
		}); */
	}
	
	//현 위치의 rgba값을 받아옴
	function getRgba(data, cx, cy, width) {
		var i = (cy * width + cx) * 4;
		return [data[i], data[i+1], data[i+2], data[i+3]];
	}
	
	/***컬러코드를 rgba값으로 변형 후 리턴. 임시로 알파값 부여 (255)*/
	function colorCodetoRGBA(color) {
		return [parseInt(color.substr(1,2), 16), parseInt(color.substr(3,2), 16), parseInt(color.substr(5,2), 16), 255];
	}
	
	function fillColor(data, rgba, paintcolor, i) {
		data[i] = paintcolor[0];
		data[i+1] = paintcolor[1];
		data[i+2] = paintcolor[2];
		data[i+3] = paintcolor[3] != undefined ? paintcolor[3] : 255;
	}
	
	/***색 채우는 방식 - flood Fill 방식이라 함*/
	function floodFill(jc, cx, cy, data, rgba, paintcolor) {
		var curLayer = returnCanvas();
		var newpos, x, y, pixelpos;
		var reachleft = false;
		var reachright = false;
		var pixelstack = [[cx, cy]];
		
		while(pixelstack.length){		
			newpos = pixelstack.pop();
			x = newpos[0];
			y = newpos[1];
			
			pixelpos = (y * curLayer.canvas.width + x) * 4;
			
			while(y >= 0 && matchcolors(data, pixelpos, rgba, paintcolor)) {
				y -= 1;
				pixelpos -= curLayer.canvas.width * 4;
			}
	
			pixelpos += curLayer.canvas.width * 4;
			//y += 1;
			reachleft = false;
			reachright = false;
		
			while (y <= curLayer.canvas.height && matchcolors(data, pixelpos, rgba, paintcolor))	{
				y += 1;
				
				fillColor(data, rgba, paintcolor, pixelpos);
				
				if(x > 0) {
					if(matchcolors(data, pixelpos - 4, rgba, paintcolor)) {
						//console.log(x,y,rgba);
						if(!reachleft) {
							pixelstack.push([x - 1, y]);
							reachleft = true;
						}
					} else if (reachleft) {
						reachleft = false;
					}
				}
				if(x < curLayer.canvas.width - 1) {
					if(matchcolors(data, pixelpos + 4, rgba, paintcolor)) {
						if(!reachright) {
							pixelstack.push([x + 1, y]);
							reachright = true;
						}
					} else if (reachright) {
						reachright = false;
					}
				}
				
				pixelpos += curLayer.canvas.width * 4;
			}
		}
		return data;
	}
	
	function matchcolors(data, pixelpos, rgba, color) {
		var currgba = [data[pixelpos], data[pixelpos+1], data[pixelpos+2], data[pixelpos+3]];
		if (currgba[0] != rgba[0] || currgba[1] != rgba[1] || currgba[2] != rgba[2] || currgba[3] != rgba[3]) return false;
		if (currgba[0] == rgba[0] && currgba[1] == rgba[1] && currgba[2] == rgba[2] && currgba[3] == rgba[3]) return true;
		//else return false;
		if (currgba[0] == color[0] && currgba[1] == color[1] && currgba[2] == color[2] && currgba[3] == color[3]) return false;
		return true;
	}
	//페인트통 추가
	function insertBucketBtn(toolbox, jc) {
		var bkbtn = document.createElement('div');
		bkbtn.className = 'tool';
		
		bkbtn.addEventListener('click', function(e) {
			if(jc.curtool != 'paintbucket') {
				toolSelected(this);
				jc.curtool = 'paintbucket';				
			}
		});
		bkbtn.addEventListener('touchstart', function(e) {
			if(jc.curtool != 'paintbucket') {
				toolSelected(this);
				jc.curtool = 'paintbucket';				
			}
		});
		bucket(jc);
		
		bkbtn.appendChild(document.createTextNode('Bucket'));
	
		toolbox.appendChild(bkbtn);
	
		return jc;
	}
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
		jc.canvas.addEventListener('mouseup',function(e) {
			e.preventDefault();
			var cx = (e.offsetX)?e.offsetX:0;
			var cy = (e.offsetY)?e.offsetY:0;

			if(jc.curtool == 'drawcircle') {
				var curLayer = returnCanvas();
				curLayer.ctx.beginPath();
				var r = Math.sqrt(Math.pow(cx-jc.starts.x,2) + Math.pow(cy-jc.starts.y,2));
				curLayer.ctx.arc(jc.starts.x, jc.starts.y, r, 0, 2*Math.PI);
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
			
			if(jc.draw==true && jc.curtool == 'drawcircle') {
				jc.ctx.beginPath();
				jc.ctx.clearRect(0, 0, jc.canvas.width, jc.canvas.height);
				var r = Math.sqrt(Math.pow(cx-jc.starts.x,2) + Math.pow(cy-jc.starts.y,2));
				jc.ctx.arc(jc.starts.x, jc.starts.y, r, 0, 2*Math.PI);
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

			if(jc.curtool == 'drawcircle') {
				var curLayer = returnCanvas();
				curLayer.ctx.beginPath();
				var r = Math.sqrt(Math.pow(cx-jc.starts.x,2) + Math.pow(cy-jc.starts.y,2));
				curLayer.ctx.arc(jc.starts.x, jc.starts.y, r, 0, 2*Math.PI);
				curLayer.ctx.stroke();
				curLayer.ctx.closePath();
				cPush(curLayer.canvas);
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
		//layer 추가
	function addLayer() {
		var canvas = document.querySelector(selector);
		var curcanvas = document.createElement('canvas');
		curcanvas.id = 'layer' + layer_cnt;
		curcanvas.width = canvas.width;
		curcanvas.height = canvas.height;
		curcanvas.style = 'border:1px solid gray;position:absolute;top:0px;left:0px;';
		canvas.parentNode.insertBefore(curcanvas,document.getElementById('draw'));
		var curctx = curcanvas.getContext('2d');
		layers.push({name: 'layer' + layer_cnt, canvas: curcanvas, ctx: curctx});
		layerSteps['layer' + layer_cnt] = -1;
		layerHistory['layer' + layer_cnt] = [];
		layer_cnt++;
	}

	function insertLayerTool() {
		var layerTool = document.createElement('div');
		layerTool.className = 'layerTool';
		layerTool.innerHTML = '';

		var label = document.createElement('div');
		label.appendChild(document.createTextNode('레이어'));

		var addbtn = document.createElement('div');
		addbtn.appendChild(document.createTextNode('+'));
		
		layerTool.appendChild(label);
		layerTool.appendChild(addbtn);
		layerTool.appendChild(drawLayers());
		
		addbtn.addEventListener('click', function(e) {
			var layerInfo = addLayer();
			var addedLayer = drawLayers();
			
			layerTool.appendChild(addedLayer);
		});
		document.getElementById('under_tools').appendChild(layerTool);
	}

	function drawLayers() {
		for(var i = 0; i < layers.length; i++) {
			var addedLayer = document.createElement('span');
			var addedImg = document.createElement('img');
			addedImg.src = layers[i].canvas.toDataURL();
			if(curlayer == layers[i].name) addedImg.style.border = '2px solid black';
			else addedImg.style.border = '1px solid black';
			addedImg.style.height = '50px';
			addedImg.style.margin = '2px';
			addedImg.setAttribute('layerName', layers[i].name);
			addedLayer.className = 'layer-image';
			addedLayer.appendChild(addedImg);
			addedLayer.addEventListener('click', selectedLayer);
		}
		return addedLayer;
	}

	function selectedLayer(e) {
		var layerSpans = document.querySelectorAll('.layer-image img');
		for(var i=0;i<layerSpans.length;i++) {
			layerSpans[i].style.borderWidth = '1px';
		}
		e.target.style.borderWidth = '2px';
		curlayer = e.target.getAttribute('layername');
	}
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

	//color pallete 만들기
	function cpallette(jc){
		var table = document.createElement('table');
		var tr;
		var td;
		var empty;
		for(c in jc.colors){
			if(c%2 == 0){
				tr = document.createElement('tr');
			}

			td = document.createElement('td');
			td.style = 'background:#' + jc.colors[c] + ';';
			td.id = jc.colors[c];
			empty = document.createTextNode('');
			td.addEventListener('click',function(e) {
				jc.color = '#' + e.target.id;
				document.getElementById('pcurcolor').style.background = jc.color;
				document.getElementsByName('colorPickInput')[0].value = jc.color;
				//jc.color = color;
			});
			td.addEventListener('touchstart',function(e) {
				jc.color = '#' + e.target.id;
				document.getElementById('pcurcolor').style.background = jc.color;
				document.getElementsByName('colorPickInput')[0].value = jc.color;
			});
			td.appendChild(empty);
			tr.appendChild(td);
					
			if(c%2 == 1){
				table.appendChild(tr);
			}
		}

		tr = document.createElement('tr');
		td = document.createElement('td');
		td.style = 'border:1px solid black;';
		td.id = 'pcurcolor';
		td.colSpan = 2;
		empty = document.createTextNode('');
		td.appendChild(empty);
		tr.appendChild(td);
		table.appendChild(tr);
	//colorPicker
		tr = document.createElement('tr');
		td = document.createElement('td');
		td.colSpan = 2;
		var cpickinput = document.createElement('input');
		cpickinput.name = 'colorPickInput';
		cpickinput.type = 'color';

		cpickinput.oninput = function(e) {
			document.getElementById('pcurcolor').style.background = cpickinput.value;
			jc.color = cpickinput.value;
		}

		td.appendChild(cpickinput);
		tr.appendChild(td);
		table.appendChild(tr);

		return table;
	}

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

	//사각형 그리기
	function rect(jc){
		jc.canvas.addEventListener('mousemove',function(e) {
			var cx = (e.offsetX)?e.offsetX:0;
			var cy = (e.offsetY)?e.offsetY:0;
			
			if(jc.draw==true && jc.curtool == 'drawrect') {
				jc.ctx.beginPath();
				jc.ctx.clearRect(0, 0, jc.canvas.width, jc.canvas.height);
				jc.ctx.rect(jc.starts.x, jc.starts.y, cx-jc.starts.x, cy-jc.starts.y);
				jc.ctx.stroke();
				jc.ctx.closePath();
			}
		});
		jc.canvas.addEventListener('mouseup',function(e) {
			e.preventDefault();
			var cx = (e.offsetX)?e.offsetX:0;
			var cy = (e.offsetY)?e.offsetY:0;

			if(jc.curtool == 'drawrect') {
				var curLayer = returnCanvas();
				curLayer.ctx.rect(jc.starts.x, jc.starts.y, cx-jc.starts.x, cy-jc.starts.y);
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
			if(jc.draw==true && jc.curtool == 'drawrect') {
				jc.ctx.beginPath();
				jc.ctx.clearRect(0, 0, jc.canvas.width, jc.canvas.height);
				jc.ctx.rect(jc.starts.x, jc.starts.y, cx-jc.starts.x, cy-jc.starts.y);
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

			if(jc.curtool == 'drawrect') {
				var curLayer = returnCanvas();
				curLayer.ctx.rect(jc.starts.x, jc.starts.y, cx-jc.starts.x, cy-jc.starts.y);
				curLayer.ctx.stroke();
				curLayer.ctx.closePath();
				cPush(curLayer.canvas);
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
	return {
		setPainter : function (text) {
			selector = text;
			var canvas = document.querySelector(selector);
			var ctx = canvas.getContext('2d');
	
			var curtool;
			var drawcanvas = document.createElement('canvas');
			drawcanvas.id = 'draw';
			drawcanvas.width = canvas.width;
			drawcanvas.height = canvas.height;
			drawcanvas.style = 'border:1px solid gray;position:absolute;top:0px;left:0px;z-index:50000;';
			canvas.parentNode.insertBefore(drawcanvas,document.getElementById('tools'));
			var drawctx = drawcanvas.getContext('2d');
			var draw = false;
			var color = '#000000';
			var strokewidth = 3;
			var linecap = 'round';
			var linejoin = 'round';
			
			var curcanvas = document.createElement('canvas');
			curcanvas.id = 'layer0';
			curcanvas.width = canvas.width;
			curcanvas.height = canvas.height;
			curcanvas.style = 'border:1px solid gray;position:absolute;top:0px;left:0px;';
			canvas.parentNode.insertBefore(curcanvas,document.getElementById('draw'));
			var curctx = curcanvas.getContext('2d');
			layers.push({name: 'layer0', canvas: curcanvas, ctx: curctx});
			
			var colors = ['000000','0000ff','ffff00','ff0000','606060','ffffff'];
			var jsonCanvas = {'ocanvas' : canvas,
					'octx' : ctx,
					'canvas': drawcanvas, 
					'ctx' : drawctx,
					'draw' : draw,
					'color' : color,
					'colors' : colors,
					'curtool' : curtool,
					'strokewidth' : strokewidth,
					'linecap' : linecap,
					'linejoin' : linejoin,
					'starts' : {'x' : 0 , 'y' : 0}
				};
	
			toolCtrl(jsonCanvas);
			
			document.getElementById('pcurcolor').style.background = color;
		},
		getImageText : function() {
			var canvas = document.querySelector(selector);
			var ctx = canvas.getContext('2d');
			for(i = 0; i < layers.length; i++) {
				var canPic = new Image();
				canPic.src = layers[i].canvas.toDataURL();
				ctx.drawImage(canPic, 0, 0);
			}
			return canvas.toDataURL();
		}
	}
})();