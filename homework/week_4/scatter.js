/*	Name: Noam Rubin 
/  	Studentnumber: 10800565
/ 	Course: Data processing
/  	
/ 	This code parses an online dataset and creates a scatterplot form it
*/ 

// http://stats.oecd.org/# 


// global variables
var data; 
var popRates; 
var fertility;
var countries;
var properties;	
var years;
var oneYear;
var year2011;
var year2012;
var year2013;

// run code when file is unloaded
window.onload = function() {

	var population = "http://stats.oecd.org/SDMX-JSON/data/CSPCUBE/EVOPOP_G1+FERTILITY_T1.AUS+FIN+IRL+ISR+ITA+KOR+LUX+MEX+NLD+NZL+ESP+GBR/all?startTime=2011&endTime=2013&dimensionAtObservation=allDimensions&pid=25e3f0d7-ac74-4b1b-a32a-84c81b3d3456"

	d3.queue()
	  .defer(d3.request, population)
	  .awaitAll(doFunction);

	function doFunction(error, response) {

	if (error) throw error;

		// create dataset variable
		var dataset = JSON.parse(response[0].responseText).dataSets[0].observations;
		console.log(dataset);
		var data = JSON.parse(response[0].responseText);
		console.log(data);

		// create empty arrays for years
		var popRates = [];
		var fertility = [];
		var countries = [];

		// iterate over countries
		for (var i = 0; i < 12; i++) {
			for (var j = 0; j< 3; j++) {

				// push countries into array
				countries.push(data.structure.dimensions.observation[1].values[i].id);
			}
		};


		// iterate over subjects
		for (var i = 0; i < 2; i++) {

			// iterate over countries
			for (var j = 0; j < 12; j++) {

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
		years = [year2011, year2012, year2013];
		console.log(years);

		oneYear = years[1];

		prepareData(oneYear)

	}
};

function prepareData(oneYear) {

	if (!oneYear) {
		oneYear = year2011;
	}

	///////////////////////////// start creating scatterplot ///////////////////////////// 

	/// Set the dimensions of the canvas / graph
	var margin = {top: 20, right: 20, bottom: 30, left: 40, legend: 10};
	var fullWidth = 900;
	var fullHeight = 450;
	var padding = 2; 
	var w = fullWidth - margin.left - margin.right;
	var h = fullHeight - margin.top - margin.bottom;

	// remove
	d3.select("svg").remove();

	// create svg element to place shapes
	var svg = d3.select("body") 
				    .append("svg")    
				        .attr("width", fullWidth)    
				        .attr("height", fullHeight)
				    .append("g")
				        .attr("transform", "translate(" + margin.left + ",0)")
				        .style("font-family", "verdana")
				        .style("font-size", "13px")
				        .attr("fill", "black");

	///////////////////////////// define axes ///////////////////////////// 

	// scale data
	var xScale = d3.scaleLinear()
	  					.domain([d3.min(oneYear, function(d) {
	  						return (d.fertility - 0.5)}), d3.max(oneYear, function(d) {
	  							return (d.fertility + 0.5)})])
	                    .range([0, w - margin.left - margin.right - 60], .1); 
	                    
                    
	var yScale = d3.scaleLinear()
	                    .domain([d3.max(oneYear, function(d) {
	  						return (d.populationrate + 0.5)}), -.5])
	                    .range([margin.left, h], .1);

	// create a colorscale
	var color = d3.scaleSequential(d3.interpolateWarm)
						.domain([0,12]);             
                    
	// define axes
	var xAxis = d3.axisBottom()
	                .scale(xScale);
	                
	var yAxis = d3.axisLeft()
	                .scale(yScale)
	                .ticks(8);

	// generate axes
	svg.append("g")
	    .attr("class", "axis")
	    .attr("transform", "translate(0," + h + ")")
	    .call(xAxis);    
	    
	svg.append("g")
	    .attr("class", "axis")
	    .attr("transform", "translate(" + 0 + ",0)")
	    .call(yAxis);

	// append title y-axis
	svg.append("text")
		.attr("class", "axis")
		.attr("transform", "rotate(-90)")
		.attr("y", margin.left - 80 )
		.attr("x", 0 - (h/2) + margin.bottom + margin.top)
		.attr("dy", "1em")
		.text("Population rate")

	// append title x-axis
	svg.append("text")
	    .attr("class", "axis")
	    .attr("transform", "translate(" + (w - margin.left - 100) + " ," + 
	                       (h + margin.top + 20) + ")")
	   .style("text-anchor", "middle")
	   .text("Fertility");

	// create circles
	svg.selectAll("circle")
		  .data(oneYear)
		  .enter()
		  .append("circle")
		  .attr("r", 7)
		  .attr("cx", function(d) { return xScale(d.fertility); })
		  .attr("cy", function(d) { return yScale(d.populationrate); })
		  .attr("fill", function(d, i) { return color(i) });
	
	///////////////////////////// create legend ////////////////////////////// 

	// create countries for legend
	var countries = ["Ireland", "Israël", "Great- Britain", "Spain", "New Zealand", "Mexico", "Luxembourg", "Finland", "Netherlands", "Australia", "Italy", "Korea"];

	// create legendn
	var legend = svg.selectAll("legend")
				.data(countries)
				.enter()
				.append("g")
				.attr("class", "legend")
				.attr("transform", function(d,i) {
					 return 'translate(0,' + i * 20 + ')';
					});

	// add legend colors
	legend.append("rect")
		.attr('x', w + 10)
		.attr("y", 50)
		.attr('width', 10)
		.attr('height', 10)
		.style('fill', function(d,i) { 
			return color(i) });

	// add text with country names
	legend.append('text')
			.attr('x', w + margin.right - 15)
			.attr('y', 57)
			.attr('dy', '.20em')
			.style('text-anchor', 'end')
			.style("font-size", "14px")
			.text(function(d) {
				return d });
	
};
	   
function changeYears(value) {
	value = Number(value)
	console.log(years)
	oneYear = years[value];
	prepareData(oneYear)
};

