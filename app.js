const luwak = require('luwak');
const bono = require('bono');
const http = require('http');
const cors = require('kcors');

luwak
  .prepare('urlParse', function(urlString) {
    return url.parse(urlString);
  })
  .prepare('trim', function(str) {
    return str.trim();
  })
  .use(require('luwak/lib/middlewares/user-agent')('Googlebot/2.1 (+http://www.google.com/bot.html)'))
  .use(require('luwak/lib/middlewares/http-engine')());

var app = bono()
  .use(cors())
  .use(function *(next) {
    console.log(this.method, this.url);

    if (this.method === 'POST') {
      yield new Promise(function(resolve, reject) {
        var chunks = [];
        this.req.on('data', function(chunk) {
          chunks.push(chunk);
        });

        this.req.on('end', function() {
          this.request.body = JSON.parse(Buffer.concat(chunks));
          resolve();
        }.bind(this));
      }.bind(this));
    }

    yield next;
  })
  .routeGet('/', function() {
    this.body = {
      name: 'Scrape'
    };
  })
  .routePost('/', function *() {
    try {
      var select = this.request.body.$select;
      var scraper = luwak(this.request.body.$url)
        .select(this.request.body.$select);

      if (this.request.body.$pagination) {
        scraper.paginate.apply(scraper, this.request.body.$pagination);
      }

      this.body = yield scraper.start();
    } catch(e) {
      console.error('<E>', e.stack);
    }
  });

var s = http.createServer(app.callback());
s.listen(3000, '0.0.0.0', function() {
  console.log('Listening at ' + s.address().address + ':' + s.address().port);
});