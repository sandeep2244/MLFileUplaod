angular.module('fileUpload', ['ngFileUpload'])
.controller('MyCtrl',['Upload','$window','$scope',function(Upload,$window,$scope){
    var vm = this;
    vm.predictiontxt = "";
    vm.classArr = new Array();
  
    vm.submit = function(){ //function to call on form submit
        console.log("submittttt");
        console.log(vm.upload_form.file.$valid);
        console.log(vm.file);
       
        if (vm.upload_form.file.$valid && vm.file) { //check if from is valid

             const img = document.getElementById('img');

                vm.height = img.naturalHeight ;
                vm.width = img.naturalWidth ;


  tf.ENV.set('WEBGL_PACK', false)
  // Load the model.

  cropToCanvas = (image, canvas, ctx) => {
    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;

    canvas.width = image.width;
    canvas.height = image.height;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (naturalWidth > naturalHeight) {
      ctx.drawImage(
        image,
        (naturalWidth - naturalHeight) / 2,
        0,
        naturalHeight,
        naturalHeight,
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
      );
    } else {
        console.log("second if");
      ctx.drawImage(
        image,
        0,
        (naturalHeight - naturalWidth) / 2,
        naturalWidth,
        naturalWidth,
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
      );
    }
  };


const c = document.getElementById("canvas");
    const ctx = c.getContext("2d");
    cropToCanvas(img, c, ctx);
  cocoSsd.load().then(model => {
    // detect objects in the image.
    model.detect(img).then(predictions => {
      console.log('Predictions: ', predictions);

      vm.classArr = [];
      // Font options.
      const font = "16px sans-serif";
      ctx.font = font;
      ctx.textBaseline = "top";

      predictions.forEach(prediction => {
        const x = prediction.bbox[0];
        const y = prediction.bbox[1];
        const width = prediction.bbox[2];
        const height = prediction.bbox[3];
        // Draw the bounding box.
        vm.classArr.push(prediction.class);
        ctx.strokeStyle = "#00FFFF";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        // Draw the label background.
        ctx.fillStyle = "#00FFFF";
        const textWidth = ctx.measureText(prediction.class).width;
        const textHeight = parseInt(font, 10); // base 10
        ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
      });

      predictions.forEach(prediction => {
        const x = prediction.bbox[0];
        const y = prediction.bbox[1];
        // Draw the text last to ensure it's on top.
        ctx.fillStyle = "#000000";
        ctx.fillText(prediction.class, x, y);
      });

      if(predictions.length>0)
      {
        console.log("heloooooooo");
      
       $scope.$apply(function(){
     vm.predictiontxt = "Object Detected";
});
      }
      else
      {
        
         $scope.$apply(function(){
            vm.predictiontxt = "Sorry, i can't detect object, It could be my fault, Please try again"
         });
      }


    },
    err => {
               $scope.$apply(function(){
            vm.predictiontxt = "Error in Prediction Image and error is " + err +".";
        });
    }


    );
  },
  error => {
              $scope.$apply(function(){
        vm.predictiontxt = "Error on loadiing COCO models and error is " + error +".";
    });
  });


            vm.upload(vm.file); //call upload function
        }
       
    }
    
    vm.upload = function (file,img) {
        Upload.upload({
            url: 'http://localhost:3000/upload', //webAPI exposed to upload the file
            data:{file:file} //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if(resp.data.error_code === 0){ //validate success
                console.log(resp.config.data.file);
                $window.alert('Success ' + resp.config.data.file.name + ' uploaded.');
                vm.predictiontxt = "File Is Uploaded, Object Detection is in process please wait to detect Objects from image !! Thank you";
                vm.uploadstatus = 'Success';
           
                vm.filesize = resp.config.data.file.size;
                vm.filetype = resp.config.data.file.type;



            } else {
                vm.uploadstatus = 'Fail';
                $window.alert('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        }, function (evt) { 
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
           
            vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };

   
}]);