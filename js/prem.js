var w = 500
    var h = 400
    var barh = 20
    var m = [0,0,0,500]
    var tdata;
    var dataset;
    var subdata;
    var teamcol;
    var state = 0;
//define svg function
     var svg = d3.select("#chart")
         .append("svg")
         .attr("width", w + m[3])
         .attr("height", h);
   //place background rect
   svg.append("rect")
      .attr("class", "background")
      .attr("width", w + m[3])
      .attr("height",h)
      .attr("fill", "#f2f2f2")
      .on("click", function() {
        return up(tdata)
      });
d3.json("../data/dta.json", function(error, data) {
	if (error) {  //If error is not null, something went wrong.
          console.log(error);
	}
	else {
	  tdata = data;
    up(tdata);
   // set state to 0
   var state = 0;


   // place first bars
   // return up(tdata);
   }
 });
var up = function (dta) {
if (state === 1) {
}
else {
if (state === 2) {
 //remove text
	d3.selectAll("text")
	  .remove();
// remove lines
	d3.selectAll("line")
	  .remove();
 	// remove rectangles
   svg.selectAll(".b2")
	  .attr("fill", function() {
	  	return teamcol;
	  })
	  .on("mouseover", function() {
	  	})
	  .transition()
	  .duration(1000)
	  .delay( function(d,i){
	  	 return i * (1000 / subdata.length);
	  	})
	  .attr("y", -50) // want to have bars exit differently?
	  .remove();
 	}
      //key fns
    var club = function(d) {
    return d.club;
    };
    var gf = function(d) {
      return d.gf
    };
    var col = function(d) {
      return d.col
    };

    var players = function(d) {
      return d.players
    };

    dataset = dta;
    // set scales
    var yScale = d3.scale.ordinal()
							.domain(d3.range(dataset.length))
							.rangeRoundBands([0, h], 0.05);
    var xScale = d3.scale.linear()
							.domain([0, d3.max(dataset, function(d) {
							return d.gf;
							})])
							.range([0, w]);
  // adding rectangles
    svg.selectAll("g")
       .data(dataset, club)
       .enter()
       .append("rect")
       .attr("class", "b1")
       .attr("id", function(d) {
 	           	return d.club;
 	           })
 	   .attr("ccol", function(d) {
 	   	      return d.col;
 	   })

 	   .attr("width", function(d) {
			   	 return xScale(d.gf)
			   })
       .attr("height", yScale.rangeBand())
	   .attr("fill", "steelblue")
	   .attr("opacity", 0.85);
     if (state === 0) {
       d3.selectAll(".b1")
         .attr("y", function(d, i) {
          return yScale(i);
         });
     } else {
       d3.selectAll(".b1")
         .attr("y", h + 50)
         .transition()
         .duration(2000)
         .delay(function(d, i) {
              return 1000 + (i+1)*(1000 /tdata.length);
            })
         .attr("y", function(d, i) {
          return yScale(i);
         });   ;
     }


    // generate text
    svg.selectAll("text")
       .data(dataset, club)
       .enter()
       .append("text")
       .text(function(d) {
			   		return d.gf;
	   })
			   .attr("text-anchor", "end")
     		   .attr("x", function(d) {
		   		return xScale(d.gf) - 5;
			   })
			   .attr("font-family", "sans-serif")
			   .attr("font-size", "11px")
			   .attr("fill", "gainsboro");
	   if (state == 2) {
	   svg.selectAll("text").transition()
	   .duration(3500)
	   .delay(3500)
	   .attr("y", function(d, i) {
			   		return yScale(i) + (yScale.rangeBand() / 2) + 2;
			   });
	   }
	   else {
	  svg.selectAll("text").attr("y", function(d, i) {
			   		return yScale(i) + (yScale.rangeBand() / 2) + 2;
			   });
	   }
	// mouse over interaction
       d3.selectAll(".b1")
	     .on("mouseover", function(d, i) {
      	      // dim other bars
       	         d3.selectAll(".b1")
       	           .filter(function(datum, j) {
       	         	return i != j;
       	     	})
       	     .style("opacity", .2);
       	     // dim other text
       	     d3.selectAll("text")
       	       .filter(function(datum, j) {
       	     	return i != j;
       	     	})
       	     .style("opacity", .35);
       	     //add line
       	     var xPlace = parseInt(d3.select(this).attr("width")) + 5;
       	     var yStart = parseInt(d3.select(this).attr("y")) + yScale.rangeBand() / 2;
       	     var clubnm = d3.select(this).attr("id");
       	    svg.append("line")
          	   .attr("id", "cpointer")
               .attr("x1", xPlace)
               .attr("x2", xPlace)
               .attr("y1", yStart)
               .attr("y2", yStart)
               .attr("stroke", "black")
               .transition()
               .duration(250)
               .attr("x2", 700);
               //add club name
            svg.append("text")
               .attr("id","clubname")
               .transition()
               .delay(250)
               .text(clubnm)
               .attr("x", 700 + 5)
               .attr("y", yStart + 3.5)
               .attr("font-family", "sans-serif")
			   .attr("font-size", "11px")
               .attr("fill", "black");
              })
          // mouse out
        .on("mouseout", function(d) {
              d3.selectAll(".b1")
                .style("opacity", 0.85)
                .attr("fill", "steelblue");
              d3.selectAll("text")
                .style("opacity", 1);
              d3.select("#cpointer").remove();
              d3.select("#clubname").remove();
              })
         // click
       .on("click", function(d) {
           	subdata = d.players;
           	console.log(subdata);
           	teamcol = d.col;
           	down(subdata);
           });
       // set state to 1
   state = 1;
 }};
