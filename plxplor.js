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
			 	console.log(data)
			 	console.log(scope)
			 	var svg = d3.select(element[0])
			 				.append("svg")
			 				.attr("width", width)
			 				.attr("height", height)

			 	var testtxt = svg.selectAll(".litxt")
			 					 .data(data)
			 					 .enter()
			 					 .append("text")
			 					 .attr("y", 15)
			 					 .text(function(d) {
			 					 	return d["Player Name"]
			 					 })
				scope.$watchCollection('idata()', function(data) { 
					console.log(scope.idata());
				})
			 }}
})