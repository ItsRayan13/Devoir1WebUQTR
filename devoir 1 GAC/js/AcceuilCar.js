var slides = [
	{
		images: "img/Art-et-modelage-terre.jpg",
		alt: "Atelier de modelage de la terre",
		titre: "art et modelage de la terre",
		description: "Decouvrez l'art du modelage de la terre, il y'a peut etre un artiste en vous",
	},
	{
		images: "img/peinture-aquarelle.jpg",
		alt: "Atelier de peinture à l'aquarelle",
		titre: "Peinture",
		description: "Apprenez les bases de la peinture et jouer avec les couleurs..",
	}
];

var images = document.getElementById("slide-image");
var texte = document.getElementById("slide-texte");
var titre = document.getElementById("slide-titre");
var description = document.getElementById("slide-description");
var boutonPrecedent = document.getElementById("btn-prec");
var boutonSuivant = document.getElementById("btn-suiv");

var position = 0;
var minuteur;

function afficherSlide(numero) {
	position = numero;

	images.classList.add("cache");
	texte.classList.add("cache");

	setTimeout(function () {
		images.src = slides[position].images;
		images.alt = slides[position].alt;
		titre.textContent = slides[position].titre;
		description.textContent = slides[position].description;

		// On les rend de nouveau visibles
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

demarrerMinuteur();