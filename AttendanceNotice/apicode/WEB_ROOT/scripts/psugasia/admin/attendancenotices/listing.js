define(['angular', 'components/shared/index'], function (angular) {
	var myApp = angular.module('myModule', ['powerSchoolModule']);
  	// creates the controller for the mypage.html page
	// the $rootScope and the myGetService need to be passed in because those services are used in this controller
	myApp.controller('myController', function($scope, $rootScope, myGetService, $sce, $timeout) {

    loadingDialog();

	// initial values of variables used in this controller
    $scope.$sce = $sce;
  	$scope.myData = [];
  	$scope.selectedTile = 'all';

    // sets a watch on $rootScope.selectedMonth to reload the table (PS Grid Widget) when this value changes
    // this funtion also fires on page-load which loads the initial table with 'all' months
    $scope.$watch(function() { return $rootScope.selectedTile; }, function() {
        
      // the $rootScope variable holds the value of the selected month
      if (typeof $rootScope.selectedTile === 'undefined') {
          $scope.selectedTile = 'all';
      } else {
          $scope.selectedTile = $rootScope.selectedTile;
      }
      
      // calls the service that gets the data from the JSON source
      myGetService.getData('listing.json?tile='+$scope.selectedTile).then(function (retData) {
          
        // remove the empty value at the end of the JSON data
        retData.pop();
        
        // convert text strings to javascript dates
        /*
        var i = retData.length;
        while(i--) {
          if (retData[i].processed_when != '') retData[i].processed_when = new Date(retData[i].processed_when);
          if (retData[i].date_end != '') retData[i].date_end = new Date(retData[i].date_end);
          if (retData[i].date_start != '') retData[i].date_start = new Date(retData[i].date_start);
          if (retData[i].whencreated != '') retData[i].whencreated = new Date(retData[i].whencreated);
          if (retData[i].lastupdated != '') retData[i].lastupdated = new Date(retData[i].lastupdated);
        }
        */
               
        // put the data into the $scope variable which is bound to the grid widget
        $scope.myData = retData;
        
        closeLoading();

      });
        
    }, true);
    
    $scope.doSearch = function () {
      loadingDialog();
      
      // the $rootScope variable holds the value of the selected month
      if (typeof $rootScope.selectedTile === 'undefined') {
          $scope.selectedTile = 'all';
      } else {
          $scope.selectedTile = $rootScope.selectedTile;
      }
          
      myGetService.getData('listing.json?tile=' + encodeURIComponent($scope.selectedTile)).then(function (retData) {
          
        // remove the empty value at the end of the JSON data
        retData.pop();
        
        // convert text strings to javascript dates
        /*
        var i = retData.length;
        while(i--) { 
          if (retData[i].processed_when != '') retData[i].processed_when = new Date(retData[i].processed_when);
          if (retData[i].date_end != '') retData[i].date_end = new Date(retData[i].date_end);
          if (retData[i].date_start != '') retData[i].date_start = new Date(retData[i].date_start);
          if (retData[i].whencreated != '') retData[i].whencreated = new Date(retData[i].whencreated);
          if (retData[i].lastupdated != '') retData[i].lastupdated = new Date(retData[i].lastupdated);
        }
        */
             
        // put the data into the $scope variable which is bound to the grid widget
        $scope.myData = retData;
        
        closeLoading();

      });
    }
    
  });
	
	// creates a directive called 'myTiles' -- it does the following:
	// -- binds the tile data to the PS Tiles Widget
	// -- changes the value of $rootscope.selectedMonth when selecting a tile
  myApp.directive('myTiles', function($rootScope, myGetService) {
    return {
      priority: 100,
      require: ['pssVidget', 'pssTilesVidget'],
      
      // because every controller has its own scope, 'myController' above can't access this controller's scope variables
      // for that reason, we need to pass in the $rootScope and store the selected month in a $rootScope variable
      // the $rootScope variable can be 'watched' for changes by the myController controller above
      controller: ['$scope', '$rootScope', function($scope, $rootScope) {
        var ctrlData = {
            pssTilesVidget: null
        };
        $scope.myTilesData = ctrlData;
        
        // load the tile data
        myGetService.getData('listing.json?src=tiles').then(function (retData) {
            retData.pop();
            ctrlData.pssTilesVidget.setTiles(retData);
        });

      }],
      link: function(scope, element, attributes, requires) {
        var pssTilesVidget = requires[1];
        scope.myTilesData.pssTilesVidget = pssTilesVidget;
        
        // creates a function to set a $rootScope variable when a tile is clicked
        var filterListener = function(newvalue, oldvalue) {
            $rootScope.selectedTile = newvalue.id;
        };
        
        // this PS Tile Widget function adds the listener to the Widget
        pssTilesVidget.addTilesFilterListener(filterListener);
      }
    };
  });

  // creates a reuseable factory (service) which will get data from the server using Angular's $http service
  // this service is used by both controllers above: myConroller and myTiles
  myApp.factory('myGetService', function ($http) {
    return {
      getData: function (datafile) {
        return $http.get(datafile).then(function (result) {
          return result.data;
        });
      }
    }
  });
});