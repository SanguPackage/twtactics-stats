var dendrogram = function(rawData) {
  var minPlayerDownloadsFilter = 10;
  var downloadedLessThanDaysAgo = 30;

  var lastDownload, firstLastDownload;
  var maxPlayerDownloads;

  function applyTextColorGradient(downloaddate) {
    return moment().diff(downloaddate, 'days') < downloadedLessThanDaysAgo;
  }

  function mapData(rawData) {
    var out = [];
    _.each(rawData, function(download) {
      var server = _.findWhere(out, {name: download.server});
      if (server) {
        server.amount++;

        var player = _.findWhere(server.children, {name: download.player});
        if (player) {
          player.amount++;
          if (player.worlds.indexOf(download.world) === -1) {
            player.worlds.push(download.world);
          }
          if (player.lastDownload < download.downloaddate) {
            player.lastDownload = download.downloaddate;
          }

        } else {
          player = {
            isPlayer: true,
            name: download.player,
            lastDownload: download.downloaddate,
            amount: 1,
            worlds: [download.world]
          };
          server.children.push(player);
        }

        if (applyTextColorGradient(download.downloaddate)) {
          if (!lastDownload || lastDownload < download.downloaddate) {
            lastDownload = download.downloaddate;
          }
          if (!firstLastDownload || firstLastDownload > download.downloaddate) {
            firstLastDownload = download.downloaddate;
          }
        }
      } else {
        out.push({
          isServer: true,
          name: download.server,
          amount: 1,
          children: []
        });
      }
    });

    _.each(out, function(server) {
      var maxPlayers = _.max(_.filter(server.children, d => d.name !== unknownPlayerOrTribe), d => d.amount);
      if (!maxPlayerDownloads || maxPlayers.amount > maxPlayerDownloads) {
        maxPlayerDownloads = maxPlayers.amount;
      }

      server.children = _.filter(server.children, p => p.amount > minPlayerDownloadsFilter);
    });
    out = _.filter(out, server => server.children.length);

    return out;
  }

  var data = {
    name: 'Sangu',
    children: mapData(rawData)
  };

  //console.log(firstLastDownload + ' -> ' + lastDownload);
  //console.log(minPlayerDownloadsFilter + ' -> ' + maxPlayerDownloads);
  //console.log(data);

  var color = d3.scale.linear()
    .domain([firstLastDownload.toDate().getTime(), lastDownload.toDate().getTime()])
    .range(['#26D0CE', '#1A2980']); // aqua marine

  var downloads = d3.scale.linear()
    .domain([minPlayerDownloadsFilter, maxPlayerDownloads])
    .range([1, 14]);

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
        if (!d.isPlayer) {
          return 4.5;
        }
        if (d.name === unknownPlayerOrTribe) {
          return 4.5;
        }
        return downloads(d.amount);
    });

  node.append('text')
    .attr('dy', '.31em')
    .attr('fill', function(d) {
      if (d.lastDownload) {
        return applyTextColorGradient(d.lastDownload) ? color(d.lastDownload) : 'lightgray';
      }
      return 'black';
    })
    .attr('text-anchor', d => d.x < 180 ? 'start' : 'end')
    .attr('transform', d => d.x < 180 ? 'translate(8)' : 'rotate(180)translate(-8)')
    .append('tspan')
      .text(function(d) {
        if (d.isServer) {
          return d.name + (d.amount ? ' (' + d.amount + ')' : '');
        } else if (d.isPlayer) {
          return d.name + ': ' + d.worlds.sort().join().replace(/[^0-9,]/g, '');
        }
        return d.name;
      })
    .append('tspan')
      .attr('x', 0)
      .attr('y', 15)
      .text(function(d) {
        if (d.isPlayer) {
          return '▼' + d.amount + ', last ' + d.lastDownload.fromNow();
        }
        return '';
      });

  d3.select(self.frameElement).style('height', radius * 2 + 'px');
};