<!-- v1.0.0 2023/01/18 gqd 滑动验证码组件; -->
<!--        2023/01/18 gqd Debug; -->
<!--
 *  Props {
 *      okText: String,
 *      cancelText: String,
 *      checkImageInfo: Object<{ylocation: number, maskImg: String, backImg: String}>,
 *      checkImageBoxVisible: Boolean, // 控制Modal显隐
 *      setCheckImageBoxVisible: (flag: boolean) => void, // 设置Modal显隐变量
 *      sendDataAjaxFn: (xlocation: number) => Promise, // 发送校验数据的请求方法，返回Promise可进行链式回调
 *  }
 *  Events {
 *      refreshCallback: () => void, // 点击刷新按钮后的回调函数
 *      successCallback: (res: any) => void, // 校验请求成功后的回调函数
 *      errorCallback: (err: any) => void, // 校验请求失败后的回调函数
 *  }
 * -->
<template>
  <a-modal
    title="请进行验证"
    :visible="checkImageBoxVisible"
    :ok-text="okText"
    :cancel-text="cancelText"
    @ok="resetCheckImageBox"
    @cancel="cancelCheckImageBoxVisible"
    width="360px"
  >
    <a-spin :spinning="loading">
      <div class="login-slider-check-box">
        <div class="login-check-image-box">
          <div class="login-check-image-content" draggable="false">
            <img
              ref="sliderImageMask"
              class="login-check-image-mask"
              :src="checkImageInfo.maskImg || constants.defaultMaskImg"
              v-bind:style="sliderImgMarkStyles"
              draggable="false"
            />
            <img
              class="login-check-image-back"
              :src="checkImageInfo.backImg || constants.defaultBackImg"
              draggable="false"
            />
          </div>
          <div class="login-check-image-slider">
            <!-- <div class="login-check-image-slider-arrow" @mousedown="_sliderMouseDown" @mousemove="_sliderMouseMove" @mouseup="_sliderMouseUp" v-bind:style="sliderArrowStyles"> -->
            <div
              ref="sliderArrowEle"
              class="login-check-image-slider-arrow"
              @mousedown="_sliderMouseDown"
              @touchstart="_sliderMouseDown"
            >
              <!-- <img :src="constants.rightArrowImg" draggable="false"/> -->
            </div>
            <div class="login-check-image-slider-mask"></div>
            <!-- <span v-if="!sliderStart" class="login-check-image-slider-tip">滑动来移动拼图</span> -->
          </div>
          <div
            class="login-check-image-success-cover"
            v-if="verifyFlag && verifyRetFlag"
          >
            <img :src="constants.successCoverImg" alt="验证通过" />
            <p>验证通过</p>
          </div>
          <div
            class="login-check-image-error-cover"
            v-if="verifyFlag && !loading && !verifyRetFlag"
          >
            <img :src="constants.rightArrowErrorImg" alt="验证失败" />
            <p>验证失败</p>
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { message } from 'ant-design-vue';

import defaultBackImg from '../../assets/sample_after.png';
import defaultMaskImg from '../../assets/sample_after_mark.png';
import rightArrowImg from '../../assets/slider_icon.png';
import rightArrowErrorImg from '../../assets/red_error.png';
import successCoverImg from '../../assets/success_cover.png';

interface SliderImgCheckboxCheckImageInfoModel {
  maskImg: String; // 跟着可拖动的滑块运动的小图片
  backImg: String; // 整体背景图片
  ylocation: Number; // 单独的小图片上边缘距离背景图片顶部高度：px
}

