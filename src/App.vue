<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="route.meta.transition">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script>
const debounce = (fn, delay) => {
  let timer = null;
  return function () {
    let context = this;
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  }
}

const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver{
  constructor(callback) {
    callback = debounce(callback, 16);
    super(callback);
  }
}
export default {
  name: 'App'
}
</script>

<style>
#app {
  width: 100%;
  height: 100%;
}

.face-enter-active,
.face-leave-active {
  transition: all 1s ease;
}

.face-enter-from,
.face-leave-to {
  transform: translateX(50px);
  opacity: 0;
}

.face-enter-to,
.face-leave-from {
  transform: translateX(0px);
  opacity: 1;
}

.into-enter-active,
.into-leave-active {
  transition: all 1s ease;
  position: absolute;
}

.into-enter-from,
.into-leave-to {
  transform: scale(0);
  left: -100%;
  top: -100%;
  opacity: 0;
}

.into-enter-to,
.into-leave-from {
  transform: scale(1);
  left: 0%;
  top: 0%;
  opacity: 1;
}
</style>
