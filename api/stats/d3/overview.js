// Headline stat band + downloads-per-year bar chart for the d3.html dashboard (d3 v3).
// Both are computed client-side from the full api.php dataset.

var heroStats = function(rawData) {
	var fmt = d3.format(',');
	var years = rawData.map(function(d) { return d.downloaddate.year(); });

	var stats = [
		{value: fmt(rawData.length), label: 'Downloads'},
		{value: fmt(_.uniq(_.pluck(rawData, 'player')).length), label: 'Players'},
		{value: fmt(_.uniq(_.pluck(rawData, 'tribe')).length), label: 'Tribes'},
		{value: fmt(_.uniq(_.pluck(rawData, 'world')).length), label: 'Worlds'},
		{value: fmt(_.uniq(_.pluck(rawData, 'server')).length), label: 'Servers'},
		{value: d3.min(years) + '–' + d3.max(years), label: 'Years'}
	];

	var band = d3.select('#hero-stats');
	stats.forEach(function(s) {
		var col = band.append('div').attr('class', 'col-xs-4 col-md-2');
		col.append('div').attr('class', 'stat-number').text(s.value);
		col.append('div').attr('class', 'text-muted').text(s.label);
	});
};

var downloadsPerYear = function(rawData) {
	var counts = _.countBy(rawData, function(d) { return d.downloaddate.year(); });
	var data = _.sortBy(_.map(counts, function(v, k) { return {year: +k, downloads: v}; }), 'year');

	var margin = {top: 10, right: 20, bottom: 30, left: 60};
	var width = 900 - margin.left - margin.right;
	var height = 280 - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
		.domain(data.map(function(d) { return d.year; }))
		.rangeRoundBands([0, width], 0.15);

	var y = d3.scale.linear()
		.domain([0, d3.max(data, function(d) { return d.downloads; })])
		.range([height, 0]);

	var svg = d3.select('#downloads-per-year-d3')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	svg.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(0,' + height + ')')
		.call(d3.svg.axis().scale(x).orient('bottom'));

	svg.append('g')
		.attr('class', 'y axis')
		.call(d3.svg.axis().scale(y).orient('left').ticks(5));

	svg.selectAll('.bar')
		.data(data)
		.enter().append('rect')
			.attr('class', 'bar')
			.attr('x', function(d) { return x(d.year); })
			.attr('width', x.rangeBand())
			.attr('y', function(d) { return y(d.downloads); })
			.attr('height', function(d) { return height - y(d.downloads); })
			.style('fill', '#1A2980')
		.append('title')
			.text(function(d) { return d.year + ': ' + d.downloads + ' downloads'; });
};
