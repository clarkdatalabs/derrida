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

        if (d.dateLog == ''){
            d.dateLog = 0;
        }
        else{
            d.date = +d.date;
            d.dateLog = +d.dateLog;
            //d.PublicationYear = +d.PublicationYear;
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

    var minY = d3.min(data, function(d) { return d.dateLog });
    var maxY = d3.max(data, function(d) { return d.dateLog });

    var margin = {top: 20, right: 15, bottom: 60, left: 80}
    var width = 960 - margin.left - margin.right;
    var height = pageGroupY - pageHeight/2;
    var heightXAxis = height + pageHeight;

    // Scale the range of the data
    var y = d3.scaleLinear()
        //.domain([0, 2017]) //There's some values assigned to 0 from data
        .domain([6.5, 0])
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

    svg.append("text")             
        .attr("transform",
            "translate(" + (width/2) + " ," + 
            (height + margin.top + 100) + ")")

        .style("text-anchor", "start")

        .text("Page of Reference");        


    // Create the y axis
    var yAxis = d3.axisLeft()
        .scale(y)
        .ticks(20)
        .tickFormat(function(d) {return 1970 - Math.floor(Math.pow(Math.exp(1), d));});

    // Add y axis to canvas
    main.append('g')
    	.attr('transform', 'translate(0,0)')
    	.attr('class', 'main axis date')
        .attr('x',0)
        .attr('y',5)
        .attr('dy','.71em')
        .call(yAxis)

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 100 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "end")
        .text("Date of reference"); 

    var gLinks = main
        .append('g')
        .attr('class', 'link')
        // .attr("transform", "translate(" + margin_left + "," +  20 + ")");

    var g = main.append("svg:g");

    // Define the div for the tooltip
    var div = d3.select("#tooltip")  //gets attribute from index.html
        .attr("class", "tooltip")
        .style("opacity", 0);

// append legend to page
    var legendSVG = d3.select("svg")
            // .append("svg")
            // .attr("transform","translate(500,0)")

            // .attr("width", width)
            // .attr("height", 200)

    var ordinal = d3.scaleOrdinal()
        .domain(["a", "b", "c", "d", "e"])
        .range([ "rgb(153, 107, 195)", "rgb(56, 106, 197)", 
            "rgb(93, 199, 76)", "rgb(223, 199, 31)", "rgb(234, 118, 47)"]);

    var language_data =
        [{language:"fr",full:"French"},
        {language:"da", full: "Danish"},
        {language:"de", full: 'German'},
        {language:"en", full: "English"},
        {language:"la", full: 'Latin'},
        {language:"it", full: 'Italian'}];

// build legend
    legend = legendSVG.selectAll(".lentry")
            .data(language_data)
            .enter()
            .append("g")
            // .attr("width","80px")
            // .attr("height","80px")
            // .attr("class","leg")

    legend.append("rect")
            .attr("y", 20)
            .attr("width","10px")
            .attr("height","10px")
            .attr("x", function(d,i) { return(svgWidth- i*50)})
            // .attr("fill", function(d) { return cValue(data)})

            .attr("class", function(d) {return (d.language)})
            .attr("stroke","#7f7f7f")
            .attr("stroke-width","0.2");
            // color = d3.scaleOrdinal(d3.schemeCategory10);

    legend.append("text")
                // .attr("class", "legText")
                .text(function(d, i) { return d.full ; })
                // .text("class", function(d) {return (d.language)})
                .attr("y", 20)
                .attr("x", function(d,i) { return(svgWidth- i*55)})

                // .attr("y", function(d, i) { return (25 * i) + 45; })
                // .attr("y", function(d, i) { return (40 * i) + 20 + 4; })


    legend.append("text")             
        // .attr("transform",
        //     "translate(" + (width/2) + " ," + 
        //     (height + margin.top) + ")")
        .style("text-anchor", "start")
        .text("Language")
        .attr("y",20);    

    legend.append("text")             
        // .attr("transform",
        //     "translate(" + (width/2) + " ," + 
        //     (height + margin.top) + ")")
        .style("text-anchor", "start")
        .text("Language")
        .attr("y",20);    

    // Add the scatterplot
    scatters = g.selectAll("scatter-dots")
                .data(data)
                .enter().append("circle")
                // .attr("cx", 30)
                // .attr("cy", 30)
                // .attr("r", 20);
                    .attr('class', function(d) {return 'reference ' + d.language})
                    // .attr("cx", function (d) { return brushXConverter(d.page); } )
                    .attr("cx", function (d) { return brushXConverter(d.avgPos); } )

                    .attr("cy", function (d) { return y(d.dateLog); } )
                    .attr("r", 8)
                    // .style("fill", function(d) { return d.language;})


                .on("mouseover", function(d) {
                    div.transition()
                        .duration(200)
                        //.style("opacity", .9);
                        .style("opacity", 200);
                    div.html('<p>' + d.bookTitle + '</p>' +
                        "<br/>Author: " + d.author +
                        "<br/>Publication Year: " + d.date)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                    d3.select(this) // Get bigger on hover
                        .transition()
                        .duration(100)
                        .attr('r', 20);
                        links.classed('highlighted',true); //turns on links highlight with CSS
                    /*d3.selectAll('line') //highlights lines with d3
                        .data(data)
                        .attr('class', 'link show')
                        //.attr('x1', function (d) { return brushXConverter(d.avgPos); }) // the x of scatter will change (maybe p.avePage)
                        //.attr('y1', function (d) { return y(d.dateLog) < height ? y(d.dateLog) : height ; })
                        //.attr('x2', function (d) { return brushXConverter(d.page); })
                        //.attr('y2', (d) => height)
                        .attr('stroke','#66cf2b') */
                    }
                    
                    )
                .on("mouseout", function(d) {
                    div.transition()
                        .duration(500)


                        .style("opacity", 0);
                    d3.select(this) // Get smaller after hover
                        .transition()
                        .duration(100)
                        .attr('r', 8);

                    /*
                    d3.select('line') //Unhighlight lines with d3
                        .data(data)
                        .attr('class', 'link show')
                        //.attr('x1', function (d) { return brushXConverter(d.avgPos); }) // the x of scatter will change (maybe p.avePage)
                        //.attr('y1', function (d) { return y(d.dateLog) < height ? y(d.dateLog) : height ; })
                        //.attr('x2', function (d) { return brushXConverter(d.page); })
                        //.attr('y2', (d) => height)
                        .attr('stroke','#ccc'); */
        
                    links.classed('highlighted',false); // Turns off links highlight with CSS
                })
                //For debugging purposes
                .on('click', function(d, i) {
                    console.log("You clicked", d), i;
                    d3.select(this)
                        .transition()
                        .attr('r', 20);

                });

    //Add the links
    links = gLinks.selectAll('.link')
                    .data(data)
                    .enter().append('line')
                        .attr('class', 'link')
                        .attr('x1', function (d) { return brushXConverter(d.avgPos); }) // the x of scatter will change (maybe p.avePage)
                        .attr('y1', function (d) { return y(d.dateLog) < height ? y(d.dateLog) : height ; })
                        .attr('x2', function (d) { return brushXConverter(d.page); })
                        .attr('y2', (d) => height)
                        .attr('stroke-width', '0.4')
                        .attr('stroke','#CCC')
    drawPages();
    gBrush.call(brush);
    gBrush.call(brush.move, [0, pageGroupWidth]);
});
