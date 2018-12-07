// parse the date / time
//var parseTime = d3.timeParse("%y");

var scatters;
var links;

var y;

// variables that are used in both 'mouseover' & 'mouseout'
var lineClassName;
var pageNumIds;
var selectedLanguageLegendId;
var hoveredLanguageNodesDs;
// var wasHiglighted = false;


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
            .attr("id", function(d) {return (d.language) + 'Legend'})
            // .attr("width","80px")
            // .attr("height","80px")
            // .attr("class","leg")


    legend.append("rect")
            .attr("y", 38)
            .attr("width","30px")
            .attr("height","4px")
            .attr("x", function(d,i) { return(svgWidth- (i+1) *55)})
            // .attr("fill", function(d) { return cValue(data)})

            .attr("class", function(d) {return (d.language)})
            .attr("stroke","#7f7f7f")
            .attr("stroke-width","0.2");
            // color = d3.scaleOrdinal(d3.schemeCategory10);

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


    legend.on("mouseover", function(d) {
                let hoveredLanguage = d.language;
                selectedLanguageLegendId = '#' + hoveredLanguage + 'Legend';
                languageHeightChange(selectedLanguageLegendId, true)

                hoveredLanguageNodesDs = data.filter((dn) => dn.language == hoveredLanguage);
                // console.log(hoveredLanguageNodesDs)
                hoveredLanguageNodesDs.forEach((n_d) => nodeHighlighted(n_d, data, true))


            })
            .on("mouseout", function(d) {
                languageHeightChange(selectedLanguageLegendId, false)
                // console.log(hoveredLanguageNodesDs)
                hoveredLanguageNodesDs.forEach((n_d) => nodeHighlighted(n_d, data, false))
            })



    legendSVG.append("text")
        // .attr("transform",
        //     "translate(" + (width/2) + " ," +
        //     (height + margin.top) + ")")
        .style("text-anchor", "start")
        .text("Language")
        .attr("x", svgWidth - 200)
        .attr("y",10);


    // Add the scatterplot
    scatters = g.selectAll("scatter-dots")
                .data(data)
                .enter().append("circle")
                .attr('id', (d) => "node" + d.id)
                // .attr("cx", 30)
                // .attr("cy", 30)
                // .attr("r", 20);

                .attr('class', function(d) {return 'reference ' + d.language})
                // .attr("cx", function (d) { return brushXConverter(d.page); } )
                .attr("cx", function (d) { return brushXConverter(d.avgPos); } )

                .attr("cy", function (d) { return y(d.dateLog); } )
                .attr("r", 5)
                // .style("fill", function(d) { return d.language;})
                .on("mouseover", function(d) {
                                nodeHighlighted(d, data, true);

                                toggleTooltip(div, d, 1);

                                let selectedLanguageClass = d3.select(this).node().classList[1];
                                selectedLanguageLegendId = '#' + selectedLanguageClass + 'Legend';
                                languageHeightChange(selectedLanguageLegendId, true)

                  })

                .on("mouseout", function(d) {
                                nodeHighlighted(d, data, false);

                                toggleTooltip(div, d, 0)

                                languageHeightChange(selectedLanguageLegendId, false)
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



function nodeRChange(nodeNode, r){
    d3.select(nodeNode) // Get bigger on hover
        .transition()
        .duration(200)
        .attr('r', r);
}

function toggleTooltip(tooltipDiv, d, opacity){

    tooltipDiv.transition()
                .duration(200)
                //.style("opacity", .9);
                .style("opacity", opacity);

    if (opacity == 1){
        let nodeId = '#node' + d.id;
        let nodeNode = d3.select(nodeId).node();

        // rebuild the tootip interms of content and position
            tooltipDiv.html('<p>' + d.bookTitle + '</p>' +
                            "<br/>Author: " + d.author +
                            "<br/>Publication Year: " + d.date)

            let divWidth = tooltipDiv.node().getBoundingClientRect().width;
            let divHeight = tooltipDiv.node().getBoundingClientRect().height;
            let blockLegendY = 155; //use console to ditect...
            let divY;
                divY = d3.event.pageY - divHeight - nodeNode.r.baseVal.value * 2; //based on the height of the tooltip, decide it's Y value
            let divX;
                if (d3.event.pageX < svgWidth - 5 * 55 - divWidth){
                    divX = d3.event.pageX + nodeNode.r.baseVal.value * 2; // tooltip is to the right of the big node
                } else{
                    divX = d3.event.pageX - nodeNode.r.baseVal.value * 2 - divWidth; // tooltip is to the left of the big node to avoid blocking legend
                    if (d3.event.pageX >= svgWidth - 5 * 55 && divY < blockLegendY){ // if the tooltip block the legend from below
                        divY = blockLegendY;
                    }
                };

            tooltipDiv.style("left", divX + "px")
                .style("top", divY + "px");
    }
}

function toggleLines(lineClassName){
    d3.selectAll(lineClassName).nodes().forEach(line => line.classList.toggle('highlighted'));
}

function togglePages(pageNumIds, ifHighlight){
    pageNumIds.forEach((pageId) => {
        d3.select(pageId)
            .classed('highlighted',ifHighlight)
    })
}

function languageHeightChange(selectedLanguageLegendId, ifHighlight){
    let languageH = ifHighlight ? [10, 36] : [4, 38];
    d3.select(selectedLanguageLegendId)
        .select('rect')
        .transition()
        .duration(500)
        .attr('height', languageH[0])
        .attr('y', languageH[1]);
}


//integrate all above

function nodeHighlighted(d, data, ifHighlight){
    let nodeId = '#node' + d.id;
    let nodeNode = d3.select(nodeId).node();


    let nodeR = ifHighlight ? 10 : 5;


    //1. nodes get bigger
    nodeRChange(nodeNode, nodeR);

    //2. highlight the lines linking the hovered node
    lineClassName = '.' + 'node' + d.id;
    toggleLines(lineClassName);

    //3. highlight the pages linked to the hovered node
    pageNumIds = [];

    let referenceTitle = d.bookTitle;

    data.forEach((thisData) => {
        if (thisData.bookTitle == referenceTitle){
            pageNumIds.push('#' + 'page' + thisData.page)
        }
    })

    togglePages(pageNumIds, ifHighlight);

    // //4. highlight the language lengend accordingly
    // let selectedLanguageClass = d3.select(nodeNode).node().classList[1];
    // let newSelectedLanguageLegendId = '#' + selectedLanguageClass + 'Legend';
    // if(newSelectedLanguageLegendId != selectedLanguageLegendId || wasHiglighted != ifHighlight){
    //     languageHeightChange(selectedLanguageLegendId, ifHighlight);
    //     wasHiglighted = ifHighlight;
    // }
    // selectedLanguageLegendId = newSelectedLanguageLegendId;

}
