<template>
  <div id="app">
    <survey/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld';
import Survey from './components/survey';

export default {
  name: 'App',
  components: {
    HelloWorld,
    Survey
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 10px;
}
</style>
