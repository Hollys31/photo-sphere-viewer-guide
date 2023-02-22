<template>
  <div class="">
      <live-player
  :videoUrl=videoUrl  autoplay live stretch
></live-player>
  </div>
</template>

<script>
import LivePlayer from '@liveqing/liveplayer'
export default {
  props: [],
  components: {LivePlayer},
  data() {
   return {
       videoUrl:'http://11.100.41.15:8090/live/03607010001132000000101/hls.m3u8',
       videoParams:{
          videoUrl:'http://live.hkstv.hk.lxdns.com/live/hks/playlist.m3u8', 
          poster:require("@/assets/video/cover1.png"),
          carouselShow:true
       }
   }
  },
  created() {},
  mounted() {},
  methods: {},
  
}
</script>
<style lang="scss" scoped>
</style>