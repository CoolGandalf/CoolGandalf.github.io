(function redirectLegacyWikiLeighUrl(windowObject) {
  'use strict';

  var path = windowObject.location.pathname;
  var wikiRoutes = [
    '/about',
    '/category',
    '/ganbaru-video',
    '/gaps',
    '/missing',
    '/now',
    '/random',
    '/search-index.json',
    '/tag',
    '/today',
    '/wiki'
  ];
  var isWikiRoute = wikiRoutes.some(function (prefix) {
    return path === prefix || path === prefix + '/' || path.indexOf(prefix + '/') === 0;
  });

  if (isWikiRoute) {
    windowObject.location.replace(
      '/wikileighs' + path + windowObject.location.search + windowObject.location.hash
    );
  }
})(window);
