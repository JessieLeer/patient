// 我们组装模块并导出 store 的地方
import Vue from 'vue'
import Vuex from 'vuex'
import VueXAlong from 'vuex-along'
import config from './modules/config'
import user from './modules/user'
import message from './modules/message'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
		config,
    user,
		message
  },
	
	plugins: [
		VueXAlong({
			name: 'patient'
		})
	]
})