<template>
  <div>
    <div style="width: 60%; margin: 0 auto">
      <a-form layout="inline">
        <a-form-item label="">
          <abc-type-date-picker
            :value="typeDatePickerValue"
            :dateTypes="dateTypes"
            @onTypeDateValueChange="onTypeDateValueChange"
          >
          </abc-type-date-picker>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import dayjs from 'dayjs';

export default defineComponent({
  name: 'TypeDatePickerPage',
  data() {
    return {
      dateTypes: [{ key: 'day', desc: '天' }, { key: 'month', desc: '月' }],
      typeDatePickerValue: {
          type: 'day',
          date: '',
      },
    };
  },
  methods: {
    /**
    * 处理选择的时间数据
    */
    onTypeDateValueChange(emitData: any) {
      const { type, date } = emitData;
      this.typeDatePickerValue = { type, date };
      let selectedDate = dayjs(date);
      if (selectedDate.isValid()) {
        console.log(selectedDate.format(type === 'day' ? 'YYYY-MM-DD' : 'YYYY-MM'));
      } else {
          console.log('Invalid date');
      }
    },
  },
});
</script>
