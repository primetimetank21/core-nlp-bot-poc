<template>
    <!-- put some styling here -->
    <v-container>
        <v-row class="pa-3">
            <Request/>
        </v-row>
        <v-row class="pa-3">
            <Request/>
        </v-row >
        <v-row class="pa-3" >
            <Request/>
        </v-row>
    </v-container>

</template>

<script>
    import Request from "./request";
    import { db } from "../database"; // import the database

    // get the requests here
    export default {
        name: "dashboard",
        components: {Request},
        data() {
            return {
                documents: []
            }
        },
        firestore: {
            documents: db.collection('requests'),
        }
    }
</script>

<style scoped>

</style>