<template>
    <div class="user">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><a href="/welcome">首页</a></el-breadcrumb-item>
            <el-breadcrumb-item><a href="/users">用户管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card class="box-card mt15">
            <!-- 搜索区域 -->
            <el-row>
                <el-col :span="18">
                    <el-form :inline="true" :model="searchData" class="demo-form-inline">
                        <el-form-item label="">
                            <el-select v-model="searchData.role" placeholder="-所有角色-" size="mini">
                                <el-option label="所有角色" value=""></el-option>
                                <el-option label="管理员" value="manger"></el-option>
                                <el-option label="普通用户" value="normal"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="">
                            <el-select v-model="searchData.origin" placeholder="-所有来源-" size="mini">
                                <el-option label="所有来源" value=""></el-option>
                                <el-option label="本地注册" value="local"></el-option>
                                <el-option label="Github登录" value="github"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="">
                            <el-select v-model="searchData.type" placeholder="-所有用户-" size="mini">
                                <el-option label="所有用户" value=""></el-option>
                                <el-option label="用户名" value="username"></el-option>
                                <el-option label="邮箱" value="email"></el-option>
                                <el-option label="手机" value="phone"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="">
                            <el-input v-model="searchData.key" placeholder="关键字" size="mini"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="mini" @click="onSubmit">查询</el-button>
                            <el-button type="primary" size="mini" @click="exportUsers">导出搜索结果</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="6" style="margin-top: 7px;">
                    <el-button type="primary" size="mini" @click="showAddUserDialog">添加用户</el-button>
                    <el-upload
                            class="upload-file"
                            action="http://127.0.0.1:7001/api/v1/importUser"
                            :show-file-list="false"
                            :on-success="handleExcelSuccess"
                            :before-upload="beforeExcelUpload"
                            :on-error="handleExcelError"
                            accept=".xls">
                        <el-button size="mini" type="primary">点击上传</el-button>
                    </el-upload>
                    <a href="http://127.0.0.1:7001/api/v1/exportUser/" class="ml10">
                        <el-button type="primary" size="mini">导出所有用户</el-button>
                    </a>
                </el-col>
            </el-row>

            <!-- 表格区域 -->
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <el-table-column
                        prop="username"
                        label="用户名"
                >
                </el-table-column>
                <el-table-column
                        prop="email"
                        label="邮箱"
                >
                </el-table-column>
                <el-table-column
                        prop="phone"
                        label="电话">
                </el-table-column>
                <el-table-column
                        prop="roleName"
                        label="角色">
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch
                                v-model="scope.row.user_state"
                                @change="updateUserState(scope.row)"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditUserDialog(scope.row)"></el-button>
                        <el-button slot="reference" size="mini" type="danger" icon="el-icon-delete" @click="destroyUser(scope.row.id)"></el-button>
                        <el-tooltip :enterable="false" effect="dark" content="分配角色" placement="top-start">
                            <el-button size="mini" type="warning" icon="el-icon-setting" @click="openAddRoleDialog(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>

            </el-table>

            <!-- 分页区域 -->
            <el-pagination
                    class="mt15"
                    @size-change="handleSizeChange"
                    @current-change="handlePageChange"
                    :current-page="searchData.currentPage"
                    :page-sizes="[5, 10, 20, 50]"
                    :page-size="searchData.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalCount">
            </el-pagination>
        </el-card>


        <!-- 添加用户弹窗区域 -->
        <el-dialog
                title="添加用户"
                :visible.sync="addUserDialogVisible"
                width="30%"
                >
            <el-form :model="addUserData" :rules="addUserRules" ref="addUserForm">
                <el-form-item label="" prop="username">
                    <el-input
                            placeholder="请输入用户名"
                            prefix-icon="el-icon-date"
                            v-model="addUserData.username">
                    </el-input>
                </el-form-item>
                <el-form-item label="" prop="phone">
                    <el-input
                            placeholder="请输入手机号"
                            prefix-icon="el-icon-message"
                            v-model="addUserData.phone">
                    </el-input>
                </el-form-item>
                <el-form-item label="" prop="email">
                    <el-input
                            placeholder="请输入邮箱"
                            prefix-icon="el-icon-message"
                            v-model="addUserData.email">
                    </el-input>
                </el-form-item>
                <el-form-item label="" prop="password">
                    <el-input
                            type="password"
                            placeholder="请输入密码"
                            prefix-icon="el-icon-date"
                            v-model="addUserData.password">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addUserDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dosureAddUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑用户弹窗区域 -->
        <el-dialog
                title="编辑用户"
                :visible.sync="editUserDialogVisible"
                width="30%"
        >
            <el-form :model="editUserData" :rules="editUserRules" ref="editUserForm">
                <el-form-item prop="avatar_url" style="text-align: center">
                    <el-upload
                            class="avatar-uploader mb15"
                            action="http://127.0.0.1:7001/api/v1/posts"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
