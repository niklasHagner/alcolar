// Code goes here

var app = angular.module('myApp', []);

app.factory('systembolagetSearch', function ($q, $http) {

    return {

        getDataFromSystembolaget: function (filterSettings) {
            var deferred = $q.defer();
            search = "";
            var filters = filterSettings.getFilterString();
            var apiUrl = "http://systemetapi.se/product?";
            var preventCorsProblems = "&callback=?";
            var url = apiUrl + filters + preventCorsProblems;
            
            $.ajax({
			  url: url,
			  async: true, cache:true,
			  dataType: 'json',
			  success: function (data) {
					var products = data;
					deferred.resolve(products);
			  },
			  error: function(jqXHR, textStatus, errorString) {
				console.log("error calling API." +"\n  Returned with Status: " + textStatus + "\n  Error: " + errorString);
			  }
			});
            
            return deferred.promise;
        }
    };
});



app.controller('SystembolagetSearchController', ['$scope', 'systembolagetSearch', '$timeout', '$rootScope', function ($scope, systembolagetSearch, $timeout, $rootScope) {

  
    $scope.search = "";
    $scope.products = [];
		$scope.editFavouritesView = false;
		$scope.searchView = true;
		$scope.favouriteProducts = [];
		$scope.currentProduct = $scope.favouriteProducts[0];
		$scope.currentProductIndex = 0;
				
		$scope.removeProduct = function(index) {
			$scope.favouriteProducts.splice(index, 1);
		};
    
    $scope.performSearch = function (value) {
            $scope.products = [];
            var promise = systembolagetSearch.getDataFromSystembolaget($scope.filterSettings);

            promise.then(function (productsData) {
                // $scope.products = data;
                angular.forEach(productsData, function (product) {
                    
                    var searchProduct = product;
                    searchProduct.alcohol = decToPercentageNum(product.alcohol);
                    searchProduct.volume = parseFloat(product.volume) * 100;
                    searchProduct.article_id = product.article_id; //todo: modify ID to fit to suit official systemet API
                    searchProduct.img = "http:\/\/www.systembolaget.se\/imagevaultfiles\/id_11184\/cf_1915\/" + product.article_id + ".jpg";
                    $scope.products.push(searchProduct);
                });
                 
                //$scope.getImages($scope.products);
            })
           

       
    };
    
                
            
	 $scope.getImages = function(list) {
	
         var errorCounter = 0;
		 for(var i=0;i<15; i++) {
             var id = list[i].product_number.substring(0,5);
             //id = list[i].article_id < 6 ? list[i].article_id.substring(0,4) : list[i].article_id.substring(0,5) ;
			
             
             for (var attempt = 3; attempt < 8; attempt++) {
             
                 id = list[i].product_number.substring(0,attempt);
                 var url = "http://systembolagetapi.se/?id=" + id + "&callback=?"; //avoids cross-domain-problems
                     console.log("attempt : " + attempt + " @ " + id);
                 
                $.ajax({
                  url: url,
                  async: true, cache:true,
                  dataType: 'json',
                  success: function (data) {
                        console.log("found image ");
                        /*var imgSrc = decodeURI(data.image);
                        list[this.songArrayIndex]["img"] = imgSrc;
                        $scope.$apply(); */
                  },
                  error: function(jqXHR, textStatus, errorString) {
                    //console.log("error calling spotify:s search API.");
                      errorCounter++;
                  }
                });
             }
		
		 }
	 }
            
    $scope.filterSettings = { 
        drinkCategory : { key: "tag", value: "" },
       
        orderby : { key: "order_by", value: "alcohol" }, //todo: bind
        orderby_options : [
            {value: "", display:"-- inget val --" }, 
            {value: "alcohol", display:"alkoholprocent" }, 
            {value: "name", display:"produktnamn" }, 
            {value: "price", display:"pris" },  
            {value: "price_per_liter", display:"pris per liter" }, 
            {value: "alcohol", display:"alkoholprocent" }, 
            {value: "apk", display:"alkohol per krona" }
        ],
       
        order : { key: "order", value: "ASC" },
      
        
       
        country : { key: "country", value: "1" },
      
        name : { key: "name", value: "" },
        
        maxVolume : { key: "max_volume", value: 0.33 },
        limit : { key: "limit", value: 50 },
        offset : { key: "offset", value: 0 },
        
        alcoholMin : { key: "alcohol_from", value: 0.045 },
        alcoholMax : { key: "alcohol_to", value: 0.15 },
        minPrice : { key: "price_from", value: 20 },
        maxPrice : { key: "price_to", value: 70 },
        minPricePerLiter : { key: "price_per_liter_from", value: 10 },
        maxPricePerLiter : { key: "price_per_liter_to", value: 1000 },
        apkMin : { key: "apk_from", value: 0.9 },
        apkMax : { key: "apk_to", value: 6 },
        
        
        minDate : { key: "start_date_from", value: "2014-03-31" },
        maxDate : { key: "start_date_to", value: "2014-05-01" },
        minYear : { key: "year_from", value: "2006" },
        maxYear : { key: "year_to", value: "2014" }
    

		
	};
    //$scope.filterSettings.orderby_selected = $scope.filterSettings.orderby_options[1];
    //$scope.filterSettings.orderby = { key: "order_by", value: $scope.filterSettings.orderby_selected.value };
    $scope.filterSettings.filterArray = [  
        
        $scope.filterSettings.drinkCategory ,
        //$scope.filterSettings.maxVolume,
        $scope.filterSettings.alcoholMin ,
        //$scope.filterSettings.alcoholMax ,
        //$scope.filterSettings.apkMin ,
        //$scope.filterSettings.apkMax ,
        //$scope.filterSettings.country ,
        //$scope.filterSettings.limit , 
        $scope.filterSettings.name,
        //$scope.filterSettings.offset ,
        $scope.filterSettings.minPrice,
        $scope.filterSettings.maxPrice
        //$scope.filterSettings.minPricePerLiter ,  
        //$scope.filterSettings.maxPricePerLiter ,
        //$scope.filterSettings.minDate ,
        //$scope.filterSettings.maxDate ,
        //$scope.filterSettings.minYear ,
        //$scope.filterSettings.maxYear
    ];
    $scope.filterSettings.getFilterString = function() {
        var filterStringArray = [];
        for (var i = 0; i< this.filterArray.length; i++) {
            if (isNullUndefinedOrEmpty($scope.filterSettings.filterArray[i].value) !== true) {
                filterStringArray.push($scope.filterSettings.filterArray[i].key + "=" + $scope.filterSettings.filterArray[i].value);
            }
        }
      if (isNullUndefinedOrEmpty($scope.filterSettings.orderby.value) !== true) {
            filterStringArray.push($scope.filterSettings.orderby.key + "=" + $scope.filterSettings.orderby.value);
            filterStringArray.push($scope.filterSettings.order.key + "=" + $scope.filterSettings.order.value);
        }
        var filterString = filterStringArray.join("&");
        return filterString;
    };
     
    $scope.clearFilters = function() {
        $scope.filterSettings.filterArray.forEach(function(elem, index) {
            elem.value = "";
            $scope.performSearch();
        });
    };
    
    $scope.$watch(function combinedWatch() {
        return {
            search: $scope.filterSettings.name
        };
    }, function (value) {
        $scope.performSearch(value);
    }, true);
    
    $scope.addProduct = function (product) {
      this.favouriteProducts.push(product);
			this.products.splice(this.products.indexOf(product), 1);
    };

    $scope.toggleFavouritesView = function() {
        $scope.editFavouritesView = !$scope.editFavouritesView;
    };

    $scope.toggleSearchView = function() {
        $scope.searchView = !$scope.searchView;
    };

	
}]);