/**
 * v0.0.1 2023/01/06 gqd 组件支持全局调用，也支持局部调用;
 */
import type { App, Plugin } from 'vue';
import TypeDatePicker from './src/index.vue';

export const TypeDatePickerPlugin: Plugin = {
  install(app: App) {
    app.component('abc-type-date-picker', TypeDatePicker);
  },
};

export { TypeDatePicker };
