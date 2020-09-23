<template>
    <div class="login-container">
        <div class="login-box">
            <h1>欢迎登录</h1>
            <LoginForm ref="LoginForm"></LoginForm>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    import LoginForm from "@/components/login/LoginForm.vue";

    // Define the component in class-style
    @Component({
        name: 'Login',
        components: {
            LoginForm
        }
    })
    export default class Login extends Vue {

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
    }
</style>