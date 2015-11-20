var dendrogram = function(rawData) {
  var minPlayerDownloads = 5;

  function mapData(rawData) {
    var out = [];
    _.each(rawData, function(download) {
      var server = _.findWhere(out, {name: download.server});
      if (server) {
        server.amount++;

        var player = _.findWhere(server.children, {name: download.player});
        if (player) {
          player.amount++;
          if (player.name !== unknownPlayerOrTribe) {
            if (player.worlds.indexOf(download.world) === -1) {
              player.worlds.push(download.world);
            }
          }

        } else {
          player = {
            name: download.player,
            firstDownload: download.downloaddate,
            lastDownload: download.downloaddate,
            amount: 1
          };
          if (player.name !== unknownPlayerOrTribe) {
            player.worlds = [download.world];
          }
          server.children.push(player);
        }
      } else {
        out.push({
          name: download.server,
          amount: 1,
          children: []
        })
      }
    });

    _.each(out, function(server) {
      server.children = _.filter(server.children, p => p.amount > minPlayerDownloads)
    });

    return out;
  }

  var data = {
    name: 'Sangu',
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
    .attr('r', function(d) {
        if (!d.worlds) {
          return 4.5;
        }
        return 4.5; //d.amount;
    });

  node.append('text')
    .attr('dy', '.31em')
    .attr('text-anchor', d => d.x < 180 ? 'start' : 'end')
    .attr('transform', d => d.x < 180 ? 'translate(8)' : 'rotate(180)translate(-8)')
    .text(function(d) {
      var s = '';
      if (d.worlds) {
        s += d.worlds.join() + ': ';
      }
      s += d.name + (d.amount ? ' (' + d.amount + ')' : '');
      return s;
    });

  d3.select(self.frameElement).style('height', radius * 2 + 'px');
};