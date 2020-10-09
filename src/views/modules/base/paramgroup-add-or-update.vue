<template>
  <el-dialog
    :title="!dataForm.groupId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item label="分组编码" prop="groupCode">
        <el-input v-model="dataForm.groupCode" placeholder="分组编码"></el-input>
      </el-form-item>
      <el-form-item label="分组名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="分组名称"></el-input>
      </el-form-item>
      <el-form-item label="上级目录" prop="parentName">
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
        <el-input v-model="dataForm.parentName" v-popover:paramgroupListPopover :readonly="true" placeholder="点击选择上级目录"
                  class="paramgroup-list__input"></el-input>
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
        dataForm: {
          groupId: 0,
          groupCode: '',
          name: '',
          parentId: 0,
          parentName: '',
          remark: ''
        },
        paramgroupList: [],
        paramgroupListTreeProps: {
          label: 'name',
          children: 'children'
        },
        dataRule: {
          groupCode: [
            {required: true, message: '分组编码不能为空', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '分组名称不能为空', trigger: 'blur'}
          ],
          parentName: [
            {required: true, message: '上级目录不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (groupId) {
        this.dataForm.groupId = groupId || ''
        this.$http({
          url: '/base/paramgroup/find',
          method: 'get'
        }).then(({data}) => {
          this.paramgroupList = this.treeDataTranslate(data.paramgroupList, 'groupId')
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (this.dataForm.groupId) {
            this.$http({
              url: `/base/paramgroup/${this.dataForm.groupId}`,
              method: 'get'
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm = data.data
                this.paramgroupTreeSetCurrentNode()
              }
            })
          }
        })
      },
      // 参数组树选中
      paramgroupTreeCurrentChangeHandle (data, node) {
        this.dataForm.parentId = data.groupId
        this.dataForm.parentName = data.name
      },
      // 菜单树设置当前选中节点
      paramgroupTreeSetCurrentNode (type) {
        this.$refs.paramgroupTree.setCurrentKey(this.dataForm.parentId)
        this.dataForm.parentName = (this.$refs.paramgroupTree.getCurrentNode() || {})['name']
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: `/base/paramgroup`,
              method: `${!this.dataForm.groupId || 0 ? 'post' : 'put'}`,
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
