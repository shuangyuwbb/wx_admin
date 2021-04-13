<template>
  <div class="goodsList">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 下拉框 -->
      <el-row :gutter="18">
        <!-- 下拉父级目录-->
        <el-col :span="5">
          <el-select @change="changeParentCatagory" v-model="valueParent" loading-text filterable allow-create
                     default-first-option placeholder="选择父级分类">
            <el-option v-for="item in categoryv1" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <!-- 下拉子级目录搜索框  -->
        <el-col :span="5">
          <el-select @change="changeChildCatagory"
                     v-model="valueChild"
                     loading-text
                     filterable
                     allow-create
                     default-first-option
                     placeholder="选择子级分类">
            <el-option v-for="item in categoryv2" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" :disabled="valueChild ==''" @click="dialogFormVisible = true">
            添加商品
          </el-button>
        </el-col>
      </el-row>

      <!-- 商品列表 -->
      <el-table :data="goodsList" border style="width: 100%; height: calc(100vh - 260px); overflow-y: scroll">
        <el-table-column prop="id" label="#" width="60"/>
        <el-table-column prop="subtitle" label="商品名称" width="180"></el-table-column>
        <el-table-column prop="title" label="商品分类" width="180"></el-table-column>
        <el-table-column prop="price" label="价格" width="80px"></el-table-column>
        <el-table-column prop="discount_price" label="折扣价格" width="80px"></el-table-column>
        <el-table-column prop="main_image" label="图片" width="80px">
          <!-- 商品图片处理 -->
          <template v-slot="scope">
            <img style="width: 100%;height: 3.125rem" :src=scope.row.main_image alt="">
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80px">
          <template slot-scope="scope">
            <el-switch
                v-model="scope.row.status==1"
                @change="userStateChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template v-slot="scope">
            <!-- 新增按钮 -->
            <!-- <el-button type="primary" icon="el-icon-circle-plus" size="mini" @click="dialogFormVisible = true" /> -->
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="updateGoods(scope.row)"/>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoods(scope.row)"/>
          </template>
        </el-table-column>
      </el-table>
      <!-- 修改商品弹出框 -->
      <el-dialog title="修改商品" :visible.sync="dialogFormVisibleUpdate">
        <el-form  label-width="80px" :model="updateData" :rules="rules" ref="updateGoodsRef">
          <el-form-item label="商品名称" prop="subtitle">
            <el-input v-model="updateData.subtitle"></el-input>
          </el-form-item>
          <el-form-item label="打折价格" prop="discount_price">
            <el-input v-model="updateData.discount_price"></el-input>
          </el-form-item>
          <el-form-item label="商品描述">
            <el-input v-model="updateData.name" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="商品图片">
            <el-upload class="upload-demo" :on-success="handleSuccess" action="http://binbin-dev.bcjgy.com/admin/goods/upload"
                       name="file"
                       :file-list="fileList3">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="商品热度">
            <el-input v-model="updateData.hot"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleUpdate = false">取 消</el-button>
          <el-button type="primary" @click="updateDataForm">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 添加商品弹出框 -->
      <el-dialog title="添加商品" :visible.sync="dialogFormVisible">
        <el-form :model="addData" label-width="80px" :rules="rules" ref="addGoodsRef">
          <el-form-item label="商品简称" prop="subtitle">
            <el-input v-model="addData.subtitle"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="price">
            <el-input v-model="addData.price"></el-input>
          </el-form-item>
          <el-form-item label="折扣价格" prop="price">
            <el-input v-model="addData.discount_price"></el-input>
          </el-form-item>
          <el-form-item label="商品类型" >
            <el-input v-model="addData.title"></el-input>
          </el-form-item>
          <el-form-item label="商品描述">
            <el-input v-model="addData.name" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="商品图片" >
            <el-upload class="upload-demo" action="http://binbin-dev.bcjgy.com/admin/goods/upload" :file-list="fileList3" :limit="1"
                       name="file" :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="商品热度">
            <el-input v-model="addData.hot"></el-input>
          </el-form-item>
          <el-form-item label="库存">
            <el-input v-model="addData.stock"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addGoodsForm">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getCategory1,
  getCategory2,
  getGoodsLists,
  goodsAdd,
  goodsUpdate,
  goodsUpdateStatus
} from './../../api/index'
import Login from "../../views/Login";

export default {
  data() {
    return {
      // 商品列表
      goodsList: [],
      // 修改商品表单
      updateData: {},
      // 增加商品表单
      addData: {},
      // 父级分类列表
      categoryv1: [],
      // 子级目录
      categoryv2: [],
      // 添加修改弹出框
      dialogFormVisible: false,
      dialogFormVisibleUpdate: false,
      // 上传图片列表
      fileList3: [],
      valueParent: '',
      valueChild: '',
      // 校验
      rules: {
        subtitle: [{
          required: true,
          message: "产品名不能为空哦！"
        }],
        price: [{
          required: true,
          message: "产品价格不能为空哦！"
        }],
        manufactorId: [{
          required: true,
          message: "厂家不能为空哦！"
        }]
      }
    }
  },
  mounted() {
    this.loadCatagoriev1()
  },
  methods: {

    // 获取父级分类
    async loadCatagoriev1() {
      this.categoryv1 = await getCategory1()
    },

    // 监听父级分类选框
    async changeParentCatagory(id) {
      this.categoryv2 = await getCategory2({id})
    },

    // 监听子级分类选狂
    changeChildCatagory() {
      this.loadGoodsList()
    },

    async loadGoodsList() {
      this.goodsList = await getGoodsLists({id: this.valueChild})
    },

    // 上传图片成功之后的回调
    handleSuccess(e) {
      this.addData.main_image = e.mdImg
      this.updateData.main_image = e.mdImg
    },

    // 添加商品
    async addGoodsForm() {
      this.$refs.addGoodsRef.validate(async (valid) => {
        if (!valid) return
        this.addData.category_id = this.valueChild
        console.log(this.addData)
        await goodsAdd(this.addData)
        this.dialogFormVisible = false
        this.loadGoodsList()
      })

    },

    // 删除商品
    async removeGoods(e) {
      let id = e.id
      let res = await this.$http.delete(`/admin/product/${id}`)
      if (res.data.msg) {
        let id = this.valueChild
        this.getGoodsList(this.pageCurrent, id)
        return this.$message.success(res.data.msg)
      }
    },

    // 修改商品看，
    updateGoods(e) {
      this.updateData = e
      this.dialogFormVisibleUpdate = true
    },

    //提交商品表单
    updateDataForm() {
      this.$refs.updateGoodsRef.validate(async valid => {
        if (!valid) return
        await goodsUpdate(this.updateData)
        this.loadGoodsList()
        this.$message.success('更新成功！')
      })
    },

    // 更改状态
    async userStateChange(e) {
      console.log(e)
      let status = e.status === 1 ? 1 : 0
      let updateForm = {
        id: e.id,
        status: !status
      }
      await goodsUpdateStatus(updateForm)
      this.loadGoodsList()
      return this.$message.success('更新成功！')
    }

  }
}
</script>

<style>
</style>
