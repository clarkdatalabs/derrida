var pageContext = svg.append("g")
    .attr('class', 'pageContext')
    .attr("transform", "translate(" + margin_left + "," + pageGroupY + ")");


var pages;
var pageGroup;
var brush;
var gBrush;
var brushResizePath;
var handle;




function drawPages() {


    brush = d3.brushX()
        .extent([
            [0, 0],
            [pageGroupWidth, pageHeight]
        ])
        .on("start brush end", brushed);

    pageGroup = pageContext.append("g")
        .attr('class', 'pageGroup');

    pages = pageGroup.selectAll('.page')
                    .data(pageData)
                        .enter()
                        .append('rect')
                        .attr('class', 'page')
                        .attr('id', (d, i) =>  "page" + (i).toString())
                        .attr('width', pageWidth)
                        .attr('height', pageHeight)
                        .attr('x', (d, i) => pageXConverter(i * numOfPageEveryRec))
                        .style('fill', 'rgba(0,0,0,0.2)');

    gBrush = pageContext.append("g")
        .attr("class", "brush")
        .call(brush);



    brushResizePath = function(d) {
        var e = +(d.type == "e"),
            x = e ? 1 : -1,
            y = pageHeight / 2;
        return "M" + (.5 * x) + "," + y + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6) + "V" + (2 * y - 6) + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y) + "Z" + "M" + (2.5 * x) + "," + (y + 8) + "V" + (2 * y - 8) + "M" + (4.5 * x) + "," + (y + 8) + "V" + (2 * y - 8);
    }
    handle = gBrush.selectAll(".handle--custom")
        .data([{ type: "w" }, { type: "e" }])
        .enter().append("path")
        .attr("class", "handle--custom")
        .attr("stroke", "#000")
        .attr("fill", "rgba(0,0,0,0.1)")
        .attr("cursor", "ew-resize")
        .attr("display", "none")
        .attr("d", brushResizePath);

    gBrush.call(brush.move, [0, pageGroupWidth]);



}







function brushed() {
    var s = d3.event.selection;

    // console.log(s)
    // console.log(pageGroupWidth)

    if (!s) {
        handle.attr("display", "none");
    } else {
        // console.log('come to here')
        // console.log(scatters)
        var brushedStartPage = Math.floor(s[0] * totalPage / pageGroupWidth);
        var brushedEndPage = Math.floor(s[1] * totalPage / pageGroupWidth);

        pages.classed("active", function(d) { return brushedStartPage <= d && d <= brushedEndPage; });
        handle.attr("display", null).attr("transform", function(d, i) { return "translate(" + [s[i], -pageHeight / 4] + ")"; });

        //highlight the circles accordingly
        scatters.classed('selected', function(d) { return brushedStartPage <= d.page && d.page <= brushedEndPage; });

        links.classed('show', function(d) { return brushedStartPage <= d.page && d.page <= brushedEndPage; });

        //highlighted()
    }


}

/*
function highlighted(points2highlight) {
    var s = d3.event.selection;

    var brushedStartPage = Math.floor(s[0] * totalPage / pageGroupWidth);
    var brushedEndPage = Math.floor(s[1] * totalPage / pageGroupWidth);

    links.classed('highlighted', function(d) { return brushedStartPage <= d.page && d.page <= brushedEndPage; });
} */
