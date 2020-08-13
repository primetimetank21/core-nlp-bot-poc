<template>
    <!-- put some styling here -->
    <v-container fluid>
        <v-row v-for="doc in documents" :key="doc.dateCreated" class="pa-3">
            <Request :document="doc"/>
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
                documents: [],
            }
        },
        firestore: {
            documents: db.collection('requests')
        },
        methods: {
            getRequests: async function () {
                const requests = await db.collection('requests').get()
                return requests
            }
        }
    }
</script>

<style scoped>

</style>