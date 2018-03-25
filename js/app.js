// Code goes here

var app = angular.module('myApp', []);


app.controller('SystembolagetSearchController', 
               ['$scope', 'systembolagetSearch', '$timeout', '$rootScope', 'drinkCategory_options', 'country_options',
                function ($scope, systembolagetSearch, $timeout, $rootScope, drinkCategory_options, country_options) {

    $scope.products = [];
    $scope.favouriteProducts = [];
    $scope.currentProductIndex = 0;
    $scope.currentProduct = $scope.favouriteProducts[$scope.currentProductIndex];	
    
    $scope.editFavouritesView = false;
    $scope.searchView = true;

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
                    searchProduct.alcohol = roundUp(decToPercentageNum(product.alcohol), 1);
                    searchProduct.price_per_liter = roundUp(product.price_per_liter, 0);
                    searchProduct.volume = roundUp(parseFloat(product.volume) * 100, 0);
                    searchProduct.article_id = product.article_id; //todo: modify ID to fit to suit official systemet API
                    searchProduct.img = "http:\/\/www.systembolaget.se\/imagevaultfiles\/id_11184\/cf_1915\/" + product.article_id + ".jpg";
                    searchProduct.country = country_options.filter(function(x) { 
                        return x.id == product.country_id; 
                    })[0];
                    
                    //console.log(searchProduct);
                    $scope.products.push(searchProduct);
                });
                 
                //systembolagetSearch.getImages($scope.products); //fetch images async
            })
    };
    
                
            
	 
            
    $scope.filterSettings = { 
        drinkCategory : { key: "tag", value: "" },
        drinkCategory_options : drinkCategory_options,
        
        orderby : { key: "order_by", value: "alcohol" }, //todo: bind
        orderby_options : [
            {value: "alcohol", display:"alcohol %" }, 
            {value: "name", display:"product name" }, 
            {value: "price", display:"price" },  
            {value: "price_per_liter", display:"price per liter" }, 
            {value: "apk", display:"alcohol per krona" }
        ],
        order_options : [
          { key: "order", value: "ASC" },
            { key: "order", value: "DESC" }
        ],
        order : { key: "order", value: "ASC" },
        country : { key: "country", value: "1" },
        name : { key: "name", value: "" },
      
        maxVolume : { key: "max_volume", value: 0.33 },
        limit : { key: "limit", value: 50 },
        offset : { key: "offset", value: 0 },
        
        alcoholMin : { key: "alcohol_from", value: "" }, //0.045
        alcoholMax : { key: "alcohol_to", value: "" }, //0.15
        minPrice : { key: "price_from", value: 25 },
        maxPrice : { key: "price_to", value: 100 },
        minPricePerLiter : { key: "price_per_liter_from", value: 10 },
        maxPricePerLiter : { key: "price_per_liter_to", value: 1000 },
        apkMin : { key: "apk_from", value: 0.9 },
        apkMax : { key: "apk_to", value: 6 },
        
        minDate : { key: "start_date_from", value: "2014-03-31" },
        maxDate : { key: "start_date_to", value: "2014-05-01" },
        minYear : { key: "year_from", value: "2006" },
        maxYear : { key: "year_to", value: "2014" }
	};
    $scope.filterSettings.drinkCategory_selected = $scope.filterSettings.drinkCategory_options[1];
    $scope.filterSettings.drinkCategory = function() {
        return { key: "tag", value: $scope.filterSettings.drinkCategory_selected.id  };     
    };
                    
    $scope.filterSettings.orderby_selected = $scope.filterSettings.orderby_options[1];
    $scope.filterSettings.orderby = function() {
        return { key: "order_by", value: $scope.filterSettings.orderby_selected.value };
    };
    $scope.filterSettings.filterArray = function() { 
        var arr = [  
            $scope.filterSettings.drinkCategory() ,
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
        return arr;
    };
    $scope.filterSettings.getFilterString = function() {
        var filterStringArray = [];
        for (var i = 0; i< this.filterArray().length; i++) {
            if (isNullUndefinedOrEmpty($scope.filterSettings.filterArray()[i].value) !== true) {
                filterStringArray.push($scope.filterSettings.filterArray()[i].key + "=" + $scope.filterSettings.filterArray()[i].value);
            }
        }
      if (isNullUndefinedOrEmpty($scope.filterSettings.orderby().value) !== true) {
            filterStringArray.push($scope.filterSettings.orderby().key + "=" + $scope.filterSettings.orderby().value);
            filterStringArray.push($scope.filterSettings.order.key + "=" + $scope.filterSettings.order.value);
        }
        var filterString = filterStringArray.join("&");
        return filterString;
    };
     
    $scope.clearFilters = function() {
        $scope.filterSettings.filterArray().forEach(function(elem, index) {
            elem.value = "";
        });
        $scope.filterSettings.drinkCategory_selected = $scope.filterSettings.drinkCategory_options[0];
        $scope.performSearch();
    };
                    
    $scope.setOrderBy = function(orderByObj, upOrDown, targetArrayName) {
        
        //toggle ASC/DESC
        if (typeof upOrDown !== "undefined") {
            $scope.filterSettings.order = $scope.filterSettings.order_options.filter(function(x) { return x.value == upOrDown })[0];
        }
        else if ($scope.filterSettings.orderby_selected.value !== orderByObj.value)
            $scope.filterSettings.orderby_selected = $scope.filterSettings.orderby_options.filter(function(x) { return x.value == orderByObj.value })[0];
        else {
            $scope.filterSettings.order = 
                ($scope.filterSettings.order_options[0].value == $scope.filterSettings.order.value) ? $scope.filterSettings.order_options[1] : $scope.filterSettings.order_options[0];
        }
        //var target =  typeof targetArrayName === "undefined" || targetArrayName == 'searchResult' ?  $scope.products : $scope.favouriteProducts;
        //$scope.filterSettings.orderby();
        $scope.performSearch();
    }
    
    ///type-to-search
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