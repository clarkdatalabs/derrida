// parse the date / time
//var parseTime = d3.timeParse("%y");

var scatters;
var links;

var y;

// variables that are used in both 'mouseover' & 'mouseout'
var lineClassName;
var pageNumIds;
var selectedLanguageLegendId;


d3.csv("data/dataNode.csv", function(data) {
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

    var margin = {top: 20, right: 15, bottom: 60, left: 80}
    var width = 960 - margin.left - margin.right;
    var height = pageGroupY - pageHeight/2;
    var heightXAxis = height + pageHeight;

    // Scale the range of the data
    var y = d3.scaleLinear()
        //.domain([0, 2017]) //There's some values assigned to 0 from data
        .domain([6.5, 0.4])
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
            "translate(" + (width/1.45) + " ," +
            (height + margin.top + 100) + ")")

        .style("text-anchor", "start")

        .text("Page of Reference");


    // Create the y axis
    var yAxis = d3.axisLeft()
        .scale(y)
        .tickValues([Math.log(1.5), Math.log(2.5), Math.log(3.5), Math.log(4.5), Math.log(6.5), 
            Math.log(9.5), Math.log(14.5), Math.log(19.5), Math.log(29.5), Math.log(39.5), Math.log(49.5), Math.log(59.5),Math.log(69.5), 
            Math.log(169.5), Math.log(269.5), Math.log(369.5)])
        .tickFormat(function(d) {return Math.floor(1969.5 - Math.pow(Math.E, d));});


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
        .attr("x",50 - (height / 2))
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
            .attr("id", function(d) {return (d.language) + 'Legend'})

    legend.append("rect")
            .attr("y", 38)
            .attr("width","30px")
            .attr("height","4px")
            .attr("x", function(d,i) { return(svgWidth- (i+1) *55)})

            .attr("class", function(d) {return (d.language)})
            .attr("stroke","#7f7f7f")
            .attr("stroke-width","0.2");

    legend.append("text")
                // .attr("class", "legText")
                .text(function(d, i) { return d.full ; })
                // .text("class", function(d) {return (d.language)})
                .attr("y", 30)
                .attr("x", function(d,i) { return(svgWidth- (i+1) *55)})
                .attr("font-size", 8)
                .attr("font-family", "sans-serif")
                .attr("font-weight", "lighter")

                // .attr("y", function(d, i) { return (25 * i) + 45; })
                // .attr("y", function(d, i) { return (40 * i) + 20 + 4; })


    legendSVG.append("text")

        .style("text-anchor", "start")
        .text("Language")
        .attr("x", svgWidth - 200)
        .attr("y",10);


    // Add the scatterplot
    scatters = g.selectAll("scatter-dots")
                .data(data)
                .enter().append("circle")

                .attr('class', function(d) {return 'reference ' + d.language})
                .attr("cx", function (d) { return brushXConverter(d.avgPos); } )

                .attr("cy", function (d) { return y(d.dateLog); } )
                .attr("r", 5)
                // .style("fill", function(d) { return d.language;})
                .on("mouseover", function(d) {
                    //1. nodes get bigger
                    d3.select(this) // Get bigger on hover
                        .transition()
                        .duration(200)
                        .attr('r', 10);

                    //2. show tooltip div
                    div.transition()
                        .duration(200)
                        //.style("opacity", .9);
                        .style("opacity", 1);

                    //2. rebuild the tootip interms of content and position
                    div.html('<p>' + d.bookTitle + '</p>' +
                        "<br/>Author: " + d.author +
                        "<br/>Publication Year: " + d.date)

                    let divWidth = div.node().getBoundingClientRect().width;
                    let divHeight = div.node().getBoundingClientRect().height;
                    let blockLegendY = 155; //use console to ditect...
                    let divY;
                        divY = d3.event.pageY - divHeight - this.r.baseVal.value * 2; //based on the height of the tooltip, decide it's Y value
                    let divX;
                        if (d3.event.pageX < svgWidth - 5 * 55 - divWidth){
                            divX = d3.event.pageX + this.r.baseVal.value * 2; // tooltip is to the right of the big node
                        } else{
                            divX = d3.event.pageX - this.r.baseVal.value * 2 - divWidth; // tooltip is to the left of the big node to avoid blocking legend
                            if (d3.event.pageX >= svgWidth - 5 * 55 && divY < blockLegendY){ // if the tooltip block the legend from below
                                // console.log(divY); //detect blockLegendY when not sure...
                                // console.log(d3.event.pageX)
                                divY = blockLegendY;
                            }
                        };


                    div.style("left", divX + "px")
                        .style("top", divY + "px");

                    //3. highlight the lines linking the hovered node
                    lineClassName = '.' + 'node' + d.id;
                    d3.selectAll(lineClassName).nodes().forEach(line => line.classList.toggle('highlighted'));

                    //4. highlight the pages linked to the hovered node
                    let referenceTitle = d.bookTitle;
                    pageNumIds = [];
                    data.forEach((thisData) => {
                        if (thisData.bookTitle == referenceTitle){
                            pageNumIds.push('#' + 'page' + thisData.page)
                        }
                    })
                    pageNumIds.forEach((pageId) => {
                        d3.select(pageId)
                            .classed('highlighted',true)
                    })

                    //5. highlight the language lengend accordingly
                    let selectedLanguageClass = d3.select(this).node().classList[1];
                    selectedLanguageLegendId = '#' + selectedLanguageClass + 'Legend';
                    d3.select(selectedLanguageLegendId)
                        .select('rect')
                        .transition()
                        .duration(200)
                        .attr('height', 10)
                        .attr('y', 36);
                  })

                .on("mouseout", function(d) {
                    //1. nodes get smaller
                    d3.select(this) // nodes get smaller after hoverout
                        .transition()
                        .duration(100)
                        .attr('r', 5);

                    //2. hide tooltip div
                    div.transition()
                        .duration(100)
                        .style("opacity", 0);

                    //3. unhighlighing the highlighted lines
                    d3.selectAll(lineClassName).nodes().forEach(line => line.classList.toggle('highlighted'));

                    //4. unhighlighing the highlighted pages
                    pageNumIds.forEach((pageId) => {
                        d3.select(pageId)
                            .classed('highlighted',false)
                    })

                    //5. unhighlighing the highlighted legend
                    d3.select(selectedLanguageLegendId)
                        .select('rect')
                        .transition()
                        .duration(100)
                        .attr('height', 4)
                        .attr('y', 38);
                        // .classed('highlightLegend', false);


                })

                //For debugging purposes
                .on('click', function(d, i) {
                    console.log("You clicked", d), i;
                    /*
                    d3.select(this)
                        .transition()
                        .attr('r', 20); */

                });

    //Add the links
    links = gLinks.selectAll('.link')
                    .data(data)
                    .enter().append('line')

                        .attr('class',function(d) { return 'link node' + d.id})
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
