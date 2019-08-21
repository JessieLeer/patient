import axios from "axios"
import qs from "qs"
import vuex from '../store'

const service = axios.create({
	baseURL: process.env.BASE_URL,
  timeout: 10000
})

/*service.interceptors.request.use(
  config => {
    config.headers = {
		  'userId': vuex.state.user.id
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(   
  (response) => {   
		return Promise.resolve(response)
  },    
  (error) => {       
    return Promise.resolve(error.response)
  }
)*/

export default service
