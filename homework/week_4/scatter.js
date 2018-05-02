/*	Name: Noam Rubin 
/  	Studentnumber: 10800565
/ 	Course: Data processing
/  	
/ 	This code parses an online dataset and creates a scatterplot form it
*/ 

// run code when file is unloaded
window.onload = function() {

	var population = "http://stats.oecd.org/SDMX-JSON/data/CSPCUBE/EVOPOP_G1+FERTILITY_T1.AUS+BEL+CAN+CHL+CZE+FIN+FRA+DEU+GRC+ISL+IRL+ISR+ITA+JPN+KOR+MEX+NLD+NZL+ESP+SWE/all?startTime=2011&endTime=2013&dimensionAtObservation=allDimensions&pid=25e3f0d7-ac74-4b1b-a32a-84c81b3d3456"

	d3.queue()
	  .defer(d3.request, population)
	  .awaitAll(doFunction);

	function doFunction(error, response) {

	if (error) throw error;

		// create dataset variable

		var dataset = JSON.parse(response[0].responseText).dataSets[0].observations;
		console.log(dataset);
		var data =JSON.parse(response[0].responseText);
		console.log(data);

		// create empty arrays for years
		var year11 = [];
		var year12 = [];
		var year13 = [];
	
		var pop = [];
		var fertility = [];
		var countries = [];

		// iterate over subjects
		for (var i = 0; i < 2; i++) {

			// iterate over countries
			for (var j = 0; j < 20; j++){

				// iterate over years
				for (var k = 0; k < 3; k++){

					// create string for object
					var object = i + ":" + j + ":" + k;

					// if object exists
					if (dataset[object]) {

						console.log(dataset[object]);

						// push value to fertility array
						if (object.charAt(0) == 0) {
							fertility.push(dataset[object][0]);
						}
						// push value to population array
						else if (object.charAt(0) == 1) {
							pop.push(dataset[object][0]);
						}

						// push to country-array
						if (j == data.structure.dimensions.observation[1].values[j]) {
							countries.push(data.structure.dimensions.observation[1].values[j].id);
						}
					}
				}
			}
		}
		
		console.log(pop);
		console.log(fertility);
		console.log(countries);


	// arr = [{"city": "whichita", "age": 18.12,}]

 	console.log('Yes, you can!')
	};
};