export default defineComponent({
  name: 'SliderImgCheckbox',
  props: {
    okText: {
      type: String,
      default: () => '刷新'
    },
    cancelText: {
      type: String,
      default: () => '关闭'
    },
    checkImageInfo: { // 获取的图片数据
      type: Object as PropType<SliderImgCheckboxCheckImageInfoModel>,
      default: () => ({maskImg: defaultMaskImg, backImg: defaultBackImg, ylocation: 50})
    },
    checkImageBoxVisible: { // 是否可见数据，单向数据流
      type: Boolean,
      default: () => false,
    },
    setCheckImageBoxVisible: {
      type: Function<(flag: boolean) => void>,
      default: () => {
        return (flag: boolean) => {}
      },
    },
    sendDataAjaxFn: {
      type: Function<(xlocation: number) => Promise<any>>,
      default: () => {
        return (xlocation: number) => {
          return new Promise((resolve, reject) => {
            if (xlocation > 0 && xlocation < 300) {
              resolve({xlocation});
            } else {
              reject({xlocation});
            }
          });
        }
      },
    },
  },
  data() {
    return {
      // 默认常量
      constants: {
        defaultBackImg: defaultBackImg,
        defaultMaskImg: defaultMaskImg,
        rightArrowImg: rightArrowImg,
        rightArrowErrorImg: rightArrowErrorImg,
        successCoverImg: successCoverImg,
        // 验证码滑块边界常量
        sliderBackWidth: 300,
        sliderMaskWidth: 30,
        // 颜色常量
        // normalColorStr: '#f9fbfc',
        // hoverColorStr: '#deee97',
        // successColorStr: '#79e77e',
        // errorColorStr: '#e73c4a',
      }, // 常量
      sliderArrowEle: null, // 可拖动元素
      sliderImageMask: null, // 小图片元素
      moveXLocation: 0, // 左右拖动的位移
      loading: false,
      verifyFlag: false, // 是否进行了校验登录，初始化为false
      verifyRetFlag: false, // 是否通过了校验登录，初始化为false
      mouseInitPos: { x: 0, y: 0 }, // 鼠标点击滑块时鼠标的初始位置: {x: number, y: number}
      // sliderMaskStyles: {width: '0px', backgroundColor: '#deee97'}, // 已经拖过的路径块的样式：{width: number, backgroundColor: string}
      // sliderArrowStyles: {marginLeft: '0px'}, // 箭头滑块的样式：{marginLeft: number}
      sliderStart: false, // 是否开始拖动滑块
      sliderYArray: [], // 存放y轴坐标变化，用于检测y轴变化，TODO: 防止机器人
    };
  },
  computed: {
    sliderImgMarkStyles() { // 抠出来的小图片的样式：{marginTop: 50px}
      return { marginTop: `${this.checkImageInfo.ylocation}px` };
    },
  },
  methods: {
    cancelCheckImageBoxVisible() {
      this.setCheckImageBoxVisible(false);
    },
    onRefreshBtnClick() {
      this.resetCheckImageBox();
      this.$emit('refreshCallback');
    },
    resetCheckImageBox() {
      // DONE: 调整验证码相关state为初始值
      this.sliderStart = false;
      this.verifyFlag = false;
      this.verifyRetFlag = false;
      this.sliderYArray = [];
      // this.sliderMaskStyles = {width: '0px', backgroundColor: this.constants.normalColorStr};
      // this.sliderImgMarkStyles = { marginTop: '50px' };
      // this.sliderArrowStyles = {marginLeft: '0px'};
      if (!this.sliderArrowEle) {
        this.sliderArrowEle = this.$refs.sliderArrowEle;
      }
      this.sliderArrowEle.style.marginLeft = 0;
      if (!this.sliderImageMask) {
        this.sliderImageMask = this.$refs.sliderImageMask;
      }
      this.sliderImageMask.style.marginLeft = 0;
      this.moveXLocation = 0;
    },
    /**
     * 滑块鼠标按下时的回调函数
     * @param e Event object.
     */
    _sliderMouseDown(e) {
      e.preventDefault();
      if (this.sliderStart) return false;
      this.sliderStart = true;
      this.mouseInitPos = {
        x: e.clientX || e.touches[0].clientX,
        y: e.clientY || e.touches[0].clientY,
      };
      // this.sliderMaskStyles = {...this.sliderMaskStyles, backgroundColor: this.constants.hoverColorStr};
      // DOING: 事件绑定
      document.addEventListener('mousemove', this._sliderMouseMove);
      // 2021/03/19 gqd 移动端事件
      document.addEventListener('touchmove', this._sliderMouseMove);
      document.addEventListener('mouseup', this._sliderMouseUp);
      // 2021/03/19 gqd 移动端事件
      document.addEventListener('touchend', this._sliderMouseUp);
    },
    /**
     * 滑块鼠标移动时的回调函数
     * @param e Event object.
     */
    _sliderMouseMove(e) {
      e.preventDefault();
      if (!this.sliderStart) return false;
      // 获取鼠标移动位置
      const eventX = e.clientX || e.touches[0].clientX;
      // const eventY = e.clientY || e.touches[0].clientY;
      const moveX = eventX - this.mouseInitPos.x;
      // const moveY = eventY - this.mouseInitPos.y;
      this.moveXLocation = moveX;
      // 暂存y轴的位移，方便判断是否是机器人
      // let tempArrayY = this.sliderYArray.slice();
      // tempArrayY.push(moveY);
      // 边界判断
      if (moveX < 0 || moveX + this.constants.sliderMaskWidth > this.constants.sliderBackWidth) {
        return false;
      } else {
        // 没有超出边界则改变界面
        // this.sliderYArray = tempArrayY;
        // DONE: 1. 改变slider 箭头的位置
        if (!this.sliderArrowEle) {
          this.sliderArrowEle = this.$refs.sliderArrowEle;
        }
        this.sliderArrowEle.style.marginLeft = `${moveX}px`;
        // this.sliderArrowStyles = {marginLeft: `${moveX}px`};
        // 2. 改变slider 滑过的背景的宽度
        // this.sliderMaskStyles = {...this.sliderMaskStyles, width: `${moveX}px`};
        // DONE: 3. 改变验证码小图片的位置
        if (!this.sliderImageMask) {
          this.sliderImageMask = this.$refs.sliderImageMask;
        }
        this.sliderImageMask.style.marginLeft = `${moveX}px`;
        // this.sliderImgMarkStyles = {...this.sliderImgMarkStyles, marginLeft: `${moveX}px`};
      }
    },
    /**
     * 滑块鼠标结束移动并松开按键时的回调函数
     * 此时进行位置校验
     * @param e Event object.
     */
    _verifyYArray(arr) {
      if (arr.length < 1) return false;
      let sumY = arr.reduce((v1, v2) => v1 + v2);
      let average = sumY / arr.length;
      return average !== 0;
      // y轴没有改变则算机器人
      //let same = false;
      //for (let i = 0; i < arr.length; i++) {
      //if (arr[i] === average) {
      //same = true;
      //break;
      //}
      //}
      //return !same;
    },
    /**
     * 滑块鼠标结束移动并松开按键时的回调函数
     * 此时进行位置校验
     * @param e Event object.
     */
    _sliderMouseUp(e) {
      // 事件解除绑定
      document.removeEventListener('mousemove', this._sliderMouseMove);
      // 2021/03/19 gqd 移动端事件
      document.removeEventListener('touchmove', this._sliderMouseMove);
      document.removeEventListener('mouseup', this._sliderMouseUp);
      // 2021/03/19 gqd 移动端事件
      document.removeEventListener('touchend', this._sliderMouseUp);
      if (!this.sliderStart) return false;
      // if (!this.checkImageInfo) {
        // 未获取到验证图片，不允许验证
        // return false;
      // }
      this.sliderStart = false;
      this.verifyFlag = true; // 已经进行了验证
      // let finalX = parseInt(this.sliderArrowStyles.marginLeft);
      this.loading = true;
      let data = {
        // ...this.requestParams,
        xlocation: parseInt(this.moveXLocation),
      };
      this.sendDataAjaxFn(data.xlocation).then((res: any) => {
        this.loading = false;
        this.verifyRetFlag = true;
        message.success('验证成功！');
        setTimeout(() => {
          this.$emit('successCallback', res);
        }, 1500);
      }, (err: any) => {
        this.loading = false;
        this.verifyRetFlag = false;
        message.error('验证失败，请重试！');
        setTimeout(() => {
          this.resetCheckImageBox();
          this.$emit('errorCallback', err);
        }, 1000);
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.sliderArrowEle = this.$refs.sliderArrowEle;
      this.sliderImageMask = this.$refs.sliderImageMask;
      // this.resetCheckImageBox();
    });
  },
});
</script>
<style lang="less" scoped>
.login-slider-check-box {
  * {
    box-sizing: border-box;
  }
  .login-check-image-box {
    width: 300px;
    height: auto;
    margin: 0 auto;
    position: relative;
    .login-check-image-content {
      width: 300px;
      height: 150px;
      position: relative;
      .login-check-image-mask {
        position: absolute;
        height: 50px;
        width: 50px;
        z-index: 1;
      }
      .login-check-image-back {
        height: 150px;
        width: 300px;
      }
    }
    .login-check-image-slider {
      position: relative;
      margin: 10px auto auto;
      width: 300px;
      height: 40px;
      background-color: #ffffff;
      .login-check-image-slider-arrow {
        position: absolute;
        z-index: 1;
        margin-left: 0;
        width: 50px;
        height: 40px;
        text-align: center;
        cursor: pointer;
        background: url('../../assets/slider_icon.png') no-repeat
          center / contain;
        img {
          width: 30px;
          height: 30px;
          margin-top: 5px;
        }
      }
      .login-check-image-slider-mask {
        position: absolute;
        top: 15px;
        left: 0;
        width: 100%;
        height: 10px;
        background-color: #eef2f5;
      }
      .login-check-image-slider-tip {
        position: absolute;
        margin-top: 10px;
        margin-left: 100px;
      }
    }
    .login-check-image-success-cover,
    .login-check-image-error-cover {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.4);
      z-index: 2;
      img {
        display: block;
        width: 50px;
        height: 50px;
        margin: 35px auto 20px;
      }
      p {
        color: #ffffff;
        margin: 0;
        text-align: center;
        font-size: 14px;
      }
    }
  }
}
</style>
