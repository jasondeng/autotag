(function () {
  'user strict';

  angular
      .module('app', [])
      .controller('HomeCtrl', HomeCtrl);

      function HomeCtrl(){
        var oauth2 = function(provider) {
               $auth.authenticate(provider)
                   .then(function() {
                       toastr.success('You have successfully signed in with ' + provider + '!');
                       $location.path('/');
                   })
                   .catch(function(error) {
                       if (error.error) {
                           // Popup error - invalid redirect_uri, pressed cancel button, etc.
                           toastr.error(error.error);
                       } else if (error.data) {
                           // HTTP response error from server
                           toastr.error(error.data.message, error.status);
                       } else {
                           toastr.error(error);
                       }
                   });
           };
      }
})();
