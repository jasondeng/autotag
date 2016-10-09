(function () {
  'use strict';

  angular
      .module('app', ['satellizer'])
      .controller('HomeCtrl', HomeCtrl)
      .config(config);

      HomeCtrl.$inject = ['$auth','$scope','$http', '$location','$window'];

      function HomeCtrl($auth, $scope, $http, $location, $window){

        $scope.twitter_submitted = false;
        $scope.linked = false;
        $scope.bothSubmitted = false;
        $scope.phonenumber = "";

        $scope.submitNumber = function() {

          var data = {
            phone_number: $scope.phonenumber,
            token: $window.localStorage['token']
          }

          $http.post('/post/phonenum', data)
            .then(function () {
              console.log('submitted');
              $scope.linked = !$scope.linked;
              $scope.bothSubmitted = !$scope.bothSubmitted;
              console.log($scope.linked);
              $location.path('/');
            });
      }
      $scope.oauth2 = function(provider) {
        $auth.authenticate(provider)
               .then(function(data) {
                   $scope.twitter_submitted = !$scope.twitter_submitted;
                   $scope.linked = !$scope.linked;
                   console.log(data.data.token);
                   $window.localStorage['token'] = data.data.token;
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
