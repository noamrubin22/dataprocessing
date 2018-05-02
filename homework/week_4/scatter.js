/*	Name: Noam Rubin 
/  	Studentnumber: 10800565
/ 	Course: Data processing
/  	
/ 	This code parses an online dataset and creates a scatterplot form it
*/ 

// run code when file is unloaded
window.onload = function() {


	var population = "http://stats.oecd.org/SDMX-JSON/data/CSPCUBE/EVOPOP_T1+FERTILITY_T1+AGEDPOPGEO.FIN+DEU+ISL+ISR+ITA+JPN+KOR+LUX+MEX+NLD+ESP+SWE/all?startTime=2011&endTime=2015&dimensionAtObservation=allDimensions&pid=25e3f0d7-ac74-4b1b-a32a-84c81b3d3456"

	d3.queue()
	  .defer(d3.request, population)
	  .awaitAll(doFunction);

function doFunction(error, response) {

	if (error) throw error;

		// create dataset variable
		var dataset = JSON.parse(response[0].responseText).dataSets[0].observations;
		console.log(dataset);

		// create empty arrays
		var populationLevel = [];
		var fertility = [];

		// iterate over dataset
		Object.keys(dataset).forEach(function(key) {
			console.log(dataset[key]);
		});
};	

	// d3.request(age)
	// 	.get(function(d) { 
	// 		console.log(JSON.parse(d.responseText))
	// 	})
	// function doFunction(error, response) {
 //  	if (error) throw error;

 //  		console.log(JSON.parse(response[0].responseText).dataSets[0].observations["0:0:0"]);

 //  	// Use response
	// };

	// arr = [{"city": "whichita", "age": 18.12,}]

 	console.log('Yes, you can!')
};
