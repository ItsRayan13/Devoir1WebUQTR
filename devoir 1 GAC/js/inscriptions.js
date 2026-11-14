var registrations = JSON.parse(
	sessionStorage.getItem("registrations") || "[]",
);
var list = document.querySelector("#registrations-list");
var groups = [];
var i;
var j;

for (i = 0; i < registrations.length; i++) {
	var registration = registrations[i];
	var group = null;

	for (j = 0; j < groups.length; j++) {
		if (groups[j].id === registration.activityId) {
			group = groups[j];
		}
	}

	if (!group) {
		group = {
			id: registration.activityId,
			name: registration.activityName,
			people: [],
		};
		groups.push(group);
	}

	group.people.push(registration);
}

for (i = 0; i < groups.length; i++) {
	var section = document.createElement("section");
	var title = document.createElement("h3");
	var peopleList = document.createElement("ul");

	section.className = "registration-group";
	title.textContent = groups[i].name;

	for (j = 0; j < groups[i].people.length; j++) {
		var person = groups[i].people[j];
		var item = document.createElement("li");

		item.textContent =
			person.firstName +
			" " +
			person.lastName +
			" - " +
			person.permanentCode +
			" - " +
			person.email;
		peopleList.appendChild(item);
	}

	section.appendChild(title);
	section.appendChild(peopleList);
	list.appendChild(section);
}

if (groups.length === 0) {
	list.textContent = "Aucune inscription pour le moment.";
}
