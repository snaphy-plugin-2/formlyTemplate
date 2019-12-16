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
                name: 'newsletter',
                templateUrl: '/formlyTemplate/views/newsletter.html',
                link: function($scope, el, attrs) {
                    //var randomId = Math.floor(100000000 + Math.random() * 900000000);
                    // $scope.options.templateOptions.id = $scope.options.templateOptions.id || "";
                    // $scope.options.templateOptions.id = $scope.options.templateOptions.id + "_" + randomId.toString();
                },
                controller: ["$scope", function ($scope) {
                    var randomId = Math.floor(100000000 + Math.random() * 900000000);
                    $scope.options.templateOptions.id = $scope.options.templateOptions.id || "";
                    $scope.options.templateOptions.id = $scope.options.templateOptions.id + "_" + randomId.toString();
                    var id = '#' + $scope.options.templateOptions.id;
                    
                    $timeout(function(){
                        // console.log("Id",$scope.model[$scope.options.key])
                        $scope.$watch('model[options.key]', function(){
                            console.log("Id",$scope.model[$scope.options.key])
                            var editor = grapesjs.init({
                                container : id,
                                // Disable the storage manager for the moment
                                //storageManager: false,
                                // fromElement: true,
                                // components: $scope.model[$scope.options.key],
                                plugins: ['gjs-preset-newsletter'],
                                pluginsOpts: {
                                  'gjs-preset-newsletter': {
                                    modalTitleImport: 'Import template',
                                    // ... other options
                                  }
                                }
                            });
                        });
                        // var editor = grapesjs.init({
                        //     container : id,
                        //     // Disable the storage manager for the moment
                        //     //storageManager: false,
                        //     // fromElement: true,
                        //     components: $scope.model[$scope.options.key],
                        //     plugins: ['gjs-preset-newsletter'],
                        //     pluginsOpts: {
                        //       'gjs-preset-newsletter': {
                        //         modalTitleImport: 'Import template',
                        //         // ... other options
                        //       }
                        //     }
                        // });

                        // editor.on('change:changesCount', (some, argument) => {
                        //     // do something
                        //     var html =  editor.runCommand('gjs-get-inlined-html');
                        //     $scope.model[$scope.options.key] = html
                        //  })
                    }, 1000)
                    
                    // var getInstance = function(){
                    //     return CKEDITOR.instances[$scope.options.templateOptions.id];
                    // };
    
    
                    // $timeout(function () {
                    //     //Listen to onchange value..
                    //     if(getInstance()){
                    //         getInstance().on('change', function() {
                    //             var htmlValue = getInstance().getData();
                    //             $scope.model[$scope.options.key] = "<html><body>"+htmlValue+"</body></html>";
                    //         });
                    //     }
    
    
                    //     if(getInstance()){
                    //         $scope.$watch('model[options.key]', function(){
                    //             getInstance().setData($scope.model[$scope.options.key]);
                    //         });
                    //     }
    
                    //     //Set default value for label..
                    //     if ($scope.options.templateOptions.row === undefined) {
                    //         $scope.options.templateOptions.row = 3;
                    //     }
    
                    //     if ($scope.options.templateOptions.colSize === undefined) {
                    //         $scope.options.templateOptions.colSize = "col-sm-12";
                    //     }
                    // }, 200);
                }]
            });
    
            
        }
    ])
}());