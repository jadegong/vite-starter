<template>
  <span>
    <a-radio-group
      v-model:value="value.type"
      @change="onTypeChange"
    >
      <a-radio
        v-for="dateTypeItem in dateTypes"
        :key="dateTypeItem.key"
        :value="dateTypeItem.key"
      >
        {{ dateTypeItem.desc }}
      </a-radio>
    </a-radio-group>
    <a-range-picker
      v-if="range"
      v-model:value="value.date"
      :disabled-date="disabledDate"
      @change="onDateChange"
    />
    <template v-else>
      <a-date-picker
        :picker="value.type === 'day' ? 'date' : value.type"
        :disabled-date="disabledDate"
        v-model:value="value.date"
        @change="onDateChange"
      />
    </template>
  </span>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);

interface TypeDatePickerPropsValueModel {
  type?: String;
  date?: any;
}

interface TypeDatePickerPropsDateTypesItemModel {
  key: String;
  desc: String;
}

interface TypeDatePickerPropsDateTypesModel {
  [index: number]: TypeDatePickerPropsDateTypesItemModel;
}

export default defineComponent({
  name: 'TypeDatePicker',
  props: {
    range: {
      type: Boolean,
      default: () => false,
    },
    value: {
      type: Object as PropType<TypeDatePickerPropsValueModel>,
      default: () => ({type: 'day', date: ''}),
    },
    // 自定义展示那几种类型单选按钮，默认天/周/月
    dateTypes: {
      type: Array as PropType<TypeDatePickerPropsDateTypesModel>,
      default: () => [{ key: 'day', desc: '天' }, { key: 'week', desc: '周' }, { key: 'month', desc: '月' },],
    },
  },
  computed: {
    // 自定义禁选时间，默认今天可选今天以前
    disabledDate() {
      return (currentDate) => currentDate.isSameOrAfter(dayjs().startOf(this.value.type || 'day'))
    },
  },
  methods: {
    /**
     * 时间类型改变回调
     */
    onTypeChange(e: Event) {
      const type = e.target.value;
      this.$emit('onTypeDateValueChange', {type, date: this.range ? [] : ''});
    },
    /**
     * 选择回调
     */
    onDateChange(date: dayjs | String | [dayjs, dayjs] | [String, String], dateString: String | [String, String]) {
      this.$emit('onTypeDateValueChange', {type: this.value.type, date});
    },
  },
});
</script>
