angular.module('App').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
  $routeProvider
    .when('/', {
      templateUrl: '/views/home.html',
      controller: 'HomeController',
      controllerAs: 'home'
    })
    .when('/home', {
      templateUrl: '/views/home.html',
      controller: 'HomeController',
      controllerAs: 'home',
      resolve: {
        // getstuff: ['TemplateService', function(TemplateService){
        //   // console.log('i know you should work');
        //   return TemplateService.createTemplate();
        // }],
        someting: ['DataService', function(DataService){
          return DataService.getData();
        }],
        bleh: ['TemplateService', function(TemplateService){
          return TemplateService.createPhotoArray();
        }],
        stuff: ['TemplateService', function(TemplateService){
          return TemplateService.getTemplates();
        }],
        meh: ['TemplateService', function(TemplateService){
          return TemplateService.getSigArray();
        }],
        huh: ['TemplateService', function(TemplateService){
          return TemplateService.getHeadersArray();
        }]
      }
    })
    // .when('/edit', {
    //   templateUrl: '/views/edit.html',
    //   controller: 'EditController',
    //   controllerAs: 'edit'
    // })
    .when('/settings' , {
      templateUrl: '/views/settings.html',
      controller: 'SettingsController',
      controllerAs: 'settings',
      resolve: {
        getTemplates: ['TemplateService', function(TemplateService){
          return TemplateService.getTemplates();
        }]
      }
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
    })
    // .when('/overview', {
    //   templateUrl: '/views/overview.html',
    //   controller: 'OverviewController',
    //   controllerAs: 'over'
    //   // ,
    //   // resolve: {
    //   //   bleh: ['DonationService', function(DonationService){
    //   //     return DonationService.getDonorDbStuff();
    //   //   }]
    //   // }
    // })

    .otherwise({redirectTo:'/'});

  $locationProvider.html5Mode(true);
}]);
