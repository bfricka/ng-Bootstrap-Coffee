/** ng-Bootstrap-JS - v0.1.0 - https://github.com/brian-frichette/ng-Bootstrap
  * Copyright (c) 2013 Brian Frichette. All rights reserved.
  * Licensed MIT - http://opensource.org/licenses/MIT
  */
(function() {
  var app;

  app = angular.module('myApp', []);

  app.run([
    '$rootScope', function($rootScope) {
      return $rootScope.safeApply = function(fn) {
        if (this.$root.$$phase) {
          if (fn && (typeof fn === 'function')) {
            return fn();
          } else {
            return this.$apply(fn);
          }
        }
      };
    }
  ]);

  app.factory('Stor', [
    '$q', '$rootScope', '$timeout', function($q, $rootScope, $timeout) {
      var Stor;
      Stor = (function() {
        Stor = function(key, exp) {
          this.key = key != null ? key : void 0;
          this.exp = exp != null ? exp : null;
          return this.amp = amplify.store;
        };
        Stor.prototype = {
          get: function(key) {
            key = key != null ? key : this.key;
            return this.amp(key);
          },
          set: function(val, key, exp) {
            key = key != null ? key : this.key;
            exp = exp != null ? exp : this.exp;
            return this.amp(key, val, {
              expires: exp
            });
          },
          remove: function(key) {
            key = key != null ? key : this.key;
            return this.amp(key, null);
          },
          empty: function() {
            var key, storage, _results;
            storage = this.amp();
            _results = [];
            for (key in storage) {
              if (storage.hasOwnProperty(key)) {
                _results.push(this.remove(key));
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          },
          getAsync: function() {
            var args, fn, q,
              _this = this;
            args = [].slice.call(arguments, 1);
            fn = arguments[0];
            q = $q.defer();
            $timeout(function() {
              var data, req, ret;
              data = _this.get.apply(_this, args);
              if (data) {
                return $rootScope.safeApply(function() {
                  return q.resolve({
                    data: data,
                    type: 'local'
                  });
                });
              } else {
                req = fn();
                ret = {
                  type: 'xhr'
                };
                return req.then(function(res) {
                  return $rootScope.safeApply(function() {
                    ret.data = res.data;
                    ret.status = res.status;
                    return q.resolve(ret);
                  });
                });
              }
            }, 1);
            return q.promise;
          }
        };
        return Stor;
      })();
      return Stor;
    }
  ]);

  app.controller("MainAppCtrl", [
    "$scope", function($scope) {
      return $scope.title = "ng-Bootstrap";
    }
  ]);

}).call(this);
