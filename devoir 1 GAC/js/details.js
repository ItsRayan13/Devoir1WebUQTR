var id = new URLSearchParams( window.location.search ).get( "id" );
var details = document.querySelector( "#activity-details" );
var activities = [
	{
		id: "Art-&-modelage-terre",
		name: "Art & modelage terre",
		category: "Arts et artisanat",
		date: "2026-11-05",
		location: "Salle communautaire",
		places: 12,
		shortDescription: "Apprenez les bases du modelage avec de l’argile.",
		description: "Vous apprendrez à créer une forme en argile.",
		image: "img/img_test.jpg",
	},
	{
		id: "Peinture-aquarelle",
		name: "Peinture aquarelle",
		category: "Arts visuels",
		date: "2026-11-12",
		location: "Salle communautaire",
		places: 15,
		shortDescription: "Découvrez les techniques de base de l’aquarelle.",
		description: "Vous découvrirez les mélanges de couleurs et les dégradés.",
		image: "img/img_test.jpg",
	},
];
var savedActivities = JSON.parse(
	sessionStorage.getItem( "activities" ) || "[]",
);
var deletedIds = JSON.parse(
	sessionStorage.getItem( "deletedActivityIds" ) || "[]",
);
var activity = null;
var i;

for ( i = 0; i < savedActivities.length; i++ ) {
	if ( savedActivities[ i ].id === id ) {
		activity = savedActivities[ i ];
	}
}

if ( !activity && deletedIds.indexOf( id ) === -1 ) {
	for ( i = 0; i < activities.length; i++ ) {
		if ( activities[ i ].id === id ) {
			activity = activities[ i ];
		}
	}
}

function makeId( name ) {
	return name.trim().replace( /\s+/g, "-" );
}

if ( activity ) {
	var image = document.createElement( "img" );
	var title = document.createElement( "h2" );
	var category = document.createElement( "p" );
	var date = document.createElement( "p" );
	var activityLocation = document.createElement( "p" );
	var places = document.createElement( "p" );
	var shortDescription = document.createElement( "p" );
	var description = document.createElement( "p" );
	var editButton = document.createElement( "button" );
	var registerButton = document.createElement( "button" );
	var backLink = document.createElement( "a" );

	image.src = activity.image;
	image.alt = activity.name;
	title.textContent = activity.name;
	category.textContent = "Catégorie : " + ( activity.category || "Autre" );
	date.textContent = "Date : " + activity.date;
	activityLocation.textContent = "Lieu : " + ( activity.location || "À préciser" );
	shortDescription.textContent = activity.shortDescription;
	description.textContent = activity.description;
	places.id = "activity-places";

	editButton.textContent = "Modifier activité";
	editButton.className = "edit-activity-button";
	editButton.type = "button";

	registerButton.textContent = "S’inscrire";
	registerButton.className = "registration-button";
	registerButton.type = "button";

	backLink.textContent = "Retour aux activités";
	backLink.href = "activites.html";
	backLink.className = "activity-link";

	details.innerHTML = "";
	details.append(
		image,
		title,
		category,
		date,
		activityLocation,
		places,
		shortDescription,
		description,
		editButton,
		registerButton,
		backLink,
	);

	editButton.onclick = function () {
		document.querySelector( "#edit-name" ).value = activity.name;
		document.querySelector( "#edit-category" ).value = activity.category || "Autre";
		document.querySelector( "#edit-date" ).value = activity.date;
		document.querySelector( "#edit-location" ).value = activity.location || "À préciser";
		document.querySelector( "#edit-places" ).value = Number( activity.places ) || 1;
		document.querySelector( "#edit-short-description" ).value =
			activity.shortDescription;
		document.querySelector( "#edit-description" ).value = activity.description;
		document.querySelector( "#edit-modal" ).hidden = false;
	};

	registerButton.onclick = function () {
		if ( availablePlaces() > 0 ) {
			document.querySelector( "#registration-modal" ).hidden = false;
		}
	};

	function availablePlaces() {
		var registrations = JSON.parse(
			sessionStorage.getItem( "registrations" ) || "[]",
		);
		var count = 0;

		for ( var registrationIndex = 0; registrationIndex < registrations.length; registrationIndex++ ) {
			if ( registrations[ registrationIndex ].activityId === id ) {
				count++;
			}
		}

		return Math.max( 0, ( Number( activity.places ) || 0 ) - count );
	}

	function updateAvailability() {
		places.textContent = "Places disponibles : " + availablePlaces();
		registerButton.disabled = availablePlaces() === 0;
	}

	updateAvailability();

	document.querySelector( "#close-edit-modal" ).onclick = function () {
		document.querySelector( "#edit-modal" ).hidden = true;
	};

	document.querySelector( "#close-registration-modal" ).onclick = function () {
		document.querySelector( "#registration-modal" ).hidden = true;
	};

	document.querySelector( "#registration-form" ).onsubmit = function ( event ) {
		var registrations = JSON.parse(
			sessionStorage.getItem( "registrations" ) || "[]",
		);

		event.preventDefault();
		if ( availablePlaces() === 0 ) {
			alert( "Il ne reste plus de places pour cette activité." );
			return;
		}
		registrations.push( {
			activityId: id,
			activityName: activity.name,
			firstName: document.querySelector( "#first-name" ).value,
			lastName: document.querySelector( "#last-name" ).value,
			permanentCode: document.querySelector( "#permanent-code" ).value,
			email: document.querySelector( "#email" ).value,
		} );
		sessionStorage.setItem( "registrations", JSON.stringify( registrations ) );
		updateAvailability();
		alert( "Inscription enregistrée." );
		document.querySelector( "#registration-form" ).reset();
		document.querySelector( "#registration-modal" ).hidden = true;
	};

	document.querySelector( "#edit-form" ).onsubmit = function ( event ) {
		var newActivity;
		var imageFile = document.querySelector( "#edit-image" ).files[ 0 ];
		var reader;

		event.preventDefault();
		newActivity = {
			id: makeId( document.querySelector( "#edit-name" ).value ),
			name: document.querySelector( "#edit-name" ).value,
			category: document.querySelector( "#edit-category" ).value,
			date: document.querySelector( "#edit-date" ).value,
			location: document.querySelector( "#edit-location" ).value,
			places: Number( document.querySelector( "#edit-places" ).value ),
			shortDescription: document.querySelector( "#edit-short-description" ).value,
			description: document.querySelector( "#edit-description" ).value,
			image: activity.image,
		};

		if ( imageFile ) {
			reader = new FileReader();
			reader.onload = function () {
				newActivity.image = reader.result;
				saveEdit( newActivity );
			};
			reader.readAsDataURL( imageFile );
		} else {
			saveEdit( newActivity );
		}
	};

	function saveEdit( newActivity ) {
		var savedIndex = -1;

		for ( var position = 0; position < savedActivities.length; position++ ) {
			if ( savedActivities[ position ].id === id ) {
				savedIndex = position;
			}
		}

		if ( savedIndex === -1 ) {
			savedActivities.push( newActivity );
		} else {
			savedActivities[ savedIndex ] = newActivity;
		}

		if ( deletedIds.indexOf( id ) === -1 ) {
			deletedIds.push( id );
		}

		sessionStorage.setItem( "activities", JSON.stringify( savedActivities ) );
		sessionStorage.setItem( "deletedActivityIds", JSON.stringify( deletedIds ) );
		window.location.href = "details.html?id=" + encodeURIComponent( newActivity.id );
	}
} else {
	details.textContent = "Cette activité n’existe pas.";
}
