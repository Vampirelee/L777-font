<template>
    <div class="admin">
        <el-container>
            <el-header>
                <h1 class="logo" @click="toggleCollapse">
                    <img src="../assets/logo.png" alt="">
                </h1>
                <div class="account clearfix">
                    <p class="avatar fl"><img :src="userInfo.baseUrl + userInfo.avatar_url" alt=""></p>
                    <span class="user-name fl">{{userInfo.username || userInfo.email || userInfo.phone}}</span>
                    <el-button @click="logout" class="fl" style="margin-top: 15px;" size="mini">退出</el-button>
                </div>
            </el-header>
            <el-container>
                <el-aside :width="isCollapse ? '65px' : '200px'">
                    <el-menu :default-active="activeMenu"
                             :collapse="isCollapse"
                             :collapse-transition="false"
                             @select="selectMenu"
                             router
                             class="el-menu-vertical-demo">
                        <el-submenu :index="submenu.rightsName" v-for="submenu in menus" :key="submenu.rightsName">
                            <template slot="title">
                                <i class="el-icon-setting"></i>
                                <span slot="title">{{submenu.rightsName}}</span>
                            </template>
                            <el-menu-item :index="menuItem.rightsPath" v-for="menuItem in submenu.children" :key="menuItem.rightsName">
                                <i class="el-icon-user"></i>
                                <span>{{menuItem.rightsName}}</span>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'

    import Cookies from "js-cookie";

    // Define the component in class-style
    @Component({
        name: 'Admin',
        components: {},
    })
    export default class Admin extends Vue {
        created():void {
            let path = this.$route.path;
            if (path !== '/welcome') (this as any).activeMenu = path;
            this.userInfo = JSON.parse(window.sessionStorage.getItem('userInfo') || '{}');
            this.userInfo.rightsTree.forEach((rights:any) => {
              if (rights.rightsType === 'menu') {
                this.menus = rights.children;
              }
            })
        }
        private userInfo:any = {};
        private isCollapse = false;
        private toggleCollapse() {
            this.isCollapse = !this.isCollapse;
        }
        private activeMenu =  '';
        private menus:any[] = [
            {
                menuName:'用户管理',
                path: '',
                icon: 'el-icon-setting',
                children:[
                    {menuName:'用户列表',path: '/users', icon:'el-icon-user', children:[]}
                ]
            },
            {
                menuName:'权限管理',
                path: '',
                icon:'el-icon-collection',
                children:[
                    {menuName:'角色列表',path: '/roles', icon:'el-icon-view',children:[]},
                    {menuName:'权限列表',path: '/right', icon:'el-icon-unlock',children:[]}
                ]
            }
        ];
        private logout() {
            Cookies.remove('token');
            this.$router.push('/login');
            window.sessionStorage.setItem('userInfo', '');
            (this as any).$message.warning('您已退出登录')
        }
        private selectMenu(index: string) {
            this.activeMenu = index;
        }
    }
</script>
<style lang="scss" scoped>
    .admin{
        .el-header{
            display: flex;
            justify-content: space-between;
            background-color: #00afff;
            .logo{
                margin: 0;
                height: 100%;
                line-height: 75px;
                margin-left: 20px;
                img{
                    width: 120px;
                }
            }
            .account{
                margin-right: 15px;
                .avatar{
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    overflow: hidden;
                    margin-right: 15px;
                    img {
                        width: 100%;
                    }
                }
                .user-name{
                    line-height: 60px;
                    margin-right: 15px;
                }
            }
        }
    }
</style>