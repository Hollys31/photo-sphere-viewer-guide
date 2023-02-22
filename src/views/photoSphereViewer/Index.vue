<template>
  <div class="">
    <photoSphereViewer
      style="width: 100vw; height: 100vh;overflow:hidden"
      ref="viewer"
      :imgList="photoList"
      :albumnList="albumnList"
      :currAlbumnIndex="activeAlbumnId"
      @selectMarker="selectMarker"
      @updateHasGallery="updateHasGallery"
      @changePanel="changePanel"
      @changetooOften="changetooOften"
      @positionInfoFun="positionInfoFun"
      @updateCurrAlbumnIndexSave="updateCurrAlbumnIndexSave"
    />
    <div class="photo-button-wrapper">
      <div class="logo">
        <img src="@/assets/logo.png" />
      </div>
      <div class="radar" @click="handelRadar">
        <img src="@/assets/radar_open_nk.png" />
      </div>
      <!--  <div class="floor">
        <select v-model="build" name="build" @change="changeFloor">
          <option :value="item.id" v-for="item in buildList" :key="item.id">
            {{ item.name }}
          </option>
        </select>
        <select v-model="floor" name="floor" @change="changeFloor">
          <option :value="item.id" v-for="item in floorList" :key="item.id">
            {{ item.name }}
          </option>
        </select>
        
      </div> -->
      <div :class="['albumn-block', { open: hasGallery }]">
        <div class="albumn-inner">
          <div
            @click="tooOften ? '' : changeAlbumns(item.id)"
            :class="['albumn-item', { active: activeAlbumnId == item.id }]"
            v-for="item in albumnList"
            :key="item.id"
          >
            <img :src="item.url" />
            <div class="title">{{ item.name }}</div>
          </div>
        </div>
      </div>
      <div class="navigation-block">
        <ul>
          <li v-for="item in navList" :key="item.id" @click="setOptions(item)">
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div class="actions-box">
        <div class="actions-inner">
          <div class="btn btn1" @click="toggleGallery"></div>
          <div
            :class="['btn', 'btn2', { active: !hasMusic }]"
            @click="changeBgmusic"
          ></div>
          <div class="btn btn3" @click="changeModal"></div>
          <div class="btn btn4" @click="changeFullscreen"></div>
        </div>
      </div>
    </div>
    <div class="share-modal modal" v-if="showModal">
      <div class="modal-inner">
        <div class="close" @click="showModal = false">
          <img src="@/assets/close.png" />
        </div>
        <div class="modal-content">
          <img src="@/assets/VR_hsl.png" />
        </div>
      </div>
    </div>
    <div
      class="radar-modal modal"
      v-if="showRadarModal"
      style="pointer-events: none"
    >
      <div class="modal-inner1">
        <!--   <div class="close" @click="closeRadarModal">
          <img src="@/assets/close.png" />
        </div> -->
        <div class="modal-content" style="pointer-events: auto">
          <Aerial
            :positionInfo="positionInfo"
            :activeAlbumn="currAlbumnIndexSave"
            @viewerfinishOneRound="viewerfinishOneRound"
            @changeAutorotate="changeAutorotate"
            @rorateToYaw="rorateToYawFun"
            @updateViewer="updateViewer"
            
          />
        </div>
      </div>
    </div>
    <div class="video-wrap" v-if="video.videoIsShow">
      <div class="video-inner">
        <img 
          
          class="close"
          src="@/assets/close1.png"
          @click="changeVideoShow(false)"
        />
<MyLivePlayer/>
       <!--  <MyVideo
          v-show="true"
          :videoUrl="video.videoUrl"
          :videoCover="video.videoCover"
          :width="video.width"
          :height="video.height"
          :autoplay="true"
          :controls="true"
          :loop="false"
          :muted="false"
          preload="auto"
          :showPlay="true"
          :playWidth="96"
          zoom="cotain"
        /> -->
      </div>
    </div>
  </div>
</template>

