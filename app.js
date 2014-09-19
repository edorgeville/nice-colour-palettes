var request = require('request')
  , cheerio = require('cheerio')
  , async = require('async')
  , format = require('util').format;

var express = require("express"),
    app = express(),
    port = parseInt(process.env.PORT, 10) || 3000;

var palettes = [];

function getPalettes(){
  var url = format('http://www.colourlovers.com/ajax/browse-palettes/_page_1?section=most-loved&period=all-time&view=meta&channelID=0');
  request(url, function (err, response, body) {
      if (err) throw err;
      var $ = cheerio.load(body);
      $('.content-panel .detail-row').each(function () {
          $(this).find('*:not(.detail-row-overlay) .palette').each(function(){
            var palette = [];
            $(this).find('.c').each(function(){
              var color = $(this)
                .attr('style')
                .split("; ")[2]
                .replace('background-color: ','')
                .replace(';','');
              palette.push(color);
            });
            palettes.push(palette);
          });
      });
      console.log(palettes);
  });
}

getPalettes();

app.get("/", function (req, res) {
  res.send(palettes);
});

console.log("http://localhost:" + port);
app.listen(port);