var w = 1100;
	 var h = 600;
	 var barw = 800;
   //define svg function
     var svg = d3.select("#chart")
         .append("svg")
         .attr("width", w)
         .attr("height", h);
        // load data
	var svgBox = d3.select('#chart')[0][0].getBoundingClientRect()
	var mouseOrigin = [svgBox.left, svgBox.top];

 d3.json("../data/nhl.json", function(error, data) {
	if (error) {  //If error is not null, something went wrong.
       console.log(error);
	}
	else {
	// declare variables
	   var ndata = data;
	   var gdata;
	   var stdata = [];
	   var maxlength = 0;
	   var maxteam = "";
	   // sort teams in ascending order of # of goalies
	   var sortteams = ndata.sort(function(a,b){
    var x = a.goalies.length < b.goalies.length? -1:1;
    return x;
    });
    //define y scale
    var yScale = d3.scale.ordinal()
                         .domain(d3.range(ndata.length))
                         .rangeRoundBands([0,h], .15);
	//
	// key fns
	var team = function(d) {
	   return d.team;
	};

	var goalies = function(d) {
		return d.goalies;
	};
	var player = function(d) {
	    return d.player;
	};
	// add team text
	svg.selectAll("text")
	   .data(ndata, team)
	   .enter()
	   .append("text")
	   .attr("x", 830)
	   .attr("font-family","sans-serif")
	   .attr("font-size","11px")
	   .attr("y", function(d,i) {
	   	   return yScale(i) + (yScale.rangeBand() /2) + 3;
	   })
	   .text(function(d) {
	   	return d.team
	   });
	// data bind + rectangles
	for (i = 0; i< ndata.length; i ++){
		gdata = sortteams[i].goalies.sort(function(a,b){
    var x = a.gp > b.gp? -1:1;
    return x;
    });
    // fix y pos
		var fixy = yScale(i);

	    var gmax = 0;
		stdata = [];
		//
		for (j = 0; j < gdata.length; j++){
			// determine total number of games
		    gmax = gmax + gdata[j].gp
		    // give data x, y vals
		    xval = j;
		    yval = gdata[j].gp;
		    nname = gdata[j].player;
		    stdata.push([{"x": xval,"y": yval, "name":nname}]);
		}
		// scale determining bar width
		var wScale = d3.scale.linear()
		                     .domain([0,gmax])
		                     .range([0, barw]);
        //stack players within team
        var stack = d3.layout.stack();
        stack(stdata);
		//class label for rectangles belonging to team
		var classlbl = ".b" + [i]

		//
		var groups = svg.selectAll(classlbl)
                        .data(stdata)
                        .enter()
                        .append("g")
		// add rectangles
 var rect = groups.selectAll("rect")
	           .data(function(d) {return d;})
	           .enter()
	           .append("rect")
	           .attr("pid", function(d) {
	           	    return d.name
	           })
	           .attr("gpid", function(d) {
	           	    return d.y
	           })
	           .attr("x", function(d) {
	   	           return wScale(d.y0) + 25;
	           })
	           .attr("y", fixy)
	           .attr("width", function(d) {
	   	          return wScale(d.y);
	           })
	           .attr("height", yScale.rangeBand())
	           .attr("fill","dodgerblue")
	           .attr("stroke","black")
	           // mouseover
	           .on("mouseover", function(d,i) {
	             // change color
	           	d3.select(this)
	           	  .attr("fill","orange");
       	var xPosition = parseFloat(d3.select(this).attr("x"));
				var yPosition = parseFloat(d3.select(this).attr("y")) + 215;
				var glabel = d3.select(this).attr("pid");
				var plabel = d3.select(this).attr("gpid");
				//Update the tooltip position and value
				d3.select("#tooltip")
  				.style("left", xPosition + "px")
  				.style("top", yPosition + "px")
  				.select("#value")
  				.text(glabel + ': ' + plabel + " Games");

				//Show the tooltip
				d3.select("#tooltip").classed("hidden", false);
	           	//add label
	           })
	           // mouseout
	           .on("mouseout", function(d,i) {
	           	d3.select(this)
	           	  .transition()
	           	  .duration(250)
	           	  .attr("fill","dodgerblue");
	           	d3.select("#tooltip").classed("hidden", true);
	           });

		}
	  }
	});

	   ///
	 /// tooltips
// $(document).ready(function() {
// $("rect").tooltip({
// 	delay: { show: 250, hide: 250 }
// 	placement: function(tip, element) {
// 		var xpos = $(element).x();
// 		var ypos = $(element).y();
// 		if(xpos <= 550) {
// 			return "right";
// 		} else {
// 		    return "left";
// 		}
// 	}
// 	title: function(tip, element) {
// 		return $(element).pid + ": " + $(element).gpid + " Games";
// 	}
// 	return this.getAttribute("pid") + ": " + this.getAttribute("gpid") + " Games";
// 	});


// 	}
// 	});
