




//Trial Refferals
// d3.select('h3').style('color', 'darkblue');
// d3.select('h3').style('font-size', '24px');

// var fruits = ['apple', 'mango', 'banana', 'orange'];
// d3.select('ul')
//     .selectAll('li')
//     .data(fruits)
//     .enter()
//     .append('li')
//     .text(function(d) { return d; });
//
// //Select SVG element
// var svg = d3.select('svg');
//
// svg.attr('width',200)
//     .attr('height',200);
// //Create rectangle element inside SVG
// var greenRect = svg.append('rect')
//                     .attr('x', 50)
//                     .attr('y', 50)
//                     .attr('width', 200)
//                     .attr('height', 100)
//                     .attr('fill', 'green');
//
// var redRect = greenRect.transition()
//                         .duration(5000)
//                         .ease(d3.easeBounce)
//                         .attr('fill', 'red')
//                         .attr('height', 200)
//                         .attr('width', 100);



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


pageContext.append("g")
              .attr("class", "brush")
              // .attr('padding', 2em)
              .call(brush)
              .call(brush.move, pageXConverter.range());


function brushed() {
    var s = d3.event.selection || brushXConverter.range();
    var brushedStartPage = s[0];
    var brushedEndPage = s[1];
    console.log(brushedEndPage)
}
