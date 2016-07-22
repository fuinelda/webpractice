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
