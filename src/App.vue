<template>
  <div id="app">
    <h3>The Opinionator</h3>
    <survey :sc="scenario"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld';
import Survey from './components/survey';
import Scenarios from './util/scenarios';

export default {
  name: 'App',
  data() {
    return {
      scenario: null
    };
  },
  components: {
    Survey
  },
  mounted() {
    this.scenario = Scenarios.getScenario();
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

h3 {
  margin-bottom: 5px;
  margin-top: 5px;
}
</style>
