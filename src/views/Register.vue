<template>
    <div class="register-container">
        <div class="register-box">
            <h1>欢迎注册</h1>
            <el-tabs tab-position="left" @tab-click="tabChange">
                <el-tab-pane label="普通注册">
                    <NormalForm ref="normalForm"></NormalForm>
                </el-tab-pane>
                <el-tab-pane label="邮箱注册">
                    <EmailForm ref="emailForm"></EmailForm>
                </el-tab-pane>
                <el-tab-pane label="手机注册">
                    <PhoneForm ref="phoneForm"></PhoneForm>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Ref} from 'vue-property-decorator';
    import NormalForm from "@/components/register/NormalForm.vue";
    import EmailForm from "@/components/register/EmailForm.vue";
    import PhoneForm from "@/components/register/PhoneForm.vue";
    // Define the component in class-style
    @Component({
        name: 'Register',
        components: {
            NormalForm,
            EmailForm,
            PhoneForm
        }
    })
    export default class Counter extends Vue {
        @Ref() readonly normalForm!:NormalForm;
        @Ref() readonly emailForm!:EmailForm;
        @Ref() readonly phoneForm!:PhoneForm;
        private tabChange() {
            this.normalForm.resetForm();
            this.emailForm.resetForm();
            this.phoneForm.resetForm();
        }
    }
</script>
<style scoped lang="scss">
    .register-container{
             width: 100%;
             height: 100%;
             background: url("../assets/bg.jpg") 0 0 no-repeat;
             background-size: cover;
             .register-box{
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