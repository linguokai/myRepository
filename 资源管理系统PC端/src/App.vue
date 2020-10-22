<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@font-face {
  font-family: 'Digital';
  src: url('assets/font/Digital.ttf');
}
body{
  margin: 0;
  padding: 0;
  background: whitesmoke;
}
a{
  text-decoration: none;
}
p{
  margin: 0;
}
/* div{
  text-align: center;
} */
</style>
