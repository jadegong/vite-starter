/**
 * 自定义Icon组件，翻译组件作为参数时的情况;
 * v0.0.1 2023/02/24 gqd Init;
 */
import { h } from 'vue'

export default {
    props: ['component'],
    setup(props: any) {
        return () => h(props.component || 'span')
    },
}
