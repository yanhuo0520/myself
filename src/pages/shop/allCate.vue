<template>
  <div class="allCate">
    <van-nav-bar
      title="全部分类"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <van-tree-select
      height="100vh"
      :items="items"
      :main-active-index.sync="active"
      @click-nav="clickActive"
    >
      <template #content>
        <van-grid :border="false" :column-num="3" v-if="secondSort.length > 0">
          <van-grid-item
            v-for="(item, index) in secondSort"
            :key="index"
            @click="toLookUp(item.son_assort_id, item.parent_id)"
          >
            <span>
              <img :src="item.icon" alt="" />
            </span>
            <span>{{ item.assort_name }}</span>
          </van-grid-item>
        </van-grid>
        <p v-else style="margin: 20px; text-align: center">暂无二级分类</p>
      </template>
    </van-tree-select>
  </div>
</template>
<script>
export default {
  name: "allCate",
  data() {
    return {
      active: 0,
      items: [],
      secondSort: [],
    };
  },
  methods: {
    leftBack() {
      this.$router.go(-1)
    },
    clickActive(index) {
      console.log(index);
      this.secondCate(this.items[index].id);
    },

    secondCate(id) {
      this.$api
        .shop_second_category({
          assort_id: id,
        })
        .then((res) => {
          if (res.errno === 0) {
            this.secondSort = res.data;
          }
        });
    },

    toLookUp(id, parent_id) {
      this.$router.push({
        path: "/lookupGoods",
        query: {
          assort_id: parent_id,
          son_assort_id: id,
        },
      });
    },
  },
  mounted() {
    window.scroll(0, 0);
    this.$api.shop_first_category().then((res) => {
      if (res.errno === 0) {
        res.data.forEach((ele) => {
          this.items.push({
            text: ele.assort_name,
            id: ele.assort_id,
            children: [],
          });
        });
        this.secondCate(this.items[0].id);
      }
    });

    window.leftBack = this.leftBack
  },
};
</script>
<style lang="less">
.allCate {
  .van-nav-bar {
    .van-icon,
    .van-nav-bar__text {
      color: #444;
    }
  }
  .van-sidebar-item--select::before {
    background-color: #41c3ff;
    width: 2px;
    height: 48px;
  }
  .van-grid {
    img {
      width: 70px;
    }
    span:first-of-type {
      background: #f9f8f8;
      margin-bottom: 5px;
    }
  }
}
</style>