var plApp = angular.module('plApp', [])

plApp.directive('testtxt', function() {
	return { restrict: 'E',
			 scope: {
			 	idata: "&"
			 }, 
			 link: function(scope, element) {
			 	var width = 500,
			 	height = 300,
			 	data = scope.idata()
			 	var svg = d3.select(element[0])
			 				.append("svg")
			 				.attr("width", width)
			 				.attr("height", height)

				scope.$watchCollection('idata()', function(newData, oldData) { 
				 	var testtxt = svg.selectAll(".litxt")
				 					 .data(newData, function(d) { 
				 					 	return d["Player Name"]})
					testtxt.enter()
					 	   .append("text")
					 	   .attr("class", "litxt")
					       .attr("y", function(d,i){
						      return (i+1) * 15
					       })
					       .text(function(d) {
					 		  return d["Player Name"]
					       })
					var txtUpdate = d3.transition(testtxt)
									  .attr("y", function(d,i){
								        return (i+1) * 15
								      })
					var txtExit = testtxt.exit().remove()
				})
			 }}
})

plApp.directive("parallel", function() {
	return {
		restrict: "E",
		scope: {
			idata:"&"
		},
		link: function(scope,element) { 
			var margin = {top:20, left:50, right:50, bottom:15},
				width = 1020 - margin.left - margin.right,
			 	height = 500 - margin.top - margin.bottom,
			 	data = scope.idata()
			 	var svg = d3.select(element[0])
			 				.append("svg")
			 				.attr("width", width + margin.left + margin.right)
			 				.attr("height", height + margin.top + margin.bottom)
			 				.append("g")
			 				.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

			var linefn = d3.svg.line()
							   .x(function(d){ return d[0]})
							   .y(function(d){ return d[1]})
							   .interpolate("monotone")
			var axis = d3.svg.axis()
							 .orient("left")
			var series = data.map(function(d) { 
				return {
					"club": d.Club,
					"playername": d["Player Name"],
					"position": d.Position,
					"stats": d3.keys(d).filter(function(k){ return ["Club","Player Name", "Position"].indexOf(k) == -1 })
							   .map(function(key) {
							   	return { 
							   		"cat": key,
							   		"val": +d[key]
							   	}
							   })

				}
			})

			var lines;
			var linesExit;

			var xscale = d3.scale.linear()
						   .domain([0,series[0].stats.length])
						   .range([0, width])

			var maxArray = series[0].stats.map(function(stat) {
				return {
					"stat": stat.cat,
					"minval": d3.min(series, function(d) {
						var obj = d.stats.filter(function(s) { return s.cat == stat.cat})
						return obj[0].val
						}),
					"maxval": d3.max(series, function(d) {
						var obj = d.stats.filter(function(s) { return s.cat == stat.cat})
						return obj[0].val
						}) 
					}
				})
			var  y = {}
			maxArray.forEach(function(item) { 
				y[item.stat] = d3.scale.linear().domain([item.minval,item.maxval]).range([height,0]);
			})

			function brush() {
				var actives = maxArray.filter(function(c) { return !y[c.stat].brush.empty(); }),
				extents = actives.map(function(c) { return y[c.stat].brush.extent(); });
				lines.attr("display", function(d) {
				  	var sArray = d.stats
					return actives.every(function(c, i) {
						var f = sArray.filter(function(s){ return  (s.cat == c.stat)})
						var v = f[0].val;
						return extents[i][0] <= v && v <= extents[i][1];
					}) ? null : "none";
				});
			}
			function axisdraw() {
				var gaxes = svg.selectAll(".stataxis")
				.data(maxArray)
				.enter()
				.append("g")
				.attr("class", "stataxis")
				.attr("transform", function(d,i) { return "translate(" + xscale(i) + ")"; });

				gaxes.append("g")
				.attr("class", "axis")
				.each(function(d) { d3.select(this).call(axis.scale(y[d.stat])); })
				.append("text")
				.style("text-anchor", "middle")
				.attr("y", -9)
				.text(function(d) { return d.stat; })
				.on("mousedown", function(){
					d3.selectAll(".brush").each(function(d) { d3.select(this).call(y[d.stat].brush.clear() )})
					d3.selectAll("path").attr("display", null)
				});

				brushes = gaxes.append("g")
					 .attr("class", "brush")
					 .each(function(d) { d3.select(this).call(y[d.stat].brush = d3.svg.brush().y(y[d.stat]).on("brush", brush) )})
					 .selectAll("rect")
					 .attr("x", -8)
					 .attr("width", 16)
			}
			function axisremove() {
				d3.selectAll(".stataxis").remove()
			}

			scope.$watchCollection('idata()', function(newData, oldData) {
				d3.selectAll(".brush").each(function(d) { d3.select(this).call(y[d.stat].brush.clear() )})
				d3.selectAll("path").attr("display", null)
				
				series = newData.map(function(d) { 
					return {
						"club": d.Club,
						"playername": d["Player Name"],
						"position": d.Position,
						"stats": d3.keys(d).filter(function(k){ return ["Club","Player Name", "Position"].indexOf(k) == -1 })
								   .map(function(key) {
								   	return { 
								   		"cat": key,
								   		"val": +d[key]
								   	}
								   })

					}
				})
				lines = svg.selectAll(".pline")
							   .data(series, key)


				// lines = svg.append("g")
				// 		   .attr("class", "pline")
				// 		   .selectAll("path")
				// 		   .data(series)					
				lines.enter()
					 .append("path")
					 //.attr("transform")
					 .attr("class", "pline")
					 .attr("id", function(d){
					 	return d.playername
					 })
					 .attr("d", pathfn)
					 .attr("stroke", "steelblue")
					 .attr("display", function(){
					 	return null
					 })
					 .on("mouseover", function(d) {
					 	var pdatum = d3.select(this).data()
					 	var lastStat = pdatum[0].stats[pdatum[0].stats.length-1] ;
					 	d3.select(this).attr("stroke","yellow")
					 	svg.selectAll(".plabel")
					 	   .data(pdatum)
					 	   .enter()
					 	   .append("text")
					 	   .attr("class", "plabel")
					 	   .attr("x", width- margin.left - 5)
					 	   .attr("y", function(p) {
					 	   	console.log(y[lastStat.cat](lastStat.val))
					 	   	return y[lastStat.cat](lastStat.val)
					 	   })
					 	   .text(function(p){
					 	   	return p.playername
					 	   })
					 })
					 .on("mouseout", function(d){
					 	d3.select(this).transition().duration(500).attr("stroke","steelblue")
					 	d3.select(".plabel").remove()
					 })
				linesExit = lines.exit().remove()
				
				axisremove();
				axisdraw();
			})
			
			function key(d) {
				return d.playername
			}

			function pathfn(d)  {
				return linefn(d.stats.map(function(s,i) {return [xscale(i), y[s.cat](s.val)]; }))
			}


		}
	}
})
