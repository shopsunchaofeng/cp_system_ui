<template>
  <el-dialog :title="testerData.systemname" :close-on-click-modal="false" :visible.sync="visible" append-to-body width="80%" :close-on-press-escape="false">
    <div class="mod-content">
      <el-row :gutter="20">
        <el-col :span="12" v-for="(item, index) in testerData.danyuanArray" :key="index" style="margin-bottom: 20px">
          <div class="shadow">
            <el-table :data="item.ercengArray" stripe border style="width: 100%">
              <el-table-column label="测评单元" width="180" prop="ercengname">
              </el-table-column>
              <el-table-column :label="item.cpuser">
                <template slot-scope="scope">
                  <el-row :gutter="20" v-for="(itemm, indexx) in scope.row.sancengArray" :key="indexx" style="margin-bottom: 20px">
                    <el-col :span="8" v-text="itemm.sancengname"> </el-col>
                    <el-col :span="12">
                      <span v-for="(labelitem,labelIndex) in itemm.danyuanArray" v-text="memovefh(labelitem.siceng) + (labelIndex!=itemm.danyuanArray.length-1?'、':'')" :key="labelIndex"></span>
                    </el-col>
                    <el-col :span="4" v-text="itemm.sancengScore"> </el-col>
                  </el-row>
                  <div>总分： {{ scope.row.ercengCpscore }}</div>
                </template>
              </el-table-column>
            </el-table>
            <el-container>
              <el-main>
                <el-col :span="16">
                  <el-row style="margin-bottom: 20px">
                    <el-col :span="24"> 低风险：{{ item.df }} </el-col>
                  </el-row>
                  <el-row style="margin-bottom: 20px">
                    <el-col :span="24"> 中风险：{{ item.zf }} </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24"> 高风险：{{ item.gf }} </el-col>
                  </el-row>
                </el-col>
              </el-main>
              <el-aside>总分：{{ item.zscore }} </el-aside>
            </el-container>
          </div>
        </el-col>
      </el-row>
      <div class="shadow" v-if="testerData.zhengtiCp">
        <table style="width: 100%" border="1" cellspacing="0" cellpadding="0" class="midtable">
          <tr>
            <th style="width: 140px">测评单元</th>
            <th colspan="5">整体测评</th>
          </tr>
          <tr>
            <th>不适合项：</th>
            <td>{{testerData.zhengtiCp.bshNum}}项</td>
            <td colspan="4">
              <div v-for="(item,index) in testerData.zhengtiCp.bshList" :key="index" style="display:inline-block;margin-right:10px;">
                (<span style="font-weight: bold;">{{item.sancengname}}</span> <span v-for="(itemm,indexx) in item.danyuanArray" :key="indexx">{{memovefh(itemm.siceng)}}{{indexx!=item.danyuanArray.length-1?'、':''}}</span>)
              </div>

            </td>
          </tr>
          <tr>
            <th></th>
            <th style="width: 100px">分值</th>
            <th style="width: 100px">高</th>
            <th style="width: 100px">中</th>
            <th style="width: 100px">低</th>
            <th></th>
          </tr>
          <tr v-for="(item,index) in testerData.zhengtiCp.zhengtiArray" :key="index">
            <th v-text="item.ercengname">{{item.ercengname}}</th>
            <td v-text="item.ercengXscore"></td>
            <td v-text="item.gf"></td>
            <td v-text="item.zf"></td>
            <td v-text="item.df"></td>
            <td>
              <div v-for="(itemm,indexx) in item.sancengArray" :key="indexx" style="display:inline-block;margin-right:10px;">
                (<span style="font-weight: bold;">{{itemm.sancengname}}</span> <span v-for="(itemmm,indexxx) in itemm.danyuanArray" :key="indexxx">{{memovefh(itemmm.siceng)}}{{indexxx!=itemm.danyuanArray.length-1?'、':''}}</span>)
              </div>
            </td>
          </tr>
          <tr>
            <th>总分</th>
            <td>{{testerData.zhengtiCp.danyuanXscore}}</td>
            <td>{{testerData.zhengtiCp.gf}}</td>
            <td>{{testerData.zhengtiCp.zf}}</td>
            <td>{{testerData.zhengtiCp.df}}</td>
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
      testerData: {},
    };
  },
  mounted() {
    // this.myEcharts();
  },
  methods: {
    memovefh(e) {
      var e = e;
      if (e != null && e != "") {
        var reg = /[\u4e00-\u9fa5]/g;
        e = e.replace(reg, "");
        e = e.replace(/[\（|\）]/g, "");
        return e
      }
      else
        return "";

    },
    // 获取数据列表
    getDataList(projectid) {
      this.visible = true;
      this.$http({
        url: "/cp/projectuser/jieguo",
        method: "get",
        params: {
          projectid: projectid,
        },
      }).then(({ data }) => {
        if (data && data.code === 200) {
          console.log('data', data)
          this.testerData = data.data;
          this.myEcharts();
          this.$forceUpdate();
        } else {
        }
      });
    },
    myEcharts() {
      var xAxisData = [], seriesData = [], zhengtiArray = this.testerData.zhengtiCp.zhengtiArray;
      for (var i = 0; i < zhengtiArray.length; i++) {
        xAxisData.push(zhengtiArray[i].ercengname)
        seriesData.push(zhengtiArray[i].ercengXscore)
      }
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById("main"));
                          var endPercent = (6 / xAxisData.length) * 100;
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: "整体测评结果",
        },
        tooltip: {},
        legend: {
          data: ["数量"],
        },
        xAxis: {
          data: xAxisData,
        },
        dataZoom: [//给x轴设置滚动条  
          {
            start: 0,//默认为0  
            end: endPercent,
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            handleSize: 0,//滑动条的 左右2个滑动条的大小  
            height: 8,//组件高度  
            left: 50, //左边的距离  
            right: 40,//右边的距离  
            bottom: 26,//右边的距离  
            handleColor: '#ddd',//h滑动图标的颜色  
            handleStyle: {
              borderColor: "#cacaca",
              borderWidth: "1",
              shadowBlur: 2,
              background: "#ddd",
              shadowColor: "#ddd",
            },
            backgroundColor: '#ddd',//两边未选中的滑动条区域的颜色  
            showDataShadow: false,//是否显示数据阴影 默认auto  
            showDetail: false,//即拖拽时候是否显示详细数值信息 默认true  
            handleIcon: 'M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z',
            filterMode: 'filter'
          },
          //下面这个属性是里面拖到  
          {
            type: 'inside',
            show: true,
            xAxisIndex: [0],
            start: 0,//默认为1  
            end: 50
          },
        ],
        yAxis: {},
        series: [
          {
            name: "数量",
            type: "bar",
            barWidth: 50,
            data: seriesData,
            label: {
              show: true, // 开启显示
              rotate: 0, // 旋转70度
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
  font-size: 14px !important;
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