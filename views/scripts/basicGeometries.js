
var totalPage = 445;
var numOfPageEveryRec = 1;
var margin_left = 80;
var margin_right = 10;
var margin_bottom = 80;
var padding_in_between = 2.2;

var pageHeight = 40;
var pageGroupWidth = (svgWidth) - margin_left - margin_right;
var pageWidth = pageGroupWidth / (totalPage/numOfPageEveryRec) - padding_in_between;

var pageGroupY = svgHeight - pageHeight - margin_bottom;

var pageData = d3.range((totalPage/numOfPageEveryRec)+1);



var pageContext = svg.append("g")
                    .attr('class','pageContext')
                    .attr("transform", "translate(" + margin_left + "," +  pageGroupY + ")");

var pageXConverter;



function drawPages(){
    // 1.1 conver page to x value based on svgWidth
    pageXConverter = d3.scaleLinear()
                            .domain([0, totalPage])
                            .range([0, pageGroupWidth]);


    // 1.2 Create the group for pages and keep the margin

    var pageGroup = pageContext.append("g")
                                .attr('class','pageGroup')



    // 1.3 create the pages
    pageGroup.selectAll('.page')
                .data(pageData)
                .enter()
                .append('rect')
                .attr('class', 'page')
                .attr('width', pageWidth)
                .attr('height', pageHeight)
                .attr('x', (d,i) => pageXConverter(i * numOfPageEveryRec))
                .style('fill', 'orange')
}





// 2 brush on pages
var brush = d3.brushX()
    .extent([[0, 0], [pageGroupWidth, pageHeight]])
    .on("brush end", brushed);

var brushXConverter = d3.scaleLinear()
                        .domain([0, totalPage])
                        .range([0, pageGroupWidth]);


var gBrush = pageContext.append("g")
                          .attr("class", "brush")
                          .call(brush)
                          // .call(brush.move, pageXConverter.range());


var brushResizePath = function(d) {
    var e = +(d.type == "e"),
        x = e ? 1 : -1,
        y = pageHeight / 2;
    return "M" + (.5 * x) + "," + y + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6) + "V" + (2 * y - 6) + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y) + "Z" + "M" + (2.5 * x) + "," + (y + 8) + "V" + (2 * y - 8) + "M" + (4.5 * x) + "," + (y + 8) + "V" + (2 * y - 8);
}


var handle = gBrush.selectAll(".handle--custom")
                    .data([{type: "w"}, {type: "e"}])
                    .enter().append("path")
                    .attr("class", "handle--custom")
                    .attr("stroke", "#000")
                    .attr("fill", "rgba(0,0,0,0.1)")
                    .attr("cursor", "ew-resize")
                    .attr("display", "none")
                    .attr("d", brushResizePath);

gBrush.call(brush.move, pageXConverter.range());

// function brushmoved() {
//   var s = d3.event.selection;

// }

function brushed() {
    var s = d3.event.selection || brushXConverter.range();
    var s = d3.event.selection;

    if (s[1] == 0) {
      handle.attr("display", "none");
      // circle.classed("active", false);
    } else {
      // circle.classed("active", function(d) { return s[0] <= d && d <= s[1]; });
      handle.attr("display", null).attr("transform", function(d, i) { return "translate(" + [ s[i], - pageHeight / 4] + ")"; });
    }

    var brushedStartPage = Math.floor(s[0] * totalPage/pageGroupWidth);
    var brushedEndPage = Math.floor(s[1] * totalPage/pageGroupWidth);
    console.log(brushedEndPage)
}
