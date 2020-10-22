<template>
  <div>
    <el-table :data="tableData" style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column v-if="select" type="selection" width="55"></el-table-column>
      <slot></slot>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ctable',
  props: {
    tableData: {
      type: Array,
      default () {
        return []
      }
    },
    select: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  methods: {
    handleSelectionChange (val) {
      this.$emit('selection', val)
      // console.log(this.multipleSelection)
    }
  }
}
</script>

<style>

</style>
