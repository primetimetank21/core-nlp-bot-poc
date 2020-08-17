<template>
    <v-card flat transparent class="full-width">
        <!--all the top level elements will go here-->

        <v-card-title>
            <UserDashboard/>
        </v-card-title>
        <v-card-text>
            <v-container fluid>
                <v-row>
                    <v-col>
                        <div class="fill-height home">
                            <Dashboard/>
                        </div>
                    </v-col>
                    <v-col>
                        <div class="fill-height home">
                            <Dashboard/>
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
    </v-card>


</template>

<script>
    import Dashboard from "@/components/dashboard.vue";
    import UserDashboard from "@/components/userInformationDashboard.vue"
    export default {
        name: "AccountDashboard",
        components: {
            Dashboard,
            UserDashboard
        }
    }
</script>

<style scoped>

</style>