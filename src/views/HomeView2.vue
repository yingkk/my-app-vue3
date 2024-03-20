<template>
  <div>
    <span>{{ hasBooks }}</span>
    <span>{{ hasBooks1() }}</span>
  </div>
  <div>
    <span>{{ fullName }}</span>
  </div>
  <div>
    <span>{{ count }}</span>
    <button @click="handleAdd">click me add</button>
    <span ref="mySpan">{{ data }}</span>
  </div>
</template>
<script lang="ts" setup>
import { reactive, computed, ref, watch, watchEffect } from "vue";

const author = reactive({
  name: "John Doe",
  books: [
    "Vue 2 - Advanced Guide",
    "Vue 3 - Basic Guide",
    "Vue 4 - The Mystery",
  ],
});

const hasBooks = computed(() => {
  return author.books.length ? "YES" : "NO";
});

const hasBooks1 = () => {
  return author.books.length ? "YES" : "NO";
};

/**
 * computed vs methods
 *   计算属性值会基于其响应式依赖被缓存, 一个计算属性仅会在其响应式依赖更新时才重新计算.
 */

const firstName = ref("zhang");
const lastName = ref("san");

const fullName = computed({
  get() {
    return firstName.value + " " + lastName.value; //只读且不被更改
  },
  set(newValue) {
    [firstName.value, lastName.value] = newValue.split(" ");
  },
});

/**
 * watch vs. watchEffect
 *  watch 只追踪明确侦听的数据源。它不会追踪任何在回调中访问到的东西。
 *        另外，仅在数据源确实改变时才会触发回调。watch 会避免在发生副作用时追踪依赖，
 *        因此，我们能更加精确地控制回调函数的触发时机。
 *  watchEffect 会在副作用发生期间追踪依赖。它会在同步执行过程中，自动追踪所有能访问到的响应式属性。这更方便，而且代码往往更简洁，但有时其响应性依赖关系会不那么明确。
 */

/**
 * 后置刷新postWatchers watchPostEffect  flush: "post" 在侦听器回调中能访问被 Vue 更新之后的所属组件的 DOM
 * 同步侦听器           watchSyncEffect  flush: "sync" 在 Vue 进行任何更新之前触发
 */

const count = ref(0);
const data = ref(null);
const handleAdd = () => {
  count.value++;
};

watch(count, (newCount) => {
  console.log("watch new count is:" + newCount);
});

// watch(
//   count,
//   async () => {
//     const response = await fetch(
//       `https://jsonplaceholder.typicode.com/todos/${count.value}`
//     );
//     data.value = await response.json();
//   },
//   {
//     immediate: true,
//   }
// );
//等价于
// watchEffect(async () => {
//   const response = await fetch(
//     `https://jsonplaceholder.typicode.com/todos/${count.value}`
//   );
//   data.value = await response.json();
// });

const mySpan = ref();
watchEffect(
  async () => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${count.value}`
    );
    data.value = await response.json();
    console.log(mySpan.value);
  },
  { flush: "post" }
);
</script>
<style lang="less" scoped>
div {
  display: flex;
  align-items: center;
}
div:not(:first-child) {
  margin-top: 10px;
}
span {
  display: inline-block;
  margin-right: 20px;
}
button {
  height: 30px;
}
</style>
