<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-images="topIamges"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo"
                         @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info ref="params" :param-info="paramInfo"></detail-param-info>
      <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
      <good-list ref="recommmend" :goods="recommends"></good-list>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import DetailNavBar from "@/views/detail/childComps/DetailNavBar";
import DetailSwiper from "@/views/detail/childComps/DetailSwiper";
import DetailBaseInfo from "@/views/detail/childComps/DetailBaseInfo";
import DetailShopInfo from "@/views/detail/childComps/DetailShopInfo";
import scroll from "@/components/common/scroll/Scroll";
import detailGoodsInfo from "@/views/detail/childComps/DetailGoodsInfo";
import detailParamInfo from "@/views/detail/childComps/DetailParamInfo";
import detailCommentInfo from "@/views/detail/childComps/DetailCommentInfo";
import GoodList from "@/components/context/goods/GoodList";
import DetailBottomBar from "@/views/detail/childComps/DetailBottomBar";
import {backTopMixin, itemListerMixin} from "@/common/mixin"
import {debounce} from "@/common/utils";

import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "@/network/detail";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    scroll,
    detailGoodsInfo,
    detailParamInfo,
    detailCommentInfo,
    GoodList,
    DetailBottomBar
  },

  data() {
    return {
      iid: null,
      topIamges: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0
    }
  },
  created() {
    this.iid = this.$route.params.iid
    getDetail(this.iid).then((res) => {
      const data = res.result
      this.topIamges = data.itemInfo.topImages
      this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)
      this.shop = new Shop(data.shopInfo)
      this.detailInfo = data.detailInfo
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
      if (data.rate.list) {
        this.commentInfo = data.rate.list[0];
      }
    })

    getRecommend().then(res => {
      this.recommends = res.data.list
    })

    this.getThemeTopY = debounce(() => {
      this.themeTopYs = []
      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommmend.$el.offsetTop)
      //console.log(this.themeTopYs)
    },100)
  },
  mixins: [itemListerMixin,backTopMixin],
  methods: {
    imageLoad() {
      this.$refs.scroll.refresh()
      this.getThemeTopY()
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],500)
    },
    contentScroll(position) {
      const positionY = -position.y
      let length = this.themeTopYs.length
      for(let i = 0; i < length; i++) {
        if(this.currentIndex !== i && ((i < length-1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) ||
          (i === length-1 && positionY >= this.themeTopYs[i]))){
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex
          // console.log(i);
        }
      }

      this.isShowBackTop = (-position.y) > 1000
    },
    addToCart() {
      const product = {}
      product.image = this.topIamges[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid

      this.$store.dispatch('addCart',product)
    }
  },
  mounted() {
  },
  destroyed() {
    this.$bus.$off('itemImgLoad',this.itemImgListener)
  }
}
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 3;
    background-color: #ffffff;
    height: 100vh;
  }

  .content {
    height: calc(100% - 44px - 58px);
  }

  .detail-nav {
    position: relative;
    z-index: 3;
    background-color: #fff;
  }
</style>
