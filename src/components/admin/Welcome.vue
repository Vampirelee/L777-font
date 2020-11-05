<template>
    <div class="welcome">
        欢迎页
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    // Define the component in class-style
    @Component({
        name: 'Welcome',
        components: {}
    })
    export default class Welcome extends Vue {

    }
</script>

<style lang="scss" scoped>

</style>
