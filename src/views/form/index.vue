<template>
  <div>
	  <cheader ref='cheader'></cheader>
    <el-container>
			<el-main>
			  <el-form ref="form" :model="form" label-width="80px" size='small' v-bind:rules='rules'>
					<el-form-item label="手机号" prop='phone'>
						<el-input v-model="form.phone"></el-input>
					</el-form-item>
					<el-form-item label="验证码" prop='passcode'>
					  <el-row>
						  <el-col :md='20' :sm='16' :xs='16'>
							  <el-input v-model="form.passcode" v-bind:maxlength='6' v-bind:disabled='vcode == 0'></el-input>
							</el-col>
							<el-col :md='4' :sm='8' :xs='8' class='f-tar'>
							  <el-button type='default' v-bind:disabled='!ableSend' v-on:click='sendCode'>{{btntext}}</el-button>
							</el-col>
						</el-row>
					</el-form-item>
					<el-form-item label='姓名' prop='name'>
					  <el-input v-model="form.name" v-bind:disabled='unEditable'></el-input>
					</el-form-item>
					<el-form-item label='性别' prop='gender'>
					  <el-radio-group v-model="form.gender" v-bind:disabled='unEditable'>
							<el-radio label="男"></el-radio>
							<el-radio label="女"></el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label='出生日期' prop='birthday'>
					  <el-date-picker v-model="form.birthday" align="right" type="date" placeholder="选择日期" v-bind:picker-options="pickerOptions" v-bind:disabled='unEditable'></el-date-picker>
					</el-form-item>
					<el-form-item label='当前症状' prop='mainSymptom'>
					  <el-input type='textarea' v-model='form.mainSymptom'></el-input>
					</el-form-item>
					<el-form-item label='过敏史' prop='allergy'>
					  <el-radio-group v-model="form.allergy">
							<el-radio v-bind:label="true">有</el-radio>
							<el-radio v-bind:label="false">无</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item prop='checkContent' v-if='form.allergy == true'>
					  <el-input type='textarea' v-model='form.checkContent' placeholder='请输入过敏史' ></el-input>
					</el-form-item>
					<el-form-item label='是否复诊' prop='rediagnose'>
					  <el-checkbox v-model="form.rediagnose">根据国家互联网诊疗相关规定，若你不是复诊患者，我们无法为你提供开处方服务，继续咨询表示您已知晓相关风险并同意<a v-bind:href='terms' target='_blank'>《相关条款》</a></el-checkbox>
					</el-form-item>
					<el-form-item>
					  <el-button type='primary' v-on:click='submit("form")'>下一步</el-button>
					</el-form-item>
				</el-form>	
			</el-main>
		</el-container>
	</div>
</template>

<style lang='stylus' scoped>
@import './index.styl'
</style>

<script src='./index'></script>
