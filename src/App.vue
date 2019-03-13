<template>
  <div id="app">
      <app-header/>
      <router-view/>
        <app-footer/>
    </div>
</template>

<script>
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';

export default {
  name: 'app',
  components: {
      AppHeader,
      AppFooter
  }
}
</script>

<style>

</style>
