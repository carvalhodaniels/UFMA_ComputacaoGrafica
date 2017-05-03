function canvasSupport () {
    return Modernizr.canvas;
}
window.addEventListener("load", eventWindowLoaded, false);
function eventWindowLoaded () {
	canvasApp();
}
function canvasApp () {
    if (!canvasSupport()) { //Test For Canvas Support
        return;
    }
    // Get a reference to the Canvas object on the HTML page
    var canvasTop = document.getElementById("canvasTop");
    var canvas = document.getElementById("canvasOne");
    var canvasMenu = document.getElementById("canvasMenu");
    // Get reference to the Canvas 2D context from the Canvas object
    var contextTop = canvasTop.getContext("2d");
    var context = canvas.getContext("2d");
    var contextMenu = canvasMenu.getContext("2d");
    // Variavel que guarda a opcao selecionada no menu
    var option = 0;
    // The rectangle should have x,y,width,height properties
	var pButton = {
	    x: 0,
	    y: 0,
	    width: 60,
	    height: 60
	};
	var rButton = {
	    x: 0,
	    y: 60,
	    width: 60,
	    height: 60
	};
	var plButton = {
	    x: 0,
	    y: 120,
	    width: 60,
	    height: 60
	};
	var pickBox = {
	    x: 0,
	    y: 180,
	    width: 60,
	    height: 60
	};
	var scaleBox = {
	    x: 0,
	    y: 240,
	    width: 60,
	    height: 60
	};
	var rotateBox = {
	    x: 0,
	    y: 300,
	    width: 60,
	    height: 60
	};
	var mirrorBox = {
	    x: 0,
	    y: 360,
	    width: 60,
	    height: 60
	};
	var areaBox = {
	    x: 0,
	    y: 420,
	    width: 60,
	    height: 60
	};
	var drawBox = {
	    x: 0,
	    y: 0,
	    width: 736,
	    height: 550
	};
	// Quantidade de clicks ao desenhar
	var clicks = 0;
	// Tolerancia de pick
	var tol = 5;
	var ponto;
	var pontos = [];
	var poligonais = [];
	var poligonos = [];
	var selected = [];
	selected.push('', 0);
	var rotateClick = {on: 0, x: 0, y: 0};
	var oldMousePos;
	var reta = {
		x1: 0,
		x2: 0,
		y1: 0,
		y2: 0
	};
	// Create a stub function used to draw onto the Canvas
	function draw() {
		// Draw filled box as the background
		contextTop.fillStyle = "#bfe7ef";
		contextTop.fillRect(0, 0, 800, 50);
		// Box de titulo
		contextTop.strokeStyle = "#000000"; 
		contextTop.strokeRect(0,  0, 800, 50);
		// Adding Text
		contextTop.fillStyle    = "#000000";
		contextTop.font         = "20px _sans";
		contextTop.fillText("Daniel's Paint",300,30 );
		// Draw “stroke” box as the border
		context.strokeStyle = "#000000";
		context.strokeRect(drawBox.x,  drawBox.y, drawBox.width, drawBox.height);
		// Box de menus
		contextMenu.strokeStyle = "#000000"; 
		contextMenu.strokeRect(0,  0, 60, 550);
		// Adding an image
		// Botao Ponto
		var pontoButton = new Image();
		pontoButton.onload = function () {
		   contextMenu.drawImage(pontoButton,pButton.x,pButton.y);
		}
		pontoButton.src = "pontoButton.jpg";
		// Botao Reta
		var retaButton = new Image();
		retaButton.onload = function () {
		   contextMenu.drawImage(retaButton,rButton.x,rButton.y);
		}
		retaButton.src = "retaButton.jpg";
		// Botao Poligonal
		var poligonalButton = new Image();
		poligonalButton.onload = function () {
		   contextMenu.drawImage(poligonalButton,plButton.x,plButton.y);
		}
		poligonalButton.src = "poligonalButton.jpg";
		// Botao Pick
		var pickButton = new Image();
		pickButton.onload = function () {
		   contextMenu.drawImage(pickButton,pickBox.x,pickBox.y);
		}
		pickButton.src = "pickButton.jpg";
		// Botao Scale
		var scaleButton = new Image();
		scaleButton.onload = function () {
		   contextMenu.drawImage(scaleButton,scaleBox.x,scaleBox.y);
		}
		scaleButton.src = "scaleButton.jpg";
		// Botao Rotate
		var rotateButton = new Image();
		rotateButton.onload = function () {
		   contextMenu.drawImage(rotateButton,rotateBox.x,rotateBox.y);
		}
		rotateButton.src = "rotateButton.jpg";
		// Botao Espelhamento
		var mirrorButton = new Image();
		mirrorButton.onload = function () {
		   contextMenu.drawImage(mirrorButton,mirrorBox.x,mirrorBox.y);
		}
		mirrorButton.src = "mirrorButton.jpg";
		// Botao Area
		var areaButton = new Image();
		areaButton.onload = function () {
		   contextMenu.drawImage(areaButton,areaBox.x,areaBox.y);
		}
		areaButton.src = "areaButton.jpg";
	}
    draw();
    // Desenha um ponto
	function drawPonto(x, y){
		context.beginPath();
		context.arc(x, y, 1, 0, 2*Math.PI);
		context.stroke();
	}
	// Desenha uma reta
	function drawReta(x1, y1, x2, y2, dash){
		// Ajuste para não sair da caixa de desenho
		if(x2 >= drawBox.x + drawBox.width){
			x2 = drawBox.x + drawBox.width - 1;
		}
		if(y2 <= drawBox.y){
			y2 = drawBox.y + 1;
		}
		if(dash == 1){
	    	context.setLineDash([3, 3]);
		}else{
			context.setLineDash([1, 0]);
		}
		context.strokeStyle = "#000000";
		context.beginPath();
		context.moveTo(x1, y1);
		context.lineTo(x2, y2);
		context.stroke();
	}
	// Redesenha todos os objetos
	function redrawAll(){
		var i, j;
		context.clearRect(drawBox.x+1, drawBox.y+1, drawBox.width-2, drawBox.height-2);
		for(i = 0; i < pontos.length; i++){
			context.setLineDash([10, 0]);
		    drawPonto(pontos[i].x, pontos[i].y);
		}
		for(j = 0; j <= poligonais.length; j++){
			if(poligonais.length > j){
		    	for(i = 0; i < poligonais[j].length; i++){
				    drawReta(poligonais[j][i].x1, poligonais[j][i].y1, poligonais[j][i].x2, poligonais[j][i].y2, 0);
				}
			}
		}
		for(j = 0; j <= poligonos.length; j++){
			if(poligonos.length > j)
			for(i = 0; i < poligonos[j].length; i++){
			    drawReta(poligonos[j][i].x1, poligonos[j][i].y1, poligonos[j][i].x2, poligonos[j][i].y2, 0);
			}
		}
		if(selected[0] != ''){
			if(selected[0] == 'Ponto'){
				context.beginPath();
				context.arc(pontos[selected[1]].x, pontos[selected[1]].y, 5, 0, 2*Math.PI);
				context.stroke();
			}else if(selected[0] == 'Reta'){
				for(var i = 0; i < poligonais[selected[1]].length; i++){
					context.beginPath();
					context.arc(poligonais[selected[1]][i].x1,  poligonais[selected[1]][i].y1, 5, 0, 2*Math.PI);
					context.stroke();
					if(i == poligonais[selected[1]].length -1){
						context.beginPath();
						context.arc(poligonais[selected[1]][i].x2,  poligonais[selected[1]][i].y2, 5, 0, 2*Math.PI);
						context.stroke();
					}
				}
			}else if(selected[0] == 'Poligono'){
				for(var i = 0; i < poligonos[selected[1]].length; i++){
					context.beginPath();
					context.arc(poligonos[selected[1]][i].x1,  poligonos[selected[1]][i].y1, 5, 0, 2*Math.PI);
					context.stroke();
				}
			}
		}
	}
    // Seleciona um ponto e retorna sua posição na array de pontos
    function pickPonto(x, y, tol){
    	var i;
    	for (i = 0; i < pontos.length; i++) {
    	  	if(x - tol <= pontos[i].x && x + tol >= pontos[i].x){
	    		if(y - tol <= pontos[i].y && y + tol >= pontos[i].y){
	    			return i;
	    		}
	    	}
    	}
    	return -1;
    }
    // Calcula codigo para pick de reta
    function pickCode(x, y, xmin, xmax, ymin, ymax, cod){
    	cod[0] = x < xmin;
    	cod[1] = x > xmax;
    	cod[2] = y < ymin;
    	cod[3] = y > ymax;
    }
    // Seleciona uma reta e retorna sua posição na array de poligonais
    function pickReta(x, y){
    	var i, j, k;
    	var cod0 = [], cod1 = [];
    	var x0, y0, x1, y1;
    	var xmin, xmax, ymin, ymax;
    	// Define a janela de atracao
    	xmin = x - tol;
    	xmax = x + tol;
    	ymin = y - tol;
    	ymax = y + tol;
    	// Testa cada elemento da array poligonais
    	for(i = 0; i < poligonais.length; i++){
    		for(k = 0; k < poligonais[i].length; k++){
	    		x0 = poligonais[i][k].x1;
	    		x1 = poligonais[i][k].x2;
	    		y0 = poligonais[i][k].y1;
	    		y1 = poligonais[i][k].y2;
	    		pickCode(x1, y1, xmin, xmax, ymin, ymax, cod1);
	    		do{
	    			pickCode(x0, y0, xmin, xmax, ymin, ymax, cod0);
	    			for(j = 0; j < 4; j++)
	    				// Test no-trivial pick
	    				if(cod0[j] && cod1[j])
	    					break;
	    			if(j != 4)
	    				break;
	    			// Move point 0 to window limit
	    			if(cod0[0])
	    				y0 += (xmin - x0) * (y1 - y0) / (x1 - x0), x0 = xmin;
	    			else if (cod0[1])
				    	y0 += (xmax - x0) * (y1 - y0) / (x1 - x0), x0 = xmax;
				   	else if (cod0[2])
				    	x0 += (ymin - y0) * (x1 - x0) / (y1 - y0), y0 = ymin;
				   	else if (cod0[3])
				 		x0 += (ymax - y0) * (x1 - x0) / (y1 - y0), y0 = ymax;
					else{ 	
						return i;
					}
	    		}while(1);
    		}
    	}
    	return -1;
    }
    // Seleciona um poligono e retorna sua posição no array de poligonos
    function pickArea(x, y){
    	var i, j;
    	// Numero de interseções
    	var ni;
    	// Começa pelo ultimo nó
    	//var fst;
    	var xc;
    	var p1, p2;
    	for(i = 0; i < poligonos.length; i++){
    		//fst = poligonos[i].length - 1;
    		ni = 0;
    		for(j = 0; j < poligonos[i].length; j++){
    			p1 = {x: poligonos[i][j].x1, y: poligonos[i][j].y1};
    			p2 = {x: poligonos[i][j].x2, y: poligonos[i][j].y2};
    			if(!(p1.y == p2.y) &&					// Descarta horizontais
    				!((p1.y > y) && (p2.y > y)) &&		// Descarta retas acima
    				!((p1.y < y) && (p2.y < y)) &&		// Descarta retas abaixo
    				!((p1.x < x) && (p2.x < x)))		// Descarta retas esquerda
    			{
    				if(p1.y == y){						// Primeiro ponto na mesma cota
    					if((p1.x > x) && (p2.y > y))	// A direita e acima do ponto
    						ni++;
    				}else{
    					if(p2.y == y){					// Segundo ponto na mesma cota
    						if((p2.x > x) && (p1.y > y))// A direita e acima do ponto
    							ni++;
    					}else{
    						if((p1.x > x) && (p2.x > x))// Inteiramente a direita
    							ni++;
    						else{						// Verifica ponto de interseção
    							var dx = p1.x - p2.x;
    							xc  = p1.x;
    							if(dx != 0)
    								xc += (y - p1.y)*dx / (p1.y - p2.y);
    							if(xc > x)
    								ni++;
    						}
    					}
    				}
    			}
    			//fst = j;
    		}
    		if(ni % 2)
    			return i;
    	}
    	return -1;
    }
    function isLeft(p0, p1, p2){
    	return ((p1.x - p0.x) * (p2.y - p0.y)
    			- (p2.x - p0.x) * (p1.y - p0.y))
    }
    function widingNumber(x, y){
    	var i, j;
    	var wn;
    	var p1;
    	var p2;
    	for(i = 0; i < poligonos.length; i++){
    		wn = 0;
    		for(j = 0; j < poligonos[i].length; j++){
    			p1 = {x: poligonos[i][j].x1, y: poligonos[i][j].y1};
    			p2 = {x: poligonos[i][j].x2, y: poligonos[i][j].y2};
    			if(p1.y <= y){
    				if(p2.y > y){
    					if(isLeft(p1, p2, {x: x, y: y}) > 2)
    						wn++;
    				}
    			}else{
    				if(p2.y <= y){
    					if(isLeft(p1, p2, {x: x, y: y}) < 0)
    						wn--;
    				}
    			}
    		}
    		if(wn != 0)
    			return i;
    	}
    	return -1;
    }
    // Calcula o angulo  entre 3 pontos
    function getAngle(p0,p1,p2) {
	    var b = Math.pow(p1.x-p0.x,2) + Math.pow(p1.y-p0.y,2),
	        a = Math.pow(p1.x-p2.x,2) + Math.pow(p1.y-p2.y,2),
	        c = Math.pow(p2.x-p0.x,2) + Math.pow(p2.y-p0.y,2);
	    return Math.acos( (a+b-c) / Math.sqrt(4*a*b) ) ;
	}
    // Multiplica matrizes
    function multMatriz(mat1, mat2){
    	var i, j, k, s;
    	var matRes = [];
    	for(i = 0; i < mat1.length; i++){
    		var res = [];
    		for(j = 0; j < mat2[0].length; j++){
    			s = 0;
    			for(k = 0; k < mat2.length; k++){
	    			s += mat1[i][k] * mat2[k][j];
    			}
	    		res.push(s);
    		}
    		matRes.push(res);
    	}
    	return matRes;
    }
    // Translação
    function translate(p1, p2){
    	var p0 = [];
    	var mat = [[1, 0, p2.x],
    				[0, 1, p2.y],
    				[0, 0, 1]];
    	p0.push([p1.x]);
    	p0.push([p1.y]);
    	p0.push([1]);
    	p0 = multMatriz(mat, p0);
    	return {x: p0[0], y: p0[1]};
    }
    // Função que calcula os pontos centrais de uma reta
    function centroReta(r){
    	var x, y;
    	x = (r.x1 + r.x2)/2;
    	y = (r.y1 + r.y2)/2;
    	return { x: x, y: y };
    }
    // Escala
    function scale(sx, sy, obj){
    	var mat, i, objtmp = [];
    	var r, tam;
    	var pm, tmp, tmpx, tmpy;
    	var p;
    	var p0;
    	mat = [[sx, 0, 0],
    			[0, sy, 0],
    			[0, 0, 1]];
 		tam = obj[selected[1]].length;
		tmpx = 0, tmpy = 0;
		for(var i = 0; i < tam; i++){
			tmp = centroReta(obj[selected[1]][i]);
			tmpx += tmp.x;
			tmpy += tmp.y;
		}
		pm = {x: tmpx/tam, y: tmpy/tam};
    	for(var i = 0; i < tam; i++){
    		p0 = [];
	    	r = obj[selected[1]][i];
	    	p = translate({x: r.x1, y: r.y1}, {x: -pm.x, y: -pm.y});
	    	p0.push([p.x]);
	    	p0.push([p.y]);
	    	p0.push([1]);
	    	p0 = multMatriz(mat, p0);
	    	p.x = p0[0];
	    	p.y = p0[1];
	    	p = translate({x: p.x, y: p.y}, {x: pm.x, y: pm.y});
	    	r.x1 = p.x[0];
	    	r.y1 = p.y[0];

	    	p0 = [];
	    	p = translate({x: r.x2, y: r.y2}, {x: -pm.x, y: -pm.y});
	    	p0.push([p.x]);
	    	p0.push([p.y]);
	    	p0.push([1]);
	    	p0 = multMatriz(mat, p0);
	    	p.x = p0[0];
	    	p.y = p0[1];
	    	p = translate({x: p.x, y: p.y}, {x: pm.x, y: pm.y});
	    	r.x2 = p.x[0];
	    	r.y2 = p.y[0];
	    	objtmp.push(r);
    	}
    	return objtmp;
    }
    // Rotação
    function rotate(cos, sin, p, c){
    	var mat;
    	var p0, p1;
    	mat = [[cos, -sin, 0],
    			[sin, cos, 0],
    			[0, 0, 1]];
		p0 = [];
    	p1 = translate({x: p.x, y: p.y}, {x: -c.x, y: -c.y});
    	p0.push([p1.x[0]]);
    	p0.push([p1.y[0]]);
    	p0.push([1]);
    	p0 = multMatriz(mat, p0);
    	p1.x = p0[0];
    	p1.y = p0[1];
    	p1 = translate({x: p1.x, y: p1.y}, {x: c.x, y: c.y});
    	p.x = p1.x[0];
    	p.y = p1.y[0];
    	return p;
    }
    // Espelhamento
    function mirror(p, r){
    	var dx, dy, a, b, x, y;
    	var p0 = {x: r.x1, y: r.y1};
    	var p1 = {x: r.x2, y: r.y2};

        dx = p1.x - p0.x;
        dy = p1.y - p0.y;
        a = (dx * dx - dy * dy) / (dx * dx + dy * dy);
        b = 2 * dx * dy / (dx * dx + dy * dy);
        x = Math.round(a * (p.x - p0.x) + b * (p.y - p0.y) + p0.x); 
        y = Math.round(b * (p.x - p0.x) - a * (p.y - p0.y) + p0.y);

        return { x:x, y:y };
    }
    /*function mirror(p, r){
    	var p, p0 = [];
    	var b, r1, r2;
    	if(r.x1 < r.x2){
		    r1 = {x: r.x1, y: r.y1};
		    r2 = {x: r.x2, y: r.y2};
		}else{
			console.log('cre');
		    r1 = {x: r.x2, y: r.y2};
		    r2 = {x: r.x1, y: r.y1};
		}
		b = r1.y;
	    var mat = [[1, 0, 0],
	    			[0, -1, 0],
	    			[0, 0, 1]];
	    // Tranlação em -b
	    var p1 = translate(r1, {x: 0, y: -b});
	    r1 = {x: p1.x[0], y: p1.y[0]};
	    p1 = translate(r2, {x: 0, y: -b});
	    r2 = {x: p1.x[0], y: p1.y[0]};
	    drawReta(r1.x, r1.y, r2.x, r2.y, 1);
	    p1 = translate({x: p.x, y: p.y}, {x: 0, y: -b});
    	// Rotação em -ang
    	var ang = getAngle({x: r2.x, y: r1.y}, r1, r2);
    	if(r.y1 < r.y2)
    		ang *= -1;
    	console.log((ang*180)/Math.PI);
    	r2 = rotate(Math.cos(ang), Math.sin(ang), r2, r1);
    	console.log(r1.x, r1.y);
    	console.log(r2.x, r2.y);
    	drawReta(r1.x, r1.y, r2.x, r2.y, 1);
    	p1 = rotate(Math.cos(ang), Math.sin(ang), p1, r1);
    	// Espelhamento em x
    	p0.push([p1.x]);
    	p0.push([p1.y]);
    	p0.push([1]);
    	p0 = multMatriz(mat, p0);
    	p1 = {x: p0[0], y: p0[1]};
    	p1 = {x: p1.x[0], y: p1.y[0]};
    	// Rotação em ang
    	p1 = rotate(Math.cos(-ang), Math.sin(-ang), p1, r1);
    	// Tranlação em b
    	p1 = translate({x: p1.x, y: p1.y}, {x: 0, y: b});
    	p = {x: p1.x[0],y: p1.y[0]}
    	return p;
    }*/
    // Area de um poligono
    function area(p){
    	var area = 0;
		var N = p.length;
		//We will triangulate the polygon
		//into triangles with points p[0],p[i],p[i+1]

		for(var i = 1; i+1<N; i++){
		    var x1 = p[i].x1 - p[0].x1;
		    var y1 = p[i].y1 - p[0].y1;
		    var x2 = p[i+1].x1 - p[0].x1;
		    var y2 = p[i+1].y1 - p[0].y1;
		    var cross = x1*y2 - x2*y1;
		    area += cross;
		}
		return Math.abs(area/2.0);
    }
    // Function to get the mouse position on a rectangle
	function getMousePosRect(canvas, event) {
	    var rect = canvas.getBoundingClientRect();
	    return {
	        x: event.clientX - rect.left,
	        y: event.clientY - rect.top
	    };
	}
	// Function to check whether a point is inside a rectangle
	function isInside(pos, rect){
	    return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y
	}
	canvas.oncontextmenu = function() {
		if(option == 2){
			redrawAll();
			clicks = 0;
			return false;
		}else if(option == 3){
			if(poligonos.length > 0)
				poligonos[poligonos.length-1].push(Object.create({x1: reta.x1, y1: reta.y1, x2: poligonos[poligonos.length-1][0].x1, y2: poligonos[poligonos.length-1][0].y1}));
			redrawAll();
			clicks = 0;
			return false;
		}
	}
	canvasMenu.addEventListener('click', function(evt) {
		var mousePos = getMousePosRect(canvasMenu, evt);

	    if (isInside(mousePos,pButton)){
	    	option = 1;
	    }else if(isInside(mousePos,rButton)){
	    	option = 2;
	    }else if(isInside(mousePos,plButton)){
	    	option = 3;
	    }else if(isInside(mousePos,pickBox)){
	    	option = 5;
	    }else if(isInside(mousePos,scaleBox)){
	    	option = 6;
	    }else if(isInside(mousePos,rotateBox)){
	    	option = 7;
	    }else if(isInside(mousePos,mirrorBox)){
	    	option = 8;
	    }else if((selected[0] == 'Poligono') && (isInside(mousePos,areaBox))){
	    	console.log(area(poligonos[selected[1]]));
	    }
	});
	canvas.addEventListener('click', function(evt) {
		var mousePos = getMousePosRect(canvas, evt);

	   if(isInside(mousePos,drawBox)){
	    	// Desenha um ponto
	    	if(option == 1){
	    		drawPonto(mousePos.x,  mousePos.y);
	    		pontos.push(Object.create({x: mousePos.x, y: mousePos.y}));
			// Desenha uma reta
	    	}else if(option == 2){
	    		if(clicks == 0){
	    			reta.x1 = mousePos.x;
	    			reta.y1 = mousePos.y;
	    			clicks++;
	    		}else{
	    			if(clicks == 1)
		    			poligonais.push([]);
	    			poligonais[poligonais.length-1].push(Object.create({x1: reta.x1, y1: reta.y1, x2: mousePos.x, y2: mousePos.y}));
	    			reta.x1 = mousePos.x;
	    			reta.y1 = mousePos.y;
	    			clicks++;
	    		}
	    	}else if(option == 3){
	    		if(clicks == 0){
	    			reta.x1 = mousePos.x;
	    			reta.y1 = mousePos.y;
	    			clicks++;
	    		}else{
	    			if(clicks == 1)
	    				poligonos.push([]);
	    			poligonos[poligonos.length-1].push(Object.create({x1: reta.x1, y1: reta.y1, x2: mousePos.x, y2: mousePos.y}));
	    			reta.x1 = mousePos.x;
	    			reta.y1 = mousePos.y;
	    			clicks++;
	    		}
	    	}else if(option == 5){
	    		var res = pickPonto(mousePos.x, mousePos.y, tol);
	    		if(res >= 0){
	    			selected[0] = 'Ponto';
	    			selected[1] = res;
					redrawAll();
	    		}else{
	    			res = pickReta(mousePos.x, mousePos.y, tol);
	    			if(res >= 0){
	    				selected[0] = 'Reta';
	    				selected[1] = res;
	    				redrawAll();
	    			}else{
	    				res = pickArea(mousePos.x, mousePos.y);
	    				if(res >= 0){
			    			selected[0] = 'Poligono';
	    					selected[1] = res;
	    					redrawAll();
			    		}else{
				    		selected[0] = '';
				    		selected[1] = 0;

				    		redrawAll();
				    	}
	    			}
	    		}
	    	}else if(option == 8){
	    		if(clicks == 0){
	    			reta.x1 = mousePos.x;
	    			reta.y1 = mousePos.y;
	    			clicks++;
	    		}else{
		    		if(clicks == 1){
		    			var p;
			    		reta.x2 = mousePos.x;
		    			reta.y2 = mousePos.y;
		    			clicks = 0;
		    			if(selected[0] == 'Ponto'){
		    				p = mirror(pontos[selected[1]], reta);
							pontos[selected[1]] = p;
		    			}else if(selected[0] == 'Reta'){
		    				for(i = 0; i < poligonais[selected[1]].length; i++){
			    				p = mirror({x: poligonais[selected[1]][i].x1, y: poligonais[selected[1]][i].y1}, reta);
								poligonais[selected[1]][i].x1 = p.x;
								poligonais[selected[1]][i].y1 = p.y;
								p = mirror({x: poligonais[selected[1]][i].x2, y: poligonais[selected[1]][i].y2}, reta);
								poligonais[selected[1]][i].x2 = p.x;
								poligonais[selected[1]][i].y2 = p.y;
							}
		    			}else if(selected[0] == 'Poligono'){
		    				for(i = 0; i < poligonos[selected[1]].length; i++){
			    				p = mirror({x: poligonos[selected[1]][i].x1, y: poligonos[selected[1]][i].y1}, reta);
								poligonos[selected[1]][i].x1 = p.x;
								poligonos[selected[1]][i].y1 = p.y;
								p = mirror({x: poligonos[selected[1]][i].x2, y: poligonos[selected[1]][i].y2}, reta);
								poligonos[selected[1]][i].x2 = p.x;
								poligonos[selected[1]][i].y2 = p.y;
							}
		    			}
		    			redrawAll();
	    			}
	    		}
	    	}
	    }
	});
	canvas.addEventListener('mousemove',function(evt){
		var mousePos = getMousePosRect(canvas, evt);
		if(option == 2){
			if(clicks >= 1){
				redrawAll();
				//context.globalCompositeOperation='source-over';
				drawReta(reta.x1, reta.y1, mousePos.x, mousePos.y, 1);
			}
		}else if(option == 3){
			if(clicks == 1){
				redrawAll();
				drawReta(reta.x1, reta.y1, mousePos.x, mousePos.y, 1);
			}else if(clicks > 1){
				redrawAll();
				drawReta(reta.x1, reta.y1, mousePos.x, mousePos.y, 1);
				drawReta(poligonos[poligonos.length-1][0].x1, poligonos[poligonos.length-1][0].y1, mousePos.x, mousePos.y, 1);
			}
		}else if(option == 51){
			var p, i, escala;
			if(selected[0] == 'Ponto'){
				p = {x: mousePos.x-pontos[selected[1]].x, y: mousePos.y-pontos[selected[1]].y};
				p = translate(pontos[selected[1]], p);
				pontos[selected[1]] = p;
				redrawAll();
			}else if(selected[0] == 'Reta'){
				escala = {x: mousePos.x - ponto.x, y: mousePos.y - ponto.y};
				for(i = 0; i < poligonais[selected[1]].length; i++){
					p = translate({x: poligonais[selected[1]][i].x1, y: poligonais[selected[1]][i].y1}, escala);
					poligonais[selected[1]][i].x1 = p.x;
					poligonais[selected[1]][i].y1 = p.y;
					p = translate({x: poligonais[selected[1]][i].x2, y: poligonais[selected[1]][i].y2}, escala);
					poligonais[selected[1]][i].x2 = p.x;
					poligonais[selected[1]][i].y2 = p.y;
				}
				redrawAll();
				ponto = mousePos;
			}else if(selected[0] == 'Poligono'){
				escala = {x: mousePos.x - ponto.x, y: mousePos.y - ponto.y};
				for(i = 0; i < poligonos[selected[1]].length; i++){
					p = translate({x: poligonos[selected[1]][i].x1, y: poligonos[selected[1]][i].y1}, escala);
					poligonos[selected[1]][i].x1 = p.x;
					poligonos[selected[1]][i].y1 = p.y;
					p = translate({x: poligonos[selected[1]][i].x2, y: poligonos[selected[1]][i].y2}, escala);
					poligonos[selected[1]][i].x2 = p.x;
					poligonos[selected[1]][i].y2 = p.y;
				}
				redrawAll();
				ponto = mousePos;
			}
		}else if(option == 7 && rotateClick.on == 1){
			var ang;
			redrawAll();
			/*context.beginPath();
			context.arc(rotateClick.x, rotateClick.y, 5, 0, 2*Math.PI);
			context.stroke();
			ang = getAngle({x: 0, y: 0}, {x: rotateClick.x, y: rotateClick.y}, mousePos);
			console.log(Math.trunc(ang)/1000);*/
			if(oldMousePos){
				if(mousePos.x < oldMousePos.x)
					ang = 0.1;
				else
					ang = -0.1;
			}
			oldMousePos = mousePos;
			if(selected[0] == 'Ponto' && ang){
				pontos[selected[1]] = rotate(Math.cos(-ang), Math.sin(-ang), pontos[selected[1]], {x: rotateClick.x, y: rotateClick.y});
			}else if((selected[0] == 'Reta' || selected[0] == 'Poligono') && ang){
				var obj;
				if(selected[0] == 'Reta')
					obj = poligonais;
				else
					obj = poligonos;
				for(var i = 0; i < obj[selected[1]].length; i++){
					var p = {x: obj[selected[1]][i].x1, y: obj[selected[1]][i].y1};
					p = rotate(Math.cos(-ang), Math.sin(-ang), p, {x: rotateClick.x, y: rotateClick.y});
					obj[selected[1]][i].x1 = p.x;
					obj[selected[1]][i].y1 = p.y;
					p = {x: obj[selected[1]][i].x2, y: obj[selected[1]][i].y2};
					p = rotate(Math.cos(-ang), Math.sin(-ang), p, {x: rotateClick.x, y: rotateClick.y});
					obj[selected[1]][i].x2 = p.x;
					obj[selected[1]][i].y2 = p.y;
				}
			}
		}else if(option == 8){
			if(clicks == 1){
				redrawAll();
				drawReta(reta.x1, reta.y1, mousePos.x, mousePos.y, 1);
			}
		}
	});
	canvas.addEventListener('mousedown', function(evt) {
		var mousePos = getMousePosRect(canvas, evt);
		var res;
		if(option == 5){
			res = pickPonto(mousePos.x, mousePos.y, tol);
			if(selected[0] == 'Ponto' && res == selected[1]){
				option = 51;
			}else{
				res = pickReta(mousePos.x, mousePos.y, tol);
				if(selected[0] == 'Reta' && res == selected[1]){
					option = 51;
				}else{
					res = pickArea(mousePos.x, mousePos.y);
					if(selected[0] == 'Poligono' && res == selected[1])
						option = 51;
				}
			}
			ponto = mousePos;
		}else if(option == 7){
			if(selected[0] != ''){
				rotateClick.on = 1;
				rotateClick.x = mousePos.x;
				rotateClick.y = mousePos.y;
				/*context.beginPath();
				context.arc(rotateClick.x, rotateClick.y, 5, 0, 2*Math.PI);
				context.stroke();*/
			}
		}
	});
	canvas.addEventListener('mouseup', function(evt) {
		var mousePos = getMousePosRect(canvas, evt);
		var p;
		if(option == 51){
			option = 5;
		}else if(option == 7 && rotateClick.on == 1){
			rotateClick.on = 0;
			redrawAll();
		}
	});
	canvas.addEventListener('mousewheel', function(evt) {
		if(option == 6 && selected[0] != ''){
			var delta = Math.max(-1, Math.min(1, (evt.wheelDelta || -evt.detail)));
			delta *= 0.3
			delta = 1 + delta;
			if(selected[0] == 'Reta')
				poligonais[selected[1]] = scale(delta, delta, poligonais);
			else if(selected[0] == 'Poligono')
				poligonos[selected[1]] = scale(delta, delta, poligonos);
			redrawAll();
		}
	});
}