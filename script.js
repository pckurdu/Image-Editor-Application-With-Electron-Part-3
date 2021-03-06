var app=angular.module('myApp',['ngRoute']);


const {remote}=require('electron')

   

//part2
app.config(function($routeProvider){
    $routeProvider.when('/',{
        templateUrl:'./select.html',
        controller:'selectCtrl'
    })
    .when('/edit',{
        templateUrl:'./edit.html',
        controller:'editCtrl'
    })
    .otherwise({
        template:'Page Not Found'
    })
})

//part3
app.service('imageService',function(){
    var imagePath="";

    this.setImagePath=function(path){//set image
        imagePath=path;
    }

    this.getImagePath=function(){//get image
        return imagePath;
    }
})

app.controller('frameCtrl',function($scope){

    var win=remote.getCurrentWindow();
    $scope.close=function(){
        win.close();
    }
    $scope.max=function(){
        if(win.isMaximized()){
            win.unmaximize()
        }else{
            win.maximize()
        }
    }
    $scope.min=function(){
        win.minimize();
    }

});

//part2
app.controller('selectCtrl',function($scope,$location,imageService){
    //part3
    var dragFile= document.getElementById("imageSelector");//I choose the imageSelector element
    dragFile.addEventListener('drop', function (e) {//I listen to the drop event.
      e.preventDefault();//prevent the current events of the element
      e.stopPropagation();//stop all events of the present element.
      
      //console.log(e);
      for (let f of e.dataTransfer.files) {//I am accessing the dropped file.
        console.log(f);
        //image/jpeg  image/png
        if(f.type=="image/jpeg"||f.type=="image/png"){
            $location.path('/edit');
            $scope.$apply();
            imageService.setImagePath(f.path);
        }

      }
    });
    dragFile.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.stopPropagation();
    });

    $scope.imageSelect=function(){
        var {dialog}=remote;

    dialog.showOpenDialog({
            properties:['OpenFile'],
            filters:[{
                name:'Images',
                extensions:['jpg','jpeg','png']
            }]
        },function(file){
            if(!!file){
                var path=file[0];
                $location.path('/edit');
                $scope.$apply();

                /*part3*/
                imageService.setImagePath(path);
            }
        })
    }

    
});

//part3
app.controller('editCtrl',function($scope,imageService){
    $scope.imagePath=imageService.getImagePath();
})