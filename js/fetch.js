// Function that fetches static Turku area bus stop data from data.foli.fi 
fetchBusStopData = () => {
	fetch('http://data.foli.fi/gtfs/stops')
		.then((response) => response.json())
		.then((busStops) => {
			// Data is in objects of an object. Make an array of object values.
			const busStopData = Object.values(busStops);
			let output = '';
			// Bus stops to output 
			busStopData.forEach((busStop) => {
				// Bus stops in Raisio have numbers 2000-2999. Show only those in output.
				if (busStop.stop_code >= 2000 && busStop.stop_code < 3000) {
					// Bus stop name is included in URL for busstop.js and it has to be encoded for that purpose (spaces, ä, ö etc.). 
					const busStopName = encodeURIComponent(busStop.stop_name);
					// Include bus stop code (number) and bus stop name in link href 
					output += '<a href=busstop.html?id=' + busStop.stop_code + '-' + busStopName + '>'
						+ busStop.stop_code + "&nbsp" + busStop.stop_name + '</a><br>';
				}
			});
			// Show the output
			document.getElementById('response').innerHTML = output;
		});
};
