function toDegrees (angle) {
  return angle * (180 / Math.PI);
}

var width = 300
var height = width * (1/8)

var lheight = (7/8) * height,
    line_y = lheight/10,
    lwidth = line_y/2
var svg = d3.select('#siteheader-svg')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background-color','#f2f2f2')
var n_lines = 10
var line_data = new Array(n_lines)
var lines = svg.selectAll('.line')
              .data(line_data)
              .enter()
              .append('rect')
              .attr('class','line')
              .attr('y',line_y)
              .attr('x', function(d,i){
                return (i+1) * (width / (n_lines + 1)) - (lwidth/2)
              })
              .attr('width',lwidth)
              .attr('height',lheight)

d3.select('body').on('mousemove',function(){
  var mouse_coords = d3.mouse(this)
  var svgBox = d3.select('#siteheader-svg')._groups[0][0].getBoundingClientRect()
  var mouseOrigin = [svgBox.left, svgBox.top];
  var adj_coords = [(mouse_coords[0] - mouseOrigin[0])
                    , (mouse_coords[1] - mouseOrigin[1])]
  d3.selectAll('.line')
    .attr('transform',function(d,i){
      var line_vertical = (i+1) * (width / (n_lines + 1)) + (lwidth/2)
			var dist_to_mouse = Math.sqrt(
														Math.pow(adj_coords[0] - line_vertical,2)
														+ Math.pow(adj_coords[1],2)
													)
			var dist_to_vertical = line_vertical - adj_coords[0]
			var rot_y_origin = line_y + (lheight/2)
			var rot_x_origin = line_vertical
			var rot_angle = toDegrees((Math.asin(dist_to_vertical / dist_to_mouse))).toString()
			var ftransform = ('rotate(' + rot_angle + ' '
												+ rot_x_origin + ' '
												+ rot_y_origin + ')')
			return ftransform
    })
})
