// Function that fetches real-time timetables for a given bus stop from data.foli.fi
fetchBusStopDataById = () => {
	// Split the bus stop id number and bus stop name from URL. Decode bus stop name.
	const keys = location.search.split('=')[1];
	const stopId = keys.split('-')[0];
	let stopName = decodeURIComponent(keys.split("-")[1]);

	// Show bus stop number and name in h1 element
	document.getElementById('bus-stop-header').innerHTML = stopId + " " + stopName;

	// Fetch data with bus stop id number
	fetch(' https://cors-anywhere.herokuapp.com/http://data.foli.fi/siri/sm/' + stopId)
		.then((response) => response.json())
		.then((busStop) => {
			let output = "";
			// If there are no results (no buses in a couple of hours), show message and empty table
			if (busStop.result.length === 0) {
				document.getElementById('updated').innerHTML = "Ei tuloksia tietokannasta."
				output += '<tr><td class="line">-</td><td>-</td><td class="expected">-</td></tr>';
				// Else show the results
			} else {
				// Show the time when the data has been recorded
				const recordedAtTime = getHoursAndMinutes(busStop.result[0].recordedattime)
				document.getElementById('updated').innerHTML = "Tiedot päivitetty tietokantaan: " + recordedAtTime + "<br>" +
					"Hae tuoreet tiedot sivua virkistämällä.";

				// Add the timetable to the HTML table
				busStop.result.forEach((journey) => {
					// Parse the timestamps to hours and minutes
					const aimedArrivalTime = getHoursAndMinutes(journey.aimedarrivaltime);
					const expectedArrivalTime = getHoursAndMinutes(journey.expectedarrivaltime);
					// Create table cells with timetable data
					output += '<tr><td class="line">' + journey.lineref + '</td>';
					output += '<td>' + journey.destinationdisplay + '</td>';
					output += '<td class="expected">' + expectedArrivalTime + " <span>(" + aimedArrivalTime + ")</span>" + '</td></tr>';
				})
			}
			// Show output
			document.getElementById('response').innerHTML += output;
		});

	// Functions that parses hours and minutes from given timestamp
	getHoursAndMinutes = (timestamp) => {
		const timestampInMilliseconds = timestamp * 1000;
		const dateObject = new Date(timestampInMilliseconds);
		const hours = ("0" + dateObject.getHours()).slice(-2);
		const minutes = ("0" + dateObject.getMinutes()).slice(-2);
		return hours + "." + minutes;
	}
};
