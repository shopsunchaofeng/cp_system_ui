<template>
  <el-dialog
    :title="`测评任务`"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="80%"
    :close-on-press-escape="false"
  >
    <div class="mod-content">
      <div class="shadow">
        <div class="cpPro" v-html="'测评师：' + detail.cpsname"></div>
      </div>
      <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
        @keyup.enter.native="dataFormSubmit()"
      >
        <div class="shadow">
          <el-row :gutter="20">
            <el-col :span="16"
              ><div class="br1 pd32">
                <h3 v-html="detail.yiceng"></h3>
                <h4 v-html="detail.erceng"></h4>
                <h4 v-html="detail.sanceng"></h4>
                <h4 v-html="detail.siceng"></h4>
                <div class="mb24" v-html="detail.yaoqiu"></div>
                <div class="content mb24">
                  <span v-html="detail.xa"></span>
                  <el-button
                    type="primary"
                    round
                    icon="el-icon-circle-plus-outline"
                    style="margin-left: 10px"
                    @click="addNewDetailList()"
                    >添加新的测评项</el-button
                  >
                </div>

                <div class="content mb24" v-html="detail.xb"></div>
                <div class="content mb24">
                  <el-row :gutter="20">
                    <el-col :span="6"> 具体测评指标：</el-col>
                    <el-col :span="18">
                      <el-input
                        placeholder="说明：涉及多项指标的逗号隔开"
                        v-model="detail.juticpzb"
                      ></el-input>
                    </el-col>
                  </el-row>
                </div>
                <div class="content mb24" v-html="detail.xc"></div>
                <div v-for="(item, index) in detail.project" :key="index">
                  <div class="mb24" v-html="item.name"></div>
                  <div class="content">
                    <el-row :gutter="20" class="mb12">
                      <el-radio-group
                        v-model="item.checked"
                        @change="changeRadio(-1)"
                      >
                        <el-radio label="0">符合</el-radio>
                        <el-radio label="1">不符合</el-radio>
                      </el-radio-group>
                    </el-row>
                  </div>
                  <div class="content mb24">
                    <el-row :gutter="20" class="content">
                      <el-col :span="6" class="fz16"> 请填写原因：</el-col>
                      <el-col :span="18">
                        <el-input
                          placeholder=""
                          v-model="item.value"
                        ></el-input>
                      </el-col>
                    </el-row>
                  </div>
                </div>

                <el-divider></el-divider>
                <div class="content mb24" v-html="detail.xd"></div>
                <el-divider></el-divider>
                <div class="content mb24">
                  <el-form-item label="" prop="result">
                    <el-radio-group v-model="detail.result">
                      <el-radio :label="1" :disabled="detail.result != 1"
                        >符合</el-radio
                      >
                      <el-radio
                        :label="0.5"
                        v-if="detail.isteshu == 0"
                        :disabled="detail.result != 0.5"
                        >部分符合
                      </el-radio>
                      <el-radio :label="0" :disabled="detail.result !== 0"
                        >不符合
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div>
                <el-divider></el-divider>

                <div
                  v-for="(item, index) in newDetailList"
                  :key="'newDetailList' + index"
                >
                  <div class="content mb24">
                    <el-row :gutter="20">
                      <el-col :span="6"> b) 测评对象：</el-col>
                      <el-col :span="18" class="content">
                        <el-input
                          placeholder=""
                          v-model="item.xbName"
                        ></el-input>

                        <el-button
                          type="danger"
                          round
                          icon="el-icon-delete"
                          style="margin-left: 10px"
                          @click="delThis(index)"
                          >删除</el-button
                        >
                      </el-col>
                    </el-row>
                  </div>
                  <div class="content mb24">
                    <el-row :gutter="20">
                      <el-col :span="6"> 具体测评指标：</el-col>
                      <el-col :span="18">
                        <el-input
                          placeholder="说明：涉及多项指标的逗号隔开"
                          v-model="item.juticpzb"
                        ></el-input>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="content mb24" v-html="detail.xc"></div>
                  <div
                    v-for="(itemm, indexx) in item.project"
                    :key="'project' + indexx"
                  >
                    <div class="mb24" v-html="itemm.name"></div>
                    <div class="content">
                      <el-row :gutter="20" class="mb12">
                        <el-radio-group
                          v-model="itemm.checked"
                          @change="changeRadio(index)"
                        >
                          <el-radio label="0">符合</el-radio>
                          <el-radio label="1">不符合</el-radio>
                        </el-radio-group>
                      </el-row>
                    </div>
                    <div class="content mb24">
                      <el-row :gutter="20" class="content">
                        <el-col :span="6" class="fz16"> 请填写原因：</el-col>
                        <el-col :span="18">
                          <el-input
                            placeholder=""
                            v-model="itemm.value"
                          ></el-input>
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                  <el-divider></el-divider>
                  <div class="content mb24" v-html="detail.xd"></div>
                  <el-divider></el-divider>
                  <div class="content mb24">
                    <el-form-item label="" prop="result">
                      <el-radio-group v-model="item.result">
                        <el-radio :label="1" :disabled="item.result != 1"
                          >符合</el-radio
                        >
                        <el-radio
                          :label="0.5"
                          v-if="detail.isteshu == 0"
                          :disabled="item.result != 0.5"
                          >部分符合
                        </el-radio>
                        <el-radio :label="0" :disabled="item.result !== 0"
                          >不符合</el-radio
                        >
                      </el-radio-group>
                    </el-form-item>
                  </div>
                  <el-divider></el-divider>
                </div></div
            ></el-col>
            <el-col :span="8"
              ><div class="pd32">
                <h3 class="content mb24">作业指导书</h3>
                <div v-html="detail.content"></div></div
            ></el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" round @click="dataFormSubmit()"
        >保存并测评下一项</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      addOrUpdateVisible: false,
      detail: {},
      newDetailList: [],
      dataForm: {
        id: "",
        napeid: "",
        projectid: "",
        cpresult: {},
      },
      dataRule: {
        // result: [{ required: true, message: "结果不能为空", trigger: "blur" }],
      },
    };
  },
  mounted() {},
  methods: {
    delThis(e) {
      var list = this.newDetailList;
      list.splice(e, 1);
      this.newDetailList = list;
      this.$forceUpdate();
    },
    changeRadio(e) {
      console.log("e", e);
      var project;
      if (e == -1) {
        project = this.detail.project;
      } else {
        project = this.newDetailList[e].project;
      }
      var proFlag = project.some((item) => {
        if (item.checked == "") {
          return true;
        }
      });
      if (proFlag) {
        return false;
      }
      var result = 0;
      if (this.detail.isteshu == 1) {
        for (var i = 0; i < project.length; i++) {
          if (project[i].checked != 1) {
            result = 1;
          }
        }
      } else {
        for (var i = 0; i < project.length; i++) {
          if (project[i].checked != 1) {
            result = 1;
            for (var ii = 0; ii < project.length; ii++) {
              if (project[ii].checked == 1) {
                result = 0.5;
              }
            }
          }
        }
      }
      console.log("result", result);

      if (e == -1) {
        this.detail.result = result;
      } else {
        this.newDetailList[e].result = result;
      }
      this.$forceUpdate();
    },
    addNewDetailList() {
      var project = JSON.parse(JSON.stringify(this.detail.project));
      this.newDetailList.push({
        juticpzb: "",
        xbName: "",
        project: project,
        result: "",
      });
    },
    dataFormSubmit() {
      var dataForm = this.dataForm;
      var cpresult = [];
      var baseproject = {};
      baseproject.project = this.detail.project;
      baseproject.result = this.detail.result;
      baseproject.juticpzb = this.detail.juticpzb;

      cpresult.push(baseproject);
      if (this.newDetailList.length > 0) {
        for (var i = 0; i < this.newDetailList.length; i++) {
          cpresult.push(this.newDetailList[i]);
        }
      }

      dataForm.cpresult = JSON.stringify(cpresult);

      console.log("dataFrom", dataForm);
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.$http({
            url: `/cp/projectuser`,
            method: `${!dataForm.id || 0 ? "post" : "put"}`,
            data: dataForm,
          }).then(({ data }) => {
            if (data && data.code === 200) {
              // this.visible = false;
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
              });
              this.getDataList(this.dataForm.projectid);
              // this.$emit("refreshDataList");
            }
          });
        }
      });
    },
    // 获取数据列表
    getDataList(projectid) {
      this.visible = true;
      this.dataForm.projectid = projectid;
      this.$http({
        url: "/cp/nape/dycprwlist",
        method: "get",
        params: {
          page: 1,
          limit: 1,
          projectid: projectid,
        },
      }).then(({ data }) => {
        if (data && data.code === 200) {
          var data = data.page.records[0];
          this.dataForm.id = data.cpuid;
          this.dataForm.napeid = data.id;
          var ii = 1;
          var iii = "xx" + ii;
          var project = [];
          while (data[iii] != undefined) {
            console.log(data[iii]);
            if (data[iii] != "") {
              project.push({
                name: data[iii],
                checked: "",
                value: "",
              });
            }
            ii++;
            iii = "xx" + ii;
          }
          if (project.length == 0) {
            project.push({
              name: "",
              checked: "",
              value: "",
            });
          }
          data.project = project;
          console.log("project", project);
          data.result = "";
          data.juticpzb = "";
          this.detail = data;
          console.log("dataList", this.detail);
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
.el-form-item__label {
  font-weight: bold;
}
.el-select-dropdown__item.selected {
  font-weight: normal !important;
  color: #606266 !important;
}
.el-form-item {
  width: 100%;
}
.fz18 {
  font-size: 18px;
}
</style>