<template>
  <el-dialog :title="`测评任务`" :close-on-click-modal="false" :visible.sync="visible" append-to-body width="80%" :close-on-press-escape="false">
    <div class="mod-content" v-cloak v-if="!showNull">
      <div class="shadow">
        <div class="cpPro" v-html="'测评师：' + detail.cpsname" v-show="detail.cpsname!=undefined"></div>
      </div>
      <!-- <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"> -->
      <el-form :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()">
        <div class="shadow">
          <el-row :gutter="20" v-for="(ditem,dindex) in dataForm" :key="'dindex'+dindex" style="border-bottom:1px solid rgba(0, 0, 0, 0.1);position: relative;">
            <el-col :span="16">
              <div class="br1 pd32">
                <h3 v-html="detail[dindex].yiceng" v-if="dindex==0"></h3>
                <h4 v-html="detail[dindex].erceng" v-if="dindex==0"></h4>
                <h4 v-html="detail[dindex].sanceng"></h4>
                <h4 v-html="detail[dindex].siceng+dindex"></h4>
                <div class="mb24" v-html="detail[dindex].yaoqiu"></div>
                <div v-for="(item, index) in ditem.cpresult" :key="'cpresult-' + index">
                  <div class="content mb24">
                    <el-row :gutter="20">
                      <el-col :span="6"> b) 测评对象：</el-col>
                      <el-col :span="18" class="content" v-text="item.xbName">
                      </el-col>
                    </el-row>
                  </div>
                  <div class="content mb24">
                    <el-row :gutter="20">
                      <el-col :span="6"> 重要程度：</el-col>
                      <el-col :span="18" v-text="cepingzycdList[item.zycd].name"></el-col>
                    </el-row>
                  </div>
                  <div class="content mb24">
                    <el-row :gutter="20">
                      <el-col :span="6"> 测评方式：</el-col>
                      <el-col :span="18" v-text="cpfs[item.cpfs]"></el-col>
                    </el-row>
                  </div>
                  <div class="content mb24" v-html="detail[dindex].xc"></div>
                  <div v-for="(itemm, indexx) in item.project" :key="'project' + indexx">
                    <div class="mb24" v-html="itemm.name"></div>
                    <div class="content">
                      <el-row :gutter="20" class="mb12">
                        <el-form-item :prop="'cpresult.'+index+'.project.'+ indexx + '.checked'" :rules="{ required: false, message: '请选择测评结果', trigger: 'blur' }" label-width="1px">
                          <el-radio-group v-model="itemm.checked" @change="changeRadio(index,dindex)">
                            <el-radio label="0">符合</el-radio>
                            <el-radio label="1">不符合</el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </el-row>
                    </div>
                    <div class="content mb24">
                      <el-row :gutter="20" class="content">
                        <el-col :span="6" class="fz16"> 请填写原因：</el-col>
                        <el-col :span="18">
                          <el-form-item :prop="'cpresult.'+index+'.project.'+ indexx + '.value'" :rules="{ required: false, message: '请填写原因', trigger: 'blur' }" label-width="1px">
                            <el-input placeholder="" v-model="itemm.value"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                  <el-divider></el-divider>
                  <div class="content mb24" v-html="detail[dindex].xd"></div>
                  <el-divider></el-divider>
                  <div class="content mb24">
                    <el-form-item label="" prop="result">
                      <el-radio-group v-model="item.result">
                        <el-radio :label="1" :disabled="item.result != 1">符合</el-radio>
                        <el-radio :label="0.5" v-if="detail[dindex].isteshu == 0" :disabled="item.result != 0.5">部分符合
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
              <div class="pd32 scrollY">
                <h3 class="content mb24">作业指导书</h3>
                <div v-html="detail[dindex].content"></div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer" v-if="!showNull">
      <el-button type="primary" round @click="dataFormSubmit()">保存并测评下一项</el-button>
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
      detail: [],
      dataForm: [],
      dataRule: {},
      status: 0,
      cepingzycdList: [],
      cpfs: ['访谈', '核查', '测试', '访谈、核查', '访谈、测试', '核查、测试',],
    };
  },
  mounted() { },
  methods: {

    xbplace(ind, e) {
      e = ind == 0 ? e.substring(9, e.length) : "";
      return e
    },
    delThis(e, ii) {
      var list = this.dataForm[ii].cpresult;
      list.splice(e, 1);
      this.dataForm[ii].cpresult = list;
      this.$forceUpdate();
    },
    changeRadio(e, iid) {
      var project = this.dataForm[iid].cpresult[e].project;
      var proFlag = project.some((item) => {
        if (item.checked == "") {
          return true;
        }
      });
      if (proFlag) {
        return false;
      }
      var result = 0;
      if (this.detail[iid].isteshu == 1) {
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
      this.dataForm[iid].cpresult[e].result = result;
      this.$forceUpdate();
    },
    addNewDetailList(i) {
      var project = JSON.parse(JSON.stringify(this.detail[i].cpresult));
      this.dataForm[i].cpresult.push(project);
      this.$forceUpdate();
    },
    dataFormSubmit() {
      var dataForm = JSON.parse(JSON.stringify(this.dataForm));
      // for (var i = 0; i < dataForm.length; i++) {
      //   if (this.dataForm[i].cpresult.length == 0) {
      //     this.$message.error(`请在${this.detail[i].siceng}至少添加一个测评对象！`);
      //     return false;
      //   }
      // }
      for (var i = 0; i < dataForm.length; i++) {
        dataForm[i].cpresult = JSON.stringify(dataForm[i].cpresult);
      }
      // this.$refs["dataForm"].validate((valid) => {
      // if (valid) {
      console.log("dataFrom", dataForm);
      this.$http({
        url: `/cp/projectuser/updates`,
        method: `post`,
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
      // }
      // });
    },
    // 获取数据列表
    getDataList(projectid, cpuid, status) {
      this.visible = true;
      this.detail = [];
      this.dataForm = [];
      this.status = status;
      this.$http({
        url: "/cp/nape/dycprwDetailList",
        method: "get",
        params: {
          cpnstatus: status,
          projectid: projectid,
          cpuid: cpuid
        },
      }).then(({ data }) => {
        if (data && data.code === 200) {
          if (data.data.length == 0) {
            this.showNull = true;
            return false;
          } else {
            this.showNull = false;
          }
          var data = data.data;

          for (var i = 0; i < data.length; i++) {
            data[i].cpresult = JSON.parse(data[i].cpresult)
            console.log("data[i].cpresult", data[i].cpresult);

            var dataForm = {
              id: data[i].cpuid,
              napeid: data[i].id,
              projectid: projectid,
              cpresult: [],
            };
            var ii = 1;
            var iii = "xx" + ii;
            var project = [];
            while (data[i][iii] != undefined) {
              if (data[i][iii] != "") {
                project.push({
                  name: data[i][iii],
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
            for (var cpresulti = 0; cpresulti < data[i].cpresult.length; cpresulti++) {
              data[i].cpresult[cpresulti].project = JSON.parse(JSON.stringify(project));
            }
            dataForm.cpresult = JSON.parse(JSON.stringify(data[i].cpresult));
            this.detail.push(data[i]);
            this.dataForm.push(dataForm);
          }
          console.log("this.dataForm", this.dataForm);
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
.scrollY {
  height: 100%;
  overflow-y: auto;
  height: 100%;
  position: absolute;
}
</style>