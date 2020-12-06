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
                  <el-table-column type="expand">
                    <template slot-scope="scope">
                      <el-row v-for="item1 in scope.row.rightTree" :key="item1.id" :class="['border-top', 'align-center']">
                        <!-- 一级菜单 -->
                        <el-col :span="6" >
                          <el-tag>{{item1.rightsName}}</el-tag>
                        </el-col>

                        <el-col :span="18">
                          <el-row v-for="(item2, index2) in item1.children" :key="item2.id" :class="['pt10', 'pb10', 'border-top', index2 === 0 ? 'border-none' : '']">
                            <el-col :span="6">
                              <el-tag type="success">{{item2.rightsName}}</el-tag>
                            </el-col>
                            <el-col :span="18">
                              <el-tag type="success" v-for="item3 in item2.children" :key="item3.id" class="mr10">{{item3.rightsName}}</el-tag>
                            </el-col>
                          </el-row>
                        </el-col>



                      </el-row>
                    </template>
                  </el-table-column>
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
                            <el-tooltip :enterable="false" effect="dark" content="分配权限" placement="top-start">
                                <el-button size="mini" type="warning" icon="el-icon-setting" @click="openEditRightsDialog(scope.row)"></el-button>
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

                <!-- 分配权限弹窗 -->
                <el-dialog
                        title="分配权限"
                        :visible.sync="editRightsDialogVisible"
                        width="30%"
                >
                    <el-tree :data="rightsData"
                             ref="rightsTreeRef"
                             show-checkbox
                             node-key="id"
                             default-expand-all
                             :props="defaultProps"></el-tree>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="editRightsDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="dosureDispatchRights">确定</el-button>
                    </span>
                </el-dialog>
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
    import { getRolesApi, addRolesApi, delRolesApi, updateRolesApi, getRightsApi, addRoleRightsApi, delRoleRightsApi } from '@/api/Api'
    import { Component, Vue, Ref } from 'vue-property-decorator';
    import {Form, Tree} from "element-ui";
    // Define the component in class-style
    @Component({
        name: 'Roles',
        components: {}
    })
    export default class Role extends Vue {
        private created() {
            this.getRoleLists();
        }
        private editRightsDialogVisible = false;
        private defaultProps = {
            children: 'children',
            label: 'rightsName'
        };
        private rightsData: any[] = [];
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
        private currentEditRoleId : number | string = '';
        private rightsKeys:any[] = [];
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
        private getAllRights() {
            getRightsApi()
                .then((res: any) => {
                    if (res.status === 200) {
                        this.rightsData = res.data.data;
                    }
                })
                .catch((err: any) => {
                    this.$message.error(err.response.data.msg);
                })
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
        private openEditRightsDialog(role: any) {
            this.rightsKeys.length = 0;
            this.editRightsDialogVisible = true;
            this.getAllRights();
            this.currentEditRoleId = role.id;
            if (Array.isArray(role.rights)) {
              (role.rights as any[]).forEach(rights => {
                if(rights.level === 2){
                  this.rightsKeys.push(rights.id);
                }
              })
            }
          this.$nextTick(() => {
            this.rightsTreeRef.setCheckedKeys(this.rightsKeys);
          })

        }

        @Ref() readonly rightsTreeRef!: Tree
        private dosureDispatchRights() {
          // 所有选中的和半选的节点
          const allKeys = [...this.rightsTreeRef.getCheckedKeys(), ...this.rightsTreeRef.getHalfCheckedKeys()]
          // 新增的节点
          const addKeys = allKeys.filter( (item:any) => !this.rightsKeys.includes(item));
          // 新移除的节点
          const removeKeys = this.rightsKeys.filter( (item:any) => !allKeys.includes(item));

          if (addKeys.length > 0 && removeKeys.length === 0) {
            this.addRoleRights({roleId: this.currentEditRoleId, rightsIds: addKeys})
            this.getRoleLists();
            this.editRightsDialogVisible = false;
            return;
          }
          if (removeKeys.length > 0 && addKeys.length === 0) {
            this.delRoleRights(this.currentEditRoleId, {rightsIds: removeKeys})
            this.getRoleLists();
            this.editRightsDialogVisible = false;
            return;
          }
          Promise.all([this.addRoleRights({roleId: this.currentEditRoleId, rightsIds: addKeys}), this.delRoleRights(this.currentEditRoleId, {rightsIds: removeKeys})]).then(() => {
            this.$message.success('操作成功！');
            this.getRoleLists();
            this.editRightsDialogVisible = false;
          })
        }

        // 增加权限
        private addRoleRights(params:any) {
          return  addRoleRightsApi(params)
            .then((res:any) => {
              console.log(res);
              if (res.status === 200) {
                this.$message.success('分配权限成功')
              }
            })
            .catch((err:any) => {
              this.$message.error(err.response.data.msg)
            })
        }

        // 删除权限
        private delRoleRights(id:string | number, params:any) {
          return delRoleRightsApi(id, params)
              .then((res:any) => {
                console.log(res);
                if (res.status === 200) {
                  this.$message.success('移除权限成功')
                }
              })
              .catch((err:any) => {
                this.$message.error(err.response.data.msg)
              })
        }

    }
</script>

<style lang="scss" scoped>
  .border-top{
    border-top: 1px solid #ddd;
  }
  .align-center{
    display: flex;
    align-items: center;
  }
  .border-none{
    border: none;
  }
</style>
