angular.module('App').controller('SettingsController', ['$http', '$location', 'DataService', 'UserService', 'Upload', '$timeout', '$uibModal', 'SettingsService', 'TemplateService', function($http, $location, DataService, UserService, Upload, $timeout, $uibModal, SettingsService, TemplateService){

var vm = this;

    vm.unhidePhotos = false;
    vm.unhideSignatures = false;
    vm.unhideHeaders = false;


    // console.log(UserService.photosArray);


    vm.deletePhoto = function(photo) {
      swal({title: "Are you sure?",   text: "You will not be able to recover this image!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){   swal("Deleted!", "Your image has been deleted.", "success");
      deletePhoto = {};
      id = 12345;
      console.log('photo.id', photo.id);
      deletePhoto.id = photo.id;
      // console.log('delete pushed' , deletePhoto);
      $http.post('/photos/deletePhoto', deletePhoto).then(handleDeleteSuccess, handleDeleteFailure);
      });
    }
    function handleDeleteSuccess(response){
        console.log('Photo Deleted', response);
        createPhotoArray();
    }
    function handleDeleteFailure(response){
        console.log('Failed to delete' , response);
    }

    function createPhotoArray(){
        $http.get('photos/createphotoarray').then(handlePhotoSuccess);
    }
    function handlePhotoSuccess(response){
        console.log(response.data);
        vm.photos = response.data;
    }

    createPhotoArray();

    function createSignatureArray(){
        $http.get('photos/createsignaturearray').then(handleSignatureSuccess);
    }

    function handleSignatureSuccess(response){
        console.log('What is this!!!!!!!!!' ,response.data);
        vm.signatures = response.data;
    }

    createSignatureArray();

    function createHeaderArray(){
        $http.get('photos/createheaderarray').then(handleHeaderSuccess);
    }

    function handleHeaderSuccess(response){
        console.log(response.data);
        vm.headers = response.data;
    }

    createHeaderArray();


    vm.photos = UserService.photosArray;
    vm.signatures = UserService.signaturesArray;
    vm.headers = UserService.headersArray;



    vm.uploadPic = function(file) {

        file.upload = Upload.upload({
            url: '/photos',
            arrayKey: '', // default is '[i]'
            data: {file: file}
        });

        file.upload.then(function (response) {
            $timeout(function () {
                file.result = response.data;
                createPhotoArray();
            });
        }, function (response) {
            if (response.status > 0)
                vm.errorMsg = response.status + ': ' + response.data;
        }, function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
    };

    vm.uploadSig = function(file) {

        file.upload = Upload.upload({
            url: '/photos/sigfile',
            arrayKey: '', // default is '[i]'
            data: {file: file}
        });

        file.upload.then(function (response) {
            $timeout(function () {
                file.result = response.data;
            });
        }, function (response) {
            if (response.status > 0)
                vm.errorMsg = response.status + ': ' + response.data;
        }, function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
    };

    vm.uploadHeader = function(file) {

        file.upload = Upload.upload({
            url: '/photos/headers',
            arrayKey: '', // default is '[i]'
            data: {file: file}
        });

        file.upload.then(function (response) {
            $timeout(function () {
                file.result = response.data;
            });
        }, function (response) {
            if (response.status > 0)
                vm.errorMsg = response.status + ': ' + response.data;
        }, function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
    };

    // vm.showPhotos = function(){
    //     vm.unhidePhotos = !vm.unhidePhotos;
    // };
    //
    // vm.showSignatures = function(){
    //     vm.unhideSignatures = !vm.unhideSignatures;
    // };
    //
    // vm.showHeaders = function(){
    //     vm.unhideHeaders = !vm.unhideHeaders;
    // }
    // function getTemplates(){
    //   $http.get('/template/getTemplates').then(getTemplateSuccess, getTemplateFailure);
    // }
    // function getTemplateSuccess(res){
    //   console.log('templates', res);
    // }
    // function getTemplateFailure(res){
    //   console.log('template retrieval failure');
    // }
    // getTemplates();

    vm.settingsClick = function(id){
      vm.showSettings.photo = false;
      vm.showSettings.template = false;
      vm.showSettings.signature = false;
      vm.showSettings.header = false;
      vm.showSettings[id] = true;
      console.log("this is the id", id);
      console.log("vm.showSettings", vm.showSettings);
      console.log("vm.showSettings[id]" , vm.showSettings[id]);
    }

    vm.showSettings = {
      photo: false,
      template: false,
      signature: false,
      header: false
    }

    vm.templatesList;
    vm.currentTemplate = SettingsService.currentTemplate.template[0].template;
    vm.fieldId = '';

    function buildTemplateObject(){
      var tempTemplateList = TemplateService.templatesObject;
      vm.templatesList = Object.assign({}, tempTemplateList)
      console.log('vm.currentTemplate:', vm.currentTemplate);
    }

    function getCurrentTemplate(){
      vm.currentTemplate = SettingsService.currentTemplate.template[0].template;
    }



    //Pop up modal for editing text
  	vm.editModal = function(id) {
  		console.log('SettingsService.currentTemplate:', SettingsService.currentTemplate);
      console.log('vm.currentTemplate:', vm.currentTemplate);

  		vm.fieldId = id;
  		vm.currentTemplate.currentField = id;
  		$uibModal.open({
  			animation: true,
  			ariaLabelledBy: 'edit text modal',
  			ariaDescribedBy: 'edit text',
  			templateUrl: 'emails/edit_settings_modal.html',
  			controller: 'SettingsModalController',
  			controllerAs: 'settingsModal',
  			size: 'md'
  		});
  	};

  	//Pop up modal for choosing images
  	vm.imageModal = function(id) {
  		// vm.currentDonor.template.currentField = id;
  		$uibModal.open({
  			animation: true,
  			ariaLabelledBy: 'image modal',
  			ariaDescribedBy: 'pick an image',
  			templateUrl: 'emails/image_settings_modal.html',
  			controller: 'SettingsModalController',
  			controllerAs: 'settingsModal',
  			size: 'md',
  			windowClass: 'imageModalClass'
  		});
  	};


    //Dropdown menu to choose different templates
    vm.templates = [{
      name: 'Template 1',
      url: 'emails/template1SettingsView.html'
    }, {
      name: 'Template 2',
      url: 'emails/template2SettingsView.html'
    }, {
      name: 'Template 3',
      url: 'emails/template3SettingsView.html'
    }, {
      name: 'Template 4',
      url: 'emails/template4SettingsView.html'
    }, {
      name: 'Template 5',
      url: 'emails/template5SettingsView.html'
    }];

    vm.selectedTemplate = vm.templates[0];

    vm.setCurrentTemplate = function(template){
      vm.selectedTemplate = vm.templates[template - 1];
      // vm.currentTemplate = vm.templatesList['template' + template];
      SettingsService.currentTemplate.template[0].template = vm.templatesList['template' + template];
      getCurrentTemplate();

      console.log('currentTemplate:', vm.currentTemplate);
      console.log('template selected:', template);
    }


    vm.saveTemplate = function(template){
      console.log('saved template:', template);
      //function(template.id, template.img, template.img2, template.img3, template.img4, template.p1, template.p2, template.p3, template.p4, template.quote, template.temp)
    }

    vm.saveAllTemplates = function(){
      console.log('save all templates:', vm.templatesList);
    }

// DataService.getTemplates();
buildTemplateObject();
getCurrentTemplate();


}]);