<!--                        <img v-if="editUserData.avatar_url" :src="editUserData.avatar_url" class="avatar">-->
                        <img v-if="editUserData.avatar_url" :src="editUserData.baseUrl + editUserData.avatar_url" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="" prop="username">
                    <el-input
                            placeholder="请输入用户名"
                            prefix-icon="el-icon-date"
                            v-model="editUserData.username">
                    </el-input>
                </el-form-item>
                <el-form-item label="" prop="phone">
                    <el-input
                            placeholder="请输入手机号"
                            prefix-icon="el-icon-message"
                            v-model="editUserData.phone">
                    </el-input>
                </el-form-item>
                <el-form-item label="" prop="email">
                    <el-input
                            placeholder="请输入邮箱"
                            prefix-icon="el-icon-message"
                            v-model="editUserData.email">
                    </el-input>
                </el-form-item>
                <el-form-item label="" prop="password">
                    <el-input
                            type="password"
                            placeholder="请输入密码"
                            prefix-icon="el-icon-date"
                            v-model="editUserData.password">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editUserDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dosureEditUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配角色弹窗 -->
        <el-dialog
                title="编辑用户"
                :visible.sync="editRoleDialogVisible"
                width="30%"
        >
            <el-form :model="editRoleData" ref="editRoleForm">
                <el-form-item label="当前用户" prop="username">
                    <el-input
                            disabled
                            prefix-icon="el-icon-message"
                            v-model="editRoleData.username">
                    </el-input>
                </el-form-item>
                <el-form-item label="当前角色" prop="email">
                    <el-input
                            disabled
                            prefix-icon="el-icon-message"
                            v-model="editRoleData.role">
                    </el-input>
                </el-form-item>
                <el-form-item label="新的角色" prop="password">
                    <el-select v-model="editRoleData.newRole" placeholder="请选择角色">
                        <el-option
                                v-for="item in roleLists"
                                :key="item.id"
                                :label="item.role_name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editUserDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dosureEditUser">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Ref, Vue} from 'vue-property-decorator';
    import {getUserApi, addUserApi, destroyUserUserApi, updateUserUserApi, getRolesApi} from "@/api/Api";
    import {Form} from "element-ui";
    import XLSX from 'xlsx'
    import { saveAs } from 'file-saver';
    // Define the component in class-style
    @Component({
        name: 'Users',
        components: {}
    })
    export default class User extends Vue {
        created(): void {
            this.getUserLists();
        }
        private editRoleDialogVisible = false;
        private getUserLists() {
            getUserApi(this.searchData)
                .then((res: any) => {
                    this.tableData = res.data.data.userLists;
                    this.totalCount = res.data.data.totalCount;
                })
                .catch((err: any) => {
                    (this as any).$message.error(err.response.data.msg);
                })
        }
        // 搜索条件
        private searchData = {
            role:'',
            origin:'',
            type:'',
            key:'',
            currentPage: 1,
            pageSize: 5
        };
        private totalCount = 0;
        private addUserDialogVisible = false;
        private editUserDialogVisible = false;
        private addUserData = {
            avatar_url: '',
            id: '',
            username: '',
            phone: '',
            email: '',
            password: '',
        };
        private editUserData = {
            avatar_url: '',
            baseUrl: '',
            id: '',
            username: '',
            phone: '',
            email: '',
            password: '',
        };
        private editRoleData = {
            username: '',
            role: '',
            newRole: '',
        };
        private roleLists:any[] = [];
        private checkUsername(rule: any, value: string, callback: any) {
            let reg = /^[a-zA-Z0-9]{6,}$/;
            if (!value) {
                return callback(new Error('用户名不能为空'));
            }
            if (!reg.test(value)) {
                return callback(new Error('用户名不能少于6位'))
            }
            callback();
        };
        private checkPhone(rule: any, value: string, callback: any) {
            let reg = /^1[3456789]\d{9}$/;
            if (value && !reg.test(value)) {
                return callback(new Error('请输入正确的国内手机号'));
            } else {
                callback();
            }

        };
        private checkAddUserPassword(rule: any, value: string, callback: any) {
            let reg = /^(?:(?=.*[0-9].*)(?=.*[A-Za-z].*)(?=.*[,\.#%'\+\*\-:;^_`].*))[,\.#%'\+\*\-:;^_`0-9A-Za-z]{8,}$/;
            if (!value) {
                return callback(new Error('密码不能为空'));
            }
            if (!reg.test(value)) {
                return callback(new Error('密码必须是数字字母符号组合'))
            }
            callback();
        };
        private checkEditUserPassword(rule: any, value: string, callback: any) {
            let reg = /^(?:(?=.*[0-9].*)(?=.*[A-Za-z].*)(?=.*[,\.#%'\+\*\-:;^_`].*))[,\.#%'\+\*\-:;^_`0-9A-Za-z]{8,}$/;
            if (value && !reg.test(value)) {
                return callback(new Error('密码必须是数字字母符号组合'))
            }
            else {
                callback();
            }

        };
        private checkEmail(rule: any, value: string, callback: any) {
            let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            if (value && !reg.test(value)) {
                return callback(new Error('请输入正确的邮箱地址'));
            } else{
                callback();
            }
        };
        private addUserRules = {
            username: [
                {validator: this.checkUsername, trigger: 'blur'}
            ],
            phone: [
                {validator: this.checkPhone, trigger: 'blur'}
            ],
            email: [
                {validator: this.checkEmail, trigger: 'blur'}
            ],
            password: [
                {validator: this.checkAddUserPassword, trigger: 'blur'}
            ],
        };

        private openAddRoleDialog(role:any) {
            this.editRoleData.username = role.username;
            this.editRoleData.role = role.role;
            this.editRoleDialogVisible = true;
            getRolesApi()
                .then( (res:any) => {
                    if (res.status === 200) {
                        this.roleLists = res.data.data.rolesLists
                    }
                })
                .catch((err:any) => {
                    this.$message.error(err.response.data.msg);
                });
        }


        private editUserRules = {
            username: [
                {validator: this.checkUsername, trigger: 'blur'}
            ],
            phone: [
                {validator: this.checkPhone, trigger: 'blur'}
            ],
            email: [
                {validator: this.checkEmail, trigger: 'blur'}
            ],
            password: [
                {validator: this.checkEditUserPassword, trigger: 'blur'}
            ],
        };


        private tableData:any[] = [];


        private onSubmit() {
            this.getUserLists();
        }

        private exportUsers() {
            const user = this.tableData.length ? this.tableData[0] : null;
            const exportData:any[] = [];
            // 生成导出数据
            if (user) {
                const cloumnTitles = Object.keys(user);
                exportData.push(cloumnTitles);

                this.tableData.forEach( item => {
                    const temp:any = [];
                    cloumnTitles.forEach(key => {
                        temp.push(item[key]);
                    });
                    exportData.push(temp)
                });
            }
            const sheet = XLSX.utils.aoa_to_sheet(exportData);
            const workBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workBook, sheet, 'users');

            const wopts:any = { bookType: 'xlsx', bookSST: false, type: 'array'};
            const wbout = XLSX.write(workBook, wopts);
            saveAs(new Blob([wbout], { type: 'application/octet-stream'}), 'user.xlsx')

        }
        private destroyUser(id:string) {
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                destroyUserUserApi(id)
                    .then((res: any) => {
                        if (res.status === 200) {
                            this.$message.success('删除用户成功');
                            const idx = this.tableData.findIndex( item => item.id === id);
                            this.tableData.splice(idx, 1);
                        }
                    })
                    .catch((err: any) => {
                        if (err && err.response && err.response.data) {
                            this.$message.warning(err.response.data.msg)
                        }
                    });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }

        @Ref() readonly addUserForm!: Form;
        private showAddUserDialog() {
            this.addUserDialogVisible = true;
            this.addUserForm ? this.addUserForm.resetFields() : '';
        }
        @Ref() readonly editUserForm!: Form;
        private showEditUserDialog(currentUser:any) {
            this.editUserDialogVisible = true;
            if (this.editUserForm) this.editUserForm.clearValidate();
            this.editUserData = Object.assign(this.editUserData, currentUser);
        }
        // 确认添加用户
        @Ref() readonly addUserForm!: Form;
        private dosureAddUser() {
            this.addUserForm.validate(valid => {
                if (valid) {
                    // 创建用户
                    addUserApi(this.addUserData)
                        .then((res: any) => {
                            if (res.status === 200) {
                                const user = res.data.data;
                                this.$message.success('添加用户成功');
                                this.tableData.push(user);
                                this.addUserDialogVisible = false;
                                this.totalCount++;
                            }
                        })
                        .catch((err: any) => {
                            if (err && err.response && err.response.data) {
                                this.$message.warning(err.response.data.msg)
                            }
                        })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        }

        // 确认修改用户
        private dosureEditUser(){
            this.editUserForm.validate(valid => {
                if (valid) {
                    // 修改用户
                    const { id } = this.editUserData;
                    updateUserUserApi(id, this.editUserData)
                        .then((res: any) => {
                            if (res.status === 200) {
                                const idx = this.tableData.findIndex( item => item.id === id);
                                this.$set(this.tableData, idx, this.editUserData);
                                this.$message.success('编辑用户成功');
                                this.editUserDialogVisible = false;
                            }
                        })
                        .catch((err: any) => {
                            if (err && err.response && err.response.data) {
                                this.$message.warning(err.response.data.msg)
                            }
                        })
                } else {
                    console.log('error submit!!');
                    this.$message.error('编辑用户失败')
                }
            });
        }

        private updateUserState(user:any) {
            updateUserUserApi(user.id, user)
                .then((res: any) => {
                    if (res.status === 200) {
                        this.$message.success('修改用户状态成功成功');
                    } else {
                        user.user_state = !user.user_state;
                        this.$message.warning('修改用户状态成功失败');
                    }
                })
                .catch((err: any) => {
                    user.user_state = !user.user_state;
                    this.$message.warning('修改用户状态成功失败');
                })
        }

        private handleExcelSuccess(res:any, file:any) {
            if (res.data.code === 200) {
                this.$message.success('上传用户成功！');
                this.getUserLists();
            }
        }
        private handleExcelError(err: any) {
            let obj;
            if (typeof err.message === 'string') obj = JSON.parse(err.message)
            this.$message.error(obj.msg);
        }
        private beforeExcelUpload(file:any) {
            const isExcel = file.type === 'application/vnd.ms-excel';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isExcel) {
                this.$message.error('上传文件只能是 xls 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传文件大小不能超过 2MB!');
            }
            return isExcel && isLt2M;
        }

        // 头像上传成功的回调
        private handleAvatarSuccess(res:any, file: any) {
            if (res.code === 200) {
                this.editUserData.avatar_url = res.data;
            }
        }
        // 头像上传之前的回调
        private beforeAvatarUpload(file: any) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        }

        private handleSizeChange(pageSize: number) {
            this.searchData.pageSize = pageSize;
            this.getUserLists();
        }

        private handlePageChange(currentPage: number) {
            this.searchData.currentPage = currentPage;
            this.getUserLists();
        }

    }
</script>

<style lang="scss" scoped>
    .user{

    }
    .avatar-uploader{
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        display: inline-block;
    }
    .avatar-uploader:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .upload-file{
        display: inline-block;
        margin-left: 10px;
    }
</style>
