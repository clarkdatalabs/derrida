d3.csv("data/combined.csv", function(data) {
    // Convert strings to numbers.
    data.forEach(function(error,d) {
        //if (error) throw error;

        if (d.Date == 'NA' || d.PublicationYear == 'NA' ){
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
    
    var svgWidth = $(window).width() - 30;
    var svgHeight = $(window).height() - 90;
    
    // Scale the range of the data  
    var x = d3.scaleLinear()
              .domain([0, d3.max(data, function (d) { return d.page; })])
              .range([ 0, width ]);
    
    var y = d3.scaleLinear()
    	      .domain([0, d3.max(data, function (d) { return d.Date; })])
    	      .range([ height, 0 ]);
 
    //Create Canvass
    var chart = d3.select('svg')
    	.append('svg:svg')
    	.attr('width', svgWidth)
    	.attr('height', svgHeight)
    	.attr('class', 'chart')

    //Create and add chart to canvas
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
        .ticks(10)
    
        // Add y axis to canvas
    main.append('g')
    	.attr('transform', 'translate(0,0)')
    	//.attr('class', 'main axis date')
    	.call(yAxis);

    
    var g = main.append("svg:g"); 
    
    // Add the scatterplot
    g.selectAll("scatter-dots")
      .data(data)
      .enter().append("circle")
          .attr("cx", function (d) { return x(d.page); } )
          .attr("cy", function (d) { return y(d.PublicationYear); } )
          .attr("r", 8);
});