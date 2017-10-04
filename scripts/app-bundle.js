define('app',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function () {
    function App() {
      var _this = this;

      _classCallCheck(this, App);

      this.apiKey = '';
      this.videosPerPage = 25;
      this.message = 'Hello World!';
      this.videos = [];
      this.channel = [];
      this.pageNum = 1;
      this.maxPages = 1;
      this.nextPageToken = null;
      this.prevPageToken = null;
      this.searchedTerm = "";
      this.lastResult = null;
      this.playVideo = false;
      this.loading = true;
      this.currentChannel = { id: null, name: null };
      window.app = this;

      $.getJSON('./api.json', function (data) {
        _this.apiKey = data.key;
        _this.loading = false;
      });

      document.body.addEventListener('playVideo', function (e) {
        _this.performPlay(e.detail);
      });
      document.body.addEventListener('openChannel', function (e) {
        _this.openChannel(e.detail);
      });
    }

    App.prototype.performSearch = function performSearch(a) {
      console.log(a);
      $('.navbar-collapse').collapse('hide');
      this.restartPager();
      this.resetChannel;
      this.currentChannel = {};
      this.getList(this.searchedTerm);
    };

    App.prototype.getList = function getList(query) {
      var _this2 = this;

      var channel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var pageToken = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      this.videos = [];
      this.nextPageToken = null;
      this.prevPageToken = null;

      this.loading = true;
      var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + encodeURI(query) + "&maxResults=" + this.videosPerPage + '&key=' + this.apiKey;
      if (channel) url = url + '&channelId=' + channel;
      if (pageToken) url = url + "&pageToken=" + pageToken;
      $.getJSON(url, function (data) {
        _this2.lastResult = data;
        if (data.nextPageToken) _this2.nextPageToken = data.nextPageToken;
        if (data.prevPageToken) _this2.prevPageToken = data.prevPageToken;
        _this2.maxPages = Math.ceil(_this2.lastResult.pageInfo.totalResults / _this2.lastResult.pageInfo.resultsPerPage);

        _this2.videos = data.items;
        _this2.loading = false;
        window.scrollTo(0, 0);
      });
    };

    App.prototype.openChannel = function openChannel(id, name) {
      console.log(id);
      console.log(name);
      this.searchedTerm = "";
      this.currentChannel = { 'id': id, 'name': name };
      this.getList('', this.currentChannel.id);
    };

    App.prototype.restartPager = function restartPager() {
      this.pageNum = 1;
      this.nextPageToken = null;
      this.prevPageToken = null;
    };

    App.prototype.prevPage = function prevPage() {
      this.getList(this.searchedTerm, this.currentChannel.id, this.prevPageToken);
      this.pageNum--;
    };

    App.prototype.nextPage = function nextPage() {
      this.getList(this.searchedTerm, this.currentChannel.id, this.nextPageToken);
      this.pageNum++;
    };

    App.prototype.performPlay = function performPlay(vid) {
      console.log(vid);
      this.playVideo = true;
      this.youtubeFrame.src = "http://www.youtube.com/embed/" + vid;
    };

    App.prototype.closeVideo = function closeVideo() {
      this.playVideo = false;
      this.youtubeFrame.src = 'about:blank';
    };

    App.prototype.resetChannel = function resetChannel() {
      this.currentChannel = { id: null, name: null };
    };

    return App;
  }();
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');


    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('resources/elements/youtube-video',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.YoutubeVideo = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _desc, _value, _class, _descriptor, _descriptor2, _descriptor3;

  var YoutubeVideo = exports.YoutubeVideo = (_class = function () {
    function YoutubeVideo() {
      _classCallCheck(this, YoutubeVideo);

      _initDefineProp(this, 'vdata', _descriptor, this);

      _initDefineProp(this, 'channelFn', _descriptor2, this);

      _initDefineProp(this, 'playFn', _descriptor3, this);
    }

    YoutubeVideo.prototype.attached = function attached() {
      console.log(this.vdata);
    };

    return YoutubeVideo;
  }(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'vdata', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'channelFn', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, 'playFn', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class);
});
define('resources/value-converters/date',['exports', 'moment'], function (exports, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DateValueConverter = undefined;

  var _moment2 = _interopRequireDefault(_moment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var DateValueConverter = exports.DateValueConverter = function () {
    function DateValueConverter() {
      _classCallCheck(this, DateValueConverter);
    }

    DateValueConverter.prototype.toView = function toView(value) {
      console.log(_moment2.default);
      return (0, _moment2.default)(value).format('DD.MM.YYYY');
    };

    DateValueConverter.prototype.fromView = function fromView(value) {};

    return DateValueConverter;
  }();
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"bootstrap/css/bootstrap.css\"></require><require from=\"bootstrap/css/bootstrap-theme.css\"></require><require from=\"./app.css\"></require><require from=\"resources/elements/youtube-video\"></require><nav class=\"navbar navbar-inverse\"><div class=\"container\"><div class=\"navbar-header\"><a class=\"navbar-brand\" href=\"#\"><span class=\"yt\">Youtube </span>search</a></div><div id=\"navbar\" class=\"navbar-collapse collapse\"><form class=\"navbar-form navbar-right\"><div class=\"form-group\"><input type=\"search\" placeholder=\"Search for...\" class=\"form-control\" value.bind=\"searchedTerm\"></div><button type=\"submit\" class=\"btn btn-primary\" click.trigger=\"performSearch()\">Search</button></form></div></div></nav><div id=\"page\" class=\"container\"><div class=\"input-group\" id=\"mobile-search-input\"><input type=\"text\" class=\"form-control\" placeholder=\"Search for...\" value.bind=\"searchedTerm\"> <span class=\"input-group-btn\"><button class=\"btn btn-primary\" type=\"button\" click.trigger=\"performSearch()\">Search</button></span></div><div class=\"no-vids-placeholder\" show.bind=\"videos.length == 0\">No videos loaded</div><div class=\"loading\" show.bind=\"loading\"><span class=\"glyphicon glyphicon-refresh\"></span></div><h2 show.bind=\"videos.length > 0 && searchedTerm\">Results for search of: ${searchedTerm}</h2><h2 show.bind=\"videos.length > 0 && currentChannel.id\">Results for channel: ${currentChannel.name}</h2><div class=\"container\" id=\"video-container\"><div repeat.for=\"video of videos\" class=\"container\"><youtube-video vdata.bind=\"video\" channel-fn.call=\"openChannel(id,name)\" play-fn.call=\"performPlay(vid)\"></youtube-video></div><div id=\"paginator\" if.bind=\"videos.length > 0\"><div><button class=\"btn btn-success\" disabled.bind=\"!prevPageToken\" click.trigger=\"prevPage()\"><span class=\"glyphicon glyphicon-arrow-left\"></span></button><div id=\"page_number\"><span>${pageNum} </span>of <span> ${maxPages}</span></div><button class=\"btn btn-success\" disabled.bind=\"!nextPageToken\" click.trigger=\"nextPage()\"><span class=\"glyphicon glyphicon-arrow-right\"></span></button></div></div></div></div><div id=\"video-modal\" show.bind=\"playVideo\"><button click.trigger=\"closeVideo()\"><span class=\"glyphicon glyphicon-remove-circle btn btn-danger\"></span></button><iframe ref=\"youtubeFrame\" allowfullscreen></iframe></div></template>"; });
define('text!app.css', ['module'], function(module) { module.exports = ":root {\n  font-size: 16px; }\n\n@media (min-width: 768px) {\n  #mobile-search-input {\n    display: none; } }\n\nnav.navbar {\n  border-top-right-radius: 0px;\n  border-top-left-radius: 0px; }\n\n.yt {\n  color: white;\n  font-weight: bold;\n  text-shadow: 0px 0px 8px rgba(255, 0, 0, 0.9); }\n\n.no-vids-placeholder, .loading {\n  text-align: center; }\n\n.loading {\n  margin-top: 1rem; }\n\n.loading > span {\n  font-size: 10rem;\n  animation: load 1s linear infinite; }\n\n#paginator {\n  text-align: center;\n  margin-bottom: 1rem;\n  margin-top: 1rem; }\n  #paginator div {\n    display: inline-block; }\n  #paginator * {\n    margin-left: 0.1rem;\n    margin-right: 0.1rem; }\n  #paginator div > div {\n    margin-top: 0.4rem; }\n\n#video-modal {\n  width: 100%;\n  height: 100%;\n  z-index: 999;\n  position: fixed;\n  top: 0;\n  left: 0;\n  background-color: rgba(0, 0, 0, 0.5); }\n\n#video-modal > button {\n  display: block;\n  position: absolute;\n  z-index: 1001;\n  right: 5%;\n  top: 5%;\n  padding: 0;\n  border: 0;\n  opacity: 0.75; }\n\n#video-modal > button:hover {\n  opacity: 1; }\n\niframe[ref=youtubeFrame] {\n  position: absolute;\n  z-index: 1000; }\n\n@media (max-width: 768px) {\n  iframe[ref=youtubeFrame] {\n    width: 100%;\n    height: 100%;\n    top: 0;\n    left: 0; } }\n\n@media (min-width: 768px) {\n  iframe[ref=youtubeFrame] {\n    width: 90%;\n    height: 90%;\n    top: 5%;\n    left: 5%; } }\n\n@keyframes load {\n  100% {\n    transform: rotate(360deg); } }\n"; });
define('text!resources/elements/youtube-video.html', ['module'], function(module) { module.exports = "<template><require from=\"./youtube-video.css\"></require><require from=\"./../value-converters/date\"></require><h3 click.trigger=\"playFn({vid : vdata.id.videoId})\">${vdata.snippet.title}</h3><img src=\"${vdata.snippet.thumbnails.default.url}\" alt=\"\" width=\"${vdata.snippet.thumbnails.default.width}\" height=\"${vdata.snippet.thumbnails.default.height}\" class=\"resultThumb\" click.trigger=\"playFn({vid : vdata.id.videoId})\"> <span>${vdata.snippet.description}</span><div class=\"video-extra-data\"><span>Channel: <a click.trigger=\"channelFn({id : vdata.snippet.channelId, name : vdata.snippet.channelTitle})\">${vdata.snippet.channelTitle}</a></span><span>Publish date: ${vdata.snippet.publishedAt | date}</span></div></template>"; });
define('text!resources/elements/youtube-video.css', ['module'], function(module) { module.exports = "youtube-video img {\n  float: left;\n  margin-right: 1rem; }\n\nyoutube-video h3:hover, youtube-video img:hover {\n  cursor: pointer; }\n\nyoutube-video span {\n  word-wrap: break-word; }\n\nyoutube-video .video-extra-data {\n  font-size: 0.75rem; }\n\nyoutube-video span:first-of-type:after {\n  content: ' '; }\n"; });
//# sourceMappingURL=app-bundle.js.map