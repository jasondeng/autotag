(function () {
  'use strict';

  angular
      .module('app', ['satellizer'])
      .controller('HomeCtrl', HomeCtrl);

      HomeCtrl.$inject = ['$auth'];

      function HomeCtrl($auth){

        var oauth2 = function(provider) {
          $auth.authenticate(provider)
                 .then(function() {
                     console.log('authenitated');
                 })
                 .catch(function(error) {
                   consol.log(error);
                 });
         };

      }
})();