var down = function (subdataset)  {
  state = 2;
  console.log(teamcol);
  var yScale = d3.scale.ordinal()
              .domain(d3.range(subdataset.length))
              .rangeRoundBands([0, h], 0.05);
  var xScale = d3.scale.linear()
              .domain([0, d3.max(subdataset, function(d) {
              return d.g;
              })])
              .range([0, w]);
  var name = function(d) {
    return d.name;
  };
  var g = function(d) {
    return d.g;
  };
   // remove text
  d3.selectAll("text")
    .remove();
   // remove lines
  d3.selectAll("line")
    .remove();
  // transition out old bars
  svg.selectAll(".b1")
     .on("mouseover", function() {
     })
     .transition()
     .duration(1000)
     .delay(function(d,i) {
      return (1000/tdata.length) * (i + 1)
     })
     .attr("y", -50)
     .remove();
 // add rectangles
  svg.selectAll("g")
    .data(subdataset, name)
    .enter()
    .append("rect")
    .attr("class","b2")
    .attr("id", function(d) {
      return d.name
    })
    .attr("y", 450)
    .attr("width", function(d) {
      return xScale(d.g);
    })
    .attr("height", function() {
      return yScale.rangeBand();
    })
    .attr("fill", function() {
    	return teamcol;
    })
    .attr("opacity", 0.85)
    .transition()
    .duration(2000)
    .delay( function(d,i) {
      return 1000 + ((i+1) * (1000/subdataset.length));
    })
    .attr("y", function(d, i) {
          return yScale(i);
    });

    // generate text
    svg.selectAll("text")
       .data(subdataset)
       .enter()
       .append("text")
       .text(function(d) {
			   		return d.g;
	   })
			   .attr("text-anchor", "end")
     		   .attr("x", function(d) {
		   		return xScale(d.g) - 5;
			   })
			   .attr("font-family", "sans-serif")
			   .attr("font-size", "11px")
			   .attr("fill", "gainsboro")
	   .transition()
	   .duration(3500)
	   .delay(3500)
	   .attr("y", function(d, i) {
			   		return yScale(i) + (yScale.rangeBand() / 2) + 2;
			   });
	// mouse over interaction
       d3.selectAll(".b2")
	     .on("mouseover", function(d, i) {
      	      // dim other bars
       	         d3.selectAll(".b2")
       	           .filter(function(datum, j) {
       	         	return i != j;
       	     	})
       	     .style("opacity", .2);
       	     // dim other text
       	     d3.selectAll("text")
       	       .filter(function(datum, j) {
       	     	return i != j;
       	     	})
       	     .style("opacity", .35);
       	     //add line
       	     var xPlace = parseInt(d3.select(this).attr("width")) + 5;
       	     var yStart = parseInt(d3.select(this).attr("y")) + yScale.rangeBand() / 2;
       	     var playernm = d3.select(this).attr("id");
       	    svg.append("line")
          	   .attr("id", "playerpointer")
               .attr("x1", xPlace)
               .attr("x2", xPlace)
               .attr("y1", yStart)
               .attr("y2", yStart)
               .attr("stroke", "black")
               .transition()
               .duration(250)
               .attr("x2", 700);
               //add club name
            svg.append("text")
               .attr("id","playername")
               .transition()
               .delay(250)
               .text(playernm)
               .attr("x", 700 + 5)
               .attr("y", yStart + 3.5)
               .attr("font-family", "sans-serif")
			   .attr("font-size", "11px")
               .attr("fill", "black");
              })
          // mouse out
        .on("mouseout", function(d) {
              d3.selectAll(".b2")
                .style("opacity", 0.85)
                .attr("fill", function() {
                return teamcol;
                });
              d3.selectAll("text")
                .style("opacity", 1);
              d3.select("#playerpointer").remove();
              d3.select("#playername").remove();
              })

};
