<template>
  <div class="app-container">
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
      <el-table-column label="微信昵称" width="300" align="center">
        <template slot-scope="scope">{{ scope.row.userName }}</template>
      </el-table-column>
      <el-table-column label="微信头像" width="240" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.userAvatar" width="150" height="150">
        </template>
      </el-table-column>
      <el-table-column label="openId" width="200" align="center">
        <template slot-scope="scope">{{ scope.row.openId }}</template>
      </el-table-column>
      <el-table-column label="联系方式" width="200" align="center">
        <template slot-scope="scope">{{ scope.row.userTel }}</template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="添加时间" width="250">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <el-tag>{{ scope.row.createTime | statusFilter}}</el-tag>
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
import { getUserList } from "@/api/user";
import { parseTime } from "@/utils/index";
import Pagination from "@/components/Pagination";

export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      return parseTime(status);
    }
  },
  data() {
    return {
      list: [],
      listLoading: true,
      pageIndex: 1,
      pageSize: 10,
      pages: 0,
      total: 0
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      var params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      };
      getUserList(params).then(response => {
        this.list = response.data.records;
        this.pages = response.data.pages;
        this.total = response.data.total;
        this.listLoading = false;
      });
    }
  }
};
</script>
