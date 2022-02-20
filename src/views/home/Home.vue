<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <scroll class="content" ref="scroll" :probe-type="3"  @scroll="contentScroll">
      <home-swiper :banners="banners"></home-swiper>
      <homecommend-view :recommends="recommends"></homecommend-view>
      <feature-view></feature-view>
      <tab-control class="tab-control"
                   :titles="['流行','新款','精选']"
                   @tabClick="tabClick" ></tab-control>
      <good-list :goods="goods[currentType].list"></good-list>
    </scroll>
    <back-top  @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import GoodList from "@/components/context/goods/GoodList";
import Scroll from "@/components/common/scroll/Scroll";
import BackTop from "@/components/context/backTop/BackTop";

import HomeSwiper from "./childComps/HomeSwiper";
import HomecommendView from "./childComps/HomecommendView";
import FeatureView from "./childComps/FeatureView";
import TabControl from "../../components/context/tabControl/TabControl";

import {getHomeMultidata,getHomeGoods} from "@/network/home";



export default {
  name: "Home",
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': {page: 0,list: []},
        'new': {page: 0,list: []},
        'sell': {page: 0,list: []}
      },
      currentType: 'pop',
      isShowBackTop: false
    }
  },
  components: {
    NavBar,
    HomeSwiper,
    HomecommendView,
    FeatureView,
    TabControl,
    GoodList,
    Scroll,
    BackTop
  },
  created() {
    this.getHomeMultidata()
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  methods: {
    tabClick(index) {
      console.log('dasd')
      switch (index) {
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
    },
    backClick() {
        this.$refs.scroll.scrollTo(0,0,500)
    },
    contentScroll(position) {
      this.isShowBackTop = (-position.y) > 1000
    },
    //网络请求
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      })
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1
      getHomeGoods(type,page).then(res => {
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page +=1
      })
    }
  }
}
</script>

<style scoped>
   #home {
     padding-top: 44px;
     height: 100vh;
     position: relative;
   }
  .home-nav {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    background-color: var(--color-tint);
    color: #fff;
    z-index: 2;
  }
  .tab-control {
    position: sticky;
    top: 44px;
    z-index: 2;
  }
  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    right: 0;
    left: 0;
  }

</style>
