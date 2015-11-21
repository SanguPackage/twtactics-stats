var lineChartPerServer = function(rawData) {
  const minMonthlyDownloads = 40;
  const minLastDownloadsToShowServerName = 15;

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
      width = 700 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

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
    .ticks(10)
    .orient('left');

  var line = d3.svg.line()
    .interpolate('basis')
    .x(d => x(d.date))
    .y(d => y(d.downloads));

  var svg = d3.select('#line-chart-server')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  x.domain(d3.extent(data, d => d.date));

  y.domain([
    d3.min(servers, c => d3.min(c.values, v => v.downloads)),
    d3.max(servers, c => d3.max(c.values, v => v.downloads))
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
    .attr('d', d => line(d.values))
    .style('stroke', d => color(d.name))
    .append('title')
      .text(function(d) {
        var tooltip = d.name + '\n▼ ' + _.reduce(d.values, (memo, num) => memo + num.downloads, 0);
        return tooltip;
      });

  server.append('text')
    .datum(d => ({name: d.name, value: d.values[d.values.length - 1]}))
    .attr('transform', d => 'translate(' + x(d.value.date) + ',' + y(d.value.downloads) + ')')
    .attr('x', 3)
    .attr('dy', '.35em')
    .text(function(d) {
      if (d.value.downloads < minLastDownloadsToShowServerName) {
        return '';
      }
      return d.name;
    });
};