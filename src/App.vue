<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/view2">View2</router-link>|
    <router-link to="/view3">View3</router-link>|
    <router-link to="/view4">View4</router-link>|
    <router-link to="/view5">View5</router-link>|
    <router-link to="/view6">View6</router-link>|
    <router-link to="/view7">View7</router-link>|
    <router-link to="/view8">View8</router-link>|
  </nav>
  <router-view />
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
