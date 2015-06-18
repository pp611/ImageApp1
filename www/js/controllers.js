angular.module('ImageApp1.controllers', [])

  .controller('imageController', function($scope, $cordovaCamera, $cordovaFile) {
    // 1
    $scope.images = [];
    
    $scope.addImage = function() {
      // 2
      var options = {
        destinationType : Camera.DestinationType.FILE_URI,
        sourceType : Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
        allowEdit : false,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions
      };

      console.log("-- imageController.addImage:");
      // 3
      $cordovaCamera.getPicture(options).then(function(imageData) {
        
        // 4
        onImageSuccess(imageData);
        
        function onImageSuccess(fileURI) {
          console.log("-- imageController.addImage.onImageSuccess:", fileURI);
          createFileEntry(fileURI);
        }
        
        function createFileEntry(fileURI) {
          console.log("-- imageController.addImage.createFileEntry:", fileURI);
          window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
        }
        
        // 5
        function copyFile(fileEntry) {
          console.log("-- imageController.addImage.copyFile:", fileEntry);
          var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
          console.log("-- imageController.addImage.copyFile:", name);
          var newName = makeid() + name;
          console.log("-- imageController.addImage.copyFile:", newName);


          window.resolveLocalFileSystemURL(cordova.file.dataDirectory,
                                           function(fileSystem2) {
                                             fileEntry.copyTo(
                                               fileSystem2,
                                               newName,
                                               onCopySuccess,
                                               fail
                                             );
                                           },
                                           fail);
        }
        
        // 6
        function onCopySuccess(entry) {
          console.log("-- imageController.addImage.:onCopySuccess", entry);
          $scope.$apply(function () {
            $scope.images.push(entry.nativeURL);
            // alert("Image has been added");
          });
        }
        
        function fail(error) {
          console.log("-- imageController.fail: " + error.code);
        }
        
        function makeid() {
          var text = "";
          var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          
          for (var i=0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
          }
          return text;
        }
        
      }, function(err) {
        console.log(err);
      });
    };

    $scope.urlForImage = function(imageName) {
      var name = imageName.substr(imageName.lastIndexOf('/') + 1);
      var trueOrigin = cordova.file.dataDirectory + name;
      return trueOrigin;
    };
    
  });
