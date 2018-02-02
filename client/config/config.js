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
            name: 'htmlText',
            template: '<div ng-class="{\'form-group\': !options.templateOptions.inline, \'inline-elements\': options.templateOptions.inline}">' +
            '<div ng-class="options.templateOptions.colSize">' +
            '<div class="form-material" ng-class="options.templateOptions.color">' +
            '<textarea snaphy-ck-editor type="{{options.templateOptions.type}}" name="{{options.templateOptions.id}}" id="{{options.templateOptions.id}}" ng-class="options.templateOptions.class" class="form-control input-box" ng-model="model[options.key]" rows="{{options.templateOptions.row}}"></textarea>' +
            '<label for="{{options.templateOptions.id}}">{{options.templateOptions.label}}</label>' +
            '</div>' +
            '</div>' +
            '</div>',
            link: function($scope, el, attrs) {
                var randomId = Math.floor(100000000 + Math.random() * 900000000);
                $scope.options.templateOptions.id = $scope.options.templateOptions.id || "";
                $scope.options.templateOptions.id = $scope.options.templateOptions.id + "_" + randomId.toString();
            },
            controller: ["$scope", function ($scope) {
                var getInstance = function(){
                    return CKEDITOR.instances[$scope.options.templateOptions.id];
                };


                $timeout(function () {
                    //Listen to onchange value..
                    if(getInstance()){
                        getInstance().on('change', function() {
                            var htmlValue = getInstance().getData();
                            $scope.model[$scope.options.key] = "<html><body>"+htmlValue+"</body></html>";
                        });
                    }


                    if(getInstance()){
                        $scope.$watch('model[options.key]', function(){
                            getInstance().setData($scope.model[$scope.options.key]);
                        });
                    }

                    //Set default value for label..
                    if ($scope.options.templateOptions.row === undefined) {
                        $scope.options.templateOptions.row = 3;
                    }

                    if ($scope.options.templateOptions.colSize === undefined) {
                        $scope.options.templateOptions.colSize = "col-sm-12";
                    }
                }, 200);
            }]
        });


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


            var order = $scope.to.searchProp? $scope.to.searchProp + " ASC": undefined;

            //Load data from database..
            var loadData = function(where){
                dbService.find({
                  filter: {
                    limit: 500,
                    where: where || {},
                    order: order
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
