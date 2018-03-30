var layers = [];
var layer_cnt = 1;
var curlayer = 'layer0';

//layer 추가
function addLayer() {
	var canvas = document.getElementById('c2');
	var curcanvas = document.createElement('canvas');
	curcanvas.id = 'layer' + layer_cnt;
	curcanvas.width = canvas.width;
	curcanvas.height = canvas.height;
	curcanvas.style = 'border:1px solid gray;position:absolute;top:0px;left:0px;';
	canvas.parentNode.insertBefore(curcanvas,document.getElementById('tools'));
	var curctx = curcanvas.getContext('2d');
	layers.push({name: 'layer' + layer_cnt, canvas: curcanvas, ctx: curctx});
    layer_cnt++;
}

function insertLayerTool() {
    var layerTool = document.createElement('div');
    layerTool.className = 'layerTool';
    layerTool.innerHTML = '';
    
    var addbtn = document.createElement('div');
    addbtn.appendChild(document.createTextNode('+'));
    
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
        console.log(i);
        var addedLayer = document.createElement('span');
        var addedImg = document.createElement('img');
        addedImg.src = layers[i].canvas.toDataURL();
        addedImg.style.border = '1px solid black';
        addedImg.style.height = '50px';
        addedImg.style.margin = '2px';
        addedImg.setAttribute('layerName', layers[i].name);
        addedLayer.appendChild(addedImg);
    }
    return addedLayer;
}