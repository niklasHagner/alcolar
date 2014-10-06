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
                var errorString = "error calling API." +"\n  Returned with Status: " + textStatus + "\n  Error: " + errorString;
                console.log(errorString);
                deferred.reject(errorString);
			  }
			});
            
            return deferred.promise;
        }, //end getDataFromSystembolaget
        
        getImages : function(list) {
	
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
	   }//end getImages
        
    };
});
