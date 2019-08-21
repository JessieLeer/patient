import Vue from 'vue'
import axios from 'axios'

// initial state
const state = {
}

// getters
const getters = {
}

// actions
const actions = {
	
}

// mutations
const mutations = {
	register(state,user) {
		state = Object.assign(state,user)
	},
	login(state,user) {
		state = Object.assign(state,user)
	},
	logout(state) {
		for(let key in state){
			delete state[key]
		}
	}
}

export default {
  state,
  getters,
  actions,
  mutations
}