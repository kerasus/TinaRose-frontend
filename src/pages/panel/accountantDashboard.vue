<template>
  <div class="row q-col-gutter-md">
    <div class="col-md-3 col-12">
      <dash-board-card
        title="تعداد حواله های در انتظار بررسی"
        icon="assignment_late"
        :loading="pendingTransfersCountLoading"
        :number="pendingTransfersCount" />
    </div>
  </div>
  <div class="row q-col-gutter-md q-mt-md">
    <div class="col-md-12 col-12">
      <transfer-list />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUser } from 'src/stores/user'
import ReportAPI from 'src/repositories/report'
import TransferList from 'src/components/TransferList.vue'
import DashBoardCard from 'src/components/DashBoardCard.vue'

const reportAPI = new ReportAPI()
const userManager = useUser()

const pendingTransfersCount = ref<number | null>(null)
const pendingTransfersCountLoading = ref<boolean>(false)

async function getPendingTransfersCountMy () {
  try {
    pendingTransfersCountLoading.value = true
    pendingTransfersCount.value = await reportAPI.getPendingTransfersCountMy()
  } finally {
    pendingTransfersCountLoading.value = false
  }
}

onMounted(()=> {
  getPendingTransfersCountMy()
})
</script>

<style lang="scss" scoped>
.chart {
  height: 500px;
}
</style>
