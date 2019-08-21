import Vue from 'vue'
import axios from 'axios'

// initial state
const state = {
	serverUrl: '',
	hardwareId: '',
	audioShow: false,
	videoShow: false
}

// getters
const getters = {
}

// actions
const actions = {
	
}

// mutations
const mutations = {
	handleAudio(state,status) {
		state.audioShow = status
	},
	handleVideo(state,status) {
		state.videoShow = status
	},
	serialSave(state,serial) {
		state.hardwareId = serial
	}
}

export default {
  state,
  getters,
  actions,
  mutations
}