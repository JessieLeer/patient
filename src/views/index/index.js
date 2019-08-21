import cheader from '@/components/header/index.vue'

export default {
	name: 'index',
	data() {
		return {
			doctor: {
				data: [],
				total: 0
			}
		}
	},
	created() {
		this.open()
	},
	components: {
		cheader
	},
	methods: {
		go(url) {
			this.$router.push(url)
		},
		open() {
			if(this.$store.state.config.hardwareId == '') {
				this.$prompt('', '', {
					confirmButtonText: '确定',
					inputPlaceholder: '请输入您设备的序列号',
					showCancelButton: false,
					customClass: 'serial',
					showClose: false,
					closeOnClickModal: false,
					closeOnPressEscape: false,
					inputPattern: /\S/,
					inputErrorMessage: '序列号还未输入'
				}).then(({ value }) => {
					this.$store.commit('serialSave', value)
					this.index(1)
				}).catch(() => {
				})
			}else{
				this.index(1)
			}
    },
		index(page) {
			this.$http.get('/api/web/user/physicianList', {params: {hardwareId: this.$store.state.config.hardwareId, pageNum: page, pageSize: 10}}).then((res) => {
				this.doctor.data = res.data.data.rows
				this.doctor.total = res.data.data.total
			})
		}
	},
}