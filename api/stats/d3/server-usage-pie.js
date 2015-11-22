var serverUsagePie = function(rawData) {
  var colors = ['#2484c1', '#0c6197', '#4daa4b', '#90c469', '#daca61', '#e4a14b', '#e98125', '#cb2121', '#830909', '#923e99', '#ae83d5', '#bf273e', '#ce2aeb', '#bca44a', '#618d1b', '#1ee67b', '#b0ec44', '#a4a0c9', '#322849', '#86f71a', '#d1c87f', '#7d9058', '#44b9b0', '#7c37c0', '#cc9fb1', '#e65414', '#8b6834', '#248838'];
  var data = _.countBy(rawData, d => d.server);
  var i = -1;
  data = _.map(data, (d, k) => (++i, {label: k, value: d, color: colors[i]}))

  return new d3pie('server-usage-pie', {
    'header': {
      'subtitle': {
        'color': '#999999',
        'fontSize': 12,
        'font': 'open sans'
      },
      'titleSubtitlePadding': 9
    },
    'footer': {
      'color': '#999999',
      'fontSize': 10,
      'font': 'open sans',
      'location': 'bottom-left'
    },
    'size': {
      'canvasWidth': 350,
      'canvasHeight': 350,
      'pieInnerRadius': '9%',
      'pieOuterRadius': '90%'
    },
    'data': {
      'sortOrder': 'value-desc',
      'smallSegmentGrouping': {
        'enabled': true
      },
      'content': data
    },
    'labels': {
      'outer': {
        'pieDistance': 32
      },
      'inner': {
        'hideWhenLessThanPercentage': 3
      },
      'mainLabel': {
        'fontSize': 11
      },
      'percentage': {
        'color': '#ffffff',
        'decimalPlaces': 0
      },
      'value': {
        'color': '#adadad',
        'fontSize': 11
      },
      'lines': {
        'enabled': true
      },
      'truncation': {
        'enabled': true
      }
    },
    'tooltips': {
      'enabled': true,
      'type': 'placeholder',
      'string': '{label}: ▼{value}, {percentage}%'
    },
    'effects': {
      'pullOutSegmentOnClick': {
        'effect': 'linear',
        'speed': 400,
        'size': 8
      }
    },
    'misc': {
      'gradient': {
        'enabled': true,
        'percentage': 100
      }
    }
  });
};