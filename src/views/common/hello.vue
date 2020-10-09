<template>
  <el-table class="mod-demo-echarts" style="width:100%;" v-loading="loading" element-loading-text="请稍后，正为您加载中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
  </el-table>
</template>

<script>
export default {
  data () {
    return {
      loading: true
    }
  },
  activated () {
    setTimeout(() => {
      if (localStorage.getItem('homeUrl') !== null && localStorage.getItem('homeUrl') !== '' && localStorage.getItem('homeUrl') !== undefined) {
        this.$router.push({ name: localStorage.getItem('homeUrl') })
      }
      // this.$router.replace({name: sessionStorage.getItem('homeUrl')})
      // this.$router.push({path: sessionStorage.getItem('homeUrl')}) // 强制切换当前路由path
      this.loading = false
    }, 2000)
  }
}
</script>
