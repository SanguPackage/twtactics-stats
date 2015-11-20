var serverUsage = function(rawData) {
  var data = _.countBy(rawData, v => v.server.replace('www.', ''));
  var maxValue = _.max(_.values(data));
  data = _.sortBy(_.pairs(data), d => -d[1]);

  //console.log(data);
  //console.log(maxValue);

  var canvas = d3.select('#content')
    .append('div')
    .attr('class', 'chart');

  var x = d3.scale.linear()
    .domain([0, maxValue])
    .range([0, 400]);

  d3.select('.chart').selectAll('div')
    .data(data)
    .enter()
      .append('div')
      .style('width', d => 200 + 'px')
      // .style('width', d => x(d[1]) + 'px')
      .text(d => d[0] + ':' + d[1]);
};