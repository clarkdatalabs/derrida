// parse the date / time
//var parseTime = d3.timeParse("%y");

var scatters;
var links;

var y;


d3.csv("data/combined.csv", function(data) {
    // Convert strings to numbers.
    data.forEach(function(error,d) {
        //if (error) throw error;

        if (d.date == 'NA' || d.date == 'NaN' ){
            d.date = 0;
        }
        else{
            d.date = +d.date;
            d.PublicationYear = +d.PublicationYear;
        }

        if (d.page == 'NaN' || d.page == 'NA' ){
            d.page = 0;
        }
        else{
            d.page = +d.page;
        }
    });

    var minX = 0;
    var maxX = 445;

    var minY = d3.min(data, function(d) { return d.date });
    var maxY = d3.max(data, function(d) { return d.date });

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

    var gLinks = main
        .append('g')
            .attr('class', 'link')
                    // .attr("transform", "translate(" + margin_left + "," +  20 + ")");
    
    var g = main.append("svg:g"); 
    
    // Define the div for the tooltip
    var div = d3.select("#tooltip")  //gets attribute from index.html
        .attr("class", "tooltip")               
        .style("opacity", 0);

    // setup fill color
    var cValue = function(d) { return d.language;},
        //color = d3.scale.category10(); #v2
        color = d3.scaleOrdinal(d3.schemeCategory10);


// ###############################################################
// all this is what i started trying to do on friday, november 16

// here are the sources:
//  https://github.com/d3/d3-selection
//  https://gist.github.com/hrbrmstr/7700364
//  https://bl.ocks.org/zanarmstrong/0b6276e033142ce95f7f374e20f1c1a7

        // var svgLegned4 = d3.select(".legend")
        //     .append("svg")
        //     .attr("width", width)
        //     .attr("height", height - 50)
        
        // var dataL = 0;
        // var offset = 80;
        
        // var legend4 = svgLegned4.selectAll('.legend')
        //     // .data(legendVals2)
        //     .data()

        //     .enter().append('g')
        //     .attr("class", "legend")
        //     .attr("transform", function (d, i) {
        //      if (i === 0) {
        //         dataL = d.length + offset 
        //         return "translate(0,0)"
        //     } else { 
        //      var newdataL = dataL
        //      dataL +=  d.length + offset
        //      return "translate(" + (newdataL) + ",0)"
        //     }
        // })
        
        // legend.append('rect')
        //     .attr("x", 0)
        //     .attr("y", 0)
        //     .attr("width", 10)
        //     .attr("height", 10)
        //     .style("fill", function (d, i) {
        //     return color(i)
        // })
        
        // legend.append('text')
        //     .attr("x", 20)
        //     .attr("y", 10)
        // //.attr("dy", ".35em")
        // .text(function (d, i) {
        //     return d
        // })
        //     .attr("class", "textselected")
        //     .style("text-anchor", "start")
        //     .style("font-size", 15)


// ###########################################################
// commented out nobv 19 10:57am
// this produced 5 black boxes that are labeled abcde

//     // to be used for legend.append("text")
//     var commasFormatter = d3.format(",")

// append legend to page
    var legendSVG = d3.select("#maplegend")
            .append("svg")
            .attr("width", width)
    var ordinal = d3.scaleOrdinal()
        .domain(["a", "b", "c", "d", "e"])
        .range([ "rgb(153, 107, 195)", "rgb(56, 106, 197)", "rgb(93, 199, 76)", "rgb(223, 199, 31)", "rgb(234, 118, 47)"]);


    var language_data = 
        [{language:"fr"}, 
        {language:"da"}, 
        {language:"de"},
        {language:"en"},
        {language:"la"},
        {language:"it"}];

// build legend
    legend = legendSVG.selectAll(".lentry")
            .data(language_data)
            .enter()
            .append("g")
            // .attr("class","leg") 

    legend.append("rect")
            .attr("y", function(d,i) { return(i*30)})
            .attr("width","40px")
            .attr("height","40px")

            // .attr("fill", function(d) { return cValue(data)})

            .attr("class", function(d) {return (d.language)})
            .attr("stroke","#7f7f7f")
            .attr("stroke-width","0.5");
            // color = d3.scaleOrdinal(d3.schemeCategory10);
       
    legend.append("text")
                // .attr("class", "legText")
                .text(function(d, i) { return "≤ "+commasFormatter(d.language[i]) ; })
                // .text("class", function(d) {return (d.language)})
                .attr("x", 45)
                .attr("y", function(d, i) { return (40 * i) + 20 + 4; })


//  ###############################################################
// commented out on friday noc

    // var ordinal = d3.scaleOrdinal()
    //   .domain(d.language)
    //   .range(color);

    // var svg = d3.select("svg");

    // svg.append("g")
    //   .attr("class", "legendOrdinal")
    //   .attr("transform", "translate(20,20)");

    // var legendOrdinal = d3.legendColor()
    //   //d3 symbol creates a path-string, for example
    //   //"M0,-8.059274488676564L9.306048591020996,
    //   //8.059274488676564 -9.306048591020996,8.059274488676564Z"
    //   .shape("path", d3.symbol().type(d3.symbolTriangle).size(150)())
    //   .shapePadding(10)
    //   //use cellFilter to hide the "e" cell
    //   .cellFilter(function(d){ return d.label !== "e" })
    //   .scale(ordinal);

    // svg.select(".legendOrdinal")
    //   .call(legendOrdinal);
// end of color legend
//  ###############################################################


    // Add the scatterplot
    scatters = g.selectAll("scatter-dots")
                .data(data)
                .enter().append("circle")
                    .attr('class', function(d) {return 'reference ' + d.language})
                    // .attr("cx", function (d) { return brushXConverter(d.page); } )
                    .attr("cx", function (d) { return brushXConverter(d.avgPos); } )

                    .attr("cy", function (d) { return y(d.date); } )
                    .attr("r", 8)
                    // .style("fill", function(d) { return color(cValue(d));})


                .on("mouseover", function(d) {
                    div.transition()     
                        .duration(200)      
                        //.style("opacity", .9);  
                        .style("opacity", 200);     
                    div.html('<p>' + d.bookTitle + '</p>' +
                        "<br/>Author: " + d.author +
                        "<br/>Publication Year: " + d.date + 
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
                    .attr('x1', function (d) { return brushXConverter(d.avgPos); }) // the x of scatter will change (maybe p.avePage)
                    .attr('y1', function (d) { return y(d.date) < height ? y(d.date) : height ; })
                    .attr('x2', function (d) { return brushXConverter(d.page); })
                    .attr('y2', (d) => height)
                    .attr('stroke-width', '0.4')
                    .attr('stroke','#CCC')
});
