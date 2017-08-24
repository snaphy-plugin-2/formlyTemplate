/**
 * Created by robinskumargupta on 17/08/17.
 */

(function config() {
  /* global angular, $snaphy */

  angular.module($snaphy.getModuleName())
    /**
     Defigning custom templates for angular-formly.
     */
    .run(['formlyConfig', '$timeout', 'Database',
      function(formlyConfig, $timeout, Database) {
        formlyConfig.setType({
          name: 'smartSelect',
          templateUrl: '/formlyTemplate/views/smart-select.html',
          controller: ['$scope', '$rootScope', function controller($scope, $rootScope) {
            // if(!$scope.to.modelName || !$scope.to.searchProperty){
            //     console.error("Error >>> searchProperty and modelName attributes are required");
            //     return false;
            // }
            $scope.label = $scope.to.btnText || 'Select';
            $scope.id = $scope.to.id?$scope.to.id:$scope.name;
            $scope.to.colSize = $scope.to.colSize || 'col-md-12';
            var dbService = Database.loadDb($scope.to.model);
            $scope.optionsList = [];

            //Get fired when an Item is selected..
            $scope.onChange = function(value){
                var targetItem;
                for(var i=0; i<$scope.optionsList.length; i++){
                    var item = $scope.optionsList[i];
                    if(value === item.id){
                        targetItem = item;
                        break;
                    }
                }//For End loop..

                $scope.model[$scope.to.key] = targetItem;
                if(targetItem){
                    $scope.model[$scope.to.foreignKey] = targetItem.id;
                }else {
                    $scope.model[$scope.to.foreignKey] = undefined;
                }

                if($scope.to.onSelect){
                    //Broadcast Event if present..
                    $rootScope.$broadcast($scope.to.onSelect, {
                        data: targetItem,
                        model: $scope.to.model,
                        foreignKey: $scope.to.foreignKey
                    });
                }
            };

            //Watch the model..and add items dynamically..
            $scope.$watch('model', function(){
                if($scope.model){
                    var targetItem = $scope.model[$scope.to.key];
                    if(targetItem){
                        if($scope.optionsList){
                            if(!$scope.optionsList.length){
                                $scope.optionsList.push(targetItem);
                            }
                            if(!$scope.model[$scope.to.foreignKey]){
                                $scope.model[$scope.to.foreignKey] = targetItem.id;
                            }
                        }
                    }
                }
            });



            //Load data from database..
            var loadData = function(where){
                dbService.find({
                  filter: {
                    limit: 100,
                    where: where || {}
                  }
                }, function(values) {
                    $scope.optionsList.length = 0;
                    if (values) {
                        if (values.length) {
                            values.forEach(function(item) {
                                $scope.optionsList.push(item);
                            });
                        }
                    }

                    if($scope.to.onLoad){
                        //Broadcast the data...
                        $rootScope.$broadcast($scope.to.onLoad, {
                            data: $scope.optionsList
                        });
                    }
                }, function(httpResp) {
                  console.log(httpResp);
                });
            }; //End Load function

            var loadWhen = function () {
                if($scope.to.loadWhen){
                    var loadListener = $rootScope.$on($scope.to.loadWhen, function(event, args){
                        //Unsubscribe
                        //loadListener();
                        if(args.where){
                            var where = getWhere(args.where);
                            loadData(where);
                        }else{
                            var where = getWhere({});
                            loadData(where);
                        }
                    });

                    ///Destroy event on page change..
                    $scope.$on('$destroy', function() {
                        //Unsubscribe
                        loadListener();
                    });
                }
            };

              //Get Where Value of Object..
            var getWhere = function(where){
                where = where || {};
                if($scope.to.filter){
                    if($scope.to.filter.where){
                        for(var key in $scope.to.filter.where){
                            if($scope.to.filter.where.hasOwnProperty(key)) {
                                where[key] = $scope.to.filter.where[key];
                            }
                        }
                    }
                }
                return where;
            };

            if($scope.to.loadWhen){
                loadWhen();
            }else{
                var where = getWhere({});
                loadData(where);
            }

        }] //Controller..
        });
      }
    ]);
}());
