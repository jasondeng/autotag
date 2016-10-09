(function () {
  'use strict';

  angular
      .module('app', ['satellizer'])
      .controller('HomeCtrl', HomeCtrl);

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
})();
