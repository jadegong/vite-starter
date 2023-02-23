<template>
  <div>
    <div style="width: 1200px;">
      <a-button type="primary" @click="onCheckBtnClicked">进行验证</a-button>
    </div>
    <abc-slider-img-checkbox
      :checkImageInfo="checkImageInfo"
      :checkImageBoxVisible="checkImageBoxVisible"
      :setCheckImageBoxVisible="setCheckImageBoxVisible"
      :sendDataAjaxFn="sendDataAjaxFn"
      @refreshCallback="refreshCallback"
      @successCallback="successCallback"
      @errorCallback="errorCallback"
    >
    </abc-slider-img-checkbox>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import defaultBackImg from '../../assets/images/sample_after.png';
import defaultMaskImg from '../../assets/images/sample_after_mark.png';

export default defineComponent({
  name: 'SliderImgCheckboxPage',
  data() {
    return {
      checkImageInfo: {
        ylocation: 50,
        maskImg: defaultMaskImg,
        backImg: defaultBackImg,
      },
      checkImageBoxVisible: false,
      sourceCode: '',
    };
  },
  methods: {
    onCheckBtnClicked() {
      this.checkImageBoxVisible = true;
    },
    setCheckImageBoxVisible(flag: boolean) {
      this.checkImageBoxVisible = !!flag;
    },
    sendDataAjaxFn(xlocation: number) {
      console.log(xlocation);
      return new Promise((resolve, reject) => {
        if (xlocation > 110 && xlocation < 120) {
          resolve({xlocation});
        } else {
          reject({xlocation});
        }
      });
    },
    refreshCallback() {},
    successCallback(emitData: any) {
      this.checkImageBoxVisible = false;
    },
    errorCallback(emitData: any) {},
    cancelBtnCallback() {},
  },
});
</script>
