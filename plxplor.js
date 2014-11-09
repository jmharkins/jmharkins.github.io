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
			var width = 500,
			 	height = 300,
			 	data = scope.idata()
			 	var svg = d3.select(element[0])
			 				.append("svg")
			 				.attr("width", width)
			 				.attr("height", height)


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

			var maxArray = series[0].stats.map(function(stat) {
				return {
					"stat": stat.cat,
					"maxval": d3.max(series, function(d) {
						var obj = d.stats.filter(function(s) { return s.cat == stat.cat})
						return obj[0].val
						}) 
					}
				})

			maxArray.forEach(function(stat) { 
				stat.scale = d3.scale.linear().domain([0,stat.maxval]).range([0,height]);
				console.log(stat)
			})

			console.log()

			


		}
	}
})
