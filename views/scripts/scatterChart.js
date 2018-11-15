// parse the date / time
//var parseTime = d3.timeParse("%y");




var scatters;
var links;

var y;


d3.csv("data/combined.csv", function(data) {
    // Convert strings to numbers.
    data.forEach(function(error,d) {
        //if (error) throw error;

        if (d.Date == 'NA' || d.Date == 'NaN' ){
            d.Date = 0;
        }
        else{
            d.Date = +d.Date;
            d.PublicationYear = +d.PublicationYear;
        }

        if (d.page == 'NaN' || d.page == 'NA' ){
            d.page = 0;
        }
        else{
            d.page = +d.Page;
        }


    });


    var minX = 0;
    var maxX = 445;

    var minY = d3.min(data, function(d) { return d.Date });
    var maxY = d3.max(data, function(d) { return d.Date });

    var margin = {top: 20, right: 15, bottom: 60, left: 80}
    var width = 960 - margin.left - margin.right;
    var height = pageGroupY - pageHeight/2;
    var heightXAxis = height + pageHeight;

    // Scale the range of the data
    var y = d3.scaleLinear()
        //.domain([0, 2017]) //There's some values assigned to 0 from data
        .domain([1500, 2017])
        .range([ height, 0 ]);

    // Create Canvass
    var chart = d3.select('svg')
    	.append('svg:svg')
            .attr('width', svgWidth)
            .attr('height', svgHeight)
            .attr('class', 'chart')

    // Create and add chart to canvas
    var main = chart
        .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'main')


    // Draw the x axis
    var xAxis = d3.axisBottom()
    	.scale(brushXConverter)

    // Add x axis to canvas
    main.append('g')
    	.attr('transform', 'translate(0,' + heightXAxis + ')')
    	.call(xAxis);

    // Create the y axis
    var yAxis = d3.axisLeft()
        .scale(y)
        .ticks(20)
    
    // Add y axis to canvas
    main.append('g')
    	.attr('transform', 'translate(0,0)')
    	.attr('class', 'main axis date')
        .attr('x',0)
        .attr('y',5)
        .attr('dy','.71em')
        .call(yAxis)

    // Add Titles
    main.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .attr("dy", "5em")
      .attr("dx", "10em")
      .text("Pages");   

    main.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "3em")
      .style("text-anchor", "middle")
      .text("Year"); 

    
    var g = main.append("svg:g"); 
    
    // Define the div for the tooltip
    var div = d3.select("#tooltip")  //gets attribute from index.html
        .attr("class", "tooltip")               
        .style("opacity", 0);

    // setup fill color
    var cValue = function(d) { return d.Language;},
        //color = d3.scale.category10(); #v2
        color = d3.scaleOrdinal(d3.schemeCategory10);

    var gLinks = main
                .append('g')
                    .attr('class', 'link')
                    // .attr("transform", "translate(" + margin_left + "," +  20 + ")");

    // Add the scatterplot
    scatters = g.selectAll("scatter-dots")
                .data(data)
                .enter().append("circle")
                    .attr('class', 'reference')
                    .attr("cx", function (d) { return brushXConverter(d.page); } )
                    .attr("cy", function (d) { return y(d.Date); } )
                    .attr("r", 8)
                    .style("fill", function(d) { return color(cValue(d));})
                .on("mouseover", function(d) {
                    div.transition()     
                        .duration(200)      
                        //.style("opacity", .9);  
                        .style("opacity", 200);     
                    div.html('<p>' + d.book_title + '</p>' +
                        "<br/>Author: " + d.Author +
                        "<br/>Publication Year: " + d.Date + 
                        "<br/>Reference Type: " + 
                        d.ref_type)  
                        .style("left", (d3.event.pageX) + "px")     
                        .style("top", (d3.event.pageY - 28) + "px")
                    })
                .on("mouseout", function(d) {     
                    div.transition()        
                        .duration(500)   
                        .style("opacity", 0);   
                });

    //Add the links
    links = gLinks.selectAll('.link')
                    .data(data)
                    .enter().append('line')
                    .attr('class', 'link')
                    .attr('x1', function (d) { return brushXConverter(d.page); }) // the x of scatter will change (maybe p.avePage)
                    .attr('y1', function (d) { return y(d.Date) < height ? y(d.Date) : height ; })
                    .attr('x2', function (d) { return brushXConverter(d.page); })
                    .attr('y2', (d) => height)
                    .attr('stroke-width', '0.4')
                    .attr('stroke','#CCC')
});
