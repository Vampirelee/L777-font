<template>
    <div class="login-form">
        <div class="input-container plr20">
            <el-form :model="LoginData" :rules="loginRules" ref="loginForm">
                <el-form-item label="" prop="account">
                    <el-input
                            placeholder="请输入用户名/邮箱/手机号"
                            prefix-icon="el-icon-message"
                            v-model="LoginData.account">
                    </el-input>
                </el-form-item>
                <el-form-item label="" prop="password">
                    <el-input
                            type="password"
                            placeholder="请输入密码"
                            prefix-icon="el-icon-date"
                            v-model="LoginData.password">
                    </el-input>
                </el-form-item>
                <el-form-item label="" prop="captcha">
                    <el-row>
                        <el-col :span="8">
                            <el-input
                                    placeholder="验证码"
                                    prefix-icon="el-icon-date"
                                    v-model="LoginData.captcha">
                            </el-input>
                        </el-col>
                        <el-col :span="8" class="ml10">
                            <img ref="captchaImgRef" src="http://127.0.0.1:7001/captcha" alt="验证码" height="40px"
                                 @click="updateCaptcha" class="cur-p" title="点击更换验证码">
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="login">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Ref, Watch} from 'vue-property-decorator'
    import {Form} from 'element-ui'
    import {LoginApi} from '@/api/Api'
    // Define the component in class-style
    @Component({
        name: 'LoginForm',
        components: {}
    })
    export default class LoginForm extends Vue {
        private LoginData = {
            account: '',
            password: '',
            captcha: ''
        };
        private isSending = false;  // 邮箱是否正在发送中
        private countdown = 60; // 发送邮箱倒计时
        private timeId = 0;

        private checkAccount(rule: any, value: string, callback: any) {
            if (!value) {
                return callback(new Error('请输入用户名/邮箱/手机号'));
            }
            callback();
        };

        private checkPassword(rule: any, value: string, callback: any) {
            if (!value) {
                return callback(new Error('密码不能为空'));
            }
            callback();
        };


        private checkCaptcha(rule: any, value: string, callback: any) {
            let reg = /^[A-Za-z0-9]{4}$/;
            if (!value) {
                return callback(new Error('请输入验证码'));
            }
            if (!reg.test(value)) {
                return callback(new Error('验证码为4位'))
            }
            callback();
        };


        private loginRules = {
            account: [
                {validator: this.checkAccount, trigger: 'blur'}
            ],
            password: [
                {validator: this.checkPassword, trigger: 'blur'}
            ],
            captcha: [
                {validator: this.checkCaptcha, trigger: 'blur'}
            ]

        };

        // 注册用户
        @Ref() readonly loginForm!: Form;

        private login() {
            this.loginForm.validate(valid => {
                if (valid) {
                    // 创建用户
                    LoginApi(this.LoginData)
                        .then((data: any) => {
                            if (data.code === 200 && data.isOk) {
                                this.$message.success('登录成功');
                                data = data.data;
                                if (data.token) localStorage.setItem('token', data.token);
                                this.$router.push('/admin');
                            } else {
                                this.$message.error(data.msg);
                                this.updateCaptcha();
                            }
                        })
                        .catch((err: { message: string; }) => {
                            this.$message.error(err.message)
                        })

                } else {
                    this.$message.warning('请按照提示填写内容');
                    return false;
                }
            });

        }

        // 更新验证码
        @Ref() readonly captchaImgRef!: HTMLImageElement;
        private updateCaptcha() {
            this.captchaImgRef.src = `http://127.0.0.1:7001/captcha?t=${Date.now() + Math.random()}`
        }

        @Watch('countdown')
        private onCountdownChange(val: number) {
            if (val <= 0) {
                this.countdown = 60;
                this.isSending = false;
                clearInterval(this.timeId);
            }
        }

    }
</script>

<style scoped lang="scss">
    .login-form {
        .input-container {
            .el-button {
                width: 100%;
            }
        }
    }
</style>