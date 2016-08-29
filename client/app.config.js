angular.module('App').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
  $routeProvider
    .when('/', {
      templateUrl: '/views/login.html',
      controller: 'LoginController',
      controllerAs: 'login'
    })
    .when('/home', {
      templateUrl: '/views/home.html',
      controller: 'HomeController',
      controllerAs: 'home'
      // ,
      // resolve: {
      //   donors: function(DataService){
      //     return DataService.getData();
      //   }
      // }
    })
    // .when('/edit', {
    //   templateUrl: '/views/edit.html',
    //   controller: 'EditController',
    //   controllerAs: 'edit'
    // })
    .when('/settings' , {
      templateUrl: '/views/settings.html',
      controller: 'SettingsController',
      controllerAs: 'settings'
    })
    .when('/gettingdata',{
      templateUrl: '/views/gettingdata.html',
      controller: 'GettingDataController',
      controllerAs: 'getting'
    })
    .when('/donor', {
      templateUrl: '/views/donor.html',
      controller: 'MainController',
      controllerAs: 'main'
      // ,
      // resolve: {
      //   bleh: function(DonationService){
      //     return DataService.getBleh();
      //   }
      // }
    })
    .when('/overview', {
      templateUrl: '/views/overview.html',
      controller: 'MainController',
      controllerAs: 'main'
    })

    .otherwise({redirectTo:'/'});

  $locationProvider.html5Mode(true);
}]);
