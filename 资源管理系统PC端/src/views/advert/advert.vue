<template>
  <div>
    <div class="top-btn">
      <el-button type="primary" @click="addBannerVisible = true">新增轮播图</el-button>
    </div>

    <div class="table-infor">
      <el-table :data="bannerData" stripe style="width: 100%" lazy @selection-change="selectBanner">
        <!-- <el-table-column type="selection" width="50"></el-table-column> -->
        <el-table-column prop="order" label="排序" width="80"></el-table-column>
        <el-table-column prop="resourceId" label="资源ID" width="180"></el-table-column>
        <el-table-column prop="title" label="资源名称" width="200"></el-table-column>
        <el-table-column prop="bannerPic" label="轮播图">
          <template slot-scope="scope">
            <el-image :src="scope.row.bannerPic" alt="">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" style="font-size:50px;color:gray;"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle @click="editBannerBtn(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="delBanner(scope.row)" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination layout="prev, pager, next" :total="20" :page-size="5"></el-pagination> -->
    </div>

    <el-dialog title="新增轮播图" :visible.sync="addBannerVisible" width="400px" @close="closeaddBanner">
      <el-form :ref="addBannerForm" :rules="rules1" :model="addBannerForm" size="small">
        <el-form-item label="资源ID" prop="resourceId" label-width="80px">
          <el-input v-model="addBannerForm.resourceId" style="width:250px"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order" label-width="80px">
          <el-select v-model="addBannerForm.order" placeholder="请选择">
            <el-option v-for="item in order" :key="item"
              :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <up-img class="up-img" :clearImg="clearBannerPic" @imgUrl="imgUrl"></up-img>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addBannerVisible = false">取 消</el-button>
        <el-button type="primary" @click="addBanner(addBannerForm)">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="轮播图修改" :visible.sync="editBannerVisible" width="400px">
      <el-form :ref="editBannerForm" :rules="rules1" :model="editBannerForm" size="small">
        <el-form-item label="资源ID" prop="resourceId" label-width="80px">
          <el-input v-model="editBannerForm.resourceId" style="width:250px"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order" label-width="80px">
          <el-select v-model="editBannerForm.order" placeholder="请选择">
            <el-option v-for="item in order" :key="item"
              :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-image :src="editBannerForm.bannerPic" class="editBannerPic">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
        <div>删除</div>
      </el-image>
      <!-- <up-img class="up-img" @imgUrl="imgUrl"></up-img> -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="editBannerVisible = false">取 消</el-button>
        <el-button type="primary" @click="editBanner(editBannerForm)">确定修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import upImg from '@/components/uploadImg'
import req from '@/api/banner.js'
export default {
  components: {
    upImg
  },
  data () {
    return {
      bannerData: [],
      rules1: {
        resourceId: [{required: true, message: '请输入资源ID', trigger: 'blur'}],
        order: [{required: true, message: '请选择排序', trigger: 'blur'}]
      },
      addBannerVisible: false,
      editBannerVisible: false,
      addBannerForm: {resourceId: '', order: ''},
      editBannerForm: {resourceId: '', order: '', bannerPic: ''},
      order: [1, 2, 3, 4, 5, 6],
      bannerPic: '', // 建议图片规格 800 * 300
      clearBannerPic: 0, // 传给子组件不同的clearImg值可以做到删除的作用
      currenPage: 1,
      pageNum: 5
    }
  },
  mounted () {
    this.bannerDataLst()
  },
  methods: {
    selectBanner (e) {
      console.log(e)
    },
    imgUrl (imgUrl) { // 获取上传图片链接
      this.bannerPic = imgUrl
    },
    bannerDataLst () {
      req('bannerLst').then(res => {
        this.bannerData = res.data
      })
    },
    delBanner (row) {
      this.$alert('此操作不可逆，确认删除？', '', {
        confirmButtonText: '确定',
        callback: action => {
          req('delBanner', {
            resourceId: row.resourceId
          }).then(res => {
            if (res.code === '11') {
              this.$message({type: 'success', message: res.msg})
            } else {
              this.$message.error(res.msg)
            }
            this.bannerDataLst()
          })
        }
      })
    },
    addBanner (addBannerForm) {
      this.$refs[addBannerForm].validate((valid) => {
        if (valid) {
          if (this.bannerPic === '') {
            this.$message({
              message: '至少添加一张轮播图图片',
              type: 'warning'
            })
            return false
          } else {
            req('addBanner', {
              ...this.addBannerForm,
              bannerPic: this.bannerPic
            }).then(res => {
              if (res.code === '11') {
                this.$message({type: 'success', message: res.msg})
                this.addBannerVisible = false
              } else {
                this.$message.error(res.msg)
              }
              this.bannerDataLst()
            })
          }
        } else {
          return false
        }
      })
    },
    editBannerBtn (row) {
      this.editBannerVisible = true
      this.editBannerForm = row
    },
    editBanner (editBannerForm) {
      this.$refs[editBannerForm].validate((valid) => {
        if (valid) {
          if (this.bannerPic === '') {
            this.$message({
              message: '至少添加一张轮播图图片',
              type: 'warning'
            })
            return false
          } else {
            console.log(this.addBannerForm, this.bannerPic)
            this.clearBannerPic++
            location.reload()
          }
        } else {
          return false
        }
      })
    },
    closeaddBanner () {
      this.addBannerForm = {resourceId: '', order: ''}
      this.clearBannerPic++
      this.bannerPic = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.table-infor{
  margin-top: 40px;
}
.el-pagination{
  margin-top: 20px;
  text-align: center;
}
.up-img{
  position: relative;
  top: 20px;
  left: 70px;
}
.editBannerPic{
  color: gainsboro;
  font-size: 50px;
  margin-left: 60px;
  width: 200px;
  height: 80px;
  line-height: 100px;
  text-align: center;
  border: 1px solid gainsboro;
  border-radius: 10px;
  margin-top: 10px;
}

</style>
