/** Les variables */

var scene, renderer, projector, plane, bande, vectors = new THREE.Vector3(0, 300, 0);

var mouse2D, mouse3D;

// La caméra et ses déplacements
var camera, position_camera_x = 50, position_camera_y = 50;
var isFlecheGauche = false, isFlecheDroite = false, isFlecheHaut = false, isFlecheBas = false;

// Design des cubes
var color = 0, transparence = false;    


var inBande = new Array(nombre_cases_hauteur), aPos = new Array(nombre_cases_hauteur), aPosHauteur = new Array(nombre_cases_hauteur), taille = 700;

// Un objet ne peut pas mesurer plus de 3 cases
var taille_objet_maximum = 3;

var taille_case = 100;
var taille_matrice = 1000;
var nombre_cases = 20;
var nombre_cases_hauteur = 30;

/** Les appels */

init();
initBande();
animate();

/** Les fonctions associées aux boutons */

// --> Bouton relatif à la transparence
$('#transparence').live('click', function () {
    transparence = $('#transparence').is(':checked');
});

$('#hauteur, #profondeur, #largeur').live('click', function(){
	$(this).focus();
});

// --> Bouton relatif au placement d'un ou de plusieurs cubes
$('#creer').live('click', function() {
    var nombre_piece = parseInt($('#nombrePieces').val());
    var mes_objets = [], objet_a_placer = {};

    for (var i = 0; i < nombre_piece; i++) {
		var h = Math.floor(Math.random() * Math.floor(taille_objet_maximum));
        var l = Math.floor(Math.random() * Math.floor(taille_objet_maximum));
        var p = Math.floor(Math.random() * Math.floor(taille_objet_maximum));

        if (h == 0) h = 1;
        if (l == 0) l = 1;
        if (p == 0) p = 1;

        objet_a_placer.h = h;
        objet_a_placer.l = l;
        objet_a_placer.p = p;
        mes_objets.push(objet_a_placer);
    };

    mes_objets.sort(function (a, b) {
        return a.l - b.l;
    });

    for (var j in mes_objets) {
        objet_a_placer = mes_objets[j];
        dessinerCube(objet_a_placer.h, objet_a_placer.l, objet_a_placer.p);
    }
});

// --> Bouton relatif au netoyage de la matrice
$('#vider').live('click', function () {
    location.reload();
});


/** LES FONCTIONS */

// Fonction d'initialisation
function init() {

    // Initialisation de la bande
    bande = document.createElement('div');
    document.body.appendChild(bande);

    // Initialisation caméra
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.y = 300;
    
    // Initialisation de la scene
    scene = new THREE.Scene();

        /** Les lignes de la matrice */

    // Geometry est un objet qui contient les points et les faces d'un volume
    var geometry = new THREE.Geometry();

    // geometry.vertices contient la liste de chaque sommets du modèle
    for (var i = - taille_matrice; i <= taille_matrice; i += taille_case) {
        geometry.vertices.push(new THREE.Vector3(- taille_matrice, 0, i));
        geometry.vertices.push(new THREE.Vector3(taille_matrice, 0, i));
        geometry.vertices.push(new THREE.Vector3(i, 0, - taille_matrice));
        geometry.vertices.push(new THREE.Vector3(i, 0, taille_matrice));
    }

    // Apparance des lignes
    var material = new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.3 });
    var line = new THREE.Line(geometry, material);
    line.type = THREE.LinePieces;
    

        /** Le plane */
    projector = new THREE.Projector();
    plane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.MeshBasicMaterial());
    plane.rotation.x = - Math.PI / 2;
    plane.visible = false;

        /** La lumiere */
    var lumiere = new THREE.AmbientLight(0xffffff);

        /** La souris */
    mouse2D = new THREE.Vector3(0, 10000, 0.5);


    // On ajoute ces éléments à la scene
    scene.add(line);
    scene.add(plane);
    scene.add(lumiere);

    renderer = new THREE.CanvasRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    bande.appendChild(renderer.domElement);

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('keydown', onDocumentKeyDown, false);
    document.addEventListener('keyup', onDocumentKeyUp, false);
}

// 
function initBande(){
	for(var i=0; i < nombre_cases_hauteur; i++){
		inBande[i] = new Array(nombre_cases);

		for(var j=0; j < nombre_cases; j++){
			inBande[i][j] = new Array(nombre_cases);

			for(var k=0; k < nombre_cases; k++){
				inBande[i][j][k] = 0;
			}
		}
	}

	for(var l=0; l < nombre_cases_hauteur; l++){
		aPos[l] = taille;
        taille -= 100;
;
;
	}
}

