<template>
  <el-dialog :title="`编辑测评对象`" :close-on-click-modal="false" :visible.sync="visible" append-to-body width="80%" :close-on-press-escape="false">
    <div class="mod-content" v-cloak v-if="!showNull">
      <div class="shadow">
        <div class="cpPro" v-html="'测评师：' + detail.cpsname" v-show="detail.cpsname!=undefined"></div>
      </div>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()">
        <div class="shadow">
          <el-row :gutter="20">
            <el-col :span="16">
              <div class="br1 pd32">
                <h3 v-html="detail.yiceng"></h3>
                <h4 v-html="detail.erceng"></h4>
                <h4 v-html="detail.sanceng"></h4>
                <h4 v-html="detail.siceng"></h4>
                <div class="mb24" v-html="detail.yaoqiu"></div>
                <div class="content mb24">
                  <span v-html="detail.xa"></span>
                  <el-button type="primary" round icon="el-icon-circle-plus-outline" style="margin-left: 10px" @click="addNewDetailList()">添加新的测评对象</el-button>
                </div>
                <div v-for="(item, index) in dataForm.cpresult" :key="'cpresult-' + index">
                  <div class="content mb24">
                    <el-row :gutter="20">
                      <el-col :span="6"> b) 测评对象：</el-col>
                      <el-col :span="18" class="content">
                        <el-form-item :prop="'cpresult.'+ index + '.xbName'" :rules="{ required: true, message: '测评对象不能为空', trigger: 'blur' }" label-width="1px">
                          <el-input v-model="item.xbName" :placeholder="xbplace(index,detail.xb)"></el-input>
                        </el-form-item>
                        <el-button type="danger" round icon="el-icon-delete" style="margin-left: 10px" @click="delThis(index)">删除</el-button>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="content mb24">
                    <el-row :gutter="20">
                      <el-col :span="6"> 重要程度：</el-col>
                      <el-col :span="18">
                        <el-form-item :prop="'cpresult.'+ index + '.zycd'" :rules="{ required: false, message: '请选择重要程度', trigger: 'blur' }" label-width="1px">
                          <el-select v-model="item.zycd" placeholder="请选择重要程度">
                            <el-option label="初级" value="0"></el-option>
                            <el-option label="中级" value="1"></el-option>
                            <el-option label="高级" value="2"></el-option>
                          </el-select>
                        </el-form-item>

                      </el-col>
                    </el-row>
                  </div>
                  <div class="content mb24">
                    <el-row :gutter="20">
                      <el-col :span="6"> 测评方式：</el-col>
                      <el-col :span="18">
                        <el-form-item :prop="'cpresult.'+ index + '.cpfs'" :rules="{ required: false, message: '请选择测评方式', trigger: 'blur' }" label-width="1px">
                          <el-select v-model="item.cpfs" placeholder="请选择测评方式">
                            <el-option label="访谈" value="0"></el-option>
                            <el-option label="核查" value="1"></el-option>
                            <el-option label="测试" value="2"></el-option>
                            <el-option label="访谈、核查" value="3"></el-option>
                            <el-option label="访谈、测试" value="4"></el-option>
                            <el-option label="核查、测试" value="5"></el-option>
                          </el-select>
                        </el-form-item>

                      </el-col>
                    </el-row>
                  </div>
                  <el-divider></el-divider>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="pd32">
                <h3 class="content mb24">作业指导书</h3>
                <div v-html="detail.content"></div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer" v-if="!showNull">
      <el-button type="primary" round @click="dataFormSubmit()">编辑完成</el-button>
    </span>
    <div class="shadow" v-if="showNull">
      <h3 style="line-height:100px;text-align:center;">暂无可编辑项</h3>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      showNull: false,
      visible: false,
      addOrUpdateVisible: false,
      detail: {},
      dataForm: {
        id: "",
        napeid: "",
        projectid: "",
        cpresult: [],
      },
      dataRule: {},
    };
  },
  mounted() { },
  methods: {
    xbplace(ind, e) {
      e = ind == 0 ? e.substring(9, e.length) : "";
      return e
    },
    delThis(e) {
      var list = this.dataForm.cpresult;
      list.splice(e, 1);
      this.dataForm.cpresult = list;
      this.$forceUpdate();
    },
    addNewDetailList() {
      var project = JSON.parse(JSON.stringify(this.detail.cpresult));
      this.dataForm.cpresult.push(project);
      this.$forceUpdate();
    },
    dataFormSubmit() {
      var dataForm = JSON.parse(JSON.stringify(this.dataForm));
      if (this.dataForm.cpresult.length == 0) {
        this.$message.error('请至少添加一个测评对象！');
        return false;
      }
      dataForm.cpresult = JSON.stringify(dataForm.cpresult);
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          console.log("dataFrom", dataForm);
          this.$http({
            url: `/cp/projectuser/editCpobject`,
            method: `POST`,
            data: dataForm,
          }).then(({ data }) => {
            if (data && data.code === 200) {
              // this.visible = false;
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
              });
              this.$emit("refreshDataList");
              this.getDataList(this.dataForm.projectid);
            }
          });
        }
      });
    },
    // 获取数据列表
    getDataList(projectid, cpuid, status) {
      this.visible = true;
      this.detail = {};
      this.dataForm = {
        id: "",
        napeid: "",
        projectid: "",
        cpresult: [],
      };
      this.dataForm.projectid = projectid;
      this.status = status;
      this.$http({
        url: "/cp/nape/dycpdxlist",
        method: "get",
        params: {
          page: 1,
          limit: 1,
          projectid: projectid,
          cpuid: cpuid
        },
      }).then(({ data }) => {
        if (data && data.code === 200) {
          if (data.page.total == 0) {
            this.showNull = true;
            return false;
          } else {
            this.showNull = false;
          }
          var data = data.page.records[0];
          this.dataForm.id = data.cpuid;
          this.dataForm.napeid = data.id;
          data.cpresult = {
            zycd: "",
            cpfs: "",
          };
          this.detail = data;
          this.dataForm.cpresult.push({
            xbName: "",
            zycd: "",
            cpfs: "",
          });
          console.log("dataList", this.detail);
          this.$forceUpdate();
        } else {
        }
      });
    },
  },
};
</script>
<style scope>
.shadow {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  width: 100%;
}
.cpPro {
  line-height: 100px;
  font-size: 24px;
  padding: 0 32px;
}
.pd32 {
  padding: 32px;
}
.br1 {
  border-right: 1px solid rgba(0, 0, 0, 0.1);
}
.mb24 {
  margin-bottom: 24px;
}
.mb12 {
  margin-bottom: 12px;
}
.shadow {
  font-size: 18px;
}
.content {
  display: flex;
  align-items: center;
}
.dib {
  display: inline-block;
}
.el-row {
  width: 100%;
}
.el-radio-group {
  width: 80%;
}
.el-dialog__footer {
  text-align: center !important;
}
.el-dialog__footer button {
  width: 500px;
  height: 40px;
  font-size: 18px;
  font-weight: bold;
}
.content .el-form-item__label {
  font-weight: bold;
}
.el-select-dropdown__item.selected {
  font-weight: normal !important;
  color: #606266 !important;
}
.content .el-form-item {
  width: 100%;
  margin-bottom: 0;
}
.content .el-form-item__error {
  position: absolute;
  bottom: 0;
  left: 0;
}
.fz18 {
  font-size: 18px;
}

[v-cloak] {
  display: none !important;
}
</style>
