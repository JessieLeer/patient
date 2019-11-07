import qs from 'qs'
import cheader from '@/components/header/index.vue'

export default {
	name: 'former',
	data() {
		let checkPhone = (rule, value, callback) => {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
      if (reg.test(value)) {
        callback()
      } else {
        return callback(new Error('请输入正确的手机号'))
      }
    }
		return {
			form: {
				hardwareId: this.$store.state.config.hardwareId,
				phone: '',
				passcode: '',
				name: '',
				gender: '',
				birthday: "",
				mainSymptom: '',
				checkContent: '',
				physicianId: this.$route.params.doctor,
				allergy: false,
				rediagnose: ''
			},
			unEditable: false,
			countdown: 0,
			vcode: 0,
			pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
			},
			terms: '',
			rules: {
				phone: [
					{
						required: true,
						trigger: 'blur',
						message: '请输入手机号'
					},
					{
					  validator: checkPhone,
					  trigger: 'blur'
				  }
				],
				passcode: {
					required: true,
					message: '请输入验证码',
					trigger: 'blur'
				},
				name: {
					required: true,
					message: '请输入姓名',
					trigger: 'blur'
				},
				gender: {
					required: true,
					message: '请选择性别',
					trigger: 'change'
				},
				birthday: {
					required: true,
					message: '请选择出生日期',
					trigger: 'change'
				},
				mainSymptom: {
					required: true,
					message: '请输入当前症状',
					trigger: 'blur'
				},
				allergy: {
					required: true,
					message: '请选择是否有过敏史',
					trigger: 'change'
				},
				checkContent: {
					required: true,
					message: '请输入过敏史',
					trigger: 'blur'
				},
				rediagnose: {
					required: true,
					message: '请同意相关协议',
					trigger: 'change'
				}
			}
		}
	},
	computed: {
		btntext() {
			return this.countdown == 0 ? '获取验证码' : `${this.countdown}s后重新发送`
		},
		ableSend() {
			return /^1[3|4|5|7|8][0-9]\d{8}$/.test(this.form.phone) && this.countdown == 0 ? true : false
		}
	},
	watch: {
		'form.passcode'(val, oldVal) {
			if(val.length == 6) {
				if(val == this.vcode) {
					this.$http.get('/api/web/user/getPatientCaseByPhone', {params: {phone: this.form.phone, code: val}}).then((res) => {
						if(res.data.retcode == 1) {
							if(res.data.data.name == null) {
								this.unEditable = false
							}else{
								this.unEditable = true
							}
							this.$set(res.data.data, 'allergy', res.data.data.checkContent == '' ? false : true)
							for(let key in res.data.data){
								this.form[key] = res.data.data[key]
							}
						}else{
							this.$message({
								message: res.data.retmsg,
								type: 'warning'
							})
						}
					})
				}else{
					this.$message({
						message: '验证码输入不正确，请重新输入',
						type: 'warning'
					})
				}
			}
		}
	},
	components: {
		cheader
	},
	created() {
		this.termShow()
	},
	methods: {
		/** 发送手机验证码 **/
		sendCode() {
			this.countdown = 60
			this.$http.get('/api/web/user/sendMemberSms',{params: {phone: this.form.phone,hardwareId: this.$store.state.config.hardwareId}}).then((res) => {
				if(res.data.retcode == '1'){
				  this.$message({
					  message: res.data.retmsg,
						type: 'success'
				  })
					this.vcode = res.data.data
					let count = setInterval(() => {
						if(this.countdown > 0){
							this.countdown--
						}else{
							clearInterval(count)
						}
					},1000)
				}else{
					this.$message({
					  message: res.data.retmsg,
						type: 'warning'
				  })
					this.countdown = 0
				}
			})
		},
		/*-- 获取相关条款 --*/
		termShow() {
			this.$http.get('/api/web/user/memberTcp').then((res) => {
				this.terms = res.data.data
			})
		},
		submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post('/api/web/user/passcodeLogin', qs.stringify(this.form)).then((res) => {
						if(res.data.retcode == 1) {
							this.$message({
								message: res.data.retmsg,
								type: 'success'
							})
							this.$store.commit('login', res.data.data)
							this.$router.push(`/visiting/${this.$route.params.imdoctor}`)
						}else{
							this.$message({
								message: res.data.retmsg,
								type: 'warning'
							})
						}
					})
        } else {
          return false
        }
      })
		}
	}
}