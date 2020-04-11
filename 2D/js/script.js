// Thomas Sourdeval, 2019 Découverte de la recherche - problème 1

hauteurBande = 730;
largeurBande = 600;
color = 0;
inBand = new Array(largeurBande);
nb_boxes = 0;

$( document ).ready(function() {

	initBand();
	document.addEventListener( 'keydown', onDocumentKeyDown, false );

	// Fonction d'initialisation de la bande (matrice)
	function initBand(){
		for(var i = 0; i < hauteurBande; i++){
			inBand[i] = new Array(largeurBande);
			for(var j = 0; j < largeurBande; j++){
				inBand[i][j] = 0;
			}
		}
	}

	// Fonction d'affichage du nouveau bloc à sa position
	function createBox(hauteur, largeur, position){
		var id = (parseInt($( "#createBox:last-child").attr('data-number')) || 0) + 1;
		$('#bande').append('<div id="createBox" data-number="'+id+'" style="background-color:'+setColor()+';width:'+largeur+'px;height:'+hauteur+'px;position:absolute;top:'+position.top+'px;left:'+position.left+'px;" class="un"></div>');
		for(var i = position.top; i < position.bottom; i++){
			for(var j = position.left; j < position.right; j++){
				inBand[i][j] = 1;
			}
		}
	}

	// Algorithme principal qui récupère une position possible pour un nouveau bloc
	function getEmplacement(hauteur, largeur){
		var ok = false;
		var fok = true;
		var top = 0;
		var left = 0;
		var fj = 0;
		// Parcours hauteur de labande
		for(var i = 0; i < hauteurBande; i++){
			// Parcours largeur de la bande
			for(var j = 0; j < largeurBande; j++){
				// Test de matrice[i][j] pour vérifier si elle est déjà prise
				if(inBand[i][j] == 0){
					for(var k = i; k < (parseInt(hauteur)+i); k++){
						fj = 0;
						for(var jj = j; jj < (parseInt(largeur)+j); jj++){

							if(jj >= largeurBande || k >= hauteurBande){
								ok = false;
								break;
							}else{
								// Test pour voir si le bloc passe
								if(inBand[k][jj] == 1){
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
						if(inBand[k][fj] == 1)
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
			// Retourne la position possible
			return {top:parseInt(top),left:parseInt(left),bottom:parseInt(top)+parseInt(hauteur),right:parseInt(left)+parseInt(largeur)}
		}else{
			return false;
		}
	}

	// Fonction de génération d'un bloc
	function generateBox(hauteur, largeur){
		if(hauteur <= hauteurBande && largeur <= largeurBande){
			var possiblePosition = getEmplacement(hauteur, largeur);
			while(possiblePosition == false){
				var newHauteur = parseInt(hauteurBande) + parseInt(hauteur);
				var oldHauteur = parseInt(hauteurBande);
				for(var indexHauteur = oldHauteur; indexHauteur < newHauteur; indexHauteur++){
					inBand[O] = new Array(largeurBande);
					for(var indexLargeur = 0; indexLargeur < largeurBande; indexLargeur++){
						inBand[indexHauteur][indexLargeur] = 0;
					}
				}
				hauteurBande = parseInt(newHauteur);
				possiblePosition = getEmplacement(hauteur, largeur);
			}
			createBox(hauteur, largeur, possiblePosition);
			nb_boxes++;
		}else{
			alert('Erreur sur les valeurs');
		}
	}

	// Évènement qui lance la création d'un bloc et donc la fonction generateBox lorsque l'on entre des valeurs (à faire)
	$("#creer").click(function(){
		var hauteur = $('#hauteur').val(), largeur = $('#largeur').val();
		if(hauteur <= hauteurBande && largeur <= largeurBande){

			generateBox(parseInt(hauteur), parseInt(largeur));

		}else{
			alert('Les données sont invalides');
		}

	});

	// Fonction qui teste si une touche est pressée
	function onDocumentKeyDown( event ) {

		switch( event.keyCode ) {

			// Si on appuie sur espace, ça ajoute un bloc personnalisé
			case 32:
			$('#creer').blur();
			$('#creer').click();
			break;

			// Si on appuie sur retour, ça vide la bande
			case 8:
			$('#vider').click();
			break;

			// Si on appuie sur entrer, ça ajoute un bloc
			case 13:
			$('#aleatoire').click();
			break;

		}
	}

	// Bouton qui vide la bande et affiche 0 bloc
	$("#vider").click(function(){
		$('#bande').empty();
		initBand();
		nb_boxes = 0;
		$("#nb_blocs").html("0 box");
	});

	// Bouton qui ajoute un bloc et affiche le nombre de blocs
	$("#aleatoire").click(function(){
		var hauteur = Math.floor((100-25)*Math.random()), largeur = Math.floor((200-25)*Math.random());
		if(hauteur == 0) hauteur = 25;
		if(largeur == 0) largeur = 25;
		generateBox(parseInt(hauteur), parseInt(largeur));
		$("#nb_blocs").html(nb_boxes+" boxes");
	});

	// Bouton qui ajoute 10 blocs et affiche le nombre de blocs
	$("#aleatoire10").click(function(){
		for(var i = 0; i<10; i++){
			var hauteur = Math.floor((100-25)*Math.random()), largeur = Math.floor((200-25)*Math.random());
			if(hauteur == 0) hauteur = 25;
			if(largeur == 0) largeur = 25;
			generateBox(parseInt(hauteur), parseInt(largeur));
			$("#nb_blocs").html(nb_boxes+" boxes");
		}
	});

	// Bouton qui ajoute 50 blocs et affiche le nombre de blocs
	$("#aleatoire50").click(function(){
		for(var i = 0; i<50; i++){
			var hauteur = Math.floor((100-25)*Math.random()), largeur = Math.floor((200-25)*Math.random());
			if(hauteur == 0) hauteur = 25;
			if(largeur == 0) largeur = 25;
			generateBox(parseInt(hauteur), parseInt(largeur));
			$("#nb_blocs").html(nb_boxes+" boxes");
		}
	});

	// Bouton qui ajoute 100 blocs et affiche le nombre de blocs
	$("#aleatoire100").click(function(){
		for(var i = 0; i<100; i++){
			var hauteur = Math.floor((100-25)*Math.random()), largeur = Math.floor((200-25)*Math.random());
			if(hauteur == 0) hauteur = 25;
			if(largeur == 0) largeur = 25;
			generateBox(parseInt(hauteur), parseInt(largeur));
			$("#nb_blocs").html(nb_boxes+" boxes");
		}
	});

	// Change la couleur du bloc à chaque ajout
	function setColor(){
		var colors = "";
		switch(color)
		{
			case 0:  colors = 'rgb(16, 122, 69)'; color=1; break;
			case 1:  colors = 'rgb(231, 32, 32)'; color=2; break;
			case 2:  colors = 'rgb(99, 17, 142)'; color=3; break;
			case 3:  colors = 'rgb(212, 56, 108)'; color=4; break;
			case 4:  colors = 'rgb(36, 184, 22)'; color=5; break;
			case 5:  colors = 'rgb(42, 209, 220)'; color=6; break;
			case 6:  colors = 'rgb(87, 55, 14)'; color=0; break;
		}
		return colors;
	}

	// Fonction de changement d'échelle lorsque l'on arrive en bas
	function scaleDividedByTwo() {

	}
});
