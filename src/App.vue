<template>

<Main />

</template>

<script>

import Main from './components/Main'

export default {
  name: 'App',
  components: {
    Main
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@300;400&display=swap');
@import url('https://fonts.googleapis.com/css2?family=PT+Sans:wght@700&display=swap');


* {
  /* margin: 0;
  padding: 0;
  box-sizing: border-box; */
  outline: none;
}

body {
    font-family: 'Kumbh', sans-serif!important;
}


body.dark{
    background: #181818;
    transition: background 0.4s;
}

body.dark .footer {
    background-color: #181818;
}

.footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 60px;
    line-height: 60px;
    /* background-color: #f5f5f5; */
    text-align: center;
    transition: background 0.4s;
    background-color: #f7f7f7;
}

.f20{
  font-size: 21px;
}

a {
   text-decoration: none;
   color: #74787b!important;
}
</style>
