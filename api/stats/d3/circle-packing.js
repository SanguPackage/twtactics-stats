var circlePacking = function(rawData) {
  function mapData(rawData) {
    var out = [];
    _.each(rawData, function(download) {
      var server = _.findWhere(out, {name: download.server});
      if (server) {
        server.size++;

        var player = _.findWhere(server.children, {name: download.player});
        if (player) {
          player.size++;
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
            size: 1,
            worlds: [download.world]
          };
          server.children.push(player);
        }

        // if (applyTextColorGradient(download.downloaddate)) {
        //   if (!lastDownload || lastDownload < download.downloaddate) {
        //     lastDownload = download.downloaddate;
        //   }
        //   if (!firstLastDownload || firstLastDownload > download.downloaddate) {
        //     firstLastDownload = download.downloaddate;
        //   }
        // }
      } else {
        out.push({
          isServer: true,
          name: download.server,
          size: 1,
          children: []
        });
      }
    });

    // _.each(out, function(server) {
    //   var maxPlayers = _.max(_.filter(server.children, d => d.name !== unknownPlayerOrTribe), d => d.amount);
    //   if (!maxPlayerDownloads || maxPlayers.amount > maxPlayerDownloads) {
    //     maxPlayerDownloads = maxPlayers.amount;
    //   }

    //   server.children = _.filter(server.children, p => p.amount > minPlayerDownloadsFilter);
    // });
    // out = _.filter(out, server => server.children.length);

    return out;
  }

  var root = {
    name: 'Sangu',
    children: mapData(rawData)
  };

  var margin = 20,
      diameter = 960;

  var color = d3.scale.linear()
    .domain([-1, 5])
    .range(['hsl(152,80%,80%)', 'hsl(228,30%,40%)'])
    .interpolate(d3.interpolateHcl);

  var pack = d3.layout.pack()
    .padding(2)
    .size([diameter - margin, diameter - margin])
    .value(function(d) { return d.size; });

  var svg = d3.select('#circle-packing')
    .attr('width', diameter)
    .attr('height', diameter)
    .append('g')
      .attr('transform', 'translate(' + diameter / 2 + ',' + diameter / 2 + ')');

  var focus = root,
      nodes = pack.nodes(root),
      view;

  var circle = svg.selectAll('circle')
    .data(nodes)
    .enter().append('circle')
      .attr('class', function(d) { return d.parent ? d.children ? 'node' : 'node node--leaf' : 'node node--root'; })
      .style('fill', function(d) { return d.children ? color(d.depth) : null; })
      .on('click', function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });

  var text = svg.selectAll('text')
    .data(nodes)
    .enter().append('text')
      .attr('class', 'label')
      .style('fill-opacity', function(d) { return d.parent === root ? 1 : 0; })
      .style('display', function(d) { return d.parent === root ? 'inline' : 'none'; })
      .text(function(d) { return d.name; });

  var node = svg.selectAll('circle,text');

  d3.select('#circle-packing')
    .style('background', color(-1))
    .on('click', function() { zoom(root); });

  zoomTo([root.x, root.y, root.r * 2 + margin]);

  function zoom(d) {
    var focus0 = focus; focus = d;

    var transition = d3.transition()
      .duration(d3.event.altKey ? 7500 : 750)
      .tween('zoom', function(d) {
        var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
        return function(t) { zoomTo(i(t)); };
      });

    transition.selectAll('text')
      .filter(function(d) { return d.parent === focus || this.style.display === 'inline'; })
        .style('fill-opacity', function(d) { return d.parent === focus ? 1 : 0; })
        .each('start', function(d) { if (d.parent === focus) this.style.display = 'inline'; })
        .each('end', function(d) { if (d.parent !== focus) this.style.display = 'none'; });
  }

  function zoomTo(v) {
    var k = diameter / v[2]; view = v;
    node.attr('transform', function(d) { return 'translate(' + (d.x - v[0]) * k + ',' + (d.y - v[1]) * k + ')'; });
    circle.attr('r', function(d) { return d.r * k; });
  }

  d3.select(self.frameElement).style('height', diameter + 'px');
};