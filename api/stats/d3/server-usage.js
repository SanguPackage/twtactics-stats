var serverUsage = function(rawData) {
  var data = _.countBy(rawData, v => v.server.replace('www.', ''));
  var maxValue = _.max(_.values(data));
  data = _.pairs(data);
  data = _.filter(data, d => d[1] > 30);
  data = _.sortBy(data, d => -d[1]);

  //console.log(data);
  //console.log(maxValue);

  var width = 960,
      height = 500;

  var y = d3.scale.linear()
      .range([height, 0]);

  var chart = d3.select('#server-usage')
    .attr('width', width)
    .attr('height', height + 150);

  y.domain([0, d3.max(data, d => d[1])]);

  var barWidth = width / data.length;

  var bar = chart.selectAll('g')
    .data(data)
    .enter()
      .append('g')
      .attr('transform', (d, i) => 'translate(' + i * barWidth + ',0)');

  bar.append('rect')
    .attr('y', d => y(d[1]))
    .attr('height', d => height - y(d[1]))
    .attr('width', barWidth - 1);

  bar.append('text')
    .attr('class', 'amount')
    .attr('x', barWidth / 2)
    .attr('y', d => y(d[1]) + 3)
    .attr('dy', '.75em')
    .text(d => d[1]);

  bar.append('text')
    .attr('x', barWidth / 2)
    .attr('y', d => height)
    .attr('dy', '.75em')
    .style('writing-mode', 'tb')
    .style('text-anchor', 'start')
    .text(d => d[0]);

  // bar.append('text')
  //   .attr('transform', 'rotate(-90)')
  //   .attr('y', height - 100)
  //   //.attr('dy', '.71em')
  //   .style('text-anchor', 'end')
  //   .text(d => d[0]);

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