(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("initialize.js", function(exports, require, module) {
'use strict';

function main() {
    var div = document.querySelectorAll('div')[1];
    var button = document.querySelector('button');

    // Lorsqu'on clique sur le bouton
    button.addEventListener('click', function () {
        if (div.className == 'hidden') {
            document.querySelectorAll('div')[0].className = "open";
            hiddenP();
            div.className = 'show';
        } else {
            showP();
            document.querySelectorAll('div')[0].className = "closed";
            div.className = 'hidden';
        }
    });

    // Transformer le bouton lorsque le popin est ouvert
    document.addEventListener('click', function () {
        if (div.className == 'show') {
            button.className = 'btnclosed';
        } else {
            button.className = 'btn';
        }
    });

    // Remettre le bouton à son état d'origine si l'on appuie sur la touche "Echap" alors que le popin est ouvert
    document.addEventListener('keydown', function (e) {
        if (e.keyCode == 27) {
            button.className = 'btn';
        } else {
            button.className = 'btnclosed';
        }
    });

    // Fonctionnement du bouton permettant de fermer le popin
    var span = document.querySelector('span');
    span.addEventListener('click', function () {
        showP();
        document.querySelectorAll('div')[0].className = "close";
        div.className = 'hidden';
    });

    // Si l'on appuie sur la touche "Echap", fermer le popin
    document.addEventListener('keydown', function (e) {
        if (e.keyCode == 27) {
            showP();
            document.querySelectorAll('div')[0].className = "close";
            div.className = 'hidden';
        }
    });

    // Activation du bouton type submit lorsque le mail remplit les conditions
    document.querySelectorAll('input')[0].addEventListener("keypress", function () {
        var email = document.querySelectorAll('input')[0].value;
        var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,4})+$/;
        if (re.test(email)) {
            document.querySelectorAll('input')[1].disabled = "";
            document.querySelectorAll('input')[1].className = "vbtn";
        } else {
            document.querySelectorAll('input')[1].disabled = "disabled";
            document.querySelectorAll('input')[1].className = "vbtndbld";
        }
    });

    // Affichage du message de validation lorsque l'email est sauvegardé
    document.addEventListener('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "script.php",
            data: { mail: document.querySelector('#mail').value }
        }).done(function (msg) {
            console.log(msg);
            if (msg == 'ok') {
                alert("Ok");
            } else {
                alert("No");
                console.log("no");
            }
        });
        div.className = 'hidden';
        var p = document.createElement('p');
        var texte = document.createTextNode('Votre demande a bien été prise en compte');
        p.appendChild(texte);
        document.body.querySelectorAll('div')[0].append(p);
        document.querySelectorAll('div')[0].className = "close";
        button.className = 'btn';
        showP();
    });

    // Affichage de la balise "p", message de validation
    function hiddenP() {
        for (var i = 0; i < document.querySelectorAll('p').length; i++) {
            document.querySelectorAll('p')[i].className = "text_off";
        }
    }
    function showP() {
        for (var i = 0; i < document.querySelectorAll('p').length; i++) {
            document.querySelectorAll('p')[i].className = "";
        }
    }
}
main();
});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map