var circlePacking = function(rawData) {
  //var minPlayerDownloadsFilter = 10;
  var serverTooltipMaxWorlds = 10;

  function mapData(rawData) {
    var out = [];
    _.each(rawData, function(download) {
      var server = _.findWhere(out, {name: download.server});
      if (!server) {
        server = {
          isServer: true,
          name: download.server,
          size: 0,
          children: []
        };
        out.push(server);
      }
      server.size++;

      var world = _.findWhere(server.children, {name: download.world});
      if (!world) {
        world = {
          isWorld: true,
          name: download.world,
          size: 0,
          children: []
        };
        server.children.push(world);
      }
      world.size++;

      var tribe = _.findWhere(world.children, {name: download.tribe});
      if (!tribe) {
        tribe = {
          isTribe: true,
          name: download.tribe,
          size: 0,
          children: [],
          parent: world
        };
        world.children.push(tribe);
      }
      tribe.size++;

      var player = _.findWhere(tribe.children, {name: download.player});
      if (player) {
        player.size++;
        if (player.downloaddate < download.downloaddate) {
          player.downloaddate = download.downloaddate;
        }

      } else {
        player = {
          isPlayer: true,
          name: download.player,
          downloaddate: download.downloaddate,
          size: 1,
          parent: tribe
        };
        tribe.children.push(player);
      }
    });

    function fixChildren(parent) {
      if (parent.children) {
        _.each(parent.children, function(c) {
          fixChildren(c);
        });
      }
      if (parent.children) {
        parent.downloaddate = _.max(parent.children, d => d.downloaddate).downloaddate;
      }
    }
    _.each(out, o => fixChildren(o));

    _.each(out, function(server) {
      if (server.name.indexOf('tw') !== 0) {
        server.name = server.name.substr(server.name.indexOf('.'));
      } else {
        server.name = server.name.replace('tw', '');
      }

      //server.children = _.filter(server.children, p => p.size > minPlayerDownloadsFilter);
    });

    return out;
  }

  var root = {
    name: 'Sangu',
    children: mapData(rawData),
    downloaddate: moment()
  };

  //console.log(root);

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

  circle.append('title')
    .text(function(d) {
      function getNameAndDownloads(d) {
        return d.name + ': ▼ ' + d.size + '. Last ' + d.downloaddate.fromNow();
      }

      var tooltip = '';
      if (d.isServer) {
        tooltip = 'Server: ' + getNameAndDownloads(d);
        if (d.children) {
          tooltip += '\n\nWorlds: (' + d.children.length + ')';
          _.each(_.first(_.sortBy(d.children, c => -c.downloaddate), serverTooltipMaxWorlds), function(c) {
            tooltip += '\n' + getNameAndDownloads(c);
          });
          if (d.children.length > serverTooltipMaxWorlds) {
            tooltip += '\n...';
          }
        }

      } else if (d.isWorld) {
        tooltip = 'World: ' + getNameAndDownloads(d);
        if (d.children) {
          var playersInWorld = [];
          _.each(d.children, function(tribe) {
            playersInWorld = playersInWorld.concat(tribe.children);
          });

          tooltip += '\n\nTribe > Player: (' + playersInWorld.length + ')';

          _.each(_.first(_.sortBy(playersInWorld, p => -p.downloaddate), serverTooltipMaxWorlds), function(c) {
            tooltip += '\n';
            if (c.parent.name !== unknownPlayerOrTribe) {
              tooltip += c.parent.name + ' > '
            }
            tooltip += getNameAndDownloads(c);
          });
          if (playersInWorld.length > serverTooltipMaxWorlds) {
            tooltip += '\n...';
          }
        }

      } else if (d.isTribe) {
        tooltip = 'World: ' + d.parent.name + '\n';
        tooltip += 'Tribe: ' + d.name;
        if (d.children.length === 1) {
          tooltip += '\n' + getNameAndDownloads(d.children[0]);

        } else {
          tooltip += '\n\nPlayers: (' + d.children.length + ')';
          _.each(_.first(_.sortBy(d.children, c => -c.downloaddate), serverTooltipMaxWorlds), function(c) {
            tooltip += '\n' + getNameAndDownloads(c);
          });
          if (d.children.length > serverTooltipMaxWorlds) {
            tooltip += '\n...';
          }
        }

      } else {
        tooltip = getNameAndDownloads(d);
      }
      return tooltip;
    });

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