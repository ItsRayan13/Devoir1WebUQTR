var activities = [];
var deletedActivities = [];

var activitiesList = document.querySelector(".activities-list");
var addModal = document.querySelector("#activity-modal");
var deleteModal = document.querySelector("#delete-modal");
var deleteList = document.querySelector("#activity-to-delete");

var addForm = document.querySelector("#activity-form");
var deleteForm = document.querySelector("#delete-form");

var navigation = performance.getEntriesByType("navigation")[0];
if (navigation && navigation.type === "reload") {
	sessionStorage.removeItem("activities");
	sessionStorage.removeItem("deletedActivityIds");
}

var savedActivities = sessionStorage.getItem("activities");
var savedDeletedActivities = sessionStorage.getItem("deletedActivityIds");

if (savedActivities) {
	activities = JSON.parse(savedActivities);
}

if (savedDeletedActivities) {
	deletedActivities = JSON.parse(savedDeletedActivities);
}

function activityId(name) {
	return name.trim().replace(/\s+/g, "-");
}

function saveActivities() {
	sessionStorage.setItem("activities", JSON.stringify(activities));
}

function createCard(activity) {
	var card = document.createElement("article");
	var image = document.createElement("img");
	var title = document.createElement("h3");
	var date = document.createElement("p");
	var shortDescription = document.createElement("p");
	var link = document.createElement("a");

	card.className = "activity-card";
	card.dataset.activityId = activity.id;

	image.src = activity.image;
	image.alt = activity.name;
	title.textContent = activity.name;
	date.className = "activity-date";
	date.textContent = activity.date;
	shortDescription.className = "activity-short-description";
	shortDescription.textContent = activity.shortDescription;
	link.className = "activity-link";
	link.href = "details.html?id=" + encodeURIComponent(activity.id);
	link.textContent = "Découvrir";

	card.append(image, title, date, shortDescription, link);
	return card;
}

function showActivities() {
	var i;

	for (i = 0; i < activities.length; i++) {
		activitiesList.appendChild(createCard(activities[i]));
	}

	for (i = 0; i < deletedActivities.length; i++) {
		var card = document.querySelector(
			'[data-activity-id="' + deletedActivities[i] + '"]',
		);

		if (card) {
			card.remove();
		}
	}

	updateDeleteList();
}

function updateDeleteList() {
	var cards = document.querySelectorAll(".activity-card");
	var i;

	deleteList.innerHTML = "";

	for (i = 0; i < cards.length; i++) {
		var option = document.createElement("option");
		option.value = cards[i].dataset.activityId;
		option.textContent = cards[i].querySelector("h3").textContent;
		deleteList.appendChild(option);
	}

	document.querySelector("#open-delete-modal").disabled = cards.length === 0;
}

function resizeImage(file, callback) {
	var reader = new FileReader();

	reader.onload = function () {
		var image = new Image();

		image.onload = function () {
			var canvas = document.createElement("canvas");
			var size = 600;
			var ratio = Math.min(size / image.width, size / image.height, 1);
			var context;

			canvas.width = image.width * ratio;
			canvas.height = image.height * ratio;
			context = canvas.getContext("2d");
			context.drawImage(image, 0, 0, canvas.width, canvas.height);
			callback(canvas.toDataURL("image/jpeg", 0.7));
		};

		image.src = reader.result;
	};

	reader.readAsDataURL(file);
}

document.querySelector("#open-modal").onclick = function () {
	addModal.hidden = false;
};

document.querySelector("#close-modal").onclick = function () {
	addModal.hidden = true;
};

document.querySelector("#open-delete-modal").onclick = function () {
	updateDeleteList();
	deleteModal.hidden = false;
};

document.querySelector("#close-delete-modal").onclick = function () {
	deleteModal.hidden = true;
};

addForm.onsubmit = function (event) {
	event.preventDefault();

	var name = document.querySelector("#activity-name").value;
	var imageFile = document.querySelector("#activity-image").files[0];

	resizeImage(imageFile, function (image) {
		var newActivity = {
			id: activityId(name),
			name: name,
			date: document.querySelector("#activity-date").value,
			shortDescription: document.querySelector(
				"#activity-short-description",
			).value,
			description: document.querySelector("#activity-description").value,
			image: image,
		};

		activities.push(newActivity);
		saveActivities();
		activitiesList.appendChild(createCard(newActivity));
		updateDeleteList();
		addForm.reset();
		addModal.hidden = true;
	});
};

deleteForm.onsubmit = function (event) {
	var id;
	var card;
	var i;

	event.preventDefault();
	id = deleteList.value;
	card = document.querySelector('[data-activity-id="' + id + '"]');

	if (card) {
		card.remove();
	}

	for (i = 0; i < activities.length; i++) {
		if (activities[i].id === id) {
			activities.splice(i, 1);
			saveActivities();
		}
	}

	if (id === "Art-&-modelage-terre" || id === "Peinture-aquarelle") {
		deletedActivities.push(id);
		sessionStorage.setItem(
			"deletedActivityIds",
			JSON.stringify(deletedActivities),
		);
	}

	updateDeleteList();
	deleteModal.hidden = true;
};

showActivities();
