var serverUsage = function(rawData) {
  var data = _.countBy(rawData, v => v.server.replace('www.', ''));
  var maxValue = _.max(_.values(data));
  data = _.sortBy(_.pairs(data), d => -d[1]);

  //console.log(data);
  //console.log(maxValue);

  var width = 960,
      height = 500;

  var y = d3.scale.linear()
      .range([height, 0]);

  var chart = d3.select("#server-usage")
    .attr("width", width)
    .attr("height", height);

  y.domain([0, d3.max(data, function(d) { return d[1]; })]);

  var barWidth = width / data.length;

  var bar = chart.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

  bar.append("rect")
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return height - y(d[1]); })
      .attr("width", barWidth - 1);

  bar.append("text")
      .attr("x", barWidth / 2)
      .attr("y", function(d) { return y(d[1]) + 3; })
      .attr("dy", ".75em")
      .text(function(d) { return d[1]; });

  // var canvas = d3.select('#content')
  //   .append('div')
  //   .attr('class', 'chart');

  // var x = d3.scale.linear()
  //   .domain([0, maxValue])
  //   .range([0, 400]);

  // d3.select('.chart').selectAll('div')
  //   .data(data)
  //   .enter()
  //     .append('div')
  //     .style('width', d => 200 + 'px')
  //     // .style('width', d => x(d[1]) + 'px')
  //     .text(d => d[0] + ':' + d[1]);
};