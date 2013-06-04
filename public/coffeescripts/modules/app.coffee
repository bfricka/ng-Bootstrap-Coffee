# Create application
app = angular.module 'myApp', []

app.run [
  '$rootScope', ($rootScope) ->
    $rootScope.safeApply = (fn) ->
      if @$root.$$phase
        if fn and (typeof fn is 'function')
          do fn
        else
          @$apply fn
]