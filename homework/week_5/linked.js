/*	Name: Noam Rubin 
/  	Studentnumber: 10800565
/ 	Course: Data processing
/  	
/ 	This code parses an online dataset and creates a scatterplot
/ 	source: http://stats.oecd.org/# 
*/ 

// initialize variables
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
var year2014;
var year2015;
var dataAsylum;
var native;
var countries;
var foreign;

var margin = { top: 50, left: 50, right: 50, bottom: 50},
height = 400 - margin.top - margin.bottom, 
width = 800 - margin.left - margin.right; 

// run code when file is unloaded
window.onload = function() {

	// create variable
	var employment = "http://stats.oecd.org/SDMX-JSON/data/CSPCUBE/MIGEDUEMP_T1C+MIGEDUEMP_T1F.AUS+AUT+BEL+CAN+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OECD+WLD+NMEC+BRA+CHN+COL+CRI+IND+IDN+LTU+PER+RUS+ZAF+GRPS/all?startTime=2011&endTime=2015&dimensionAtObservation=allDimensions&pid=25e3f0d7-ac74-4b1b-a32a-84c81b3d3456";

	// wait till requests are fulfilled before executing function
	queue()
	  .defer(d3.request, employment)
	  .defer(d3.json, "asylum.json")
	  .awaitAll(getData);

	var map = new Datamap({
		scope: "world",
	    element: document.getElementById("container"),
	    fills: {
	        defaultFill: "#756bb1" 
	}});

	// werkt niet 
	createBarChart(year2011);
};

function getData(error, response) {

	if (error) throw error; 

		// create dataset variables
		var data = JSON.parse(response[0].responseText);
		var dataset = data.dataSets[0].observations;
		dataAsylum = response[1];

		// create empty arrays for varables
		native = [];
		foreign = [];
		countries = [];

		// iterate over countries
		for (var i = 0; i < 31; i++) {

			// iterate over years
			for (var j = 0; j < 5; j++) {

				// push countries into array
				countries.push(data.structure.dimensions.observation[1].values[i].id);
			}
		};	
	

		// iterate over subjects
		for (var i = 0; i < 2; i++) {

			// iterate over countries
			for (var j = 0; j < 31; j++) {

				// iterate over years
				for (var k = 0; k < 5; k++) {

					// create string for object
					var object = i + ":" + j + ":" + k;

					// if object exists
					if (dataset[object]) {

						// push value to fertility array
						if (object.charAt(0) == 0) {
							native.push(dataset[object][0]);
						}

						// push value to population array
						else if (object.charAt(0) == 1) {
							foreign.push(dataset[object][0]);
						}
					}
				}
			}
		};
	parseData()	
};

function parseData() {
	// create list for properties for each country
	properties = [];
	
	// create lists for years
	year2011 = [];
	year2012 = [];
	year2013 = [];
	year2014 = [];
	year2015 = [];

	// create list for all years
	years = [year2011, year2012, year2013, year2014, year2015];

	// iterate over countries
	for (var i = 0; i < countries.length; i++) {
		
		// create object with properties
		properties.push({ country:countries[i], features:[{ "type": "native", "value": native[i]}, {"type": "foreign", "value": foreign[i] }]});
	};

	// iterate over properties per country
	for (var j = 0; j < properties.length; j+= 5) {

		// place properties in right year
		year2011.push(properties[j]);
		year2012.push(properties[j + 1]);
		year2013.push(properties[j + 2]);
		year2014.push(properties[j + 3]);
		year2015.push(properties[j + 4]);
	};

 	//* get the inflow of asylum for each country and year *//

	// iterate over dataset asylum
	for (var i = 0; i < dataAsylum.length; i++) {
		
		// check year and transform data
		if (dataAsylum[i].YEA == 2011) {
			transformData(year2011, i);
		}
		else if (dataAsylum[i].YEA == 2012) {
			transformData(year2012, i);
		}
		else if (dataAsylum[i].YEA == 2013) {
			transformData(year2013, i);
		}
		else if (dataAsylum[i].YEA == 2014) {
			transformData(year2014, i);
		}				
		else {
			transformData(year2015, i);
		}			
	}
	console.log(years);
};


// creates a list with the inflow of asylum for each country for a specific year
function transformData(year, number){

	// iterate over countries
	for (var j = 0; j < year.length; j++) {

		// if country has an inflow of asylum
		if (dataAsylum[number].COU == year[j].country && dataAsylum[number].Value != 0) {
			
			// add them to the inflow array
			year[j].features.push({ inflow: dataAsylum[number].Value, jaar: dataAsylum[number].YEA})
		}
	}
};	


function createBarChart() {

	var dataset = [{ "type": "Native", "value": 20},
                 {"type": "Foreign", "value": 50}];
                 
	console.log(dataset)
	/* chart setup */

	// margin and size
	var margin = { top: 35, right: 0, bottom: 30, left: 40 };
	var width = 960 - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;

	// append chart and g-group
	var chart = d3.select(".chart")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// scales
	var x = d3.scale.ordinal()
	    .domain(["native", "foreign"])
	    .rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
	    .domain([0, 100])
	    .range([height, margin.top], .1);

	/* axes */

	// define axis 
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	// generate axes
	chart.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height  + ")")
	    .call(xAxis);

	chart.append("g")
	    .attr("class", "y axis")
	    .attr("transform", "translate(" + 0 + ",0)")
	    .call(yAxis);

	/* titles */

	// bar chart title
	chart.append("text")
	  .text('Percentage of employement')
	  .attr("text-anchor", "middle")
	  .attr("class", "graph-title")
	  .attr("y", -10)
	  .attr("x", width / 2.0);

	// y-axis title
	chart.append("text")
	    .attr("class", "y-axis")
	    .attr("transform", "rotate(-90)")
	    .attr("y", 0 )
	    .attr("x", 0 - (height / 2) + margin.top)
	    .attr("dy", "1em")
	    .text("Percentage of employment (%)")

	/* create bars */

	// bars
	var bar = chart.selectAll(".bar")
	    .data(dataset)
	  .enter().append("rect")
	    .attr("class", "bar")
	    .attr("x", function(d) { return x(d.type); })
	    .attr("y", function(d) { return y(d.value)/2; })
	    .attr("width", x.rangeBand())
	    .attr("height", function(d) { return (height - y(d.value))/2 });

	// bar.transition()
	//     .duration(1500)
	//     .ease("elastic")
	//     .attr("y", function(d) { return y(d["value"]); })
	//     .attr("height", function(d) { return height - y(d["type"]); })

	// tooltip
	var tooltip = d3.select("body").append("div")
	    .attr("class", "tooltip");

	bar.on("mouseover", function(d) {
	      tooltip.html(d['value'])
	          .style("visibility", "visible");
	    })
	    .on("mousemove", function(d) {
	      tooltip.style("top", event.pageY - (tooltip[0][0].clientHeight + 5) + "px")
	          .style("left", event.pageX - (tooltip[0][0].clientWidth / 2.0) + "px");
	    })
	    .on("mouseout", function(d) {
	      tooltip.style("visibility", "hidden");
	});
};


		



