app.factory 'Stor', [
  '$q', '$rootScope', '$timeout'
  ($q, $rootScope, $timeout) ->
    Stor = do ->
      Stor = (key, exp) ->
        @key = if key? then key else undefined
        @exp = if exp? then exp else null
        @amp = amplify.store

      Stor:: =
        get: (key) ->
          key = if key? then key else @key
          @amp key

        set: (val, key, exp) ->
          key = if key? then key else @key
          exp = if exp? then exp else @exp
          @amp key, val, { expires: exp }

        remove: (key) ->
          key = if key? then key else @key
          @amp key, null

        empty: ->
          storage = @amp()
          for key of storage
            @remove key if storage.hasOwnProperty(key)

        getAsync: ->
          args = [].slice.call(arguments, 1)
          fn = arguments[0]
          q = $q.defer()
          $timeout =>
            data = @get.apply(@, args)
            if data
              $rootScope.safeApply ->
                q.resolve
                  data: data
                  type: 'local'
            else
              req = fn()
              ret = type: 'xhr'
              req.then (res) ->
                $rootScope.safeApply ->
                  ret.data = res.data
                  ret.status = res.status
                  q.resolve ret
          , 1

          q.promise

      Stor
    Stor
]