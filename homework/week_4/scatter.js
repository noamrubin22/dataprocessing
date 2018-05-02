/*	Name: Noam Rubin 
/  	Studentnumber: 10800565
/ 	Course: Data processing
/  	
/ 	This code parses an online dataset and creates a scatterplot form it
*/ 

// http://stats.oecd.org/# 

// run code when file is unloaded
window.onload = function() {

	var population = "http://stats.oecd.org/SDMX-JSON/data/CSPCUBE/EVOPOP_G1+FERTILITY_T1.AUS+CZE+FIN+HUN+IRL+ISR+ITA+JPN+KOR+LUX+MEX+NLD+NZL+POL+ESP+GBR/all?startTime=2011&endTime=2013&dimensionAtObservation=allDimensions&pid=25e3f0d7-ac74-4b1b-a32a-84c81b3d3456"

	d3.queue()
	  .defer(d3.request, population)
	  .awaitAll(doFunction);

	function doFunction(error, response) {

	if (error) throw error;

		// create dataset variable
		var dataset = JSON.parse(response[0].responseText).dataSets[0].observations;
		// console.log(dataset);
		var data = JSON.parse(response[0].responseText);
		console.log(data);

		// create empty arrays for years
		var popRates = [];
		var fertility = [];
		var countries = [];

		// iterate over countries
		for (var i = 0; i < 16; i++) {
			for (var j = 0; j< 3; j++) {

				// push countries into array
				countries.push(data.structure.dimensions.observation[1].values[i].id);
			}
		};

		// iterate over subjects
		for (var i = 0; i < 2; i++) {

			// iterate over countries
			for (var j = 0; j < 16; j++) {

				// iterate over years
				for (var k = 0; k < 3; k++) {

					// create string for object
					var object = i + ":" + j + ":" + k;

					// if object exists
					if (dataset[object]) {

						// push value to fertility array
						if (object.charAt(0) == 0) {
							fertility.push(dataset[object][0]);
						}

						// push value to population array
						else if (object.charAt(0) == 1) {
							popRates.push(dataset[object][0]);
						}
					
					}
				}
			}
		}
		// console.log(popRates);
		// console.log(fertility);
		// console.log(countries);
		
		// create dictionary for properties for each country
		var properties = [];
		
		// create lists for years
		year2011 = [];
		year2012 = [];
		year2013 = [];

		// iterate over countries
		for (var i = 0; i < countries.length; i++) {
			
			// create object with properties
			properties.push({ country:countries[i], fertility:fertility[i], populationrate:popRates[i] });
		};

		// iterate over properties per country
		for (var j = 0; j < properties.length; j+= 3) {

			// place properties in right year
			year2011.push(properties[j]);
			year2012.push(properties[j + 1]);
			year2013.push(properties[j + 2]);
		}

		// create list for years
		var years = [year2011, year2012, year2013];
		console.log(years);



 	console.log('Yes, you can!')
	};
};