<script>
import photoSphereViewer from "@/components/PhotoSphereViewer.vue";
import Aerial from "@/views/AerialView.vue";
import MyVideo from "@/components/video/video.vue";
import MyLivePlayer from '@/components/video/liveplayer.vue'
import { markers, photos2, photos1 } from "@/components/data.js";
/* import photoSphereData from "@/utils/photoSphere/index"; */
export default {
  props: [],
  components: { photoSphereViewer, Aerial, MyVideo,MyLivePlayer },
  data() {
    return {
      currAlbumnIndexSave:1,
      video: {
        width: null,
        heigh: "auto",
        videoUrl:require("@/assets/video/demo.mp4"),
        // 视频封面支持https或require本地地址
        videoCover: require("@/assets/video/cover.png"),
        videoIsShow: false,
      },

      positionInfo: {},
      tooOften: false, //操作过于频繁
      photoList: photos1,
      markers: [],
      activeAlbumnId: 1,
      floor: 1,
      build: 1,
      hasGallery: true,
      hasMusic: true,
      showModal: false,
      showRadarModal: false,
      albumnList: [
        {
          id: 1,
          url: require("@/assets/guide/1_thumbnail.jpg"),
          name: "路线",
          currentIndex: 0,
        },
        {
          id: 2,
          url: require("@/assets/floor/037_thumbnail.jpg"),
          name: "室内",
          currentIndex: null,
        },
      ],
      navList: [
        { id: 1, name: "街区介绍" },
        { id: 2, name: "业务服务" },
        { id: 3, name: "主题特色" },
      ],
      floorList: [
        {
          id: 1,
          name: "F1",
        },
        {
          id: 2,
          name: "F2",
        },
        {
          id: 3,
          name: "F3",
        },
      ],
      buildList: [
        { id: 0, name: "请选择" },
        { id: 1, name: "文友楼" },
        { id: 2, name: "厚德楼" },
      ],
    };
  },
  created() {
    /*   this.photoList=photoSphereData.GUIDE_MODULES.photos;
    this.markers=photoSphereData.GUIDE_MODULES.markers; */
  },
  mounted() {},
  methods: {
    updateCurrAlbumnIndexSave(arg){
      console.log(arg);
        this.currAlbumnIndexSave=arg;
    },
    changeVideoShow(bol){
      this.video.videoIsShow = bol;
/*       if(!bol){
        this.$refs.viewer.startAutorotate()
      } */
      
    },
    updateViewer(albumnNum) {
      this.showRadarModal = false;
      this.$refs.viewer.updateIndex(0);
      this.changeAlbumns(albumnNum);

      this.$refs.viewer.handelChangeViewer();
    },
    rorateToYawFun(rorate) {
      const yaw = rorate / (360 / 6.282314);
      this.$refs.viewer.viewerRotate({
        yaw: yaw,
        pitch: this.positionInfo.pitch,
      });

      /*  this.positionInfo.yaw=yaw; */
    },
    changeAutorotate(bol) {
      if (bol) {
        this.$refs.viewer.startAutorotate();
      } else {
        this.$refs.viewer.stopAutorotate();
      }
    },
    positionInfoFun(Info) {
      this.positionInfo = Info;
    },
    //鸟瞰图
    handelRadar() {
      this.showRadarModal = !this.showRadarModal;
      if (this.showRadarModal) {
        this.$refs.viewer.positionUpdateListener();
        this.video.videoIsShow=false;
      } else {
        this.$refs.viewer.removePositionUpdateListener();
      }
    },
    //更新图库列表
    showViewerInfo() {
      this.$refs.viewer.getViewerInfo();
    },
    positionUpdateListener() {
      this.$refs.viewer.positionUpdateListener();
    },
    viewerfinishOneRound() {
      this.$refs.viewer.removePositionUpdateListener();
      this.showRadarModal = false;
      console.log("转完了呀");
    },
    updatePhotos() {},
    changeModal() {
      this.showViewerInfo();
      this.showModal = !this.showModal;
    },
    changePanel(bol) {
      this.hasGallery = bol;
    },
    changeBgmusic() {
      this.hasMusic = !this.hasMusic;
    },
    changetooOften(bol) {
      this.tooOften = bol;
    },
    changeAlbumns(id) {
      const _this = this;
      if (this.tooOften) {
        alert("操作过于频繁");
        return;
      }
      if (this.activeAlbumnId != id && this.hasGallery) {
        this.activeAlbumnId = id;
        if (id == 1) {
          this.photoList = photos1;
        }
        if (id == 2) {
          this.photoList = photos2;
        }

        this.$refs.viewer.galleryHide();

        setTimeout(function () {
          _this.$refs.viewer.galleryShow();
        }, 200); //
      } else {
        _this.$refs.viewer.galleryToggle();
      }
    },
    //更新标记
    updateMarkers() {},
    setOptions(info) {
      const myViewer = this.$refs.viewer;
      myViewer.showPanel("description", "<div>" + info.name + "</div>");
    },
    changeFloor() {
      console.log(this.floor);
    },
    //图库切换
    toggleGallery() {
      if (this.hasGallery) {
        this.$refs.viewer.galleryHide();
      } else {
        this.$refs.viewer.galleryShow();
      }

      this.hasGallery = !this.hasGallery;
    },

    updateHasGallery(bol) {
      this.hasGallery = bol;
    },
    //切换全屏
    changeFullscreen() {
      this.$refs.viewer.handleToggleFullscreen();
    },
    //标记选重
    selectMarker(marker) {
      const myViewer = this.$refs.viewer;
      const idArr = marker.id ? marker.id.split("-") : [];
      if (idArr.length > 0) {
        if (idArr[0] == "guide") {
          myViewer.updateIndex(idArr[1]);
          myViewer.handelChangeViewer();
        }
        if (idArr[0] == "video") {
          //查看视频
          this.video.videoIsShow = true;
          myViewer.stopAutorotate();
        }
        if (idArr[0] == "guideAlbumn") {
        }
        if (idArr[0] == "mark") {
          myViewer.updateMarker(marker.id, require("./../../assets/bao.png"));
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.photo-button-wrapper {
  ul {
    list-style: none;
  }
  .logo {
    width: 140px;
    height: 191px;
    position: absolute;
    top: 10px;
    left: 5px;
    z-index: 80;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
  .radar {
    position: absolute;
    right: 3%;
    top: 50%;
    width: 39.5px;
    height: 112.5px;
    z-index: 1002;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .navigation-block {
    position: absolute;
    right: 30px;
    top: 30px;
    z-index: 88;
    color: #57241b;

    li {
      width: 142px;
      height: 46px;
      line-height: 46px;
      text-align: center;
      margin: 0 10px;
      float: left;
      background: url("@/assets/tbtn_bg.png") center no-repeat;
      background-size: 142px 46px;
      cursor: pointer;
    }
  }
  .floor {
    position: fixed;
    top: 40px;
    left: 130px;
    z-index: 10;
    select {
      width: 120px;
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      border: none;
      font-size: 14px;
      color: #fff;
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.5);
      margin-left: 20px;
    }
  }
  .actions-box {
    width: 386px;
    height: 64.667px;
    line-height: 65px;
    position: absolute;
    z-index: 89;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    background: url("@/assets/btn_bg.png") center no-repeat;
    background-size: 100% 100%;
    .actions-inner {
      display: flex;
      flex-direction: row;
      justify-content: center;
      .btn {
        width: 50px;
        height: 50px;
        background-size: 45px 45px;
        margin: 10px 5px;
        background-color: rgba(102, 46, 25, 0.8);
        border-radius: 50%;
        background-position: center;
        background-repeat: no-repeat;
        cursor: pointer;
      }
      .btn1 {
        background-image: url("@/assets/vr-btn-scene_3.png");
      }
      .btn2 {
        background-image: url("@/assets/bgmusic-open_3.png");
        &.active {
          background-image: url("@/assets/bgmusic-close_3.png");
        }
      }

      .btn3 {
        background-image: url("@/assets/vr-btn-share_3.png");
      }
      .btn4 {
        background-image: url("@/assets/full-screen_3.png");
      }
    }
  }
  .albumn-block {
    width: 100%;
    height: 80px;
    position: absolute;
    bottom: 78px;
    left: 0;
    z-index: 88;
    transform: translateY(200px);
    pointer-events: none;
    transition: transform ease-in-out 0.1s;
    &.open {
      transform: translateY(0);
    }
    display: inline-block;
    .albumn-inner {
      display: flex;
      justify-content: center;
      .albumn-item {
        margin: 0 4px;
        width: 85px;
        height: 85px;
        background: url("@/assets/group2.png") center no-repeat;
        background-size: 85px 85px;
        text-align: center;
        position: relative;
        pointer-events: auto;
        &.active {
          background: url("@/assets/group1.png") center no-repeat;
          background-size: 85px 85px;
        }
        img {
          width: 70px;
          height: 70px;
          margin-top: 8px;
          cursor: pointer;
        }
        .title {
          position: absolute;
          width: 70px;
          z-index: 12;
          bottom: 8px;
          left: 6px;
          background: rgba(0, 0, 0, 0.5);
          height: 2em;
          line-height: 2em;
          font-size: 12px;
          color: #fff;
          text-align: center;
        }
      }
    }
  }
}
.modal {
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  z-index: 1001;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .modal-inner {
    width: 500px;
    height: 500px;
    background: #fff;
    position: relative;
    margin: 0 auto;
    margin-top: 10%;
  }
  .close {
    width: 30px;
    height: 30px;
    position: absolute;
    top: 20px;
    right: 15px;
    z-index: 1002;
    img {
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  }
  .modal-content {
    width: 100%;
    text-align: center;
    img {
      margin-top: 80px;
      max-width: 100%;
    }
  }
  .modal-inner1 {
    /*  width:50%;
   height: auto;
   background: #fff; */
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateY(-50%) translateX(-50%);
    img {
      max-width: 100%;
      width: 100%;
      height: auto;
      margin: 0;
    }
  }
}
/deep/ {
  .psv-gallery {
    background: none;
    border: none;
    z-index: 88;
    pointer-events: none;
  }
  .psv-gallery-container {
    justify-content: center;
  }
  .psv-gallery.psv-gallery--open {
    transform: translateY(-150px) !important;
  }
  .psv-gallery-item {
    pointer-events: auto;
  }
  .psv-gallery-item::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: 3px solid white;
    z-index: 3;
  }
  .psv-gallery-item--active::after {
    /*  rgb(246, 166, 0) */
    border-color: rgb(246, 166, 0);
  }
  
  .psv-gallery-item-title {
    bottom: 0;
    top: auto;
    font-size: 12px;
  }
  .psv-gallery-item:hover .psv-gallery-item-title{
    height: 2.2em;
  }

  .psv-panel {
  }
}
.video-wrap {
  position: absolute;
  z-index: 1009;
  width: 50%;
  height: 50%;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  .video-inner {
    position: relative;
    width: 100%;
    text-align: center;
    background: rgb(43, 40, 40);
  }
  .close {
    width: 30px;
    height: 30px;
    position: absolute;
    top: 20px;
    right: 15px;
    z-index: 1002;
  }
}
@media screen and (max-width: 500px) {
  .video-wrap{
    width: 100%;
  }
   .photo-button-wrapper  .actions-box {
    transform: scale(0.7);
    left: 0;
  }
  /deep/ {
    .psv-gallery-container{
      margin: 0;
      padding: 0;
      flex-wrap: nowrap;
    }
    .psv-gallery{
      top: auto;
    }
    .psv-gallery .psv-gallery-item {
      width: 80px !important;
      height: 80px !important;
      margin-bottom: 0;
    }
    .psv-gallery.psv-gallery--open {
      transform: translateY(-165px) !important;
    }
    .psv-gallery .psv-panel-close-button {
      display: none;
    }
  }
  .photo-button-wrapper .logo {
    width: 70px;
    height: 95.5px;
  }
  .photo-button-wrapper .navigation-block li {
    width: 85.2px;
    height: 27.6px;
    line-height: 28px;
    background-size: 85.2px 27.6px;
    cursor: pointer;
    font-size: 12px;
    margin: 0 4px;
  }
  .photo-button-wrapper .navigation-block {
    right: 0;
    top: 0;
  }

}

</style>