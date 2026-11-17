var menuButton = document.querySelector(".nav-toggle");
var menu = document.getElementById("home-nav");

menuButton.addEventListener("click", function () {
	var menuIsOpen = menuButton.getAttribute("aria-expanded") === "true";

	menuButton.setAttribute("aria-expanded", String(!menuIsOpen));
	menuButton.setAttribute("aria-label", menuIsOpen ? "Ouvrir le menu" : "Fermer le menu");
	menu.classList.toggle("is-open", !menuIsOpen);
});

menu.addEventListener("click", function (event) {
	if (event.target.closest("a")) {
		menuButton.setAttribute("aria-expanded", "false");
		menuButton.setAttribute("aria-label", "Ouvrir le menu");
		menu.classList.remove("is-open");
	}
});
