(function () {
  'use strict';

  angular
      .module('app', ['satellizer'])
      .controller('HomeCtrl', HomeCtrl)
      .config(config);

      HomeCtrl.$inject = ['$auth','$scope','$http', '$location'];

      function HomeCtrl($auth, $scope, $http, $location){

        $scope.phone_submitted = false;
        $scope.phonenumber = "";
        $scope.linked = false;
        $scope.bothSubmitted = false;
        $scope.submitNumber = function() {

          var data = {
            phone_number: $scope.phonenumber
          }

          $http.post('/post/phonenum', data)
            .then(function () {
              console.log('submitted');
              $scope.phone_submitted = !$scope.phone_submitted;
              $scope.linked = !$scope.linked;
              $location.path('/');
            })
        }

        $scope.oauth2 = function(provider) {
          $auth.authenticate(provider)
                 .then(function() {
                   console.log($scope.phonenumber);
                     console.log('authenitated');
                     $scope.linked = !$scope.linked;
                     $scope.bothSubmitted = !$scope.bothSubmitted;
                     console.log($scope.linked);
                     $location.path('/');
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
