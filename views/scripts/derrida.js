//import { } from 'd3-fetch'
import all from 'd3-fetch';

//notworking
var d3 = require('d3');

module.exports = {
    importCSV: function (csv){
        d3.csv(csv).then(function(data) {
            console.log(data); // [{"Hello": "world"}, …]
          });
    }

}
