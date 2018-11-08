d3.csv("data/data.csv", function(data) {
    // Convert strings to numbers.
    data.forEach(function(error,d) {
        if (error) throw error;

        if (d.Date == 'NA' || d.Date == 'NAN'){
            d.Date = 1500;
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

  
   
    var margin = {top: 20, right: 15, bottom: 60, left: 60}
      , width = 960 - margin.left - margin.right
      , height = 500 - margin.top - margin.bottom;
    
    var x = d3.scaleLinear()
              .domain([0, d3.max(data, function (d) { return d.page; })])
              .range([ 0, width ]);
    
    var y = d3.scaleLinear()
    	      .domain([0, d3.max(data, function (d) { return d.Date; })])
    	      .range([ height, 0 ]);
 
    var chart = d3.select('body')
    	.append('svg:svg')
    	.attr('width', width + margin.right + margin.left)
    	.attr('height', height + margin.top + margin.bottom)
    	.attr('class', 'chart')

    var main = chart.append('g')
    	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    	.attr('width', width)
    	.attr('height', height)
    	.attr('class', 'main')   
        
    // draw the x axis
    var xAxis = d3.axisBottom()
    	.scale(x)
    	//.orient('bottom');

    main.append('g')
    	.attr('transform', 'translate(0,' + height + ')')
    	.attr('class', 'main axis date')
    	.call(xAxis);


// scale the yAxis
    var axisScale = d3.scaleLinear()               
      .domain([0,100])
      .range([0,100]);


// https://www.dashingd3js.com/d3js-axes

// http://bl.ocks.org/weiglemc/6185069
    // draw the y axis
    var yAxis = d3.axisLeft()
    	.scale(y)
    	//.orient('left');

    main.append('g')
    	.attr('transform', 'translate(0,0)')
    	.attr('class', 'main axis date')
    	.call(yAxis);

    var g = main.append("svg:g"); 
    
    g.selectAll("scatter-dots")
      .data(data)
      .enter().append("circle")
          .attr("cx", function (d) { return x(d.page); } )
          .attr("cy", function (d) { return y(d.PublicationYear); } )
          .attr("r", 8);
});