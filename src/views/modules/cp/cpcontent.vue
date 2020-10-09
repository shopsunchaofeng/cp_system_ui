<template>
  <div class="mod-content">
    <div class="shadow">
      <div class="cpPro">初级测评师：YH666</div>
    </div>
    <div class="shadow">
      <el-row :gutter="20">
        <el-col :span="16"
          ><div class="br1 pd32">
            <h3>通用要求</h3>
            <h4>7.1.1安全物理环境</h4>
            <h4>7.1.1.1.1测评单元（L2-PES1-01）</h4>
            <div class="mb24">该测评单元包括以下要求：</div>
            <div class="content mb24">
              <el-row :gutter="20">
                <el-col :span="6"> a）测评指标：</el-col>
                <el-col :span="18">
                  机房场地应选择在具有防震、防风和防雨等能力的建筑内
                </el-col>
              </el-row>
            </div>
            <div class="content mb24">
              <el-row :gutter="20">
                <el-col :span="6"> b) 测评对象：</el-col>
                <el-col :span="18"> 记录类文档和机房 </el-col>
              </el-row>
            </div>
            <div class="content mb24">
              <el-row :gutter="20">
                <el-col :span="6"> 具体测评指标：</el-col>
                <el-col :span="18">
                  <el-input
                    placeholder="说明：涉及多项指标的逗号隔开"
                  ></el-input>
                </el-col>
              </el-row>
            </div>
            <div class="mb24">c) 测评实施包括以下内容</div>
            <div v-for="(item, index) in 3" :key="index">
              <div class="mb24">
                1) 应检查所在建筑物是否具有建筑抗震设防审批文档
              </div>
              <div class="content mb24">
                <el-radio-group>
                  <el-row :gutter="20" class="mb12">
                    <el-col :span="6">
                      <el-radio label="1">符合</el-radio>
                    </el-col>
                    <el-col :span="18">
                      <el-input placeholder=""></el-input>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="6">
                      <el-radio label="2">不符合</el-radio>
                    </el-col>
                    <el-col :span="18">
                      <el-input placeholder=""></el-input>
                    </el-col>
                  </el-row>
                </el-radio-group>
              </div>
            </div>
            <el-divider></el-divider>

            <div class="content mb24">
              <el-row :gutter="20">
                <el-col :span="6"> d) 测评实施包括以下内容：</el-col>
                <el-col :span="18"
                  >如果1）-4）均为肯定，则符合测评单元指标要求，
                  否则不符合或部分符合本测评单元指标要求
                </el-col>
              </el-row>
            </div>
            <el-divider></el-divider>
            <div class="content mb24">
              <el-radio-group>
                <el-radio>符合</el-radio>
                <el-radio>部分符合 </el-radio>
                <el-radio>不符合 </el-radio>
              </el-radio-group>
            </div>
          </div></el-col
        >
        <el-col :span="8"><div class="pd32">测评指南</div></el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>
<style>
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
</style>