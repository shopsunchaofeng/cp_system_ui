<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="100px">
             
      <el-form-item label="任务类型" prop="jobType">
        <el-radio-group v-model="dataForm.jobType">
          <el-radio v-for="(type, index) in jobTypeList" :label="index" :key="index">{{ type }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="任务名称" prop="jobName">
        <el-input v-model="dataForm.jobName" placeholder="任务名称"></el-input>
      </el-form-item>
      <el-form-item label="bean name" prop="beanName" v-if="dataForm.jobType==0" >
        <el-input v-model="dataForm.beanName" placeholder="填写Spring bean name"></el-input>
      </el-form-item>
      <el-form-item label="执行内容" prop="method">
        <el-input v-model="dataForm.method" placeholder="任务类型为springBean时,填写方法名；类时,填写类路径；URL时,填写URL地址；SQL时,填写SQL文"></el-input>
      </el-form-item>
      <el-form-item label="参数" prop="params">
        <el-input v-model="dataForm.params" placeholder="参数"></el-input>
      </el-form-item>
      <el-form-item style="margin-top: -10px; margin-bottom:0px;">
       <cron v-if="showCronBox" v-model="dataForm.cron"></cron>
       <span style="color: #E6A23C; font-size: 12px;">corn从左到右（用空格隔开）：秒 分 小时 月份中的日期 月份 星期中的日期 年份</span>
     </el-form-item>
     <el-form-item label="cron表达式" prop="cron">
       <el-input v-model="dataForm.cron" auto-complete="off">
          <el-button slot="append" v-if="!showCronBox" icon="el-icon-arrow-up" @click="showCronBox = true" title="打开图形配置"></el-button>
          <el-button slot="append" v-else icon="el-icon-arrow-down" @click="showCronBox = false" title="关闭图形配置"></el-button>
       </el-input>
     </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio v-for="item in statusList" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import cron from '@/components/cron'

  export default {
    components: {
      cron
    },
    data () {
      return {
        visible: false,
        showCronBox: false,
        dataForm: {
          id: undefined,
          jobType: 0,
          jobName: '',
          beanName: '',
          method: '',
          params: '',
          cron: '',
          remark: '',
          status: 1
        },
        jobTypeList: ['springBean', '类', 'URL', 'SQL'],
        jobLib: ['bean名称', '类路径', 'URL地址', 'SQL语句'],
        statusList: [{
          value: 1,
          label: '启用'
        }, {
          value: 0,
          label: '暂停'
        }],
        dataRule: {
          jobType: [
            {required: true, message: '请选择任务类型', trigger: 'blur'}
          ],
          jobName: [
            {required: true, message: '任务名称不能为空', trigger: 'blur'}
          ],
          beanName: [
            {required: true, message: 'bean name不能为空', trigger: 'blur'}
          ],
          method: [
            {required: true, message: '执行内容不能为空', trigger: 'blur'}
          ],
          cron: [
            {required: true, message: 'cron表达式不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || undefined
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: `/job/detail/${this.dataForm.id}`,
              method: 'get'
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm = data.data
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: `/job/detail`,
              method: `${!this.dataForm.id ? 'post' : 'put'}`,
              data: this.dataForm
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500
                })
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          }
        })
      }
    }
  }
</script>
