<template>
  <el-dialog :title="`测评任务`" :close-on-click-modal="false" :visible.sync="visible" append-to-body width="80%" :close-on-press-escape="false">
    <div class="mod-content">
      <el-row :gutter="20">
        <el-col :span="12" v-for="(item, index) in testerData" :key="index" style="margin-bottom: 20px">
          <div class="shadow">
            <el-table :data="item.project" stripe border style="width: 100%">
              <el-table-column label="测评单元" width="180" prop="name">
              </el-table-column>
              <el-table-column :label="item.testerLevel + item.testerName">
                <template slot-scope="scope">
                  <el-row :gutter="20" v-for="(itemm, indexx) in scope.row.value" :key="indexx" style="margin-bottom: 20px">
                    <el-col :span="8" v-text="itemm.name"> </el-col>
                    <el-col :span="12" v-text="itemm.lable"> </el-col>
                    <el-col :span="4" v-text="itemm.value"> </el-col>
                  </el-row>
                  <div>总分： {{ scope.row.total }}</div>
                </template>
              </el-table-column>
            </el-table>
            <el-container>
              <el-main>
                <el-col :span="16">
                  <el-row style="margin-bottom: 20px">
                    <el-col :span="24"> 低风险：{{ item.difengxian }} </el-col>
                  </el-row>
                  <el-row style="margin-bottom: 20px">
                    <el-col :span="24"> 中风险：{{ item.zhongfengxian }} </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24"> 高风险：{{ item.gaofengxian }} </el-col>
                  </el-row>
                </el-col>
              </el-main>
              <el-aside>总分：{{ item.total }} </el-aside>
            </el-container>
          </div>
        </el-col>
      </el-row>
      <div class="shadow">
        <table style="width: 100%" border="1" cellspacing="0" cellpadding="0" class="midtable">
          <tr>
            <th style="width: 140px">测评单元</th>
            <th colspan="5">整体测评</th>
          </tr>
          <tr>
            <th>不适合项：</th>
            <td>26项</td>
            <td colspan="4">(物理位置选择 L2-PES1-01)</td>
          </tr>
          <tr>
            <th></th>
            <th style="width: 100px">分值</th>
            <th style="width: 100px">高</th>
            <th style="width: 100px">中</th>
            <th style="width: 100px">低</th>
            <th></th>
          </tr>
          <tr>
            <th>安全通讯网络</th>
            <td>0.5</td>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>物理位置选择 L2-PES1-01</td>
          </tr>
          <tr>
            <th>总分</th>
            <td>85</td>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td></td>
          </tr>
        </table>
      </div>
      <div class="shadow">
        <div id="main" style="width: 100%; height: 400px"></div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,

      testerData: [
        {
          testerName: "张明慧",
          testerLevel: "中级测评师",
          project: [
            {
              name: "安全物理环境",
              value: [
                {
                  name: "物理位置选择",
                  lable: "L2-PES1-01 L2-PES1-01",
                  value: 1.5,
                },
                {
                  name: "物理访问控制",
                  lable: "L2-PES1-01 L2-PES1-01",
                  value: 1.6,
                },
              ],
              total: 6.5,
            },
            {
              name: "安全区域边界",
              value: [
                {
                  name: "物理位置选择1",
                  lable: "L2-PES1-01 L2-PES1-01",
                  value: 1.5,
                },
                {
                  name: "物理访问控制1",
                  lable: "L2-PES1-01 L2-PES1-01",
                  value: 1.6,
                },
              ],
              total: 6.5,
            },
            {
              name: "安全计算环境",
              value: [
                {
                  name: "物理位置选择2",
                  lable: "L2-PES1-01 L2-PES1-01",
                  value: 1.5,
                },
                {
                  name: "物理访问控制2",
                  lable: "L2-PES1-01 L2-PES1-01",
                  value: 1.6,
                },
              ],
              total: 6.5,
            },
          ],
          difengxian: 18,
          zhongfengxian: 18,
          gaofengxian: 18,
          total: 35,
        },
        {
          testerName: "王毅",
          testerLevel: "中级测评师",
          project: [
            {
              name: "安全物理环境",
              value: [
                {
                  name: "物理位置选择",
                  lable: "L2-PES1-01 L2-PES1-01",
                  value: 1.5,
                },
                {
                  name: "物理访问控制",
                  lable: "L2-PES1-01 L2-PES1-01",
                  value: 1.6,
                },
              ],
              total: 6.5,
            },
            {
              name: "安全区域边界",
              value: [
                {
                  name: "物理位置选择1",
                  lable: "L2-PES1-01 L2-PES1-01",
                  value: 1.5,
                },
                {
                  name: "物理访问控制1",
                  lable: "L2-PES1-01 L2-PES1-01",
                  value: 1.6,
                },
              ],
              total: 6.5,
            },
            {
              name: "安全计算环境",
              value: [
                {
                  name: "物理位置选择2",
                  lable: "L2-PES1-01 L2-PES1-01",
                  value: 1.5,
                },
                {
                  name: "物理访问控制2",
                  lable: "L2-PES1-01 L2-PES1-01",
                  value: 1.6,
                },
              ],
              total: 6.5,
            },
          ],
          difengxian: 18,
          zhongfengxian: 18,
          gaofengxian: 18,
          total: 35,
        },
        {
          testerName: "王毅1",
          testerLevel: "中级测评师1",
          project: [
            {
              name: "安全物理环境",
              value: [
                {
                  name: "物理位置选择",
                  lable: "L2-PES1-01 L2-PES1-01",
                  value: 1.5,
                },
                {
                  name: "物理访问控制",
                  lable: "L2-PES1-01 L2-PES1-01",
                  value: 1.6,
                },
              ],
              total: 6.5,
            },
            {
              name: "安全区域边界",
              value: [
                {
                  name: "物理位置选择1",
                  lable: "L2-PES1-01 L2-PES1-01",
                  value: 1.5,
                },
                {
                  name: "物理访问控制1",
                  lable: "L2-PES1-01 L2-PES1-01",
                  value: 1.6,
                },
              ],
              total: 6.5,
            },
            {
              name: "安全计算环境",
              value: [
                {
                  name: "物理位置选择2",
                  lable: "L2-PES1-01 L2-PES1-01",
                  value: 1.5,
                },
                {
                  name: "物理访问控制2",
                  lable: "L2-PES1-01 L2-PES1-01",
                  value: 1.6,
                },
              ],
              total: 6.5,
            },
          ],
          difengxian: 55,
          zhongfengxian: 44,
          gaofengxian: 11,
          total: 32,
        },
      ],
    };
  },
  mounted() {
    this.myEcharts();
  },
  methods: {

    // 获取数据列表
    getDataList(projectid) {
      this.visible = true;
      this.$http({
        url: "/cp/projectuser/huizong",
        method: "get",
        params: {
          projectid: projectid,
        },
      }).then(({ data }) => {
        if (data && data.code === 200) {
          console.log('data', data)
          this.$forceUpdate();
        } else {
        }
      });
    },
    myEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById("main"));
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: "达标个数",
        },
        tooltip: {},
        legend: {
          data: ["销量"],
        },
        xAxis: {
          data: [
            "安全物理环境",
            "安全通信网络",
            "安全区域边界",
            "安全计算环境",
            "安全管理中心",
            "安全管理制度",
            "安全管理机构",
            "安全管理人员",
            "安全运维管理",
          ],
        },
        yAxis: {},
        series: [
          {
            name: "达标个数",
            type: "bar",
            barWidth: 50,
            data: [5, 20, 36, 10, 10, 20, 20, 20, 20],
            label: {
              show: true, // 开启显示
              rotate: 70, // 旋转70度
              position: "top", // 在上方显示
              distance: 20, // 距离图形元素的距离。当 position 为字符描述值（如 'top'、'insideRight'）时候有效。
              verticalAlign: "middle",
              textStyle: {
                // 数值样式
                color: "black",
                fontSize: 12,
              },
            },
          },
        ],
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
  },
};
</script>
<style scoped>
.el-button {
  margin-bottom: 10px;
}
.el-table {
  font-size: 16px !important;
}
.shadow {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  width: 100%;
}
.el-main {
  border-right: 1px solid rgb(235, 238, 245);
}
.el-aside {
  display: flex;
  align-items: center;
  justify-content: center;
}
.midtable {
  width: 100%;
  border-collapse: collapse;
  border-color: rgb(235, 238, 245);
  margin-bottom: 32px;
}
.midtable tr th,
.midtable tr td {
  border-color: rgb(235, 238, 245);
}
.midtable th,
.midtable td {
  height: 40px;
}
.midtable td {
  padding: 0 32px;
}
</style>