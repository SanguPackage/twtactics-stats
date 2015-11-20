var lineChart = function(rawData) {
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var dataObject = _.countBy(rawData, d => d.downloaddate.format('YYYY-MM'));
  var data = _.map(dataObject, (d, k) => ({downloaddate: k, downloads: d}));
  data = _.sortBy(data, d => d.downloaddate);

  var parseDate = d3.time.format('%Y-%m').parse;
  data.forEach(function(d) {
    d.downloaddate = parseDate(d.downloaddate);
  });

  var x = d3.time.scale()
    .range([0, width]);

  var y = d3.scale.linear()
    .range([height, 0]);

  var customTimeFormat = d3.time.format.multi([
    ['%a %d', d => d.getDay() && d.getDate() != 1],
    ['%b %d', d => d.getDate() != 1],
    ['%b', d => d.getMonth()],
    ['%Y', () => true]
  ]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(customTimeFormat)
    .orient('bottom');

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

  var line = d3.svg.line()
    .x(d => x(d.downloaddate))
    .y(d => y(d.downloads));

  var svg = d3.select('#line-chart')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  x.domain(d3.extent(data, d => d.downloaddate));
  y.domain(d3.extent(data, d => d.downloads));

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

  svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Downloads');

  svg.append('path')
    .datum(data)
    .attr('class', 'line')
    .attr('d', line);
};