//Creates Width of the Canvas
var width = 400, height = 100;

//Creates Array to hold Chart Data
var chartData = []


//Parses Through Combined.csv in /data folder
function getData(){
    parsedData = [];
    d3.csv("data/combined.csv", function(data) {
        //console.log(data); //this would print out all the data in a list of objects from the CSV
        //console.log(data[0]); //this would print out the first object in the list of objecs from the CSV
        /*
            This loops through the list, retrieves that year published, 
            converts it from a string into a number, removes NaN, sorts the keys ascendingly
            and pushes those values into the chartData array
        */
        for(i=0;i<=data.length;i++){
            if(data[i].Date !='NA'){
                date = (Number(data[i].Date))
                parsedData.push(date)
                parsedData.sort(function(a, b){return a - b})
            }
        }
        
        
    });
    return parsedData
}

chartData = getData()
//console.log(chartData) //This prints out new Chart Data
//Filter Through Duplicates



var svg = d3.select("ul")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

var scale = d3.scaleLinear()
              .domain([d3.min(chartData), d3.max(chartData)])
              .range([height/2, 0]);

var y_axis = d3.axisLeft()
              .scale(scale);

svg.append("g")
   .attr("transform", "translate(50, 10)")
   .call(y_axis);

