<template>
    <div class="admin">
        <el-button @click="getUsers">按钮</el-button>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    import { getUser } from "@/api/Api";

    // Define the component in class-style
    @Component({
        name: 'Admin',
        components: {}
    })
    export default class Admin extends Vue {
        getUsers() {
            getUser().then( (data:any) => {
                console.log(data);
            })
            .catch( (err:any) => {
                console.log(err);
            })
        }
    }
</script>