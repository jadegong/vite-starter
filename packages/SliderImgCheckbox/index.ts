/**
 * v0.0.1 2023/01/18 gqd 组件支持全局调用，也支持局部调用;
 */
import type { App, Plugin } from 'vue';
import SliderImgCheckbox from './src/index.vue';

export const SliderImgCheckboxPlugin: Plugin = {
    install(app: App) {
        app.component('abc-slider-img-checkbox', SliderImgCheckbox);
    },
};

export { SliderImgCheckbox };
