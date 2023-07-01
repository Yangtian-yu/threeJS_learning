<script setup>
import router from "./router/index";
import { useRouter } from "vue-router";
const _router = useRouter();
const routes = router.options.routes;
const routerTo = (path) => {
  _router.push(path);
};
console.log(router);
</script>

<template>
  <div class="menu">
    <ul>
      <li v-for="item in routes">
        <button @click="routerTo(item.path)">{{ item.meta.title }}</button>
      </li>
    </ul>
  </div>
  <router-view></router-view>
</template>

<style scoped>
.menu {
  position: fixed;
  height: 100vh;
  width: 120px;
  background-color: bisque;
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  z-index: 9999;
}
.menu li {
  list-style: none;
  margin-top: 10px;
  font-size: 11px;
}

.menu li button {
  padding: 0;
}
.menu ul {
  margin-block-start: 0;
  margin-block-end: 0;
  padding-inline-start: 0;
}
</style>
