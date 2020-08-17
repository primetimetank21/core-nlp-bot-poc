<template>
  <div class="fill-height home">
    <HelloWorld/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    HelloWorld
  }
};
</script>

<style>
  @keyframes bgcolor {
    0% {
      background-color: #ad7e7e
    }
    50% {
      background-color: #fa7572
    }
    100% {
      background-color: #5E3939
    }
  }
  .home {
    -webkit-animation: bgcolor 20s infinite;
    animation: bgcolor 10s infinite;
    -webkit-animation-direction: alternate;
    animation-direction: alternate;
  }
</style>
