<template>
  <el-dialog :title="(status==3? '整体测评':'修改')" :close-on-click-modal="false" :visible.sync="visible" append-to-body width="80%" :close-on-press-escape="false">
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
                </div>
                <div v-for="(item, index) in dataForm.cpresult" :key="'cpresult-' + index">
                  <div class="content mb24">
                    <el-row :gutter="20">
                      <el-col :span="6"> b) 测评对象：</el-col>
                      <el-col :span="18" class="content" v-text="item.xbName"></el-col>
                    </el-row>
                  </div>
                  <div class="content mb24">
                    <el-row :gutter="20">
                      <el-col :span="6"> 重要程度：</el-col>
                      <el-col :span="18" v-text="cepingzycdList.length>0?cepingzycdList[getzycdNumber(item.zycd)].name:''"></el-col>
                    </el-row>
                  </div>
                  <div class="content mb24">
                    <el-row :gutter="20">
                      <el-col :span="6"> 测评方式：</el-col>
                      <el-col :span="18" v-text="cpfs[item.cpfs]"></el-col>
                    </el-row>
                  </div>
                  <div class="content mb24" v-html="detail.xc"></div>
                  <div v-for="(itemm, indexx) in item.project" :key="'project' + indexx">
                    <div class="mb24" v-html="itemm.name"></div>
                    <div class="content">
                      <el-row :gutter="20" class="mb12">
                        <el-form-item :prop="'cpresult.'+index+'.project.'+ indexx + '.checked'" :rules="dataForm.cpresult[index].project[indexx].checked==1?{ required: true,  message: '请选择测评结果', trigger: 'blur' }:[]" label-width="1px">
                          <el-radio-group v-model="itemm.checked" @change="changeRadio(index)">
                            <el-radio label="0">符合</el-radio>
                            <el-radio label="1">不符合</el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </el-row>
                    </div>
                    <div class="content mb24" v-if="dataForm.cpresult[index].project[indexx].checked==1">
                      <el-row :gutter="20" class="content">
                        <el-col :span="6" class="fz16"> 请填写原因：</el-col>
                        <el-col :span="18">
                          <el-form-item :prop="'cpresult.'+index+'.project.'+ indexx + '.value'" :rules="dataForm.cpresult[index].project[indexx].checked==1?{ required: true,  message: '请填写原因', trigger: 'blur' }:[]" label-width="1px">
                            <el-input placeholder="" v-model="itemm.value"></el-input>
                          </el-form-item>
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
                        <el-radio :label="1" :disabled="item.result != 1">符合</el-radio>
                        <el-radio :label="0.5" v-if="detail.isteshu == 0" :disabled="item.result != 0.5">部分符合
                        </el-radio>
                        <el-radio :label="0" :disabled="item.result !== 0">不符合</el-radio>
                      </el-radio-group>
                    </el-form-item>
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
      <el-button type="primary" round @click="dataFormSubmit()">保存</el-button>
    </span>
    <div class="shadow" v-if="showNull">
      <h3 style="line-height:100px;text-align:center;">暂无可测评项</h3>
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
      status: 0,
      cepingzycdList: [],
      cpfs: ['访谈', '核查', '测试', '访谈、核查', '访谈、测试', '核查、测试',],
    };
  },
  mounted() { },
  methods: {
    getzycdNumber(e) {
      for (var i = 0; i < this.cepingzycdList.length; i++) {
        if (e == this.cepingzycdList[i].id) {
          return i;
        }
      }
    },
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
    changeRadio(e) {
      console.log("e", e);
      var project = this.dataForm.cpresult[e].project;
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
      this.dataForm.cpresult[e].result = result;
      this.$forceUpdate();
    },
    addNewDetailList() {
      var project = JSON.parse(JSON.stringify(this.detail.basecpresult));
      this.dataForm.cpresult.push(project);
      this.$forceUpdate();
    },
    dataFormSubmit() {
      var dataForm = JSON.parse(JSON.stringify(this.dataForm));
      if (this.dataForm.cpresult.length == 0) {
        this.$message.error('请至少添加一个测评对象！');
        return false;
      }
      if (this.status == 2) {
        dataForm.xresult = JSON.stringify(dataForm.cpresult)
        dataForm.cpresult = JSON.stringify(this.detail.cpresult);
      } else if (this.status == 1) {
        dataForm.cpresult = JSON.stringify(dataForm.cpresult);
      }
      dataForm = [dataForm]
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          console.log("dataFrom", dataForm);
          var url = `/cp/projectuser`;
          if (this.status == 2) {
            url = `/cp/projectuser/update`;
          } else if (this.status == 1) {
            url = `/cp/projectuser`;
          }
          this.$http({
            url: url,
            method: `post`,
            data: dataForm,
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.visible = false;
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
              });
              this.$emit("refreshDataList");
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
        url: "/cp/nape/dycprwlist",
        method: "get",
        params: {
          page: 1,
          cpnstatus: status,
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
          data.cpresult = JSON.parse(data.cpresult);
          console.log('data', data)
          this.dataForm.id = data.cpuid;
          this.dataForm.napeid = data.id;
          var ii = 1;
          var iii = "xx" + ii;
          var project = [];
          while (data[iii] != undefined) {
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
          data.basecpresult = {
            project: JSON.parse(JSON.stringify(project)),
            result: "",
            zycd: "",
            cpfs: "",
          };
          this.detail = data;
          this.dataForm.cpresult = JSON.parse(JSON.stringify(data.cpresult));
          console.log("this.dataForm.cpresult", this.dataForm.cpresult);
          console.log("dataList", this.detail);
          this.$forceUpdate();
        } else {
        }
      });
      this.$http({
        url: "/cp/param/list1",
        method: "get",
        params: {
        },
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.cepingzycdList = data.data;
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