
/*
    Variables
*/
//Creates Height and Width of the Canvas
var margin = { top: 50, right: 50, bottom: 50, left: 50 }
var height = 500 - margin.top - margin.bottom
var width = 500 - margin.left - margin.right

var body = d3.select("svg")
            //.append("svg")
            .attr("width", width)
            .attr("height", height);
/*
    Functions
*/
//Parses Through Combined.csv in /data folder

//unused
function getDateData(){
    var parsedData = [];
    d3.csv("data/combined.csv", function(data) {
        //console.log(data); //this would print out all the data in a list of objects from the CSV
        //console.log(data[0]); //this would print out the first object in the list of objecs from the CSV
        /*
            This loops through the list, retrieves that year published, 
            converts it from a string into a number, removes NaN, sorts the keys ascendingly
            and pushes those values into the chartData array
        */

        data.forEach(function(d) {
            d.Date = +d.Date;
            d.PublicationYear = +d.PublicationYear;
        });
        for(i=0;i<=data.length;i++){
            /*
            if(data[i].Date !='NA'){
                date = parseInt(data[i].Date)
                parsedData.push(date)
                parsedData.sort(function(a, b){return a - b})
            } */
            date = data[i].Date
            parsedData.push(date)
            parsedData.sort(function(a, b){return a - b})
        }
        
        
    });
    return parsedData
}
//unused
function customYAxis(svg) {
    svg.call(yAxis);
    svg.select(".domain").remove();
    svg.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "2,2");
    svg.selectAll(".tick text").attr("x", 4).attr("dy", -4);
}

//Creates Array to hold Chart Data
//const chartData = getDateData()
//const chartData = [1111,1500,1900,1900,1996,1998,0,2020]
//console.log(chartData) //This prints out new Chart Data


d3.csv("data/combined.csv", function(data) {
    // Convert strings to numbers.
    data.forEach(function(d) {
        if(d.Date == 'NA' || d.PublicationYear == 'NA' ){
            d.Date = 1500
        }
        else{
            d.Date = +d.Date;
            d.PublicationYear = +d.PublicationYear;
        }
        
    });

    var minX = 0;
    var maxX = 445;

    var minY = d3.min(data, function(d) { return d.Date });
    var maxY = d3.max(data, function(d) { return d.Date });

    //SVG
    var svg = body.append('svg')
        .attr('height',height + margin.top + margin.bottom)
        .attr('width',width + margin.left + margin.right)
        .append('g')
        .attr('transform','translate(' + margin.left + ',' + margin.top + ')')

    //Scales
    var yScale = d3.scaleLinear()
        .domain([minY, maxY])
        .range([height,0])

    var xScale = d3.scaleLinear()
        .domain([minX, maxX])
        .range([0,width])


    //Y-Axis
    var yAxis = d3.axisLeft()
            //.tickSize(width)
            .scale(yScale)
            //.tickFormat(d3.timeFormat("%Y"))
            .ticks(10)
            //.orient('left');
    
    // Add scales to axis
    var xAxis = d3.axisBottom()
            .scale(xScale)
    
    //Display SVG
    svg.append('g')
        .attr('class', 'axis')
        .call(yAxis)
        //.call(customYAxis)
        .append('text') // y-axis Label
        .attr('class','label')
        .attr('transform','rotate(-90)')
        .attr('x',0)
        .attr('y',5)
        .attr('dy','.71em')
        .style('text-anchor','end')
        .text('Date Published');

    
    svg.append("g")
        .attr("transform", "translate(0, " + height  +")")
        .call(xAxis)
});



