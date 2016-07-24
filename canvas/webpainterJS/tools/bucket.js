//페인트 채우기
function bucket(jc){
	jc.canvas.addEventListener('click', function(e){
		var cx = (e.offsetX)?e.offsetX:0;
		var cy = (e.offsetY)?e.offsetY:0;
		
		if (jc.curtool == 'paintbucket') {
			var imgdata = jc.octx.getImageData(0, 0, jc.ocanvas.width, jc.ocanvas.height);
			var data = imgdata.data;
			var i = (cy * jc.ocanvas.width + cx) * 4;
			var rgba = getRgba(data, cx, cy, jc.ocanvas.width);
			var paintcolor = colorCodetoRGBA(jc.color);
			//console.log(paintcolor,data);
			if(rgba[0] == paintcolor[0] && rgba[1] == paintcolor[1] && rgba[2] == paintcolor[2]) {return;}
			imgdata.data = floodFill(jc, cx, cy, data, rgba, paintcolor);
			
			jc.octx.putImageData(imgdata,0 ,0 );
			
			cPush(jc.octx, jc.ocanvas, jc.canvas);
		}
		
	});
}

//현 위치의 rgba값을 받아옴
function getRgba(data, cx, cy, width) {
	var i = (cy * width + cx) * 4;
	return [data[i], data[i+1], data[i+2], data[i+3]];
}

/***컬러코드를 rgba값으로 변형 후 리턴*/
function colorCodetoRGBA(color) {
	return [parseInt(color.substr(1,2), 16), parseInt(color.substr(3,2), 16), parseInt(color.substr(5,2), 16)];
}

function fillColor(data, rgba, paintcolor, i) {
	data[i] = paintcolor[0];
	data[i+1] = paintcolor[1];
	data[i+2] = paintcolor[2];
	data[i+3] = paintcolor[3] != undefined ? paintcolor[3] : 255;
}

/***색 채우는 방식 - flood Fill 방식이라 함*/
function floodFill(jc, cx, cy, data, rgba, paintcolor) {
	var newpos, x, y, pixelpos;
	var reachleft = false;
	var reachright = false;
	var pixelstack = [[cx, cy]];
	
	while(pixelstack.length){		
		newpos = pixelstack.pop();
		x = newpos[0];
		y = newpos[1];
		
		pixelpos = (y * jc.ocanvas.width + x) * 4;
		
		while(y >= 0 && matchcolors(data, pixelpos, rgba, paintcolor)) {
			y -= 1;
			pixelpos -= jc.ocanvas.width * 4;
		}

		pixelpos += jc.ocanvas.width * 4;
		//y += 1;
		reachleft = false;
		reachright = false;
	
		while (y <= jc.ocanvas.height && matchcolors(data, pixelpos, rgba, paintcolor))	{
			y += 1;
			
			fillColor(data, rgba, paintcolor, pixelpos);
			
			if(x >= 0) {
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
			if(x < jc.ocanvas.width) {
				if(matchcolors(data, pixelpos + 4, rgba, paintcolor)) {
					if(!reachright) {
						pixelstack.push([x + 1, y]);
						reachright = true;
					}
				} else if (reachright) {
					reachright = false;
				}
			}
			
			pixelpos += jc.ocanvas.width * 4;
		}
	}
	return data;
}

function matchcolors(data, pixelpos, rgba, color) {
	var currgba = [data[pixelpos], data[pixelpos+1], data[pixelpos+2], data[pixelpos+3]];
	if (currgba[0] != rgba[0] || currgba[1] != rgba[1] || currgba[2] != rgba[2]) return false;
	if (currgba[0] == rgba[0] && currgba[1] == rgba[1] && currgba[2] == rgba[2]) return true;
	//else return false;
	if (currgba[0] == color[0] && currgba[1] == color[1] && currgba[2] == color[2]) return false;
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
	bucket(jc);
	
	bkbtn.appendChild(document.createTextNode('Bucket'));

	toolbox.appendChild(bkbtn);

	return jc;
}
