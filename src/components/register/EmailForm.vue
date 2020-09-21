<template>
    <div class="register-form">
        <div class="input-container pr20">
            <el-form :model="registerData" :rules="registerRules" ref="registerForm">
                <el-form-item label="" prop="email">
                    <el-input
                            placeholder="请输入邮箱"
                            prefix-icon="el-icon-message"
                            v-model="registerData.email">
                    </el-input>
                </el-form-item>
                <el-form-item label="" prop="password">
                    <el-input
                            type="password"
                            placeholder="请输入密码"
                            prefix-icon="el-icon-date"
                            v-model="registerData.password">
                    </el-input>
                </el-form-item>
                <el-form-item label="" prop="captcha">
                    <el-row>
                        <el-col :span="8">
                            <el-input
                                    placeholder="验证码"
                                    prefix-icon="el-icon-date"
                                    v-model="registerData.captcha">
                            </el-input>
                        </el-col>
                        <el-col :span="8" class="ml10">
                            <el-button @click="sendEmail" type="primary" plain :loading="isSending">{{isSending ? `${countdown}秒后重试`: '发送验证码'}}</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item prop="checkProtocol">
                    <el-button type="primary" @click="register">注册</el-button>
                    <p class="use-protocol t-center">
                        <el-checkbox v-model="registerData.checkProtocol"></el-checkbox>
                        阅读并接受
                        <a href="javascript:void(0);" class="primary-a">知播渔用户协议</a>
                        及
                        <a href="javascript:void(0);" class="primary-a">知播渔隐私权保护申明</a>
                    </p>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Ref, Watch} from 'vue-property-decorator'
    import {Form} from 'element-ui'
    import { registerUserApi, sendEmailApi } from '@/api/userApi'
    // Define the component in class-style
    @Component({
        name: 'EmaiForm',
        components: {}
    })
    export default class EmailForm extends Vue {
        private registerData = {
            email: '',
            password: '',
            captcha: '',
            checkProtocol: true,
            registerType: 'email'
        };
        private isSending = false;  // 邮箱是否正在发送中
        private countdown = 60; // 发送邮箱倒计时
        private timeId = 0;

        private checkEmail(rule: any, value: string, callback: any) {
            let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            if (!value) {
                return callback(new Error('请输入邮箱地址'));
            }
            if (!reg.test(value)) {
                return callback(new Error('请输入正确的邮箱地址'));
            }
            callback();
        };

        private checkPassword(rule: any, value: string, callback: any) {
            let reg = /^(?:(?=.*[0-9].*)(?=.*[A-Za-z].*)(?=.*[,\.#%'\+\*\-:;^_`].*))[,\.#%'\+\*\-:;^_`0-9A-Za-z]{8,}$/;
            if (!value) {
                return callback(new Error('密码不能为空'));
            }
            if (!reg.test(value)) {
                return callback(new Error('密码必须是数字字母符号组合'))
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

        private checkProtocol(rule: any, value: string, callback: any) {
            if (!value) {
                return callback(new Error('请勾选用户协议'));
            }
            callback();
        };

        private registerRules = {
            email: [
                {validator: this.checkEmail, trigger: 'blur'}
            ],
            password: [
                {validator: this.checkPassword, trigger: 'blur'}
            ],
            captcha: [
                {validator: this.checkCaptcha, trigger: 'blur'}
            ],
            checkProtocol: [
                {validator: this.checkProtocol, trigger: 'change'}
            ]
        };

        // 注册用户
        @Ref() readonly registerForm!: Form;
        private register() {
            this.registerForm.validate(valid => {
                if (valid) {
                    // 创建用户
                    registerUserApi(this.registerData)
                        .then( (data: any) => {
                            console.log(data);
                            if (data.code === 200) {
                                this.$message.success('注册成功');
                                this.$router.push('/login');
                            } else {
                                this.$message.success('注册失败');
                            }
                        })
                        .catch( (err: { message: string; }) => {
                            this.$message.error(err.message)
                        })

                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        }

        // 更新验证码
        private sendEmail() {
            // 校验邮箱格式是否正确
            let emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            if (!emailReg.test(this.registerData.email)) {
                this.$message.error('请输入正确的邮箱格式!');
                return
            }
            this.isSending = true;
            this.timeId = setInterval(() => {
                this.countdown--;
            }, 1000);
            sendEmailApi({email: this.registerData.email})
                .then((data: any) => {
                    if (data.code === 200) {
                        this.$message.success('发送邮件成功')
                    } else {
                        this.$message.error(data.msg)
                    }
                })
                .catch( (e: any) => {
                    this.$message.error(e.message)
                })
        }

        @Watch('countdown')
        private onCountdownChange(val: number) {
            if (val <= 0) {
                this.countdown = 60;
                this.isSending = false;
                clearInterval(this.timeId);
            }
        }

        // 清空表单
        @Ref() readonly registerForm!: Form;
        public resetForm () {
            this.registerForm.resetFields();
        }
    }
</script>

<style scoped lang="scss">
    @import "~@css/variable.scss";

    .register-form {
        .input-container {
            .el-button {
                width: 100%;
            }
        }

        .use-protocol {
            margin-bottom: 0;
            line-height: 20px;
            font: {
                size: $font-small;
            }
            color: $font-gray;
        }
    }
</style>