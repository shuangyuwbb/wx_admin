<template>
    <div class="users">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" clearable v-model="words">
                        <el-button slot="append" icon="el-icon-search" @click="getUser"/>
                    </el-input>
                </el-col>

            </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="userList" border stripe  style="height: calc(100vh - 240px); overflow-y: scroll">
                <el-table-column type="index" label="#"/>
                <el-table-column label="用户id" prop="id"/>
                <el-table-column label="用户名" prop="username"/>
                <el-table-column label="email" prop="email"/>
                <el-table-column label="角色" prop="role">
                    <template v-slot="scope">
                        <span v-if="scope.row.role==1">管理员</span>
                        <span v-else>普通用户</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" prop="status">
                    <template v-slot="scope">
                        <el-switch v-model="scope.row.status==1" @change="userStateChange(scope.row)"/>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

    </div>
</template>

<script>
    import {getUserList, updateUser, searchUser} from './../../api/index'

    export default {
        data() {
            return {
                total: 0,
                words: '',
                pageNum: 1,
                userList: [],
                pageCurrent: 1,
                addUserForm: {},
                updateForm: {},

                // 校验
                rules: {
                    username: [{
                        required: true,
                        message: "用户名不能为空哦！"
                    },
                        {
                            min: 2,
                            max: 15,
                            message: '长度在 3 到 25 个字符',
                            trigger: 'blur'
                        }],
                    password: [{
                        required: true,
                        message: "密码不能为空哦！"
                    },
                        {
                            min: 3,
                            max: 15,
                            message: '长度在 3 到 15 个字符',
                            trigger: 'blur'
                        }]

                }
            }
        },
        mounted() {
            this.loadUserList()
        },
        methods: {
            // 获取用户列表
            async loadUserList() {
                this.userList = await getUserList()
            },

            // 更改用户状态
            async userStateChange(e) {
                let status = e.status === 1 ? 1 : 0
                let updateForm = {
                    id: e.id,
                    status: !status
                }
                await updateUser(updateForm)
                this.loadUserList()
            },


            // 搜索用户
            async getUser() {
                if (this.words == '')return this.getUserList()
                let params = {
                    username: this.words,
                    role: 2
                }
                this.userList = searchUser(params)
            }
        }
    }
</script>

<style>
</style>
