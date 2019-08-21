<template>
  <div>
	  <cheader ref='cheader'></cheader>
    <el-container>
			<el-main>
			  <el-row class='wait-wrapper' v-if='isWaiting'>
				  <el-col :span='24' class='f-tac'>
					  <i class='el-icon-loading'></i>
					  <el-button type='text' class='wait-text'>已等待<i class='color-white'>{{waiting.minutes}}</i>分<i class='color-white'>{{waiting.seconds}}</i>秒</el-button>
						<p class='queue'>前面还有<b>{{waiting.queue}}</b>人排队</p>
					  <el-button type='default' v-on:click='cancel'>取消问诊</el-button>
					</el-col>
				</el-row>
				<el-row>
				  <el-col :span='12' class='chat-wrapper' :offset='6'>
					  <div class='message-wrapper' ref='messageWrapper'>
						  <ul class="infinite-list">
								<li v-for='(item,index) in messages' v-bind:key='index' class="infinite-list-item f-cb" v-bind:class='item.type == "receive" ? "f-tal" : "f-tar"'> 
								  <el-avatar size="small" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" v-bind:class='item.type == "receive" ? "f-fl" : "f-fr"' class='chat-avatar'></el-avatar>
									<i class='message f-fsn f-ib f-fs2' v-bind:class='item.type == "receive" ? "message-receive" : "message-send"' v-if='item.chatType == "text"' v-html='item.data'></i>
									<a v-bind:href='item.data' target='_blank' v-if='item.chatType == "image"' class='message-image f-ib' v-bind:class='item.type == "receive" ? "message-receive" : "message-send"'>
									  <img v-bind:src='item.data' class='chat-image'>
									</a>
								</li>
							</ul>
						</div>
						<el-card class="input-wrapper" shadow="never">
							<header slot="header" class="f-cb">
							  <label>
								  <input v-on:change="sendImageMessage" ref="imageInput" type="file" class='f-dn'>
									<i class='chat-opera el-icon-picture-outline f-csp mr-10' title='发送图片'></i>
								</label>
								<i class='chat-opera el-icon-microphone f-csp mr-10' title='语音通话' v-on:click='rtAudioCall'></i>
								<i class='chat-opera el-icon-video-camera f-csp mr-10' title='视频通话' v-on:click='rtVideoCall'></i>
							</header>
							<div>
								<el-input type="textarea" rows='3' v-model="editing" @keyup.native.enter='sendPrivateText' class='text-input'></el-input>
								<el-row>
								  <el-col :span='12'>
									  <el-button type='warning' size='small' class='ml-20' v-on:click='finish'>结束问诊</el-button>
									</el-col>
									<el-col :span='12' class=' f-tar'>
									  <el-button class='mr-20' type='primary' v-on:click='sendPrivateText' size='small' v-bind:disabled='editing == "" ? true : false'>发送</el-button>
									</el-col>
								</el-row>
							</div>
						</el-card>
					</el-col>
				</el-row>
				<VueDragResize :isActive="true" v-bind:w="200" v-bind:h='100' v-on:resizing="resize" v-on:dragging="resize" v-show="audioShow" class='bg-white'>
				  <section class='pt-5 pb-5 f-tar'>
				    <el-button type="warning" icon="el-icon-close" circle v-on:click='handleAudioEnd' class='video-close' size='small'> </el-button>
					</section>
				  <section class='f-tac f-fs2'>语音通话中...</section>
				</VueDragResize>
				<VueDragResize :isActive="true" v-bind:w="width" v-bind:h='height' v-on:resizing="resize" v-on:dragging="resize" v-show="videoShow" class='bg-white'>
				  <section class='pt-5 f-tar'>
						<el-button type="warning" icon="el-icon-close" circle v-on:click='handleVideoEnd' class='video-close' size='small'> </el-button>
						<el-button type="success" circle v-on:click='minimize' class='video-close' size='small' icon='el-icon-minus'></el-button>
						<el-button type="primary" circle v-on:click='reduction' class='video-close' size='small' icon='el-icon-full-screen'></el-button>
					</section>
          <video id="v1" autoplay class='w-100'></video>
        </VueDragResize>
			</el-main>
		</el-container>
	</div>	
</template>

<style lang='stylus' scoped>
@import './index.styl'
</style>

<script src='./index'></script>