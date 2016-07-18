//color pallete 만들기
function cpallette(colors){
	var table = document.createElement('table');
	var tr;
	var td;
	var empty;
	for(c in colors){
		if(c%2 == 0){
			tr = document.createElement('tr');
		}

		td = document.createElement('td');
		td.style = 'background:#' + colors[c] + ';width:1em;border:1px solid #aaa;color:#'+colors[c];
		empty = document.createTextNode('.');
		td.appendChild(empty);
		console.log('adbv',td);
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
	empty = document.createTextNode('.');
	td.appendChild(empty);
	console.log('adbv',td);
	tr.appendChild(td);
	table.appendChild(tr);

	return table;
}
