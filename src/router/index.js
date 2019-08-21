import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/index/index.vue'
import Form from '@/views/form/index.vue'
import Terms from '@/views/terms/index.vue'
import Visiting from '@/views/visiting/index.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
		{
			path: '/form/:doctor/:imdoctor',
			name: 'former',
			component: Form
		},
		{
			path: '/terms',
			name: 'terms',
			component: Terms
		},
		{
			path: '/visiting/:imdoctor',
			name: 'visiting',
			component: Visiting
		}
  ]
})
