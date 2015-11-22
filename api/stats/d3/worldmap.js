var worldMap = function(rawData) {
  var serverToCountryMapping = [
    {server: 'die-staemme.de', country: 'DEU'},
    {server: 'tw.nl', country: 'NLD'},
    {server: 'staemme.ch', country: 'CHN'},
    {server: 'plemiona.pl', country: 'POL'},
    {server: 'tw.se', country: 'SWE'},
    {server: 'tw.com.br', country: 'BRA'},
    {server: 'tw.com.pt', country: 'PRT'},
    {server: 'divokekmeny.cz', country: 'CZE'},
    {server: 'bujokjeonjaeng.org', country: 'CHN'},
    {server: 'triburile.ro', country: 'ROU'},
    {server: 'voyna-plemyon.ru', country: 'RUS'},
    {server: 'fyletikesmaxes.gr', country: 'GRC'},
    {server: 'tw.no.com', country: 'NOR'},
    {server: 'divoke-kmene.sk', country: 'SVK'},
    {server: 'klanhaboru.hu', country: 'HUN'},
    {server: 'tw.dk', country: 'DNK'},
    {server: 'tribals.it', country: 'ITA'},
    {server: 'klanlar.org', country: 'TUR'},
    {server: 'guerretribale.fr', country: 'FRA'},
    {server: 'guerrastribales.es', country: 'ESP'},
    {server: 'tw.fi', country: 'FIN'},
    {server: 'tw.ae', country: 'ARE'},
    {server: 'tw.co.uk', country: 'GBR'},
    {server: 'vojnaplemen.si', country: 'SVN'},
    {server: 'genciukarai.lt', country: 'LTU'},
    {server: 'plemena.com', country: 'HRV'},
    {server: 'tw.us', country: 'USA'},

    {server: 'twmasters.net', country: ''},
    {server: 'tw.net', country: ''},
    {server: 'perangkaum.net', country: ''},
    {server: 'tw.asia', country: ''},
    {server: 'beta.tw.net', country: ''},
    {server: 'tw.works', country: ''}
  ];

  var data = _.countBy(rawData, function(d) {
    var server = _.findWhere(serverToCountryMapping, {server: d.server});
    //if (!server) console.log(d);
    return server.country;
  });
  data = _.mapObject(data, d => ({downloads: d, fillKey: 'hasDownloads'}));
  console.log(data);

  var map = new Datamap({
    element: document.getElementById('worldmap'),
    height: 350,
    width: 750,
    data: data,
    fills: {
      defaultFill: "lightgray",
      hasDownloads: "#ABDDA4"
    },
    geographyConfig: {
      popupTemplate: function(geography, data) {
        var serverName = _.findWhere(serverToCountryMapping, {country: geography.id});
        if (!serverName) {
          return '<div class="hoverinfo"><h4 style="margin-top: 0px">' + geography.properties.name + '</h4>No TW server :(</div>';
        }
        return '<div class="hoverinfo"><h4 style="margin-top: 0px">' + serverName.server + ' (' + geography.properties.name + ')</h4>Downloads: ' + data.downloads + '</div>';
      }
    }
  });

  //map.labels();
};