<template>
    <div class="right">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><a href="/welcome">首页</a></el-breadcrumb-item>
            <el-breadcrumb-item><span>权限管理</span></el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card class="box-card mt15">
            <!-- 搜索区域 -->
            <el-row>
                <el-col :span="18">
                    <el-form :inline="true" :model="searchData" class="demo-form-inline">
                        <el-form-item label="">
                            <el-select v-model="searchData.right" placeholder="-所有权限-" size="mini">
                                <el-option label="所有权限" value=""></el-option>
                                <el-option label="菜单权限" value="menu"></el-option>
                                <el-option label="路由权限" value="router"></el-option>
                                <el-option label="请求权限" value="action"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="">
                            <el-input v-model="searchData.key" placeholder="关键字" size="mini"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="mini" @click="searchRightsList">查询</el-button>
                            <el-button type="primary" size="mini" @click="openRightDialog">添加</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>

            <!-- 表格区域 -->
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <el-table-column
                        prop="rightsName"
                        label="权限名称"
                >
                </el-table-column>
                <el-table-column
                        prop="rightsDesc"
                        label="权限描述"
                >
                </el-table-column>
                <el-table-column
                        label="权限等级">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.level === 0 ? 'primary' : scope.row.level === 1 ?  'warning' : scope.row.level === 2 ? 'success' : ''">等级{{scope.row.level + 1}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch
                                v-model="scope.row.rightsState"
                                @change="updateRightState(scope.row)"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditRightDialog(scope.row)"></el-button>
                        <el-button slot="reference" size="mini" type="danger" icon="el-icon-delete" @click="destroyRight(scope.row.id)"></el-button>
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

        <!-- 对话框 -->
        <el-dialog
                :title="isEditRights? '编辑权限':'添加权限'"
                :visible.sync="rightsDialogVisible"
                width="30%">
            <el-form ref="form" :model="rightsData"  :rules="rightsRules" label-width="80px">
                <el-form-item label="权限名称" prop="rightsName">
                    <el-input v-model="rightsData.rightsName"
                              prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <el-form-item label="权限描述" prop="rightsDesc">
                    <el-input v-model="rightsData.rightsDesc"
                              prefix-icon="el-icon-info"></el-input>
                </el-form-item>
                <el-form-item label="权限类型" prop="rightsType">
                    <el-select v-model="rightsData.rightsType" @change="handleRightsChange">
                        <el-option label="菜单权限" value="menu"></el-option>
                        <el-option label="路由权限" value="router"></el-option>
                        <el-option label="请求权限" value="action"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="请求方式" prop="rightsMethod">
                    <el-select v-model="rightsData.rightsMethod"
                               :disabled="rightsData.rightsType !== 'action'">
                        <el-option label="GET请求" value="get"></el-option>
                        <el-option label="POST请求" value="post"></el-option>
                        <el-option label="PUT请求" value="put"></el-option>
                        <el-option label="DELETE请求" value="delete"></el-option>
                        <el-option label="所有请求" value="all"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="权限等级" prop="level">
                    <el-select v-model="rightsData.level" @change="handleRightsChange">
                        <el-option label="一级权限" :value="0"></el-option>
                        <el-option label="二级权限" :value="1"></el-option>
                        <el-option label="三级权限" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上级权限" prop="pid">
                    <el-select v-model="rightsData.pid"
                               placeholder="请选择上级权限"
                               :disabled="rightsData.level === 0">
                        <el-option
                                v-for="item in parentRights"
                                :key="item.id"
                                :label="item.rightsName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="权限地址" prop="rightsPath">
                    <el-input v-model="rightsData.rightsPath"
                              prefix-icon="el-icon-info"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="rightsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handlerRights">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script lang="ts">
    import { Component, Vue, Ref } from 'vue-property-decorator';
    import {addRightsApi, getRightsApi, updateRightsApi, delRightsApi, destroyUserUserApi} from "@/api/Api";
    import { ElForm } from "element-ui/types/form";
    // Define the component in class-style
    @Component({
        name: 'Right',
        components: {}
    })
    export default class Right extends Vue {
        private created() {
            this.searchRightsList();
        }
        private searchData = {
            key: '',
            rightsType: '',
            currentPage: 1,
            pageSize: 5
        };
        private isEditRights = true;
        private rightsDialogVisible = false;
        private totalCount = 0;
        private tableData: any[] = [];
        private rightsData = {
            id: 0,
            rightsName: '',
            rightsDesc: '',
            rightsType: 'menu',
            rightsMethod: '',
            rightsPath: '',
            level: 0,
            pid: 0
        };
        private parentRights: any[] = [];
        // 添加权限相关代码
        private validatePid = (rule: any, value:number, callback:any) => {
            if(this.rightsData.level !== 0 && value === 0){
                callback('非一级权限必须选择上级权限');
            }else{
                callback();
            }
        };
        private validateMethod = (rule: any, value:string, callback:any) => {
            if(this.rightsData.rightsType === 'action' && !value){
                callback('请求权限必须选择请求方式');
            }else{
                callback();
            }
        };
        private rightsRules = {
            rightsName: [
                { required: true, message: '请输入权限名称', trigger: 'blur' },
                { min: 1,  message: '长度至少1个字符', trigger: 'blur' }
            ],
            rightsDesc: [
                { required: true, message: '请输入权限描述', trigger: 'blur' },
                { min: 1,  message: '长度至少1个字符', trigger: 'blur' }
            ],
            rightsType: [
                { required: true, message: '请选择权限类型', trigger: 'change' },
            ],
            rightsMethod: [
                { validator: this.validateMethod, trigger: 'change' }
            ],
            rightsPath:[
                { required: false, message: '请输入权限地址', trigger: 'blur' }
            ],
            pid: [
                { validator: this.validatePid, trigger: 'change' }
            ],
            level:[
                { required: false, message: '请选择权限等级', trigger: 'change' },
            ]
        };

        // 查询权限列表
        private searchRightsList() {
            getRightsApi(this.searchData)
                .then((res:any) => {
                    if (res.status === 200) {
                        this.tableData = res.data.data.rightsLists;
                        this.totalCount = res.data.data.totalCount;
                    }
                })
                .catch((err:any) => {
                    this.$message.error(err.response.data.msg);
                })
        }
        // 打开添加权限的弹窗
        @Ref() readonly form?: ElForm;
        private openRightDialog() {
            this.rightsData.id = 0;
            this.isEditRights = false;
            this.rightsDialogVisible = true;
            this.$nextTick(() => {
              this.form!.resetFields();
              console.log(this.rightsData);
            })
        }


        private handlerRights() {
            this.form!.validate((flag:boolean)=>{
                if (flag) {
                    if (this.rightsData.id) { // 更新
                        this.updateRight(this.rightsData.id, this.rightsData)
                    } else { // 添加
                        this.addRight(this.rightsData);
                    }

                } else {
                    this.$message.error('数据格式不对');
                }
            });

        }
        // 更新权限状态
        private updateRightState(right:any) {
            Object.assign(this.rightsData, right);
            this.updateRight(this.rightsData.id, this.rightsData);

        }
        private updateRight(id:string | number, data:any) {
            updateRightsApi(id, data)
                .then((res: any) => {
                    if (res.status === 200) {
                        this.rightsDialogVisible = false;
                        this.$message.success('更新角色成功');
                        this.searchRightsList();
                    }
                })
                .catch((err: any) => {
                    this.$message.error(err.response.data.msg);
                })
        }
        private addRight(data:any) {
            addRightsApi(data)
                .then((res: any) => {
                    if (res.status === 200) {
                        this.rightsDialogVisible = false;
                        this.$message.success('添加角色成功');
                        this.searchRightsList();
                    }
                })
                .catch((err: any) => {
                    this.$message.error(err.response.data.msg);
                })
        }
        // 显示编辑权限对话框
        private showEditRightDialog(right:any) {
            this.rightsDialogVisible = true;
            this.isEditRights = true;
            Object.assign(this.rightsData, right);
        }
        // 删除权限
        private destroyRight(id: string | number) {
            this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delRightsApi(id)
                    .then((res: any) => {
                        if (res.status === 200) {
                            this.$message.success('删除权限成功');
                            this.searchRightsList();
                        }
                    })
                    .catch((err: any) => {
                         this.$message.error(err.response.data.msg)
                    });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        }
        private handleSizeChange(pageSize: number) {
          this.searchData.pageSize = pageSize;
          this.searchRightsList();
        }
        private handlePageChange(currentPage: number) {
          this.searchData.currentPage = currentPage;
          this.searchRightsList();
        }
        private handleRightsChange() {
            this.rightsData.pid = 0;
            const level = this.rightsData.level - 1;
            if (level < 0) {
                this.parentRights.length = 0;
                return;
            }
            getRightsApi({rightsType: this.rightsData.rightsType, level: this.rightsData.level - 1})
                .then(((res: any) => {
                    if (res.status === 200) {
                        this.parentRights = res.data.data.rightsLists;
                        // 父权限需要去除自己
                        const index = this.parentRights.findIndex(right => right.id === this.rightsData.id);
                        if (index > -1) {
                            this.parentRights.splice(index, 1);
                        }
                    }
                }))
                .catch((err: any) => {
                    this.$message.error(err.response.data.msg);
                })
        }
    }
</script>

<style lang="scss" scoped>

</style>
