// parse the date / time
//var parseTime = d3.timeParse("%y");

d3.csv("data/combined.csv", function(data) {
    // Convert strings to numbers.
    data.forEach(function(error,d) {
        //if (error) throw error;

        if (d.Date == 'NA' || d.Date == 'NaN' ){
            d.Date = 0;
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

  
    var margin = {top: 20, right: 15, bottom: 60, left: 80}
    var width = 960 - margin.left - margin.right
    var height = 500 - margin.top - margin.bottom;

    
    var minX = 0;
    var maxX = 445;

    var minY = d3.min(data, function(d) { return d.Date });
    var maxY = d3.max(data, function(d) { return d.Date });
    
    // Scale the range of the data  
    var x = d3.scaleLinear()
              .domain([0, maxX])
              .range([ 0, width ]);
    
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
    var main = chart.append('g')
    	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    	.attr('width', width)
    	.attr('height', height)
    	.attr('class', 'main')   
        
    
    // Draw the x axis
    var xAxis = d3.axisBottom()
    	.scale(x)
        //.orient('bottom');
        
    // Add x axis to canvas
    main.append('g')
    	.attr('transform', 'translate(0,' + height + ')')
    	//.attr('class', 'main axis date')
    	.call(xAxis);

    // Create the y axis
    var yAxis = d3.axisLeft()
        .scale(y)
        //.tickFormat(d3.timeFormat("%Y"))
        .ticks(20)
    
    // Add y axis to canvas
    main.append('g')
    	.attr('transform', 'translate(0,0)')
    	.attr('class', 'main axis date')
        .attr('x',0)
        .attr('y',5)
        .attr('dy','.71em')
        .call(yAxis)

    
    var g = main.append("svg:g"); 
    
    // Add the scatterplot
    g.selectAll("scatter-dots")
      .data(data)
      .enter().append("circle")
          .attr("cx", function (d) { return x(d.page); } )
          .attr("cy", function (d) { return y(d.Date); } )
          .attr("r", 4);
});