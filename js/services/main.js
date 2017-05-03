(function (angular) {
	// 注册一个新的模块
	angular.module('app.services.main',[])
		// 添加一个服务
		.service('MainService',[function () {
			// 业务逻辑都必须出现在服务中(专门定义业务逻辑)
		}])
})(angular);
