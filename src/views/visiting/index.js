import qs from 'qs'
import VueDragResize from 'vue-drag-resize'
import cheader from '@/components/header/index.vue'
import { conn, rtcCall } from "../../webim/index"

WebIM.message = WebIM.default.message
WebIM.utils = WebIM.default.utils
WebIM.debug = WebIM.default.debug
WebIM.statusCode = WebIM.default.statusCode

export default {
	name: 'visiting',
	data() {
		return {
			waiting: {
				minutes: 0,
				seconds: 0,
				queue: 0
			},
			loading: {},
			isWaiting: true,
			editing: '',
			receives: [],
			sends: [],
			confrIds: [],
			
			width: 500,
      height: 400,
      top: 0,
      left: 0
		}
	},
	computed: {
		user() {
			return this.$store.state.user
		},
		receive() {
			return this.$store.state.message.receive
		},
		send() {
			return this.$store.state.message.send
		},
		messages() {
			return this.receives.concat(this.sends).sort((a,b) => {
				return a.created_at < b.created_at ? -1 : 1
			})
		},
		audioShow: {
			get() {
				return this.$store.state.config.audioShow
			},
			set(newValue) {
				return this.$store.state.config.audioShow = newValue
			}
		},
		videoShow: {
			get() {
				return this.$store.state.config.videoShow
			},
			set(newValue) {
				return this.$store.state.config.videoShow = newValue
			}
		}
	},
	watch: {
		receive(val, oldVal) {
			if(val.from == this.$route.params.imdoctor) {
				this.receives.push(val)
				if(val.data == '对方已经结束问诊') {
					this.$http.post('/api/web/user/finishDiagnose', qs.stringify({diagnoseId: this.user.diagnoseId, sessionId: this.user.sessionId, confrIds: this.confrIds.toString()})).then((res) => {
						if(res.data.retcode == 1) {
							this.$router.push('/')
						}else{
							this.$message({
								message: res.data.retmsg,
								type: 'warning'
							})
						}
					})
				}
			}
		},
		send(val, oldVal) {
			if(val.to == this.$route.params.imdoctor) {
				this.sends.push(val)
			}
		},
		messages(val, oldVal) {
			this.$nextTick(_ => {
        this.$refs.messageWrapper.scrollTop = this.$refs.messageWrapper.scrollHeight
      })
		},
		receives(val, oldVal) {
			if(val.length > 0) {
				this.loading.close()
				this.isWaiting = false
			}
		}
	},
	components: {
		VueDragResize,
		cheader,
	},
	created() {
		console.log(this.user)
		this.loginIm()
	},
	mounted() {
		this.$nextTick(() => {
			document.getElementsByClassName('el-loading-mask')[0].style.zIndex = '20'
			this.$refs.messageWrapper.style.height = window.innerHeight - 120 - 200 + 'px'
		})
		this.watchWaiting()
		this.watchQueue()
		this.openFullScreen()
	},
	methods: {
		loginIm() {
      let options = {
        apiUrl: WebIM.config.apiURL,
        user: this.user.imUsername,
        pwd: this.user.imPassword,
        appKey: WebIM.config.appkey
      }
      conn.open(options)
    },
		watchWaiting() {
			window.setInterval(() => {
				this.waiting.seconds ++
				if(this.waiting.seconds == 60) {
					this.waiting.minutes ++
					this.waiting.seconds = 0
				}
			},1000)
		},
		watchQueue() {
			this.$http.get('/api/web/user/refreshQueue', {params: {diagnoseId: this.user.diagnoseId, sessionId: this.user.sessionId}}).then((res) => {
				this.waiting.queue = res.data.data
			})
			window.setInterval(() => {
				this.$http.get('/api/web/user/refreshQueue', {params: {diagnoseId: this.user.diagnoseId, sessionId: this.user.sessionId}}).then((res) => {
					this.waiting.queue = res.data.data
				})
			},10000)
		},
		openFullScreen() {
      this.loading = this.$loading({
        lock: true,
        spinner: 'none',
        background: 'rgba(0, 0, 0, 0.7)'
      })
		},
		/*-- 取消问诊 --*/
		cancel() {
			this.$confirm('再次问诊将需要重新填写问诊信息，确定执行该操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
				customClass: 'cancel-confirm',
        type: 'warning'
      }).then(() => {
				this.$http.get('/api/web/user/quitQueue', {params: {diagnoseId: this.user.diagnoseId, sessionId: this.user.sessionId}}).then((res) => {
					if(res.data.retcode == 1) {
						this.$message({
							message: res.data.retmsg,
							type: 'success'
						})
						this.$store.commit('logout')
						this.loading.close()
						this.$router.push('/')
					}else{
						this.$message({
							message: res.data.retmsg,
							type: 'warning'
						})
					}
				})
      }).catch(() => {       
      })
		},
		rtAudioCall() {
			this.$store.commit('handleAudio', true)
      rtcCall.caller = this.user.imUsername
      rtcCall.makeVoiceCall(this.$route.params.imdoctor)
			window.setTimeout(() => {
				this.confrIds.push(JSON.parse(JSON.parse(window.localStorage.mycon).content).confrId)
			},1000)
    },
		rtVideoCall() {
		  this.$store.commit('handleVideo', true)
      rtcCall.caller = this.user.imUsername
      rtcCall.makeVideoCall(this.$route.params.imdoctor)
			window.setTimeout(() => {
				this.confrIds.push(JSON.parse(JSON.parse(window.localStorage.mycon).content).confrId)
			},1000)
    },
		handleAudioEnd() {
			this.$store.commit('handleAudio', false)
			this.editing = '音频通话已经结束'
			this.sendPrivateText()
			rtcCall.endCall()
		},
		handleVideoEnd() {
			this.$store.commit('handleVideo', false)
			this.editing = '视频通话已经结束'
			this.sendPrivateText()
			rtcCall.endCall()
		},
		// 单聊发送文本消息
		sendPrivateText() {
			let _this = this
			// 生成本地消息id 
			var id = conn.getUniqueId()   
			// 创建文本消息
			var msg = new WebIM.message('txt', id)     
			msg.set({
				// 消息内容
				msg: this.editing,  
				// 接收消息对象（用户id）
				to: this.$route.params.imdoctor,                          
				roomType: false,      
				// 对成功的相关定义，sdk会将消息id登记到日志进行备份处理
				success(id, serverMsgId) {
					_this.$store.commit('handleSend', {
						from: _this.user.imUsername,
						to: _this.$route.params.imdoctor,
						data: _this.editing,
						created_at: new Date(),
						type: 'send',
						chatType: 'text'
					})
					_this.editing = ''
				},                                       
				// 对失败的相关定义，sdk会将消息id登记到日志进行备份处理
				fail(e){
					console.log("Send private text error")
				}                                       
			})
			conn.send(msg.body)
		},
		/*-- 发送图片消息 --*/
		sendImageMessage() {
			let _this = this
			// 生成本地消息id
      let id = conn.getUniqueId()
      let msg = new WebIM.message("img", id)
      let input = this.$refs.imageInput
      let file = WebIM.utils.getFileUrl(input)
      let allowType = {
        jpg: true,
        gif: true,
        png: true,
        bmp: true
      }
      if (file.filetype.toLowerCase() in allowType) {
        var option = {
          apiUrl: WebIM.config.apiURL,
          file: file,
					// 接收消息对象
          to: this.$route.params.imdoctor, 
          roomType: false,
          chatType: "singleChat",
          onFileUploadError() {
            // 消息上传失败
            console.log("onFileUploadError");
          },
          onFileUploadComplete(message) {
						_this.$store.commit('handleSend', {
							from: _this.user.imUsername,
							to: _this.$route.params.imdoctor,
							data: message.uri + "/" + message.entities[0].uuid,
							created_at: new Date(),
							type: 'send',
							chatType: 'image'
						})
          },
          success() {
          },
          flashUpload: WebIM.flashUpload
        }
        msg.set(option)
        conn.send(msg.body)
      }
		},
		/*-- 结束问诊 --*/
		finish() {
			this.$confirm('确定结束此次问诊吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
				customClass: 'cancel-confirm',
        type: 'warning'
      }).then(() => {
				this.$http.post('/api/web/user/finishDiagnose', qs.stringify({diagnoseId: this.user.diagnoseId, sessionId: this.user.sessionId, confrIds: this.confrIds.toString()})).then((res) => {
					if(res.data.retcode == 1) {
						this.$message({
							message: res.data.retmsg,
							type: 'success'
						})
						this.editing = '对方已经结束问诊'
						this.sendPrivateText()
						conn.close()
						this.$router.push('/')
					}else{
						this.$message({
							message: res.data.retmsg,
							type: 'warning'
						})
					}
				})
			}).catch(() => {
				
			})
		},
		resize(newRect) {
      this.width = newRect.width
      this.height = newRect.height
      this.top = newRect.top
      this.left = newRect.left
    },
		minimize() {
			this.width = 150
      this.height = 150
		},
		reduction() {
			this.width = 500
			this.height = 400
		}
	}
}