var lineChartPerServer = function(rawData) {
  var minMonthlyDownloads = 40;

  var dataObject = _.groupBy(rawData, d => d.downloaddate.format('YYYY-MM'));
  //console.log(dataObject)

  var serverNames = [];
  var data = _.map(dataObject, function(serverDownloads, key) {
    var perServer = _.extend(_.countBy(serverDownloads, d => d.server), {date: serverDownloads[0].downloaddate.format('YYYY-MM') });
    _.each(perServer, function(downloads, key) {
      if (key !== 'date' && downloads > minMonthlyDownloads) {
        serverNames.push(key);
      }
    });
    return perServer;
  });
  data = _.sortBy(data, d => d.date);

  var parseDate = d3.time.format('%Y-%m').parse;
  data.forEach(function(d) {
    d.date = parseDate(d.date);
  });
  //console.log(data[0])

  var color = d3.scale.category10();
  color.domain(_.uniq(serverNames));
  var servers = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, downloads: +d[name] || 0};
      })
    };
  });
  //console.log(servers);

  var margin = {top: 20, right: 80, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 700 - margin.top - margin.bottom;

  var x = d3.time.scale()
    .range([0, width]);

  var y = d3.scale.linear()
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(customTimeFormat)
    .orient('bottom');

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

  var line = d3.svg.line()
    .interpolate('basis')
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.downloads); });

  var svg = d3.select('#line-chart-server')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  x.domain(d3.extent(data, function(d) { return d.date; }));

  y.domain([
    d3.min(servers, function(c) { return d3.min(c.values, function(v) { return v.downloads; }); }),
    d3.max(servers, function(c) { return d3.max(c.values, function(v) { return v.downloads; }); })
  ]);

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

  var server = svg.selectAll('.server')
    .data(servers)
    .enter().append('g')
      .attr('class', 'server');

  server.append('path')
    .attr('class', 'line')
    .attr('d', function(d) { return line(d.values); })
    .style('stroke', function(d) { return color(d.name); });

  server.append('text')
    .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
    .attr('transform', function(d) { return 'translate(' + x(d.value.date) + ',' + y(d.value.downloads) + ')'; })
    .attr('x', 3)
    .attr('dy', '.35em')
    .text(function(d) { return d.name; });
};