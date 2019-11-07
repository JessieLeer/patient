<template>
  <div>
	  <cheader ref='cheader'></cheader>
    <el-container>
			<el-main>
			  <el-row :gutter='10'>
				  <el-col :md='6' :sm='8' :xs='12' v-for='(item,index) in doctor.data' v-bind:key='index'>
					  <el-card shadow='never'>
						  <div class='doctor-card'>
								<el-avatar shape="square" v-bind:src="item.imgHead" class='avatar' :size='60'></el-avatar>
								<section class='doctor-info f-tal'>
									<h5 class='f-fs2'>{{item.name}} <el-tag size='mini'>{{item.department}}</el-tag></h5>
									<el-button type="text" v-bind:disabled='item.online == 1 ? false : true'>{{item.online == 1 ? `在线 | 当前${item.queueNum}人排队` : `离线 | 当前${item.appointmentNum}人预约`}}</el-button>
								</section>
							</div>
							<el-tooltip class="item" effect="dark" placement="top-start">
							  <section slot='content' style='max-width: 300px'>{{item.intro}}</section>
							  <p class='intro f-tal'>{{item.intro.substr(0,60)}}...</p>
              </el-tooltip>
							<el-button type='primary' size='small' v-if='item.online == 1' v-on:click='go(`/form/${item.id}/${item.imUsername}`)'>选他问诊</el-button>
							<el-button type='default' size='small' v-if='item.online == 0' disabled title='暂未开放，敬请期待'>预约问诊</el-button>
						</el-card>
					</el-col>
				</el-row>
				<br>
			  <el-pagination layout="prev, pager, next" v-bind:total="doctor.total" class='f-tac'></el-pagination>
			</el-main>
	  </el-container>
	</div>
</template>

<style lang='stylus' scoped>
@import './index.styl'
</style>

<script src='./index'></script>