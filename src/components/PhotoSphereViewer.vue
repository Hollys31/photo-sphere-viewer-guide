<template>
  <div id="viewer"></div>
</template>

<script>
import { Viewer, utils } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { GalleryPlugin } from "@photo-sphere-viewer/gallery-plugin";
import { AutorotatePlugin } from "@photo-sphere-viewer/autorotate-plugin";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import "@photo-sphere-viewer/gallery-plugin/index.css";

export default {
  props: {
    currAlbumnIndex: {
      type: Number,
    },
    hasAnimate: {
      type: Boolean,
      default: true,
    },
    imgList: [],
    hasGallery: {
      type: Boolean,
      default: true,
    },
    albumnList: {
      type: Array,
    },
  },
  components: {},
  data() {
    return {
      changeViewerType:null,
      currAlbumnIndexSave: null,

      hasUpdateImglist: true,
      viewer: "",
      panoramaUrl: "",
      markersPlugin: "",
      autorotatePlugin: "",
      galleryPlugin: "",
      currIndex: 0,
      currIndexSave: null,
      animatedValues: {
        pitch: { start: -Math.PI / 2, end: 0.2 },
        yaw: { start: Math.PI, end: 0 },
        zoom: { start: 0, end: 50 },
        fisheye: { start: 2, end: 0 },
      },
      defaultUrl: require("../assets/3.jpg"),
    };
  },
  created() {},
  mounted() {
    this.panoramaUrl = this.imgList[0].panorama || this.defaultUrl;
    
    this.initViewer();
    this.handelListenerViewerClick();
    this.handleSelectMarker();
    this.handleHoverMarker();
    this.handleLeaveMarker();
    this.$nextTick(() => {
      this.handleGalleryChange();
    });
    this.listenerPanel();
  },
  watch: {
    imgList(val, olVal) {
      this.initPhotos();
    },
  },
  methods: {
    initViewer() {
      const _this = this;
      this.viewer = new Viewer({
        container: "viewer",
        panorama: this.panoramaUrl || this.defaultUrl,
        caption: "江西憶源多媒体科技有限公司",
        loadingImg: require("../assets/loader.gif"),
        touchmoveTwoFingers: true,
        mousewheelCtrlKey: false,
        defaultPitch: _this.animatedValues.pitch.start,
        defaultYaw: _this.animatedValues.yaw.start,
       /*  defaultZoomLvl: _this.animatedValues.zoom.start, */
        fisheye: _this.animatedValues.fisheye.start,
        description: "<div >hello,nihao </div>",
        navbar: false /* [
          "autorotate",
          "zoom",
          "markers",
          "move",
          "download",
          "gallery",
          {
            title: "Change points",
            content: "🔄",
            onClick: _this.randomPoints,
          },
          "caption",
          "fullscreen",
           "description"
        ] */,
        plugins: [
          [
            GalleryPlugin,
            {
              visibleOnLoad: true,
              hideOnClick: false,
              thumbnailSize: {
                width: 80,
                height: 80,
              },
            },
          ],
          [
            AutorotatePlugin,
            {
              autostartDelay: 5000,
              autorotatePitch: _this.animatedValues.pitch.end,
              autostartOnIdle: true,
              autorotateSpeed: "1rpm",
            },
          ],
          [
            MarkersPlugin,
            {
              markers: [],
            },
          ],
        ],
      });
      this.currAlbumnIndexSave = this.currAlbumnIndex;

      _this.markersPlugin = _this.viewer.getPlugin(MarkersPlugin);
      _this.autorotatePlugin = _this.viewer.getPlugin(AutorotatePlugin);
      _this.galleryPlugin = _this.viewer.getPlugin(GalleryPlugin);
     
      _this.viewer.addEventListener("ready", _this.handleViewerReady, {
        once: true,
      });
    },
    getViewerInfo() {
      const position = this.viewer.getPosition();
      const zoom = this.viewer.getZoomLevel();
      const size = this.viewer.getSize();
    },
    initPhotos() {
      this.galleryPlugin.setItems(this.imgList);
      this.$nextTick(() => {
        this.handelGalleryActive();
      });
    },
    handleViewerReady() {
      
      this.enteraAimation();
      this.markersPlugin.setMarkers(this.imgList[this.currIndex].markers); //设置标签
      this.showInitMarker();
    },
    viewerRotate(position){
       this.viewer.rotate(position);
    },
    //position更新监听
    positionUpdateInfo: ({ position }) => {
      console.log(position);
    },
    positionUpdateListener() {
      this.viewer.addEventListener("position-updated", ({ position }) => {
        this.$emit("positionInfoFun", position);
      });
    },
    removePositionUpdateListener() {
      console.log("position-updated 取消监听");
      this.viewer.removeEventListener(
        "position-updated",
        this.positionUpdateInfo
      );
    },
    //入场动画
    enteraAimation() {
      const _this = this;
      /*  _this.autorotatePlugin.stop(); */
      new utils.Animation({
        properties: _this.animatedValues,
        duration: 2500,
        easing: "inOutQuad",
        onTick: (properties) => {
          _this.viewer.setOption("fisheye", properties.fisheye);
          _this.viewer.rotate({ yaw: properties.yaw, pitch: properties.pitch });
          _this.viewer.zoom(properties.zoom);
          
        },
      }).then(() => {
         if (this.hasGallery) {
        this.galleryPlugin.setItems(this.imgList); //设置图库
        
      }
        /*  _this.autorotatePlugin.start(); */
      });
    },
    //全屏
    handleFullScreen() {
      this.viewer.enterFullscreen();
    },
    handleToggleFullscreen() {
      this.viewer.toggleFullscreen();
      if (!this.viewer.isFullscreenEnabled()) {
        this.galleryHide();
        this.$emit("updateHasGallery", false);
      }
    },
    //pannel
    listenerPanel() {
      const _this = this;
      this.viewer.addEventListener("show-panel", ({ panelId }) => {
        _this.$emit("changePanel", false);
        /*     if (panelId === PANEL_ID) {
        viewer.navbar.getButton(BUTTON_ID).toggleActive(true);
        
    } */
      });

      this.viewer.addEventListener("hide-panel", ({ panelId }) => {
        /*     if (panelId === PANEL_ID) {
        viewer.navbar.getButton(BUTTON_ID).toggleActive(false);
        
    } */
        this.$emit("changePanel", true);
        this.galleryShow();
      });
    },
    hidePanel() {
      this.viewer.panel.hide();
    },
    showPanel(name, value) {
      const PANEL_ID = "custom-panel";
      /*  this.viewer.setOption(name, value); */
      if (this.viewer.panel.isVisible(PANEL_ID)) {
        console.log("可视");
      } else {
        this.viewer.panel.show({
          id: value,
          width: "100%",
          content: value,
        });
      }
    },
    setDefaultOptions() {
      console.log("setDefaultOptions");
    /*   this.viewer.setOptions({
        defaultPitch: this.animatedValues.pitch.end,
        defaultYaw: this.animatedValues.yaw.end,
        defaultZoomLvl: this.animatedValues.zoom.end,
      }); */
       this.viewerRotate({yaw:0,pitch:0})
     /*  this.autorotatePlugin.start(); */
    },
    showInitMarker() {
      const _this = this;
      this.markersPlugin.showAllTooltips();
      /*  _this.markersPlugin.showMarkerTooltip("new-marker1"); */
      /*  _this.autorotatePlugin.start(); */
    },
    //清除标记
    clearMarker() {
      this.markersPlugin.clearMarkers();
    },
    //更新标记
    updateMarker(id, imgUrl) {
      this.markersPlugin.updateMarker({
        id: id,
        image: imgUrl,
      });
    },
    updateIndex(index) {
      this.currIndex = index;
      this.panoramaUrl = this.imgList[index].panorama;
    },
    //选择标记事件
    handleSelectMarker() {
      const _this = this;
      this.markersPlugin.addEventListener("select-marker", ({ marker }) => {
        this.$emit("selectMarker", marker);
      });
    },
    //标记悬停事件
    handleHoverMarker() {
      this.markersPlugin.addEventListener("enter-marker", ({ marker }) => {
        /*  console.log("enter"); */
      });
    },
    handleLeaveMarker() {
      this.markersPlugin.addEventListener("leave-marker", ({ marker }) => {
        /* console.log("leave"); */
      });
    },
    //gallery图库列表切换
    galleryShow() {
      this.galleryPlugin.show();
    },
    galleryHide() {
      this.galleryPlugin.hide();
    },
    galleryToggle() {
      this.galleryPlugin.toggle();
    },
    handleGalleryChange() {
      const _this = this;
      let _sindex = "";

      document.addEventListener("click", function (e) {
        var element = document.elementFromPoint(e.clientX, e.clientY);
        let flag = false;

        if (element && element.dataset && element.dataset.psvGalleryItem) {
          const id = element.dataset.psvGalleryItem;
         
          _sindex = _this.imgList.findIndex((data) => {
            return data.id == id;
          });
          flag = true;
        } else {

          if (element && element.className == "psv-gallery-item-thumb") {
            const eleId =
              element.parentElement.parentElement.dataset.psvGalleryItem;
            _sindex = _this.imgList.findIndex((data) => {
              return data.id == eleId;
            });
            flag = true;
          }
        }
        
        if (flag) {
          this.currAlbumnIndexSave = this.currAlbumnIndex;
          if (_this.currIndex!="" && _this.currIndex == _sindex) {
            console.log("点击了未切换");
          } else {
            _this.currIndex = _sindex;
            _this.panoramaUrl =_this.imgList[_sindex]&& _this.imgList[_sindex].panorama||"";
            if( _this.panoramaUrl){
              _this.handelChangeViewer("gallery");
            }
            
          }
        } else {
         /*  console.log(" _sindex不存在"); */
        }
      });
    },
    //图库列表当前选中active更新
    handelGalleryActive() {
      const galleryBox = document.getElementsByClassName(
        "psv-gallery-container"
      )[0];
      if (
        this.currIndex!=="" &&this.currAlbumnIndex==this.currAlbumnIndexSave&&
        document.getElementsByClassName("psv-gallery-item")[this.currIndex]
      ) {
        const galleryItemEle =
          document.getElementsByClassName("psv-gallery-item")[this.currIndex] ||
          document.getElementsByClassName("psv-gallery-item");
        galleryBox.childNodes.forEach((item) => {
          item.className = "psv-gallery-item";
        });
        galleryItemEle.classList.add("psv-gallery-item--active");
      }
    },
    /***
     * viewer 切换场景
     * */
    
    handelChangeViewer(type) {
      const _this = this;
      this.$emit("changetooOften", true); //处理频繁切换问题
      if (_this.viewer) {
        _this.autorotatePlugin.stop();
        this.currAlbumnIndexSave = this.currAlbumnIndex;
        this.$emit("updateCurrAlbumnIndexSave",this.currAlbumnIndexSave);
        _this.clearMarker();
        if (type == "gallery"&&_this.changeViewerType!='mark') {
          //点击图库切换
          _this.changeViewerType="gallery"
          console.log("图库切换场景")
           _this.setDefaultOptions();
          /* this.currAlbumnIndexSave = this.currAlbumnIndex; */
          _this.markersPlugin.setMarkers(
            _this.imgList[_this.currIndex].markers
          );
          _this.markersPlugin.showAllTooltips();
         
          this.$emit("changetooOften", false);
        } else {
          //标记几自定义切换场景
          _this.handelGalleryActive();
          if (_this.panoramaUrl) {
            _this.changeViewerType="mark";
            _this.setDefaultOptions();
            _this.viewer.setPanorama(_this.panoramaUrl).then(() => {
              _this.markersPlugin.setMarkers(
                _this.imgList[_this.currIndex].markers
              );
              _this.markersPlugin.showAllTooltips();
              
              _this.$emit("changetooOften", false);
            });
          } else {
            _this.$emit("changetooOften", false);
          }
        }
      }
    },
    stopAutorotate(){
      console.log("stopAutorotate");
       this.autorotatePlugin.stop();
    },
    startAutorotate(){
      this.autorotatePlugin.start();
    },
    //viewer点击事件监听
    handelListenerViewerClick(addMarker) {
      const _this = this;
      const emptyMarker = {
        image: require("./../assets/m.png"),
        width: 32,
        height: 32,
      };
      addMarker = addMarker ? addMarker : emptyMarker;
      this.viewer.addEventListener("click", ({ data }) => {
        console.log("viewerClick", data);
        if (!data.rightclick) {
          _this.$emit("viewerClick", data);
          _this.markersPlugin.addMarker({
            id: "#" + Math.random(),
            position: { yaw: data.yaw, pitch: data.pitch },
            image: addMarker.image || require("./../assets/local.png"),
            size: {
              width: addMarker.width || 32,
              height: addMarker.height || 32,
            },
            anchor: "bottom center",
            tooltip: addMarker.tooltip || "新增标记",
            data: {
              generated: true,
            },
          });
        }
      });
    },
    randomPoints() {
      /*  this.markersPlugin.showMarkerTooltip("new-marker3"); */
      this.markersPlugin.showAllTooltips();
    },
  },
};
</script>

<style lang="scss" scoped>
#viewer {
  width: 100%;
  height: 100%;
}
/deep/ .psv-canvas-container {
}
/deep/ .psv--has-navbar .psv-panel {
  width: 100%;

  /*  background: rgba($color: #fff, $alpha: 1.0);
  color: #666; */
}
/deep/{
  .custom-tooltip1 {
    max-width: none;
    width: 300px;
    padding: 0;
    box-shadow: 0 0 0 3px white;
}

.custom-tooltip1 img {
    width: 100%;
    border-radius: 4px 4px 0 0;
}

.custom-tooltip1 h2,
.custom-tooltip1 p {
    margin: 1rem;
    text-align: justify;
}
}
</style>