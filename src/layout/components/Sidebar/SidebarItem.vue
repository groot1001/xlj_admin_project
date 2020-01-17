<template>
  <div>
    <div v-if="this.$route.path!='/account'&&this.$route.path!='/accounts/company_info'&&this.$route.path!='/accounts/qualifications'&&this.$route.path!='/accounts/uplaccountcode'">
      <div v-if="!item.hidden" class="menu-wrapper">
        <template
          v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow"
        >
          <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
            <el-menu-item
              :index="resolvePath(onlyOneChild.path)"
              :class="{'submenu-title-noDropdown':!isNest}"
            >
              <item
                :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)"
                :title="onlyOneChild.meta.title"
              />
            </el-menu-item>
          </app-link>
        </template>

        <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
          <template slot="title">
            <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
          </template>
          <sidebar-item
            v-for="child in item.children"
            :key="child.path"
            :is-nest="true"
            :item="child"
            :base-path="resolvePath(child.path)"
            class="nest-menu"
          />
        </el-submenu>
      </div>
    </div>
    <div v-else>
      <!-- 账户中心的路由 -->
      <div v-if="item.type_nav==='account'" class="menu-wrapper">
        <template
          v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow"
        >
          <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
            <el-menu-item
              :index="resolvePath(onlyOneChild.path)"
              :class="{'submenu-title-noDropdown':!isNest}"
            >
              <item
                :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)"
                :title="onlyOneChild.meta.title"
              />
            </el-menu-item>
          </app-link>
        </template>

        <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
          <template slot="title">
            <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
          </template>
          <sidebar-item
            v-for="child in item.children"
            :key="child.path"
            :is-nest="true"
            :item="child"
            :base-path="resolvePath(child.path)"
            class="nest-menu"
          />
        </el-submenu>
      </div>
    </div>
  </div>
</template>
<style scoped>

.is-active {
  color: #1286fd !important;
}
</style>

<script>
import path from "path";
import { isExternal } from "@/utils/validate";
import Item from "./Item";
import AppLink from "./Link";
import FixiOSBug from "./FixiOSBug";

export default {
  name: "SidebarItem",
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ""
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function使用呈现函数重构
    this.onlyOneChild = null;
    return {};
  },
  //   beforeCreate(){
  // console.log(this.$route.path);
  //   },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false;
        } else {
          // Temp set(will be used if only has one showing child)
          //临时设置（只有一个显示子项时使用）
          this.onlyOneChild = item;
          return true;
        }
      });

      // When there is only one child router, the child router is displayed by default
      //当只有一个子路由器时，默认情况下会显示子路由器。

      // if (showingChildren.length === 1) {
      //   return true
      // }

      // Show parent if there are no child router to display
      //如果没有要显示的子路由器，则显示父路由器
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
        return true;
      }

      return false;
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        //是外部的链接
        return routePath;
      }
      if (isExternal(this.basePath)) {
        return this.basePath;
      }
      return path.resolve(this.basePath, routePath);
      //webpack 的路径解析方法
    }
  }
};
</script>

