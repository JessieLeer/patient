import config from '../../static/WebIM-v3'
import store from '@/store'

//初始化IM SDK
var conn = {}
WebIM.config = config
conn = WebIM.conn = new WebIM.default.connection({
  appKey: WebIM.config.appkey,
  isHttpDNS: WebIM.config.isHttpDNS,
  isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
  https: WebIM.config.https,
  url: WebIM.config.xmppURL,
  apiUrl: WebIM.config.apiURL,
  isAutoLogin: true,
  heartBeatWait: WebIM.config.heartBeatWait,
  autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
  autoReconnectInterval: WebIM.config.autoReconnectInterval,
  isStropheLog: WebIM.config.isStropheLog,
  delivery: WebIM.config.delivery,
})

//注册回调监听
conn.listen({
	onOpened(message) {     
		console.log('登录成功')
		// 连接成功回调
		// 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
		// 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置true
		// 则无需调用conn.setPresence()             
	},  
	//连接关闭回调
	onClosed(message) {
		console.log('onclosed')
	},     
	//收到文本消息
	onTextMessage(message) {
		message.created_at = new Date()
		message.type = 'receive'
		message.chatType = 'text'
		store.commit('handleReceived',message)
	},    
	//收到表情消息
	onEmojiMessage(message) {
		console.log('onemojimessage')
	},   
	//收到图片消息
	onPictureMessage(message) {
		store.commit('handleReceived', {
			from: message.from,
			to: message.to,
			data: message.url,
			created_at: new Date(),
			type: 'receive',
			chatType: 'image'
		})
	}, 
	//收到命令消息
	onCmdMessage(message) {
		console.log('oncmdmessage')
	},     
	//收到音频消息
	onAudioMessage(message) {
		console.log('收到音频消息')
	},   
	//收到位置消息
	onLocationMessage(message) {},
	//收到文件消息
	onFileMessage(message) {},    
	//收到视频消息
	onVideoMessage(message) {},  
	//处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
	onPresence( message ) {},  
	//处理好友申请
	onRoster(message) {},     
	//处理群组邀请
	onInviteMessage( message ) {}, 
	//本机网络连接成功
	onOnline() {
		console.log('网络连接成功')
	},       
	//本机网络掉线
	onOffline() {
		console.log('网络临界失败')
	},       
	//失败回调
  onError(message) {
		console.log(message)
	},     
	//黑名单变动
	onBlacklistUpdate(list) {       
		// 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
		console.log(list)
	},
	//收到消息送达服务器回执
	onReceivedMessage(message) {}, 
	//收到消息送达客户端回执
	onDeliveredMessage(message) {},   
	//收到消息已读回执
	onReadMessage(message) {},   
	//创建群组成功回执（需调用createGroupNew）
	onCreateGroup(message) {},     
	//如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员
	onMutedMessage(message) {}     
})

//初始化音视频
var rtcCall = {}
if (WebIM.WebRTC) {
  rtcCall = new WebIM.WebRTC.Call({
    connection: conn,
    mediaStreamConstaints: {
      audio: true,
      video: true
    },
    listener: {
      onAcceptCall(from, options) {
        console.log("onAcceptCall::", "from: ", from, "options: ", options)
      },
      onGotRemoteStream(stream, streamType) {
				let video = document.getElementById("v1")
        video.srcObject = stream
      },
      onGotLocalStream(stream, streamType) {
      },
      onRinging(caller, streamType) {
				let str
				if(streamType == 'VIDEO') {
					str = '邀请您进行视频通话'
				}else{
					str = '邀请您进行语音通话'
				}
        if (confirm(str)) {
          rtcCall.acceptCall()
					if(streamType == 'VIDEO') {
						store.commit('handleVideo', true)
					}else{
						store.commit('handleAudio', true)
					}
        } else {
          rtcCall.endCall()
        }
      },
      onTermCall(reason) {
				if(reason == 'reject') {
					alert('对方已经挂断')
					store.commit('handleVideo', false)
					store.commit('handleAudio', false)
				}else if(reason == 'hangup') {
					store.commit('handleVideo', false)
					store.commit('handleAudio', false)
				}
      },
      onIceConnectionStateChange(iceState) {
				if(iceState == 'disconnected' || iceState == 'closed') {
					store.commit('handleVideo', false)
					store.commit('handleAudio', false)
				}
      },
      onError(e) {
        if (e.event.name == "NotAllowedError") {
          alert("没有摄像头，请检查设备")
					store.commit('handleVideo', false)
          rtcCall.endCall()
        }
      }
    }
  })
} else {
  console.warn("不能进行视频通话！您的浏览器不支持webrtc或者协议不是https。")
}

export { conn, rtcCall }