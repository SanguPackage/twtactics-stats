var dendrogram = function(rawData) {
  function mapData(rawData) {
    var out = [];
    _.each(rawData, function(download) {
      var server = _.findWhere(out, {name: download.server});
      if (server) {
        var player = _.findWhere(server.children, {name: download.player});
        if (player) {
          player.downloads++;
        } else {
          server.children.push({
            name: download.player,
            downloads: 1
          });
        }
      } else {
        out.push({
          name: download.server,
          children: []
        })
      }
    });

    return out;
  }

  var data = {
    name: 'tactics',
    children: mapData(rawData)
  };


  console.log(data);

  var radius = 960 / 2;

  var cluster = d3.layout.cluster()
      .size([360, radius - 120]);

  var diagonal = d3.svg.diagonal.radial()
      .projection(d => [d.y, d.x / 180 * Math.PI]);

  var svg = d3.select('#dendrogram')
    .attr('width', radius * 2)
    .attr('height', radius * 2)
    .append('g')
      .attr('transform', 'translate(' + radius + ',' + radius + ')');

  var nodes = cluster.nodes(data);

  var link = svg.selectAll('path.link')
    .data(cluster.links(nodes))
    .enter().append('path')
      .attr('class', 'link')
      .attr('d', diagonal);

  var node = svg.selectAll('g.node')
    .data(nodes)
    .enter().append('g')
      .attr('class', 'node')
      .attr('transform', d => 'rotate(' + (d.x - 90) + ')translate(' + d.y + ')');

  node.append('circle')
    .attr('r', 4.5);

  node.append('text')
    .attr('dy', '.31em')
    .attr('text-anchor', d => d.x < 180 ? 'start' : 'end')
    .attr('transform', d => d.x < 180 ? 'translate(8)' : 'rotate(180)translate(-8)')
    .text(d => d.name);

  d3.select(self.frameElement).style('height', radius * 2 + 'px');
};