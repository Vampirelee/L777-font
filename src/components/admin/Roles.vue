<template>
    <div>
        <div class="roles">
            <!-- 卡片区域 -->
            <el-card class="box-card mt15">
                <!-- 搜索区域 -->
                <el-row>
                    <el-col :span="18">
                        <el-input v-model="searchData.key" placeholder="关键字" size="mini"></el-input>
                    </el-col>
                    <el-col :span="6" class="pl10">
                        <el-button type="primary" size="mini" @click="searchRole">查询</el-button>
                        <el-button type="primary" size="mini" @click="openAddRoleDialog">添加</el-button>
                    </el-col>
                </el-row>

                <!-- 表格区域 -->
                <el-table
                        :data="tableData"
                        style="width: 100%">
                    <el-table-column
                            prop="role_name"
                            label="角色名称"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="role_desc"
                            label="角色备注"
                    >
                    </el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <el-switch
                                    v-model="scope.row.role_state"
                                    @change="updateRoleState(scope.row)"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949">
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditRoleDialog(scope.row)"></el-button>
                            <el-button slot="reference" size="mini" type="danger" icon="el-icon-delete" @click="destroyRole(scope.row.id)"></el-button>
                            <el-button size="mini" type="warning" icon="el-icon-setting"></el-button>
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
        </div>

        <!-- 添加角色弹窗 -->
        <el-dialog
                title="添加角色"
                :visible.sync="addRoleDialogVisible"
                width="30%"
        >
            <el-form :model="addRoleData" :rules="roleRules" ref="addRoleForm">
                <el-form-item label="" prop="role_name">
                    <el-input
                            placeholder="请输入角色名"
                            prefix-icon="el-icon-date"
                            v-model="addRoleData.role_name">
                    </el-input>
                </el-form-item>
                <el-form-item label="" prop="role_desc">
                    <el-input
                            placeholder="请输入角色描述"
                            prefix-icon="el-icon-message"
                            v-model="addRoleData.role_desc">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dosureAddRole">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑角色弹窗 -->
        <el-dialog
                title="编辑角色"
                :visible.sync="editRoleDialogVisible"
                width="30%"
        >
            <el-form :model="editRoleData" :rules="roleRules" ref="editRoleForm">
                <el-form-item label="" prop="role_name">
                    <el-input
                            placeholder="请输入角色名"
                            prefix-icon="el-icon-date"
                            v-model="editRoleData.role_name">
                    </el-input>
                </el-form-item>
                <el-form-item label="" prop="role_desc">
                    <el-input
                            placeholder="请输入角色描述"
                            prefix-icon="el-icon-message"
                            v-model="editRoleData.role_desc">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dosureEditRole">确 定</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script lang="ts">
    import { getRolesApi, addRolesApi, delRolesApi, updateRolesApi } from '@/api/Api'
    import { Component, Vue, Ref } from 'vue-property-decorator';
    import {Form} from "element-ui";
    // Define the component in class-style
    @Component({
        name: 'Roles',
        components: {}
    })
    export default class Role extends Vue {
        private created() {
            this.getRoleLists();
        }
        private searchData = {
            key: '',
            currentPage: 1,
            pageSize: 5
        };
        private tableData:any[] = [];
        private totalCount = 0;
        private addRoleData = {
            role_name: '',
            role_desc: ''
        };
        private editRoleData = {
            id: '',
            role_name: '',
            role_desc: '',
            role_state: false,
        };
        private checkRolename(rule: any, value: string, callback: any) {
            if (!value) {
                return callback(new Error('角色名不能为空'));
            }
            if (value.length >= 20) {
                return callback(new Error('角色名不能超过20字'))
            }
            callback();
        };
        private checkRoleDesc(rule:any, value: string, callback: any) {
            if (!value) {
                return callback(new Error('角色描述不能为空'));
            }
            if (value.length >= 20) {
                return callback(new Error('角色描述不能超过20字'))
            }
            callback();
        }
        private roleRules = {
            role_name: [
                {validator: this.checkRolename, trigger: 'blur'}
            ],
            role_desc: [
                {validator: this.checkRoleDesc, trigger: 'blur'}
            ]
        };
        private addRoleDialogVisible = false;
        private editRoleDialogVisible = false;
        private getRoleLists() {
            getRolesApi(this.searchData)
                .then((res: any) => {
                    console.log(res);
                    if (res.status === 200) {
                        this.tableData = res.data.data.rolesLists;
                        this.totalCount = res.data.data.totalCount;
                    }
                })
                .catch((err:any) => {
                    (this as any).$message.error(err.response.data.msg);
                })
        }
        private searchRole () {
            this.getRoleLists();
        }
        @Ref() readonly addRoleForm!: Form;
        private openAddRoleDialog() {
            this.addRoleForm ? this.addRoleForm.resetFields() : '';
            this.addRoleDialogVisible = true;
            this.addRoleData.role_name = '';
            this.addRoleData.role_desc = '';
        }
        private dosureAddRole() {
            addRolesApi(this.addRoleData)
                .then((res:any) => {
                    if (res.status === 200) {
                        this.$message.success('添加成功');
                        const role = res.data.data;
                        this.totalCount++;
                        this.addRoleDialogVisible = false;
                        if (this.tableData.length < this.searchData.pageSize) {
                            this.tableData.push(role);
                        }
                    }
                })
                .catch((err:any) => {
                    this.$message.error(err.response.data.msg);
                })
        }
        private dosureEditRole() {
            updateRolesApi(this.editRoleData.id, this.editRoleData)
                .then((res:any) => {
                    if (res.status === 200) {
                        this.$message.success('更新成功');
                        const index = this.tableData.findIndex(item => item.id === this.editRoleData.id);
                        Object.assign(this.tableData[index], this.editRoleData);
                        this.editRoleDialogVisible = false;
                    }
                })
                .catch((err:any) => {
                    this.$message.error(err.response.data.msg);
                })
        }

        @Ref() readonly editRoleForm!: Form;
        private showEditRoleDialog(role:any) {
            this.editRoleForm ? this.editRoleForm.resetFields() : '';
            this.editRoleDialogVisible = true;
            Object.assign(this.editRoleData, role);
        }
        private destroyRole(id:string) {
            delRolesApi(id)
                .then((res:any) => {
                    if (res.status === 200) {
                        const index = this.tableData.findIndex(item => item.id === id);
                        this.tableData.splice(index, 1);
                        this.$message.success('移除成功');
                        this.totalCount--;
                    }
                })
                .catch( (err:any) => {
                    this.$message.error(err.response.data.msg)
                })
        }
        private handleSizeChange() {

        }
        private handlePageChange() {

        }
        private updateRoleState(role:any) {
            updateRolesApi(role.id, role)
                .then((res:any) => {
                    if (res.status === 200) {
                        this.$message.success('更新状态成功');
                    }
                })
                .catch((err:any) => {
                    role.role_state = !role.role_state;
                    this.$message.error(err.response.data.msg);
                })
        }
    }
</script>

<style lang="scss" scoped>

</style>
