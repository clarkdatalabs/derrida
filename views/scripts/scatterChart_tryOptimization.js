
var scatters;
var links;
var y;

// variables that are used in both 'mouseover' & 'mouseout'
var lineClassName;
var pageNumIds;
var selectedLanguageLegendId;
var hoveredLanguageNodesDs;
// var wasHiglighted = false;

var darkblue_memory;
var baseline_memory;

d3.csv("data/dataNode.csv", function(data) {
    // Convert strings to numbers with '+'
    data.forEach(function(error,d) {
        d.date = +d.date;
        d.page = +d.page;

    });

    // compute logarithmic scale for date data
    for (i = 0; i < data.length; ++i) {
        data[i].logDate = Math.abs(Math.log(1969.5 - data[i].date));
    }
    // use 'logDate' variable in scatter

    // for just each publication
        // compute average position given multiple page locations
            var dataRollup = d3.nest()
                .key(function(d) {
                    return +d.id;
                })
                .rollup(function(d) {
                    return d3.mean(d, function(g) {
                        return +g.page; })
                    })
                .entries(data);
        // write in data
            data.forEach(function (d){
                match = dataRollup.filter(function(g) {return g.key==d.id});
                d.avgPos = match[0].value;
            })

    // for just each publication
        // compute average position given multiple page locations
            var dataRollupAuthor = d3.nest()
                .key(function(d) {
                    return d.author;
                })
                .rollup(function(d) {
                    return {
                        'avePage': d3.mean(d, function(g) { return +g.page; }),
                        'aveDate': d3.mean(d, function(g) { return +g.date; })
                    }
                })
                .entries(data);
        // write in data
            data.forEach(function (d){
                matchAuthor = dataRollupAuthor.filter(function(g) {return g.key==d.author});
                d.avgPosAuthor = matchAuthor[0].value.avePage;
                d.logDateAuthorAvg = Math.abs(Math.log(1969.5 - matchAuthor[0].value.aveDate))
            })





    var margin = {top: 20, right: 15, bottom: 60, left: 85}
    var width = 960 - margin.left - margin.right;
    var height = pageGroupY - pageHeight/2;
    var heightXAxis = height + pageHeight;

    // Scale the range of the data

    var maxY = 6.5; // FIX to compute max logDate value + 1
    var y = d3.scaleLinear()
        .domain([maxY, 0.4])
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
            "translate(" + (width/1.2) + " ," +
            (height + margin.top + pageHeight + 40) + ")")

        .style("text-anchor", "start")
        .text("Page of Reference");


    // Create the y axis
    var yAxis = d3.axisLeft()
        .scale(y)
        .tickValues([Math.log(1.5), Math.log(2.5), Math.log(3.5), Math.log(4.5), Math.log(6.5),
            Math.log(9.5), Math.log(14.5), Math.log(19.5), Math.log(29.5), Math.log(39.5), Math.log(49.5),Math.log(69.5),
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
        .attr("x",55 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "end")
        .text("Publication Year of Reference");

    var gLinks = main
        .append('g')
        .attr('class', 'link')

    var g = main.append("svg:g");

    // Define the div for the tooltip
    var div = d3.select("#tooltip")  //gets attribute from index.html
        .attr("class", "tooltip")
        .style("opacity", 0);

    // append legend to page
    var legendSVG = d3.select("svg")


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
                .text(function(d, i) { return d.full ; })
                .attr("y", 30)
                .attr("x", function(d,i) { return(svgWidth- (i+1) *55)})
                .attr("font-size", 8)
                .attr("font-family", "sans-serif")
                .attr("font-weight", "lighter")


    legend.on("mouseover", function(d) {
                let hoveredLanguage = d.language;
                selectedLanguageLegendId = '#' + hoveredLanguage + 'Legend';
                languageHeightChange(selectedLanguageLegendId, true)

                hoveredLanguageNodesDs = data.filter((dn) => dn.language == hoveredLanguage);
                // console.log(hoveredLanguageNodesDs)
                if (hoveredLanguage== 'fr' && darkblue_memory !== undefined) {
                    hoveredLanguageNodesDs = darkblue_memory;
                    console.log('using darkblue');
                    return;
                }

                hoveredLanguageNodesDs.forEach((n_d) => nodeHighlighted(n_d, data, true))
                console.log(hoveredLanguageNodesDs);
                if (hoveredLanguage== 'fr') {
                    darkblue_memory = JSON.parse(JSON.stringify(hoveredLanguageNodesDs))
                    console.log('saving darkblue');
                }

            })
            .on("mouseout", function(d) {
                let hoveredLanguage = d.language;
                languageHeightChange(selectedLanguageLegendId, false)
                if (baseline_memory !== undefined) {
                    hoveredLanguageNodesDs = baseline_memory;
                    console.log('out');
                    return;
                }
                // console.log(hoveredLanguageNodesDs)
                hoveredLanguageNodesDs.forEach((n_d) => nodeHighlighted(n_d, data, false))
                if (baseline_memory == undefined) {
                    baseline_memory = JSON.parse(JSON.stringify(hoveredLanguageNodesDs));
                    console.log('saved baseline');
                }
            })



    legendSVG.append("text")
        .style("text-anchor", "start")
        .text("Language")
        .attr("x", svgWidth - 200)
        .attr("y",10);


    // Add the scatterplot and links
        drawScattersAndLinks('id', data, g, gLinks, y, height, div);

            // have the radio button work to switch back and forth
                // var showOption = d3.selectAll('.showOption')
                //                     .on('change', function(){
                //                         gLinks.remove();
                //                         g.remove();
                //                         gLinks = main.append('g')
                //                                         .attr('class', 'link');
                //                         g = main.append("svg:g");
                //                         drawScattersAndLinks(this.value, data, g, gLinks, y, height, div);
                //                     })



    drawPages();
    gBrush.call(brush);
    gBrush.call(brush.move, [0, pageGroupWidth]);
});




function drawScattersAndLinks(baseOnCol, data, g, gLinks, y, height, tooltopDiv ){
    let avePosUsed,
        dateUsed;

    if (baseOnCol == 'id'){
        avePosUsed = 'avgPos';
        dateUsed = 'logDate';
    } else if (baseOnCol == 'author'){
        avePosUsed = 'avgPosAuthor';
        dateUsed = 'logDateAuthorAvg';
    }

    // Add the scatterplot
    scatters = g.selectAll("scatter-dots")
                .data(data)
                .enter().append("circle")
                .attr('id', (d) => "node" + d.id)


                .attr('class', function(d) {return 'reference ' + d.language})
                .attr("cx", function (d) {
                    // console.log(avePosUsed,":", d[avePosUsed])
                    return brushXConverter(d[avePosUsed]);
                } )

                .attr("cy", function (d) { return y(d[dateUsed]); } )
                .attr("r", 5)
                .on("mouseover", function(d) {

                                nodeHighlighted(d, data, true);
                                nodeWithSameAuthorHighlighted(d, data, true, showOtherPublicationsWithTheSameAuthor);

                                toggleTooltip(tooltopDiv, d, 1, baseOnCol);

                                let selectedLanguageClass = d3.select(this).node().classList[1];
                                selectedLanguageLegendId = '#' + selectedLanguageClass + 'Legend';
                                languageHeightChange(selectedLanguageLegendId, true)

                  })

                .on("mouseout", function(d) {
                                nodeHighlighted(d, data, false);
                                nodeWithSameAuthorHighlighted(d, data, false, showOtherPublicationsWithTheSameAuthor);

                                toggleTooltip(tooltopDiv, d, 0)

                                languageHeightChange(selectedLanguageLegendId, false)
                })

                //For debugging purposes
                .on('click', function(d, i) {
                    console.log("You clicked", d), i;

                });

    //Add the links
    links = gLinks.selectAll('.link')
                    .data(data)
                    .enter().append('line')
                        .attr('class',function(d) { return 'link node' + d.id})
                        .attr('x1', function (d) { return brushXConverter(d[avePosUsed]); }) // the x of scatter will change (maybe p.avePage)
                        .attr('y1', function (d) { return y(d[dateUsed]) < height ? y(d[dateUsed]) : height ; })
                        .attr('x2', function (d) { return brushXConverter(d.page ); })
                        .attr('y2', (d) => height)
                        .attr('stroke-width', '0.4')
                        .attr('stroke','#CCC')
}







function nodeRChange(nodeNode, r){
    d3.select(nodeNode) // Get bigger on hover
        .transition()
        .duration(200)
        .attr('r', r);
}

function toggleTooltip(tooltipDiv, d, opacity, baseOnCol=''){

    tooltipDiv.transition()
                .duration(200)
                //.style("opacity", .9);
                .style("opacity", opacity);

    if (opacity == 1){
        let nodeId = '#node' + d.id;
        let nodeNode = d3.select(nodeId).node();

        // rebuild the tootip interms of content and position
        switch(baseOnCol){
            case 'id':
                tooltipDiv.html('<p>' + d.bookTitle + '</p>' +
                                "<br/>Author: " + d.author +
                                "<br/>Publication Year: " + d.date);
                break;
            case 'author':
                tooltipDiv.html('<p>' + d.author + '</p>' +
                                "<br/>Publications: " + d.bookTitle); // need nest data for all publications for each author
        }


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

function nodeWithSameAuthorHighlighted(d, data, ifHighlight, showOtherPublicationsWithTheSameAuthor){
    if (! showOtherPublicationsWithTheSameAuthor) return;

    let authorName = d.author;
    let nodeHoveredId = d.id;
    let nodeR = ifHighlight ? 10 : 5;
    for (let i = 0; i < data.length; i ++){
        let thisData = data[i];
        if (thisData.author == authorName && thisData.id != nodeHoveredId){
            let nodeId = '#node' + thisData.id;
            let nodeNode = d3.select(nodeId).node();
            nodeRChange(nodeNode, nodeR);
        }
    }
}


function nodeHighlighted(d, data, ifHighlight){

    // let authorName = d.author;
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
