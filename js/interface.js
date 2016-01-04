angular.module('dataScrapper', [])
    .controller('InterfaceController', ['$scope','$filter','$timeout', function($scope, $filter, $timeout) {
        var tab_opener = 0;
        $scope.formulas = [];

        if(localStorage.getItem('formulas')) {
            var json_formulas = JSON.parse(localStorage.getItem('formulas'));
            json_formulas.forEach(function(val){
                $scope.formulas.push(val);
            });
        }

        $scope.showView = 'main';
        $scope.setNameMode = 'add';
        $scope.showSaveAlert = false;
        var showSaveAlertTimeout = false;

        $scope.setCurrentFormula = function() {
            $scope.currentFormula = $scope.formulas[$scope.currentFormulaIndex];
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
            localStorage.setItem('formulas', JSON.stringify($scope.formulas));
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
                    exportToCsv($scope.currentFormula.title+'.csv',response);
                }
            });
        };

        chrome.runtime.sendMessage({action: "whatIsMyOpenerId"}, function(response) {
            tab_opener = response;
        });
}]);