var svgWidth = 1000
var svgHeight = 500;

var margin = {top:20, right:40, bottom:50, left:60};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// SVG container
var svg = d3.select("#scatter").append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

// Append SVG group
var chartGroup = svg.append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data
d3.csv("Assets/data/data.csv").then(function(response){
    console.log(response);

    response.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

// Create scale functions
    var xScale = d3.scaleLinear()
    .domain([d3.min(response, d => d.poverty) - 1, d3.max(response, d => d.poverty) +1])
    .range([0, chartWidth]);

    var yScale = d3.scaleLinear()
    .domain([d3.min(response, d => d.healthcare) - 1, d3.max(response, d => d.healthcare) +2] )
    .range([chartHeight, 0]);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);

    chartGroup.append("g")
        .call(yAxis);

    // Circles
    var circleGroup = chartGroup.append("g").selectAll("circle")
        .data(response)
        .enter()
        .append("circle")
        .classed("circle", true)
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", 12)
        .attr("fill", "blue")
        .attr("opacity", 0.9);

    // State abbreviations
    var stateGroup = chartGroup.append("g").selectAll("text")
        .data(response)
        .enter()
        .append("text")
        .classed("state-text", true)
        .attr("x", d => xScale(d.poverty))
        .attr("y", d => yScale(d.healthcare))
        .attr("transform", `translate(-10, 5)`)
        .text(d => d.abbr)
        .attr("fill", "white");

    // Axis labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left+10)
        .attr("x", 0 - (chartHeight/1.5))
        .attr("dy", "1em")
        .classed("yaxis-text", true)
        .text("Lacks Heathcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth/2}, ${chartHeight + margin.bottom -15})`)
        .classed("xaxis-text", true)
        .text("In Poverty (%)");

    }).catch(function (error) {
        console.log(error);
});