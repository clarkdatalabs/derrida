




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


// 0. Set SVG to make it adaptable
var svg = d3.select('svg');
var svgWidth;
var svgHeight;


svgWidth = $(window).width() - 30;
svgHeight = $(window).height() - 90;
svg.attr('width',svgWidth)
    .attr('height',svgHeight)
    .style('background', '#00D9E8');



d3.csv("data/data.csv", function(data) {
    console.log(data);
    var derrida_data = data;

    drawPages();
});





function drawPages(){
    // 1.0 Set some Parameters
    var totalPage = 425;  //This is the largest page num in the data, but the real number might be larger
    var margin_left_and_right = 10;
    var padding_in_between = 0.5;

    var pageHeight = 40;
    var pageGroupWidth = (svgWidth) - 2 * margin_left_and_right;
    var pageWidth = pageGroupWidth / totalPage - padding_in_between;


    // 1.1 conver page to x value based on svgWidth
    var pageXConverter = d3.scaleLinear()
                            .domain([0, totalPage])
                            .range([0, pageGroupWidth]);


    // 1.2 Create the group for pages and keep the margin
    var pages = svg.append("g")
                    .attr("transform", "translate(" + margin_left_and_right + "," +  svgHeight/2 + ")")


    // 1.3 create the pages
    pages.selectAll('.page')
            .data(d3.range(totalPage))
            .enter()
            .append('rect')
            .attr('class', 'page')
            .attr('width', pageWidth)
            .attr('height', pageHeight)
            .attr('x', (d,i) => pageXConverter(i))
            .style('fill', 'orange')
}
