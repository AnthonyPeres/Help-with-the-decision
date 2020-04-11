hauteurBande = 400;
largeurBande = 400;
color = 0;
inBande = new Array(largeurBande);

$( document ).ready(function() {

	initBande();	
	document.addEventListener( 'keydown', onDocumentKeyDown, false );

function initBande(){
	for(var i = 0; i < hauteurBande; i++){
		inBande[i] = new Array(largeurBande);
		for(var j = 0; j < largeurBande; j++){
			inBande[i][j] = 0;
		}
	}
}


function CreateList(nbr){

var bhauteur = 0, blargeur = 0 , bcout = 0;

var couttot=0;
	for (var i = 0;i<nbr ;i++) {
		bhauteur = Math.floor((100-5)*Math.random()+15);
		blargeur = Math.floor((200-5)*Math.random())+15;
		bcout = (Math.floor((10)*Math.random()+1))*10;
		couttot = couttot + bcout;
		doBox(bhauteur,blargeur,bcout);
		}
		//$('#tot').append(couttot);
}


function doBoxes(hauteur, largeur, position,cout){
	var id = (parseInt($( "#doBoxes:last-child").attr('data-number')) || 0) + 1;
	$('#bande1').append('<div id="doBoxes" data-number="'+id+'" style="background-color:'+setColor()+';width:'+largeur+'px;height:'+hauteur+'px;position:absolute;top:'+position.top+'px;left:'+position.left+'px" class="un">'+cout+'</div>');
	for(var i = position.top; i < position.bottom; i++){
		for(var j = position.left; j < position.right; j++){
			inBande[i][j] = 1;
		}
	}
	infos();
}

function getEmplacement(hauteur, largeur){
	var ok = false;
	var fok = true;
	var top = 0;
	var left = 0;
	var fj = 0;
	for(var i = 0; i < hauteurBande; i++){
		for(var j = 0; j < largeurBande; j++){
			if(inBande[i][j] == 0){
				for(var k = i; k < (parseInt(hauteur)+i); k++){
					fj = 0;
					for(var jj = j; jj < (parseInt(largeur)+j); jj++){

						if(jj >= largeurBande || k >= hauteurBande){
							ok = false;
							break;
						}else{
							if(inBande[k][jj] == 1){
								if(ok)
								{
									fok = false;
								}
								ok = false;
								break;
							}else{
								if(fok)ok = true;
								fj = jj;
								
							}
						}
					}
						if(inBande[k][fj] == 1)
						{
							ok = false;
							break;
						}
						if(!fok)
						{
							fok = true;
							break;
						}
					
				}
				if(ok){
					top = i;
					left = j;
					break;
				}

			}
		}
		if(ok){
			break;
		}
	}
	if(ok){
		return {top:parseInt(top),left:parseInt(left),bottom:parseInt(top)+parseInt(hauteur),right:parseInt(left)+parseInt(largeur)}
	}else{
		return false;
	}
}

function createBox(hauteur, largeur,cout){
	if(hauteur <= hauteurBande && largeur <= largeurBande){
		var possiblePosition = getEmplacement(hauteur, largeur);
		while(possiblePosition == false){
			var newHauteur = parseInt(hauteurBande) + parseInt(hauteur);
			var oldHauteur = parseInt(hauteurBande);
			for(var t = oldHauteur; t < newHauteur; t++){
				inBande[t] = new Array(largeurBande);
				for(var tt = 0; tt < largeurBande; tt++){
					inBande[t][tt] = 0;
				} 
			}
			hauteurBande = parseInt(newHauteur);
			possiblePosition = getEmplacement(hauteur, largeur);
		}
		doBoxes(hauteur, largeur, possiblePosition,cout);
	}else{
		alert('Erreur sur les valeurs');
	}
}

function doBox(hauteur, largeur,cout){

	if(hauteur <= hauteurBande && largeur <= largeurBande){

		createBox(parseInt(hauteur), parseInt(largeur),cout);

	}else{
		alert('Les données sont invalides');
	}
}



function infos(){
	var perte = 0;
	var utilise = 0;
	var max = 0
	for(var i = 0; i < hauteurBande; i++){
		for(var j = 0; j < largeurBande; j++){
			if(inBande[i][j] == 1){
				if(i > max){
					max = i;
				}
			}
		}
	}
	max++;
	var total = max * largeurBande;
	for(var i = 0; i < max; i++){
		for(var j = 0; j < largeurBande; j++){
			if(inBande[i][j] == 0){
				perte++;
			}else{
				utilise++;
			}
		}
	}
	var perteFinal = (perte / total) * 100;
	var utiliseFinal = (utilise / total) * 100;
	$('#perte').html(perteFinal.toFixed(2)+' %');
	$('#utilise').html(utiliseFinal.toFixed(2)+' %');
}

$("#creer").click(function(){
	var hauteur = $('#hauteur').val(), largeur = $('#largeur').val();
	doBox(hauteur, largeur);
});

$("#creerList").click(function(){
	
	var nbr = $('#nbr').val();
	CreateList(nbr);
});



function onDocumentKeyDown( event ) {

				switch( event.keyCode ) {

					case 13:
						$('#creer').blur();
						$('#creer').click();
						break;

				}
			}

$("#vider").click(function(){
	$('#bande').empty();
	initBande();
	$('#perte').html('');
	$('#utilise').html('');
});

$("#aleatoire").click(function(){

	var hauteur = Math.floor((200-50)*Math.random()), largeur = Math.floor((300-50)*Math.random());
	doBox(hauteur, largeur);
});

function setColor(){
 var colors = "";
 switch(color)
 {
   case 0: colors = 'rgb(255, 0, 0)'; color=1;break;
   case 1:  colors = 'rgb(0, 0, 255)';color=2; break;
   case 2:  colors = 'rgb(255, 255, 0)'; color=3; break;
   case 3:  colors = 'rgb(0, 255, 255)'; color=4; break;
   case 4:  colors = 'rgb(255, 0, 255)'; color=5; break;
   case 5:  colors = 'rgb(100, 100, 100)'; color=0; break;
 }
    return colors;
}

function createTable(){
	$('#block2').append('<div id="table"></table>');
}

function updateTable(){
	$('#table').empty();
	for(var i = 0; i < hauteurBande; i++){
		$('#table').append('<tr>');
		for(var j = 0; j < largeurBande; j++){
			$('#table').append(j+'<td>'+inBande[i][j]+'</td>');
		}
		$('#table').append('</tr>');
	}	
}
});

