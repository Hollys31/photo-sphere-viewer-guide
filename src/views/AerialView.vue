<template>
  <div class="aerialWrap" id="aerialWrap">
    <div class="aerial" id="aerial">
      <div
        id="1"
        @click="changeViewer(1)"
        :class="['circle', { active: activeAlbumn == 1 }]"
        style="top: calc(41% - 5px); left: calc(20% - 5px)"
      ></div>
      <div
        @click="changeViewer(2)"
        id="2"
        :class="['circle', { active: activeAlbumn == 2 }]"
        style="top: calc(38% - 5px); left: calc(79% - 5px)"
      ></div>
      <!--  <div :style="{width:'100px',height:'100px',background:'red',transform: 'rotate(' + sectorRotate + ')'}"></div> -->
      <svg
        id="svg"
        class="svg"
        width="130"
        height="130"
        :style="{
          top: sectorTop,
          left: sectorLeft,
          transform: 'rotate(' + sectorRotate + ')',
        }"
      >
        <path
          id="sector"
          stroke="rgb(255,0,0)"
          stroke-width="0.5"
          stroke-opacity="0.5"
          fill="rgb(255,255,255)"
          fill-opacity="0.8"
          d="M 65,65 L 7.38990328951872,37.12390348328888 A 64,64 0 0 1 127.0503038999791,49.323272474134214 Z"
          style="
            pointer-events: visiblepainted;
            cursor: pointer;
            transform: scale(1, 1);
          "
        ></path>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  props: ["positionInfo", "activeAlbumn"],
  components: {},
  data() {
    return {
      sectorTop: "",
      sectorLeft: "",
      sectorRotate: "",
      isMoveSvg: false,
    };
  },
  created() {},
  mounted() {
    /*  this.getActiveHotDot(); */
    let isPC = this.getIsPc();
    this.getInitWidth();
    if (isPC) {
      this.listenerMouseWheelEvent();
      this.mouseMoveEventListener();
      this.sectorMouseMove();
    } else {
      this.touchMoveEvent();
      console.log("mobile");
    }
  },
  watch: {
    activeAlbumn: {
      handler: function (newVal, oldVal) {
        this.getActiveHotDot();
      },
      immediate: true,
    },
    positionInfo: {
      handler: function (newVal, oldVal) {
        if (oldVal.yaw - 6 > 0 && newVal.yaw - 1 < 0 && !this.isMoveSvg) {
          console.log("已经转完一圈了");
          this.$emit("viewerfinishOneRound");
        } else {
          const rotate = (360 / 6.282314) * newVal.yaw;
          this.sectorRotate = rotate + "deg";
        }
      },
      deep: true,
    },
  },
  computed: {},
  methods: {
    //判断是PC端还是移动端
    getIsPc() {
      var userAgentInfo = navigator.userAgent;

      var Agents = [
        "Android",
        "iPhone",

        "SymbianOS",
        "Windows Phone",

        "iPad",
        "iPod",
      ];

      var flagPc = true;

      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flagPc = false;

          break;
        }
      }

      return flagPc;
    },

    changeViewer(num) {
      if (this.activeAlbumn != num) {
        console.log(num);
        this.$emit("updateViewer", num);
      }
    },
    getActiveHotDot() {
      if (this.activeAlbumn == 1) {
        this.sectorTop = "calc(41% - 65px)";
        this.sectorLeft = "calc(20% - 65px)";
      }
      if (this.activeAlbumn == 2) {
        this.sectorTop = "calc(38% - 65px)";
        this.sectorLeft = "calc(79% - 65px)";
      }
    },
    getInitWidth() {
      const _this = this;
      let box1 = document.getElementById("aerialWrap");
      /*   let box2 = document.getElementById("aerial"); */
      let initWidth = document.documentElement.clientWidth;

      if (initWidth <= 500) {
        initWidth = initWidth * 1;
      } else {
        initWidth = initWidth / 2;
      }
      const initHeight = (Number(initWidth) / 1415) * 920;
      box1.style.width = initWidth + "px";
      box1.style.height = initHeight + "px";
      setTimeout(_this.addHotDot, 500);
    },
    /****touch*****/
    getDistance(p1, p2) {
      var x = p2.pageX - p1.pageX,
        y = p2.pageY - p1.pageY;
      return Math.sqrt(x * x + y * y);
    },
    touchMoveEvent() {
      var pageX,
        pageY,
        initX,
        initY,
        isTouch = false;
      var start = [];
      const _this = this;
       let box1 = document.getElementById("aerialWrap");
      box1.addEventListener(
        "touchstart",
        function (e) {
          //手指按下时的手指所在的X，Y坐标
          pageX = e.targetTouches[0].pageX;
          pageY = e.targetTouches[0].pageY;
          //初始位置的X，Y 坐标
          initX = e.target.offsetLeft;
          initY = e.target.offsetTop;
          //记录初始 一组数据 作为缩放使用
          if (e.touches.length >= 2) {
            //判断是否有两个点在屏幕上
            start = e.touches; //得到第一组两个点
          }
          //表示手指已按下
          isTouch = true;
        },
        false
      );

      //监听 touchmove 事件 手指 移动时 做的事情
      box1.addEventListener(
        "touchmove",
        function (e) {
           e.preventDefault && e.preventDefault();
        e.stopPropagation();
          // 一根 手指 执行 目标元素移动 操作
          if (e.touches.length == 1 && isTouch) {
            //移动目标的 X Y 坐标
            var touchMoveX = e.targetTouches[0].pageX,
              touchMoveY = e.targetTouches[0].pageY;
            //设置当前点击元素的 top left 定位值
           e.target.style.left =
              parseInt(touchMoveX) - parseInt(pageX) + parseInt(initX) + "px";
           e.target.style.top =
              parseInt(touchMoveY) - parseInt(pageY) + parseInt(initY) + "px";
          }

          // 2 根 手指执行 目标元素放大操作
          if (e.touches.length >= 2 && isTouch ) {
            //得到第二组两个点
            var now = e.touches;
            //得到缩放比例， getDistance 是勾股定理的一个方法
            var scale =_this.getDistance(now[0], now[1]) /_this.getDistance(start[0], start[1]);
            // 对缩放 比例 取整
            scale = scale.toFixed(2);
         
            // 执行目标元素的缩放操作
            /* const w = box1.clientWidth*scale;
            const h = (Number(w) / 1415) * 920;
            box1.style.width = w + "px";
            box1.style.height = h + "px"; */
           box1.style.transform = "scale(" + scale + ")";
          }
        },
        false
      );

      //监听 手指离开屏幕时
      box1.addEventListener(
        "touchend",
        function (e) {
          //将 isTouch 修改为false  表示 手指已经离开屏幕
          if (isTouch) {
            isTouch = false;
          }
        },
        false
      );

      //缩放 勾股定理方法
    },
    //扇形移动
    sectorMouseMove() {
      const _this = this;
      let dragging = false;
      let svgBox = document.getElementById("svg");

      svgBox.addEventListener("mousedown", function (e) {
          e.preventDefault && e.preventDefault();
        e.stopPropagation();

        clearTimeout(_this.timeout);
        dragging = true;
        _this.isMoveSvg = true;
        _this.$emit("changeAutorotate", false);
      });

      svgBox.addEventListener("mousemove", function (e) {
          e.preventDefault && e.preventDefault();
        e.stopPropagation();

        console.log("move");
        if (dragging === false) {
          return;
        }
        let rect = svgBox.getBoundingClientRect();
        let center = {
          x: rect.left + (rect.right - rect.left) / 2,
          y: rect.top + (rect.bottom - rect.top) / 2,
        };
        let degNum =
          Math.atan2(center.y - e.pageY, center.x - e.pageX) * (180 / Math.PI);
        _this.$emit("rorateToYaw", degNum);
      });
      svgBox.addEventListener("mouseup", function (e) {
        dragging = false;
        _this.isMoveSvg = false;
        _this.timeout = setTimeout(() => {
          _this.$emit("changeAutorotate", true);
        }, 3000);
      });
    },
    listenerMouseWheelEvent() {
      const _this = this;

      let box1 = document.getElementById("aerialWrap");

      box1.onmousewheel = function (event) {
        event = event || window.event;
        //判断滚轮滚动方向
        if (event.wheelDelta > 0 || event.detail < 0) {
          const w = box1.clientWidth + 50;
          const h = (Number(w) / 1415) * 920;
          box1.style.width = w + "px";
          box1.style.height = h + "px";
        } else {
          const w = box1.clientWidth - 50;
          const h = (Number(w) / 1415) * 920;
          box1.style.width = w + "px";
          box1.style.height = h + "px";
        }
        //当滚轮滚动，如果浏览器有滚动条，滚动条会随之滚动，是默认行为
        //addEventLinstener绑定响应函数时取消默认行为不能使用return false;
        //需要使用event来取消，event.preventDefault;但IE8不支持，会报错
        event.preventDefault && event.preventDefault();

        return false;
      };
      bind(box1, "DOMMouseScroll", box1.onmousewheel);
      //事件的绑定
      function bind(el, eventStr, callBack) {
        //大部分浏览器兼容
        if (el.addEventListener) {
          el.addEventListener(eventStr, callBack, false);
        } else {
          // this是由调用方式决定；callback.call（obj）

          el.attachEvent("on" + eventStr, function () {
            //在匿名函数调用回调函数
            callBack.call(el);
          });
        }
      }
    },
    mouseMoveEventListener() {
      let dragging = false;
      let position = null;
      let box1 = document.getElementById("aerialWrap");
      box1.addEventListener("mousedown", function (e) {
        dragging = true; // 正在移动
        position = [e.clientX, e.clientY];
      });
      box1.addEventListener("mousemove", function (e) {
        if (dragging === false) {
          return;
        }
        const x = e.clientX;
        const y = e.clientY;
        const deltaX = x - position[0];
        const deltaY = y - position[1];
        const left = parseInt(box1.style.left || 0);
        const top = parseInt(box1.style.top || 0);
        box1.style.left = left + deltaX + "px";
        box1.style.top = top + deltaY + "px";
        position = [x, y];
      });
      box1.addEventListener("mouseup", function (e) {
        console.log("ss");
        dragging = false;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.aerialWrap {
  position: absolute;
  z-index: 999;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-35%);
}
.aerial {
  width: 100%;
  height: 100%;
  background: url("@/assets/all.png") top center no-repeat;
  background-size: contain;
  position: relative;
}
.svg {
  position: absolute;
  z-index: 999;
}
.circle {
  width: 10px;
  height: 10px;
  background: #00b4ff;
  border: 1px solid #fff;
  position: absolute;
  z-index: 1000;
  border-radius: 50%;
  cursor: pointer;
}
.circle.active {
  background: rgb(255, 138, 0);
}
</style>