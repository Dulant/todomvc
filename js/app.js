(function (angular) {
	'use strict';

	// Your starting point. Enjoy the ride!
	// 创建一个模块
	var myApp = angular.module('TodoMvc',['ngRoute','app.controllers.main']);
	// 路由配置
	myApp.config(['$routeProvider',function ($routeProvider) {
		$routeProvider
			.when('/:status?',{
				controller:'MainController',
				templateUrl:'main_tmpl'
			})
			.otherwise({redirectTo:'/'})
	}]);
	myApp.controller('MainController',[
		'$scope',
		'$routeParams',
		'$route',
		function ($scope,$routeParams,$route) {
		function getId() {
			var id =Math.random();
			for(var i=0;i<$scope.todos.length;i++){
				if(id===$scope.todos[i].id){
					id=getId();
					break;
				}
			}
			return id;
		}
		$scope.text="";
		$scope.todos=[{id:0.151,text:"学习",completed:false},
			{id:0.23,text:"睡觉",completed:false},
			{id:0.33,text:"吃饭",completed:true}];
		$scope.add=function () {
			if(!$scope.text){
				return
			}
			$scope.todos.push({id:getId(),text:$scope.text,completed:false})
		};
		// 处理删除
		$scope.remove=function (id) {
			for(var i=0;i<$scope.todos.length;i++){
				if($scope.todos[i].id===id){
					$scope.todos.splice(i,1);
					break;
				}
			}
		};
		// 清空已完成
		$scope.clear=function () {
			var result=[];
			for(var i=0;i<$scope.todos.length;i++){
				if($scope.todos[i].completed==false){
					result.push($scope.todos[i]);
				}
			}
			return $scope.todos=result;
		};
		// 是否有已经完成的
		$scope.existCompleted=function () {
			for(var i=0;i<$scope.todos.length;i++){
				if($scope.todos[i].completed){
					return true
				}
			}
			return false;
		};

		// 当前编辑哪个元素
		$scope.currentEditingId=-1;
		$scope.editing=function (id) {
			$scope.currentEditingId=id;
		};
		$scope.save=function () {
			$scope.currentEditingId=-1;
		};

		var now = false;
		$scope.toggleAll = function() {
			for (var i = 0; i < $scope.todos.length; i++) {
				$scope.todos[i].completed = now;
			}
			now = !now;

		};

		//状态筛选
		// 三种情况{}(什么都不找，什么都可以)、{completed:true}、 {completed:false}
		//	$scope.selector={completed:true};
		// 点击事件的方式不合适，有DOM操作

		$scope.selector={};
		// 取路由中匹配出来的数据
		var status = $routeParams.status;
		switch (status){
			case 'active':
				$scope.selector={completed:false};
				break;
			case 'completed':
				$scope.selector={completed:true};
				break;
			default:
				$route.updateParams({status:''});
				$scope.selector={};
				break;
		}

		// 自定义比较函数，默认filter过滤器是使用模糊匹配的
		$scope.equalCompare=function (source,target) {
			/*console.log(source)
			 console.log(target)*/
			return source === target;
		}


	}]);

	// 注册一个控制器
	/*myApp.controller('MainController',['$scope','$location',function ($scope,$location) {
		function getId() {
			var id =Math.random();
			for(var i=0;i<$scope.todos.length;i++){
				if(id===$scope.todos[i].id){
					id=getId();
					break;
				}
			}
			return id;
		}
		$scope.text="";
		$scope.todos=[{id:0.151,text:"学习",completed:false},
			{id:0.23,text:"睡觉",completed:false},
			{id:0.33,text:"吃饭",completed:true}];
		$scope.add=function () {
			if(!$scope.text){
				return
			}
			$scope.todos.push({id:getId(),text:$scope.text,completed:false})
		};
		// 处理删除
		$scope.remove=function (id) {
			for(var i=0;i<$scope.todos.length;i++){
				if($scope.todos[i].id===id){
					$scope.todos.splice(i,1);
					break;
				}
			}
		};
		// 清空已完成
		$scope.clear=function () {
			var result=[];
			for(var i=0;i<$scope.todos.length;i++){
				if($scope.todos[i].completed==false){
					result.push($scope.todos[i]);
				}
			}
			return $scope.todos=result;
		};
		// 是否有已经完成的
		$scope.existCompleted=function () {
			for(var i=0;i<$scope.todos.length;i++){
				if($scope.todos[i].completed){
					return true
				}
			}
			return false;
		};

		// 当前编辑哪个元素
		$scope.currentEditingId=-1;
		$scope.editing=function (id) {
			$scope.currentEditingId=id;
		};
		$scope.save=function () {
			$scope.currentEditingId=-1;
		};

		var now = false;
		$scope.toggleAll = function() {
			for (var i = 0; i < $scope.todos.length; i++) {
				$scope.todos[i].completed = now;
			}
			now = !now;

		};

		//状态筛选
		// 三种情况{}(什么都不找，什么都可以)、{completed:true}、 {completed:false}
	//	$scope.selector={completed:true};
		// 点击事件的方式不合适，有DOM操作
		// 1、拿到锚点值
		// 这样写就要求执行环境必须要有window
		/!*var hash = window.location.hash;
		 console.log(hash);*!/
		/!*var path=$location.path();
		 console.log(path);*!/
		// 2、根据锚点值对selector做变换
		$scope.selector={};
		//让$scope可以指向$location，然后可以用$watch去监视
		$scope.$location = $location;
		// $watch只能监视$scope它的成员
		$scope.$watch("$location.path()",function (now,old) {
			switch (now){
				case '/active':
					$scope.selector={completed:false};
					break;
				case '/completed':
					$scope.selector={completed:true};
					break;
				default:
					$scope.selector={};
					break;
			}
		});
		// 自定义比较函数，默认filter过滤器是使用模糊匹配的
		$scope.equalCompare=function (source,target) {
			/!*console.log(source)
			console.log(target)*!/
			return source === target;
		}


	}]);
*/
})(angular);
