<template>
  <div>
    <el-select class="width100" v-model="selectValue" autocomplete clearable :disabled="disabled"
               :placeholder="placeholder" filterable>
      <el-option
        v-for="item in options"
        :key="item.key"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  export default {
    name: 'el-dict',
    componentName: 'ElDict',
    data () {
      return {
        placeholder: '请选择',
        options: [],
        selectValue: ''
      }
    },
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      // 导入的url地址
      code: {
        type: String
      },
      // 接受外部v-model传入的值，必须使用value
      value: {
        type: String
      }
    },
    watch: {
      // 判断下拉框的值是否有改变
      selectValue (val, oldVal) {
        if (val !== oldVal) {
          this.$emit('input', this.selectValue)
        }
      },
      value (val) {
        if (typeof val === 'number') {
          this.selectValue = val.toString()
        } else {
          this.selectValue = val
        }
      }
    },
    mounted () {
      // 远程请求回来的数据
      this.$http('/base/param/queryByGroupCode?groupCode=' + this.code)
        .then((response) => {
          for (let i = 0; i < response.data.list.length; i++) {
            let op = {}
            op.label = response.data.list[i]['paramName']
            op.value = response.data.list[i]['paramValue']
            op.key = i
            this.options.push(op)
          }
        })
    }
  }
</script>
