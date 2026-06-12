// Downloads-per-year bar chart for the server-rendered /stats page (d3 v7).
function drawPerYear(selector, data) {
	var margin = {top: 10, right: 10, bottom: 30, left: 55};
	var width = 560 - margin.left - margin.right;
	var height = 320 - margin.top - margin.bottom;

	var svg = d3.select(selector)
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	var x = d3.scaleBand()
		.domain(data.map(function(d) { return d.year; }))
		.range([0, width])
		.padding(0.15);

	var y = d3.scaleLinear()
		.domain([0, d3.max(data, function(d) { return d.downloads; })]).nice()
		.range([height, 0]);

	svg.append('g')
		.attr('transform', 'translate(0,' + height + ')')
		.call(d3.axisBottom(x).tickFormat(d3.format('d')));

	svg.append('g')
		.call(d3.axisLeft(y).ticks(5));

	svg.selectAll('.bar')
		.data(data)
		.join('rect')
			.attr('class', 'bar')
			.attr('x', function(d) { return x(d.year); })
			.attr('width', x.bandwidth())
			.attr('y', function(d) { return y(d.downloads); })
			.attr('height', function(d) { return height - y(d.downloads); })
			.attr('fill', '#1A2980')
		.append('title')
			.text(function(d) { return d.year + ': ' + d.downloads + ' downloads'; });
}
