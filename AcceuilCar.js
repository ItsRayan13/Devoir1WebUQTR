var slides = [
	{
		images: "img/img_test.jpg",
		titre: "Atelier d’art et modelage terre",
		description: "Decouvrez l'art du modelage de la terre, il y'a peut etre un artiste en vous...",
        lien: "details.html?id=Art-%26-modelage-terre",
	},
	{
		images: "img/img_test.jpg", 
		titre: "Peinture",
		description: "Apprenez les bases de la peinture et jouer avec les couleurs..",
        lien: "details.html?id=Peinture-aquarelle",
	}
];

var images = document.getElementById("slide-image");
var texte = document.getElementById("slide-texte");
var titre = document.getElementById("slide-titre");
var lien = document.getElementById("slide-lien");
var description = document.getElementById("slide-description");
var boutonPrecedent = document.getElementById("btn-prec");
var boutonSuivant = document.getElementById("btn-suiv");

var position = 0;
var minuteur;

function remplirS(){
    images.src = slides[position].images;
	titre.textContent = slides[position].titre;
	description.textContent = slides[position].description;
    lien.href = slides[position].lien;
}

function afficherSlide(numero) {
	position = numero;

	images.classList.add("cache");
	texte.classList.add("cache");

	setTimeout(function () {
		remplirS();
		images.classList.remove("cache");
		texte.classList.remove("cache");
	}, 400);
}

function slideSuivante() {
	afficherSlide((position + 1) % slides.length);
}

function slidePrecedente() {
	afficherSlide((position - 1 + slides.length) % slides.length);
}

function demarrerMinuteur() {
	clearInterval(minuteur);
	minuteur = setInterval(slideSuivante, 4000);
}

boutonSuivant.addEventListener("click", function () {
	slideSuivante();
	demarrerMinuteur();
});

boutonPrecedent.addEventListener("click", function () {
	slidePrecedente();
	demarrerMinuteur();
});
remplirS();
demarrerMinuteur();