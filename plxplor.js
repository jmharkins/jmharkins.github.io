var plApp = angular.module('plApp', [])

plApp.directive('parallel', function() {
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
					if (newData.length <= oldData.length) {
						d3.selectAll(".litxt").remove()
					}
				 	var testtxt = svg.selectAll(".litxt")
				 					 .data(newData)
									 .enter()
						 		     .append("text")
						 		     .attr("class", "litxt")
						 		     .attr("y", function(d,i){
						 		      return (i+1) * 15
						 		     })
						 		     .text(function(d) {
						 			  return d["Player Name"]
						 		     })
				})
			 }}
})