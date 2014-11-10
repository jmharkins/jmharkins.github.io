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
					//console.log(scope.idata());
					// if (newData.length <= oldData.length) {
					// 	d3.selectAll(".litxt").remove()
					// }
					//console.log(newData)
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
			var margin = {top:15, left:50, right:50, bottom:15},
				width = 900 - margin.left - margin.right,
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
							   .interpolate("linear")
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

			var lines = svg.append("g")
						   .attr("class", "pline")
						   .selectAll("path")
						   .data(series)
						   .enter()
						   .append("path")
						   .attr("d", pathfn)
						   .attr("stroke", "steelblue")
						   .attr("stroke-width", 1.5)
						   .attr("stroke-opacity", 0.25)
						   .attr("fill", "none")

			function pathfn(d)  {
				 return linefn(d.stats.map(function(s,i) { return [xscale(i), y[s.cat](s.val)]; }))
			}

		}
	}
})