// Fonction qui va creer un objet
function dessinerCube(hauteur, largeur, profondeur) {
	var geometry = new THREE.CubeGeometry( largeur * taille_case, hauteur * taille_case, profondeur * taille_case);
	var couleur = "";

	switch(color) {
		case 0: couleur = '0xFA8072'; color=1; break;
		case 1: couleur = '0x7BF2B7'; color=2; break;
		case 2: couleur = '0xFFDB58'; color=3; break;
		case 3: couleur = '0x827775'; color=4; break;
		case 4: couleur = '0x006C96'; color=5; break;
		case 5: couleur = '0xC0C0C0'; color=6; break;
		case 6: couleur = '0x999999'; color=0; break;
	}

	for (var i = 0; i < geometry.faces.length; i ++ ) {
		geometry.faces[i].color.setHex(couleur);
	}

    // On crée le material
	var material = new THREE.MeshLambertMaterial({ 
        vertexColors: THREE.FaceColors, 
        wireframe: transparence 
    });
    
    var cube = new THREE.Mesh(geometry, material);
    var pos = getEmplacement(hauteur, largeur, profondeur);
    
    cube.position.x = pos.y * taille_case + (taille_case*largeur)/2 - taille_matrice;
	cube.position.y = pos.x * taille_case + (taille_case*hauteur)/2; 
	cube.position.z = pos.z * taille_case + (taille_case*profondeur)/2 - taille_matrice;
    
    cube.matrixAutoUpdate = false;
	cube.updateMatrix();
	scene.add(cube);
	infos();
}

// Pour savoir ou poser un cube 
function getEmplacement(h, l, p){
	var ok = false;
	var posOK = false;
	var fok = true;
	var X = 0;
	var Y = 0;
	var Z = 0;

	for(var i=0; i < nombre_cases_hauteur; i++) {
		for(var j=0; j < nombre_cases; j++) {
			for(var k=0; k < nombre_cases; k++) {
                
                if(inBande[i][j][k] == 0){
					for(var ii=i; ii < (parseInt(h)+i); ii++){
						for(var jj=j; jj < (parseInt(l)+j); jj++){
							for(var mm = k; mm < (parseInt(p)+k); mm++){
								if(jj > nombre_cases_hauteur || ii > nombre_cases || mm > nombre_cases || inBande[ii][jj][mm] != 0){
									if (ok) fok = false;
 									ok=false;
 									break;
 								} else {
 									if(fok) ok=true;
 								}
 							}
 						}
 						if(!fok) {
 							fok = true;
 							break;
 						}
 					}
 					if(ok == true){
 						X=i;
 						Y=j;
 						Z=k;
 						for(var iii=i; iii < (parseInt(h)+i); iii++){
 							for(var jjj=j; jjj < (parseInt(l)+j); jjj++){
 								for(var kkk=k; kkk < (parseInt(p)+k); kkk++){
 									inBande[iii][jjj][kkk] = 1;
 								}
 							}
 						}
 						posOK = true;
 					}
 				}
 				if(posOK){
 					break;
 				}	
 			}
 			if(posOK){
 				break;
 			}
 		}
 		if(posOK){
 			break;
 		}
 	}
	if (posOK) {
 		return {x:X,y:Y,z:Z}
 	} else {
 		return false;
 	}
}

function infos() {
	var perte = 0;
	var utilise = 0;
	var max = 0

	for(var i = 0; i < nombre_cases_hauteur; i++){
		for(var j = 0; j < nombre_cases; j++){
			for(var k = 0; k < nombre_cases; k++){
				if(inBande[i][j][k] == 1){
					if(i > max){
						max = i;
					}
				}
			}
		}
	}

	max++;
	var total = max * nombre_cases;

	for(var i = 0; i < max; i++){
		for(var j = 0; j < nombre_cases; j++){
			for(var k = 0; k < nombre_cases; k++){
				if(inBande[i][j][k] == 0){
					perte++;
				} else {
					utilise++;
				}
			}
		}
	}

	var perteTotal = ((perte / total) * 100 / nombre_cases) ;
	var utiliseTotal = ((utilise / total) * 100 / nombre_cases) ;

	$('#perte').html(perteTotal.toFixed(2)+' %');
	$('#utilise').html(utiliseTotal.toFixed(2)+' %');
}

// Fonction qui test si une touche est pressée
function onDocumentKeyDown(event) {
    switch (event.keyCode) {
        case 37: isFlecheGauche = true; break;
        case 38: isFlecheHaut = true; break;
        case 39: isFlecheDroite = true; break;
        case 40: isFlecheBas = true; break;
    }
}

// Fonction qui test si une touche est relachée
function onDocumentKeyUp(event) {
    switch (event.keyCode) {
        case 37: isFlecheGauche = false; break;
        case 38: isFlecheHaut = false; break;
        case 39: isFlecheDroite = false; break;
        case 40: isFlecheBas = false; break;
    }
}

// Fonction qui test les mouvements de la souris
function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse2D.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse2D.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

// Fonction qui va tcheker les touches directionnelles pour creer un mouvement à la caméra
function mouvementCamera() {
    if (isFlecheGauche) { position_camera_x += mouse2D.x * -10; }
    if (isFlecheDroite) { position_camera_x += mouse2D.x * 10; }
    if (isFlecheHaut) { position_camera_y += mouse2D.y * 5; }
    if (isFlecheBas) { position_camera_y += mouse2D.y * -5; }

    camera.position.x = 2500 * Math.sin(position_camera_x * Math.PI / 360);
    camera.position.y = 2500 * Math.sin(position_camera_y * Math.PI / 360);
    camera.position.z = 2500 * Math.cos(position_camera_x * Math.PI / 360);

    camera.lookAt(vectors);
}

// Fonction render
function render() {
    mouvementCamera();
    renderer.render(scene, camera);
}

// Fonction animate
function animate() {
    requestAnimationFrame(animate);
    render();
}