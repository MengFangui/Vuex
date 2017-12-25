import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import App from './app.vue';
//加载vue-router插件
Vue.use(VueRouter);
//加载vuex插件
Vue.use(Vuex);

// 路由配置,配置路由匹配列表
//webpack会把每一个路由打包为一个js文件，在请求该页面时，加载这个页面的js，异步实现懒加载（按需加载）
const Routers = [{
		//匹配的路径
		path: '/index',
		//
		meta: {
			title: '首页'
		},
		//映射的组件
		component: (resolve) => require(['./views/index.vue'], resolve)
	},
	{
		path: '/about',
		meta: {
			title: '关于'
		},
		component: (resolve) => require(['./views/about.vue'], resolve)
	},
	{
		//路由到同一个页面，数据不同
		path: '/user/:id',
		meta: {
			title: '个人主页'
		},
		component: (resolve) => require(['./views/user.vue'], resolve)
	},
	//访问的路径不存在时，重定向到首页。
	{
		path: '*',
		redirect: '/index'
	}
];
const RouterConfig = {
	// 使用 HTML5 的 History 路由模式，通过‘/’设置路径
	mode: 'history',
	routes: Routers
};
const router = new VueRouter(RouterConfig);
//导航钩子，beforeEach路由改变前触发
//to形参 即将进入的路由对象
//from 即将离开的路由对象
//next 调用改方法后才能进入下一个钩子，设置为false时，可以取消导航，设置为具体路径时可以导航到指定的页面
router.beforeEach((to, from, next) => {
	window.document.title = to.meta.title;
	next();
});
//导航钩子，afterEach路由改变后触发
router.afterEach((to, from, next) => {
	window.scrollTo(0, 0);
});
//vuex的配置
//注意Store是大写
const store = new Vuex.Store({
	//数据保存
	state: {
		count: 0,
		list: [1, 5, 8, 10, 30, 50]
	},
	mutations: {
		increase(state, n = 1) {
			state.count += n;
		},
		decrease(state, n = 1) {
			state.count -= n;
		}
	},
	getters: {
		filteredList: state => {
			return state.list.filter(item => item < 10);
		}
	},
	actions:{
		asyncIncrease(context){
			//异步 1s后执行
			return new Promise(resolve=>{
				setTimeout(()=>{
					context.commit('increase');
					//Promise 的一种状态Resolved（已完成）
					resolve();
				},1000)
			})
		}
	}
});
new Vue({
	el: '#app',
	router: router,
	//使用vuex
	store: store,
	render: h => {
		return h(App)
	}
});