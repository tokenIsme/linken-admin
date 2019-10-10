<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
    </div>

    <el-table
      style="margin-top:10px"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="设备id" width="300" align="center">
        <template slot-scope="scope">{{ scope.row.deviceName }}</template>
      </el-table-column>
      <el-table-column label="设备名" width="300" align="center">
        <template slot-scope="scope">{{ scope.row.deviceValue }}</template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="创建时间" width="250">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <el-tag>{{ scope.row.createTime | statusFilter}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">修改</el-button>
          <el-button size="mini" type="danger" @click="handleModifyStatus(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="pageIndex"
      :limit.sync="pageSize"
      @pagination="getList"
    />

    <el-dialog width="80%" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 1020px; margin-left:50px;"
      >
        <el-form-item label="设备id" prop="deviceName">
          <el-input v-model="temp.deviceName" />
        </el-form-item>
        <el-form-item label="设备名称" prop="deviceValue">
          <el-input v-model="temp.deviceValue" />
        </el-form-item>
        <el-form-item label="设备图片地址" prop="devicePic">
          <el-input v-model="temp.devicePic" />
        </el-form-item>
        <el-form-item label="设备介绍" prop="deviceInfo">
          <tinymce ref="tiny" v-model="temp.deviceInfo" :height="300" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
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
</style>

<script>
import { getList, update, getUploadUrl, del } from "@/api/table";
import { parseTime } from "@/utils/index";
import Pagination from "@/components/Pagination";
import Tinymce from "@/components/Tinymce";

export default {
  components: { Pagination, Tinymce },
  filters: {
    statusFilter(status) {
      return parseTime(status);
    }
  },
  data() {
    return {
      uploadUrl: "",
      isShowPic: false,
      list: [],
      temp: {},
      listLoading: true,
      pageIndex: 1,
      pageSize: 10,
      pages: 0,
      total: 0,
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "修改",
        create: "添加"
      }
    };
  },
  created() {
    this.fetchData();
    this.getUrl();
  },
  methods: {
    getUrl() {
      getUploadUrl().then(response => {
        console.log("uploadUrl" + response.data);
        this.uploadUrl = response.data;
      });
    },
    fetchData() {
      this.listLoading = true;
      var params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      };
      getList(params).then(response => {
        this.list = response.data.records;
        this.pages = response.data.pages;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    handleAvatarSuccess(res, file) {
      console.log("res " + res.data);
      this.isShowPic = true;
      this.temp.devicePic = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      return isJPG;
    },
    handleCreate() {
      //添加
      this.isShowPic = false;
      this.temp = {};
      this.dialogFormVisible = true;
      this.dialogStatus = "create";
    },
    handleUpdate(row) {
      //修改
      this.temp = {};
      this.isShowPic = true;
      this.dialogFormVisible = true;
      this.dialogStatus = "update";
      this.temp = row;
      this.$refs["tiny"].setContent(row.deviceInfo);
    },
    createData() {
      update(this.temp).then(response => {
        if (response.data) {
          this.$message("添加成功！");
          this.dialogFormVisible = false;
          this.fetchData();
        } else {
          this.$message("添加失败！");
        }
      });
    },
    updateData() {
      update(this.temp).then(response => {
        if (response.data) {
          this.$message("修改成功！");
          this.dialogFormVisible = false;
        } else {
          this.$message("修改失败！");
        }
      });
    },
    handleModifyStatus(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var param = { id: row.id };
          del(param).then(response => {
            if (response.data) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.fetchData();
            } else {
              this.$message({
                type: "success",
                message: "删除失败!"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>
