<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item label="所属分组" prop="groupName">
        <el-popover
          ref="paramgroupListPopover"
          placement="top-start"
          trigger="click">
          <el-tree
            :data="paramgroupList"
            :props="paramgroupListTreeProps"
            node-key="groupId"
            ref="paramgroupTree"
            @current-change="paramgroupTreeCurrentChangeHandle"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.groupName" v-popover:paramgroupListPopover :readonly="true" placeholder="点击选择分组"
                  class="paramgroup-list__input"></el-input>
      </el-form-item>
      <el-form-item label="字典名称" prop="paramName">
        <el-input v-model="dataForm.paramName" placeholder="字典名称"></el-input>
      </el-form-item>
      <el-form-item label="字典值" prop="paramValue">
        <el-input v-model="dataForm.paramValue" placeholder="字典值"></el-input>
      </el-form-item>
      <el-form-item label="排序号" prop="orderNum">
        <el-input-number v-model="dataForm.orderNum" placeholder="排序号"></el-input-number>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio border :label="1">正常</el-radio>
          <el-radio border :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        groupWrong: '',
        dataForm: {
          id: 0,
          groupId: '',
          groupName: '',
          paramName: '',
          paramValue: '',
          orderNum: 0,
          status: 1,
          remark: ''
        },
        paramgroupList: [],
        paramgroupListTreeProps: {
          label: 'name',
          children: 'children'
        },
        dataRule: {
          paramName: [
            {required: true, message: '字典名称不能为空', trigger: 'blur'}
          ],
          paramValue: [
            {required: true, message: '字典值不能为空', trigger: 'blur'}
          ],
          groupName: [
            {required: true, message: '所属分组不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (id, groupId) {
        this.dataForm.id = id || ''
        this.dataForm.groupId = groupId
        this.$http({
          url: '/base/paramgroup/find',
          method: 'get',
          loading: false
        }).then(({data}) => {
          this.paramgroupList = this.treeDataTranslate(data.paramgroupList, 'groupId')
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: `/base/param/${this.dataForm.id}`,
              method: 'get'
            }).then(({data}) => {
              if (data && data.code === 200) {
                data.data.groupName = ''
                this.dataForm = data.data
                this.paramgroupTreeSetCurrentNode()
              }
            })
          } else {
            this.paramgroupTreeSetCurrentNode()
          }
        })
      },
      // 参数组树选中
      paramgroupTreeCurrentChangeHandle (data, node) {
        this.dataForm.groupId = data.groupId
        this.dataForm.groupName = data.name
      },
      // 菜单树设置当前选中节点
      paramgroupTreeSetCurrentNode () {
        if (this.dataForm.groupId) {
          this.$refs.paramgroupTree.setCurrentKey(this.dataForm.groupId)
          this.dataForm.groupName = (this.$refs.paramgroupTree.getCurrentNode() || {})['name']
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (this.dataForm.groupId === 0) {
              this.$message({
                message: '顶级目录不允许选择',
                type: 'warning',
                duration: 1500
              })
              return false
            }
            this.$http({
              url: `/base/param`,
              method: `${!this.dataForm.id || 0 ? 'post' : 'put'}`,
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

<style lang="scss">

  .paramgroup-list__input{

    > .el-input__inner {
      cursor: pointer;
    }

  }

</style>
