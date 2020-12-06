<template>
    <div class="login-container">
        <div class="login-box">
            <h1 @click="isLogin">欢迎登录</h1>
            <LoginForm ref="LoginForm"></LoginForm>
            <ul class="third-party-login">
                <li class="third-party-item iconfont icon-qq" style="color: #68a5e1;"></li>
                <li class="third-party-item iconfont icon-weixin" style="color: #46bb36;"></li>
                <li class="third-party-item iconfont icon-weibo" style="color: #e95d5c;"></li>
                <li class="third-party-item iconfont icon-github" @click="githubLogin" style="color: #666666;">
                    <a href="http://127.0.0.1:7001/passport/github"></a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    import LoginForm from "@/components/login/LoginForm.vue";
    import {isLogin} from '../api/Api'

    // Define the component in class-style
    @Component({
        name: 'Login',
        components: {
            LoginForm
        }
    })
    export default class Login extends Vue {
        isLogin() {
            isLogin().then( (res:any) => {
              console.log(res);
            })
        }
        // github第三方登录
        githubLogin() {

        }
    }
</script>
<style lang="scss" scoped>
    .login-container{
        width: 100%;
        height: 100%;
        background: url("~@assets/bg.jpg") 0 0 no-repeat;
        background-size: cover;
        .login-box{
            width: 500px;
            height: 400px;
            border-radius: 10px;
            background-color: #fff;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            h1{
                text-align: center;
            }

        }
        .third-party-login{
            list-style: none;
            display: flex;
            justify-content: space-between;
            padding: 0 40px;
            .third-party-item{
                font-size: 30px;
                cursor: pointer;
                position: relative;
                a{
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
</style>