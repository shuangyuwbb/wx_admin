<template>
  <div class="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
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
      <el-table :data="userList" border stripe style="height: calc(100vh - 240px); overflow-y: scroll">
        <el-table-column type="index" label="#"/>
        <el-table-column label="用户id" prop="id"/>
        <el-table-column label="用户名" prop="username"/>
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
        <el-table-column align="center" label="操作" width="160px">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"
                       @click="dialogFormVisible(scope.row)"/>

            <!-- 添加用户按钮 -->
            <el-button type="warning" icon="el-icon-circle-plus" size="mini"
                       @click="dialogFormVisibleAdd = true"/>

          </template>
        </el-table-column>
      </el-table>
      <!-- 添加用户天出框 -->
      <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd" width="50%">
        <el-form label-position="right" label-width="80px" :model="addUserForm" :rules="rules" ref="addUserRef">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUserForm.username" style="width: 218px;"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUserForm.password" type="password" style="width: 218px;"></el-input>
          </el-form-item>
          <el-form-item label="头像">
            <el-upload
                class="avatar-uploader"
                action="http://binbin-dev.bcjgy.com/admin/user/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
          <el-button type="primary" @click="addUserSubmit">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 更新用户天出框 -->
      <el-dialog title="更新用户" :visible.sync="dialogFormVisibleUpdate" width="50%">
        <el-form label-position="right" label-width="80px" :model="updateForm" :rules="rules" ref="updateUserRef">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="updateForm.username" style="width: 218px;"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="updateForm.password" type="password" style="width: 218px;"></el-input>
          </el-form-item>
          <el-form-item label="头像">
            <el-upload
                class="avatar-uploader"
                action="http://binbin-dev.bcjgy.com/admin/user/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                >
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleUpdate = false">取 消</el-button>
          <el-button type="primary" @click="updateUserSubmit">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>

  </div>
</template>

<script>
import {getUserList, updateUser, addUser, searchUser} from './../../api/index'

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
      dialogFormVisibleAdd: false,
      dialogFormVisibleUpdate: false,
      imageUrl: '',
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
      let params = {
        role: 1
      }
      this.userList = await getUserList(params)
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

    // 提交添加表单
    addUserSubmit() {
      this.$refs.addUserRef.validate(async (valid) => {
        if (!valid) return
        await addUser(this.addUserForm)
        this.dialogFormVisibleAdd = false
        this.loadUserList()
      })
    },

    // 更改用户信息弹出框
    dialogFormVisible(e) {
      this.updateForm = e
      this.dialogFormVisibleUpdate = true
    },

    // 更新用户密码信息
    async updateUserSubmit() {
      this.$refs.updateUserRef.validate(async valid => {
        if (!valid) return
        await updateUser(this.updateForm)
        this.loadUserList()
        this.dialogFormVisibleUpdate = false
      })
    },

    // 搜索用户
    async getUser() {
      if (this.words === '') return this.loadUserList()
      this.userList = []
      let params = {
        username: this.words,
        role: 1
      }
      let res = await searchUser(params)
      console.log(res)
      this.userList = res
    },

    handleAvatarSuccess(res, file){
      this.updateForm.avatar = res.mdImg
      this.addUserForm.avatar = res.mdImg
      this.imageUrl = URL.createObjectURL(file.raw);
    }
  }
}
</script>

<style lang="less">
.avatar-uploader{
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  i{
    width: 100%;
    height: 100%;
    line-height: 100px;
  }
  img{
    width: 100%;
    height: 100%;
  }
}
</style>
