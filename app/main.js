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
    var canvas = document.getElementById("canvasOne");
    // Get reference to the Canvas 2D context from the Canvas object
    var context = canvas.getContext("2d");
    // Variavel que guarda a opcao selecionada no menu
    var option = 0;
    // The rectangle should have x,y,width,height properties
	var pButton = {
	    x: 740,
	    y: 50,
	    width: 60,
	    height: 60
	};
	var rButton = {
	    x: 740,
	    y: 110,
	    width: 60,
	    height: 60
	};
	var plButton = {
	    x: 740,
	    y: 170,
	    width: 60,
	    height: 60
	};
	var pickBox = {
	    x: 740,
	    y: 230,
	    width: 60,
	    height: 60
	};
	var scaleBox = {
	    x: 740,
	    y: 290,
	    width: 60,
	    height: 60
	};
	var rotateBox = {
	    x: 740,
	    y: 350,
	    width: 60,
	    height: 60
	};
	var drawBox = {
	    x: 0,
	    y: 50,
	    width: 740,
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
	var reta = {
		x1: 0,
		x2: 0,
		y1: 0,
		y2: 0
	};
	// Create a stub function used to draw onto the Canvas
	function draw() {
		// Draw filled box as the background
		context.fillStyle = "#bfe7ef";
		context.fillRect(0, 0, 800, 50);
		// Draw “stroke” box as the border
		context.strokeStyle = "#000000"; 
		context.strokeRect(0,  50, 740, 550);
		// Box de titulo
		context.strokeStyle = "#000000"; 
		context.strokeRect(0,  0, 800, 50);
		// Box de menus
		context.strokeStyle = "#000000"; 
		context.strokeRect(740,  50, 60, 550);
		// Adding Text
		context.fillStyle    = "#000000";
		context.font         = "20px _sans";
		context.fillText("Daniel's Paint",300,30 );
		// Adding an image
		// Botao Ponto
		var pontoButton = new Image();
		pontoButton.onload = function () {
		   context.drawImage(pontoButton,740,50);
		}
		pontoButton.src = "pontoButton.jpg";
		// Botao Reta
		var retaButton = new Image();
		retaButton.onload = function () {
		   context.drawImage(retaButton,740,110);
		}
		retaButton.src = "retaButton.jpg";
		// Botao Poligonal
		var poligonalButton = new Image();
		poligonalButton.onload = function () {
		   context.drawImage(poligonalButton,740,170);
		}
		poligonalButton.src = "poligonalButton.jpg";
		// Botao Pick
		var pickButton = new Image();
		pickButton.onload = function () {
		   context.drawImage(pickButton,740,230);
		}
		pickButton.src = "pickButton.jpg";
		// Botao Scale
		var scaleButton = new Image();
		scaleButton.onload = function () {
		   context.drawImage(scaleButton,740,290);
		}
		scaleButton.src = "scaleButton.jpg";
		// Botao Rotate
		var rotateButton = new Image();
		rotateButton.onload = function () {
		   context.drawImage(rotateButton,740,350);
		}
		rotateButton.src = "rotateButton.jpg";
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
	canvas.addEventListener('click', function(evt) {
		var mousePos = getMousePosRect(canvas, evt);

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
	    }else if(isInside(mousePos,drawBox)){
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
		}
	});
	canvas.addEventListener('mouseup', function(evt) {
		var mousePos = getMousePosRect(canvas, evt);
		var p;
		if(option == 51){
			option = 5;
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