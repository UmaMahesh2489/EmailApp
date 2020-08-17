(function (angular) {
//  'use strict';
  angular.module('myapp', ['ui.router',
   'ui.bootstrap'
  ])

  //factory method
  .factory('myservice', function($http){
    var service ={};
    var baseurl =  'http://jsonplaceholder.typicode.com';
    service.getPostData =function(){
       return $http.get(baseurl  + "/posts");
    }
    service.getUserData =function(){
      return $http.get(baseurl  + "/users");
   }
   return service;
})




//route configuration
  .config(['$stateProvider', '$urlRouterProvider',function ($stateProvider, $urlRouterProvider){
      $stateProvider.state('/',{
          url:'/',
          templateUrl : 'home.html',
          controller:'MainController'
      }).state('emailbody',{
        url:'/emailbody/:userId?value',     
        templateUrl : 'emailbody.html',
        controller:'MainController'
      })
      $urlRouterProvider.otherwise('/');
  }])

 
  .run(function($state){
    $state.transitionTo('/');
  })
  
  //controller
  .controller('MainController',['$scope','$state','$stateParams','$http','$filter','myservice', '$uibModal',
      
      function($scope,$state,$stateParams,$http,$filter, myservice,$uibModal) {
        $scope.selectedpostid = parseInt($stateParams.value);
        
        $scope.selectedpostid1 = parseInt($stateParams.value);    
        
        $scope.submitForm = function()
      {
        $state.transitionTo('home');
      }  
    var init = function() {
    myservice.getPostData().then(
    function successCallback(response) {
      $scope.postData = response.data;
      $scope.postsready = true;     
      
    },
    function errorCallback(response) {
      console.log("Error");
    }
  );

  myservice.getPostData().then(
    function successCallback(response){
      $scope.postData = response.data;
    }
  )





  myservice.getUserData().then(
    function successCallback(response) {
      $scope.userData =  response.data;
      $scope.usersready = true; 
    },
    function errorCallback(response) {
      console.log("Error");
    }
  );
  
};

init();



$scope.getUsername = function(userID){
  return $scope.userData.filter(name => name.id===userID )
}
// $scope.getEmailId = function(userID){
//   return $scope.userData.filter(email => email.id===userID );
// }

if($scope.usersready && $scope.postsready){

$scope.getselectedEmailId = function(userID){ 
  return $scope.userData.filter(email => email.id===userID );
}
$scope.getselectedpostData = function(userID){ 
  return $scope.postData.filter(userId => userId.id ===userID );
}
 }



//auto populate
if($scope.usersready){
$scope.usernameList=[];
 for(var i=0;i<$scope.userData.length;i++){
      $scope.usernameList.push($scope.userData[i].name);
 }
 $scope.emailIdList=[];
 for(var i=0;i<$scope.userData.length;i++){
      $scope.emailIdList.push($scope.userData[i].email);
 }
$scope.complete=function(string){			
  var output=[];
  angular.forEach($scope.usernameList,function(user){
    if(user.toLowerCase().indexOf(string.toLowerCase())>=0){
      output.push(user);      
    }
  });
  $scope.filterUser=output;
}
$scope.fillTextbox=function(string){
  $scope.user=string;
  $scope.filterUser=null;
}
}

//custom search filter
if($scope.postsready || $scope.usersready){
$scope.userFilter = function(searchvalue) {
  return function(post) {
    if(searchvalue === '' || !$scope.usernameList.includes(searchvalue) ) {
      return true
    }
    var uid = $scope.userData.filter(user => user.name.toLowerCase() === searchvalue.toLowerCase()); 
    if(uid && uid.length > 0) { 
      var uidd = uid[0].id;
     return post.userId === uidd; 
    }
    return false
  };
};
$scope.emailFilter = function(searchvalue) {
  return function(post) {
    if(searchvalue === '' || !$scope.emailIdList.includes(searchvalue)) {      
      return true
    }
    var uid = $scope.userData.filter(user => user.email.toLowerCase() === searchvalue.toLowerCase()); 
    if(uid && uid.length > 0) { 
      var uidd = uid[0].id;
     return post.userId === uidd; 
    }
    return false
  };
};
}
}])
}(angular));
