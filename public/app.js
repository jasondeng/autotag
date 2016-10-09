(function () {
  'use strict';

  angular
      .module('app', ['satellizer'])
      .controller('HomeCtrl', HomeCtrl)
      .config(config);

      HomeCtrl.$inject = ['$auth','$scope'];

      function HomeCtrl($auth, $scope){
     

        $scope.oauth2 = function(provider) {
          console.log('clicked');
          $auth.authenticate(provider)
                 .then(function() {
                     console.log('authenitated');
                 })
                 .catch(function(error) {
                   console.log(error);
                 });
         };
      }

      config.$inject = ['$authProvider'];
      function config($authProvider) {
        $authProvider.twitter({
          url: '/auth/twitter'
        });
      }
})();
