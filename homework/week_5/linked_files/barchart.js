window.onload = function(){

data = [{ "type": "Native", "value": 20},
        { "type": "Foreign", "value": 50}];

// Chart Size Setup
var margin = { top: 35, right: 0, bottom: 30, left: 40 };

var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// scales
var x = d3.scale.ordinal()
    .domain(data.map(function(d) { return d.type; }))
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .domain([0, 100])
    .range([height, margin.top], .1);

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

/* title */
chart.append("text")
  .text('Bar Chart!')
  .attr("text-anchor", "middle")
  .attr("class", "graph-title")
  .attr("y", -10)
  .attr("x", width / 2.0);

/* bars */
var bar = chart.selectAll(".bar")
    .data(data)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d["type"]); })
    .attr("y", height)
    .attr("width", x.rangeBand())
    .attr("height", function(d) { return d.value });

// bar.transition()
//     .duration(1500)
//     .ease("elastic")
//     .attr("y", function(d) { return y(d["value"]); })
//     .attr("height", function(d) { return height - y(d["type"]); })

///////////////////////
// Tooltips
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
}

