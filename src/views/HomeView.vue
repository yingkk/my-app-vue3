<template>
  <div ref="demo1" :id="dynamicId">
    <span ref="mySpan">{{ count }}</span>
    <button @click="handleIncrement">click me</button>
  </div>

  <div ref="demo2">
    <span>{{ state.num }}</span>
    <button @click="handleUnEffect">shallowRef uneffect</button>
    <button @click="handleEffect">shallowRef effect</button>
  </div>

  <div ref="demo3">
    <span>{{ _state.age }}</span>
    <button @click="handleChange">reactive替换整个对象 响应性链接丢失</button>
  </div>

  <div ref="demo4">
    <span>object.id未被解包： {{ object.id + 1 }}</span>
    <span>解构id为顶层属性 {{ id + 1 }}</span>
    <span>{{ object.id }} 等价于 {{ object.id.value }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref, shallowRef, nextTick, reactive } from "vue";

const dynamicId = ref("homeId");
console.log(dynamicId);
console.log(dynamicId.value);

const count = ref(0);
const mySpan = ref(); // tips: 变量名必须与 <span ref="mySpan"></span> 的 ref值一致
const handleIncrement = async () => {
  count.value++;
  console.log(mySpan.value.textContent);
  await nextTick(); // DOM更新不是同步的
  console.log(mySpan.value.textContent);
};

/**
 * 为什么我们需要使用带有 .value 的 ref，而不是普通的变量？
 *
 * 为了解释这一点，我们需要简单地讨论一下 Vue 的响应式系统是如何工作的。
 * 当你在模板中使用了一个 ref，然后改变了这个 ref 的值时，Vue 会自动检测到这个变化，并且相应地更新 DOM。
 * 这是通过一个基于依赖追踪的响应式系统实现的。当一个组件首次渲染时，Vue 会追踪在渲染过程中使用的每一个 ref。
 * 然后，当一个 ref 被修改时，它会触发追踪它的组件的一次重新渲染。
 * 但在标准的 JavaScript 中，检测普通变量的访问或修改是行不通的。然而，我们可以通过 getter 和 setter 方法来拦截对象属性的 get 和 set 操作。
 * 该 .value 属性给予了 Vue 一个机会来检测 ref 何时被访问或修改。在其内部，Vue 在它的 getter 中执行追踪，在它的 setter 中执行触发。
 */

/**
 * ref
 */
const user = ref({
  id: 1,
  name: "张三",
  isAdmin: false,
  dept: { name: "测试", id: "001", code: "test" },
  roles: ["add", "delete", "update"],
});
user.value.id++;
user.value.dept.code = "test1";
user.value.roles.push("query");
console.log(user.value);

/**
 * shallowRef 放弃深层响应性 即数据改变 view试图不更新
 * */
const state = shallowRef({ num: 1 });
function handleUnEffect() {
  state.value.num = 2;
}
function handleEffect() {
  state.value = { num: 2 };
}

/**
 * reactive
 */
const origin = { count: 4 };
const proxy = reactive(origin);

console.log(origin === proxy); //原始对象和代理对象是不相等的
console.log(reactive(origin) === proxy); //在同一个对象上调用 reactive() 会返回相同的代理
console.log(reactive(proxy) === proxy); //在一个代理上调用 reactive() 会返回它自己

/**
 *  ref() 和 reactive()的区别
 *
 *  ref:
 *    可以持有任何类型的值，包括深层嵌套的对象、数组或者 JavaScript 内置的数据结构，比如 Map。
 *    使它的值具有深层响应性，（即数据变化，数据试图会更新）。
 * reactive:
 *    它只能用于对象类型，eg:Object Array Map Set等
 *    返回的是一个原始对象的 Proxy，它和原始对象是不相等
 */

/**
 * reactive的局限性：
 *    不能替换整个对象
 *    对解构操作不友好
 */
let _state = reactive({ age: 1 });

// 不能替换整个对象：由于 Vue 的响应式跟踪是通过属性访问实现的，因此我们必须始终保持对响应式对象的相同引用。这意味着我们不能轻易地“替换”响应式对象，因为这样的话与第一个引用的响应性连接将丢失
const handleChange = () => {
  _state = reactive({ age: 2 });
  console.log(_state);
};

// 对解构操作不友好: 当我们将响应式对象的原始类型属性解构为本地变量时，或者将该属性传递给函数时，我们将丢失响应性连接
let { age } = _state;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
age++;
console.log(_state.age);
// _state.age++;
// console.log(_state.age);

/**
 * ref解包 : 见ref="demo4"
 *    只有当嵌套在一个深层响应式对象内时，才会发生 ref 解包。当其作为浅层响应式对象的属性被访问时不会解包。
 *    在模板渲染上下文中，只有顶级的 ref 属性才会被解包
 *    如果 ref 是文本插值的最终计算值 (即 {{ }} 标签)，那么它将被解包
 */

const count1 = ref(0);
const state1 = reactive({ num: count1 }); //即 代理对象 state1 的属性num 是代理对象 count1

console.log(state1.num);
state1.num = 1;
console.log(count1.value);

const count2 = ref(2);
state1.num = count2;
console.log(state1.num); //原始ref count1 现在已经和 state1.num 失去联系
console.log(count1.value);
/*
  my comments:
  obj = proxy {
          name: Proxy {
            value: 0
          }
        }
  obj.name = 1   ==> name.value = 1
  obj.name = Proxy{ value: 2 }   ==> obj.name = 2 && name.value = 1 代理对象引用地址变了
 */

const object = { id: ref(1) };
const { id } = object;
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
