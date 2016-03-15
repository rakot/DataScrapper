angular.module('dataScrapper', [])
    .controller('InterfaceController', ['$scope','$filter','$timeout', function($scope, $filter, $timeout) {
        var tab_opener = 0;
        $scope.formulas = [];

        chrome.storage.local.get('formulas', function(data) {
            var formulas = data.formulas || [];
            formulas.forEach(function(val){
                $scope.formulas.push(val);
            });
            $scope.$digest();
        });

        $scope.showView = 'main';
        $scope.setNameMode = 'add';
        $scope.showSaveAlert = false;
        var showSaveAlertTimeout = false;

        $scope.setCurrentFormula = function() {
            $scope.currentFormula = $scope.formulas[$scope.currentFormulaIndex];
            if($scope.currentFormula.excel_mode === undefined) {
                $scope.currentFormula.excel_mode = 'yes';
            }

            if($scope.currentFormula.default_value === undefined) {
                $scope.currentFormula.default_value = '';
            }

            if($scope.currentFormula.separator === undefined) {
                $scope.currentFormula.separator = ',';
            }
        };

        $scope.addCol = function() {
            if($scope.currentFormula && Array.isArray($scope.currentFormula.cols)) {
                $scope.currentFormula.cols.push({
                    title: '',
                    selector: ''
                });
            }
        };

        $scope.setFormulaName = function() {
            if($scope.formulaName) {
                if($scope.setNameMode == 'add') {
                    $scope.formulas.push({
                        title: $scope.formulaName,
                        row: '',
                        cols: []
                    });
                    $scope.formulaName = '';
                } else {
                    $scope.currentFormula.title = $scope.formulaName;
                }
                $scope.showView = 'main';
            }
        };

        $scope.removeFormula = function() {
            if($scope.currentFormulaIndex != undefined) {
                $scope.formulas = $filter('filter')($scope.formulas, function(value, index) {return index != $scope.currentFormulaIndex;});
                $scope.setCurrentFormula();
            }
        };

        $scope.removeCol = function(el) {
            $scope.currentFormula.cols = $filter('filter')($scope.currentFormula.cols, function(value, index) {return index !== el;});
        };

        $scope.saveFormulas = function() {


            chrome.storage.local.set({'formulas': $scope.formulas});
            if(showSaveAlertTimeout) {
                $timeout.cancel(showSaveAlertTimeout);
            }
            $scope.showSaveAlert = true;
            showSaveAlertTimeout = $timeout(function(){
                $scope.showSaveAlert = false;
            }, 2000);
        };

        $scope.serializeFormula = function() {
            $scope.serialized_formula = btoa(JSON.stringify($scope.currentFormula));
        };

        $scope.downloadCSV = function() {
            chrome.tabs.sendMessage(tab_opener,{action: 'parseData', formula: $scope.currentFormula},{},function(response) {
                if(response && response.length) {
                    exportToCsv($scope.currentFormula.title+'.csv',response,{
                        default_value: ($scope.currentFormula.default_value === undefined) ? '' : $scope.currentFormula.default_value,
                        separator: (!$scope.currentFormula.separator) ? ',' : $scope.currentFormula.separator,
                        excel_mode: ($scope.currentFormula.excel_mode === undefined) ? 'yes' : $scope.currentFormula.excel_mode
                    });
                }
            });
        };

        $scope.ImportFormula = function() {
            var json = atob($scope.ImportFormulaText);
            $scope.ImportFormulaText = '';
            if(json) {
                var data = jQuery.parseJSON(json);
                if(data) {
                    angular.copy(data, $scope.currentFormula);
                    $scope.showView = 'main';
                }
            }
        };

        $scope.advanced = false;
        $scope.showAdvanced = function() {
            if($scope.advanced) {
                $scope.advanced = false;
            } else {
                $scope.advanced = true;
            }
        };

        chrome.runtime.sendMessage({action: "whatIsMyOpenerId"}, function(response) {
            tab_opener = response;
        });
}]);