'use strict';
 
angular.module('Home',["googlechart"])
 
.controller('HomeController',['$http','$scope', function ($http,$scope) {
	
	$scope.myChartObject = {};
    $scope.myChartObject.type = "ColumnChart";
    
    $scope.engrData=[];
    $scope.salesData=[];
    $scope.devData=[];
    
    $http.get('modules/home/json/engr.json').success(function(data){
		angular.forEach(data, function(objValue,index) {
			$scope.engrData[index]=objValue.value;
		});
	});
    
    $http.get('modules/home/json/sales.json').success(function(data){
		angular.forEach(data, function(objValue,index) {
			$scope.salesData[index]=objValue.value;
		});
	});
    
    $http.get('modules/home/json/mktg.json').success(function(data){
		angular.forEach(data, function(objValue,index) {
			$scope.devData[index]=objValue.value;
		});
	});
    
    $scope.engrDataDropped=undefined;
    $scope.salesDataDropped=undefined;
    $scope.devDataDropped=undefined;
    
    $scope.myChartObject.data = 
    {
	"cols": [
	      {
	        "id": "quaters",
	        "label": "Month",
	        "type": "string",
	        "p": {}
	      }
	    ], 
    "rows": [
        {
          "c": [
            {
              "v": "Qtr1"
            }
          ]
        },
        {
          "c": [
            {
              "v": "Qtr2"
            }
          ]
        },
        {
          "c": [
            {
              "v": "Qtr3"
            }
          ]
        },
        {
          "c": [
            {
              "v": "Qtr4"
            }
          ]
	    }
      ]
    };

    $scope.myChartObject.options = {
    		"title": "Profit Details for Year 2016",
    	    "isStacked": "true",
    	    "fill": 20,
    	    "displayExactValues": true,
    	    "vAxis": {
    	      "title": "Profit",
    	      "gridlines": {
    	        "count": 10
    	      }
    	    },
    	    "hAxis": {
    	      "title": "Quarters"
    	    },
    	    "tooltip": {
    	      "isHtml": false
    	    }
    };
    $scope.myChartObject.formatters = {};
    $scope.myChartObject.view = {};
    
	$scope.handleDrop = function(itemid) {
		var graphDataCols = $scope.myChartObject.data["cols"];
		var graphDataRows = $scope.myChartObject.data["rows"];
		if(itemid == 'item1' && $scope.engrDataDropped == undefined){
			$scope.engrDataDropped=true;
				var colsObj={
				        "id": "engr",
				        "label": "Engr",
				        "type": "number",
				        "p": {}
				      };
				graphDataCols.push(colsObj);
				angular.forEach($scope.engrData, function(arrValue,parindex) {
					var pushObj={
							"v":arrValue
					};
					angular.forEach(graphDataRows, function(objValue,childIndex) {
						if(parindex == childIndex){
							objValue["c"].push(pushObj)
						}
					});
				});
		}
		if(itemid == 'item2' && $scope.salesDataDropped == undefined){
			$scope.salesDataDropped=true;
			var colsObj={
			        "id": "sales",
			        "label": "Sales",
			        "type": "number",
			        "p": {}
			      };
			graphDataCols.push(colsObj);
			angular.forEach($scope.salesData, function(arrValue,parindex) {
				var pushObj={
						"v":arrValue
				};
				angular.forEach(graphDataRows, function(objValue,childIndex) {
					if(parindex == childIndex){
						objValue["c"].push(pushObj)
					}
				});
			});
		}
		if(itemid == 'item3' && $scope.devDataDropped == undefined){
			$scope.devDataDropped = true;
			var colsObj={
			        "id": "mktg",
			        "label": "Mktg",
			        "type": "number",
			        "p": {}
			      };
			graphDataCols.push(colsObj);
			angular.forEach($scope.devData, function(arrValue,parindex) {
				var pushObj={
						"v":arrValue
				};
				angular.forEach(graphDataRows, function(objValue,childIndex) {
					if(parindex == childIndex){
						objValue["c"].push(pushObj)
					}
				});
			});
		}
		if(itemid == 'item4'){
			var colsObj={
			        "id": "total",
			        "label": "Total",
			        "type": "number",
			        "p": {}
			      };
			graphDataCols.push(colsObj);
			angular.forEach($scope.devData, function(arrValue,parindex) {
				arrValue=((($scope.engrDataDropped)?$scope.engrData[parindex]:0) +
						(($scope.salesDataDropped)?$scope.salesData[parindex]:0) +
						(($scope.devDataDropped)?$scope.devData[parindex]:0));
				var pushObj={
						"v":arrValue
				};
				angular.forEach(graphDataRows, function(objValue,childIndex) {
					if(parindex == childIndex){
						objValue["c"].push(pushObj)
					}
				});
			});
		}
    };
	$scope.setChartType = function(chartType) {
		$scope.myChartObject.type = chartType;
	};
}])
.directive('draggable', function() {
    return function(scope, element) {
    	// this gives us the native JS object
        var el = element[0];

        el.draggable = true;

        el.addEventListener(
            'dragstart',
            function(e) {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('Text', this.id);
                this.classList.add('drag');
                return false;
            },false);

        el.addEventListener(
            'dragend',
            function(e) {
                this.classList.remove('drag');
                return false;
            },false);
    }
})
.directive('droppable', function() {
    return {
        scope: {
        	drop: '=' // parent
        },
        link: function(scope, element) {
            // again we need the native object
            var el = element[0];
            el.addEventListener( 'dragover', function(e) {
                      e.dataTransfer.dropEffect = 'move';
                      // allows us to drop
                      if (e.preventDefault) e.preventDefault();
                      this.classList.add('over');
                      return false;
            },false);
            el.addEventListener('dragleave',function(e) {
                      this.classList.remove('over');
                      return false;
            },false);
            el.addEventListener('drop', function(e) {
        	        // Stops some browsers from redirecting.
        	        if (e.stopPropagation) e.stopPropagation();

        	        this.classList.remove('over');

        	        var item = document.getElementById(e.dataTransfer.getData('Text'));
        	        var itemid = e.dataTransfer.getData('Text');
//        	        this.appendChild(item);

        	     // call the drop passed drop function
                    scope.$apply(scope.drop(itemid));
        	       
        	        return false;
        	 }, false);
        }
    }
});