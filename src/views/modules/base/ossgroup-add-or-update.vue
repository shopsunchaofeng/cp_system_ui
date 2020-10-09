<template>
  <el-dialog
    :modal-append-to-body="false" :append-to-body="true"
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="上传类型" prop="uploadType">
        <el-radio-group v-model="dataForm.uploadType">
          <el-radio :label="1">全部</el-radio>
          <el-radio :label="2">图片</el-radio>
          <el-radio :label="3">视频</el-radio>
          <el-radio :label="4">文件</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="组名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="文档目录名称"></el-input>
      </el-form-item>
      <el-form-item label="上级目录" prop="parentName">
        <el-popover
          ref="ossgroupListPopover"
          placement="top-start"
          trigger="click">
          <el-tree
            :data="ossgroupList"
            :props="ossgroupListTreeProps"
            node-key="id"
            ref="ossgroupTree"
            @current-change="ossgroupTreeCurrentChangeHandle"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:ossgroupListPopover :readonly="true" placeholder="点击选择上级目录"
                  class="ossgroup-list__input"></el-input>
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
          id: 0,
          uploadType: 1,
          parentId: '',
          parentName: '',
          name: ''},
        dataRule: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'}
          ],
          parentName: [
            {required: true, message: '上级目录不能为空', trigger: 'blur'}
          ]
        },
        ossgroupList: [],
        ossgroupListTreeProps: {
          label: 'name',
          children: 'children'
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || ''
        this.$http({
          url: '/base/ossgroup/find',
          method: 'get'
        }).then(({data}) => {
          this.ossgroupList = this.treeDataTranslate(data.ossgroupList, 'id')
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: `/base/ossgroup/info/${this.dataForm.id}`,
              method: 'get'
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm = data.data
                this.ossgroupTreeSetCurrentNode()
              }
            })
          }
        })
      },
      // 参数组树选中
      ossgroupTreeCurrentChangeHandle (data, node) {
        this.dataForm.parentId = data.id
        this.dataForm.parentName = data.name
      },
      // 菜单树设置当前选中节点
      ossgroupTreeSetCurrentNode () {
        this.$refs.ossgroupTree.setCurrentKey(this.dataForm.parentId)
        this.dataForm.parentName = (this.$refs.ossgroupTree.getCurrentNode() || {})['name']
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm']
          .validate((valid) => {
            if (valid) {
              this.$http({
                url: `/base/ossgroup`,
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

  .ossgroup-list__input{

    > .el-input__inner {
      cursor: pointer;
    }

  }

</style>
