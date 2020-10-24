<template>
  <el-dialog :title="`测评任务-非测评机构`" :close-on-click-modal="false" :visible.sync="visible" append-to-body width="80%" :close-on-press-escape="false">
    <div class="mod-content" v-cloak v-if="!showNull">
      <div class="shadow">
        <div class="cpPro" v-html="'测评师：' + detail.cpsname" v-show="detail.cpsname!=undefined"></div>
      </div>
      <el-form :rules="dataRule" :model="dataFormw" ref="dataForm" @keyup.enter.native="dataFormSubmit()">
        <div class="shadow">
          <el-row :gutter="20" v-for="(ditem,dindex) in dataFormw.dataForm" :key="'dindex'+dindex" style="border-bottom:1px solid rgba(0, 0, 0, 0.1);position: relative;">
            <el-col :span="16">
              <div class="br1 pd32">
                <h3 v-html="detail[dindex].yiceng" v-if="dindex==0"></h3>
                <h4 v-html="detail[dindex].erceng" v-if="dindex==0"></h4>
                <h4 v-html="detail[dindex].sanceng"></h4>
                <h4 v-html="detail[dindex].siceng+dindex"></h4>
                <div class="mb24" v-html="detail[dindex].yaoqiu"></div>
                <div class="content mb24">
                  <span v-html="detail[dindex].xa"></span>
                  <el-button type="primary" round icon="el-icon-circle-plus-outline" style="margin-left: 10px" @click="addNewDetailList(dindex)">添加新的测评对象</el-button>
                </div>
                <div v-for="(item, index) in ditem.cpresult" :key="'cpresult-' + index">
                  <div class="content mb24">
                    <el-row :gutter="20">
                      <el-col :span="6"> b) 测评对象：</el-col>
                      <el-col :span="18" class="content">
                        <el-form-item :prop="'dataForm.'+dindex+'.cpresult.'+ index + '.xbName'" :rules="{ required: false, message: '测评对象不能为空', trigger: 'blur' }" label-width="1px">
                          <el-input v-model="item.xbName" :placeholder="xbplace(index,detail[dindex].xb)"></el-input>
                        </el-form-item>
                        <el-button type="danger" round icon="el-icon-delete" style="margin-left: 10px" @click="delThis(index,dindex)">删除</el-button>
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
      dataFormw: {
        dataForm: [],
      },
      dataRule: {},
      status: 0,
      cepingzycdList: [],
    };
  },
  mounted() { },
  methods: {

    xbplace(ind, e) {
      e = ind == 0 ? e.substring(9, e.length) : "";
      return e
    },
    delThis(e, ii) {
      var list = this.dataFormw.dataForm[ii].cpresult;
      list.splice(e, 1);
      this.dataFormw.dataForm[ii].cpresult = list;
      this.$forceUpdate();
    },
    changeRadio(e, iid) {
      var project = this.dataFormw.dataForm[iid].cpresult[e].project;
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
      this.dataFormw.dataForm[iid].cpresult[e].result = result;
      this.$forceUpdate();
    },
    addNewDetailList(i) {
      var project = JSON.parse(JSON.stringify(this.detail[i].cpresult));
      this.dataFormw.dataForm[i].cpresult.push(project);
      this.$forceUpdate();
    },
    dataFormSubmit() {
      var dataForm = JSON.parse(JSON.stringify(this.dataFormw.dataForm));
      for (var i = 0; i < dataForm.length; i++) {
        if (this.dataFormw.dataForm[i].cpresult.length == 0) {
          this.$message.error(`请在${this.detail[i].siceng}至少添加一个测评对象！`);
          return false;
        }
      }
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
          this.getDataList(this.dataFormw.dataForm[0].projectid, '', 0);
        }
      });
      // }
      // });
    },
    // 获取数据列表
    getDataList(projectid, cpuid, status) {
      this.visible = true;
      this.detail = [];
      this.dataFormw.dataForm = [];
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
        console.log('data', data);
        if (data && data.code === 200) {
          if (data.data.length == 0) {
            this.showNull = true;
            return false;
          } else {
            this.showNull = false;
          }
          var data = data.data;

          for (var i = 0; i < data.length; i++) {
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
            data[i].cpresult = {
              project: JSON.parse(JSON.stringify(project)),
              result: 0,
              zycd: "",
              cpfs: "",
            };
            console.log("project", dataForm);
            dataForm.cpresult.push({
              project: JSON.parse(JSON.stringify(project)),
              result: 0,
              xbName: "",
              zycd: "",
              cpfs: "",
            });
            this.detail.push(data[i]);
            this.dataFormw.dataForm.push(dataForm);
          }
          console.log("this.dataFormw.dataForm.cpresult", this.dataFormw.dataForm);
          console.log("dataList", this.detail);
          this.$http({
            url: "/cp/param/list1",
            method: "get",
            params: {
            },
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.cepingzycdList = data.data;
              console.log('this.cepingzycdList', this.cepingzycdList);
            } else {
            }
          });
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