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
                controller: ["$scope", function ($scope) {
                    var randomId = Math.floor(100000000 + Math.random() * 900000000);
                    $scope.options.templateOptions.id = $scope.options.templateOptions.id || "";
                    $scope.options.templateOptions.id = $scope.options.templateOptions.id + "_" + randomId.toString();
                    var id = '#' + $scope.options.templateOptions.id;
                    $timeout(function(){
                        var editor, initialized = false;
                        editor = grapesjs.init({
                            container : id,
                            plugins: ['gjs-preset-newsletter'],
                            storageManager: {
                                autoload: false,
                                autosave: false
                            },
                            // Disable the storage manager for the moment
                            components: $scope.model[$scope.options.key],
                            // fromElement: true,
                            pluginsOpts: {
                              'gjs-preset-newsletter': {
                                modalTitleImport: 'Import template',
                              }
                            }
                        });


                        editor.on('change:changesCount', (some, argument) => {
                            var html =  editor.runCommand('gjs-get-inlined-html');
                            $scope.model[$scope.options.key] = html
                        });

                        // // editor.render();
                        // $scope.$watch('model[options.key]', function(){
                        //     if(!initialized){
                        //         console.log("loading")
                        //         //var data = $scope.model[$scope.options.key] || "";
                        //         //editor.getModel().setComponents(data)
                        //         initialized = true;
                        //     }
                            
                        // });
                      
                    }, 1000)
                }]
            });
    
            
        }
    ])
}());