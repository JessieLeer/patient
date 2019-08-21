import Vue from 'vue'
import axios from 'axios'

// initial state
const state = {
	receive: {},
	send: {}
}

// getters
const getters = {
}

// actions
const actions = {
}

// mutations
const mutations = {
	handleReceived(state,message) {
		state.receive = message
	},
	handleSend(state,message) {
		state.send = message
	}
}

export default {
  state,
  getters,
  actions,
  mutations
}