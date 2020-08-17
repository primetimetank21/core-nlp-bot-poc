<template>
    <v-card flat
            class="mx-auto"
            color="#26c6da"
            dark
    >
        <v-card-title>
            <span class="overline">
                Dashboard
            </span>
        </v-card-title>

        <v-card-text class="">
            <v-container fluid>
                <v-row>
                <span class="display-2 font-weight-light">
                    Welcome, <br> Ikechukwu Anude
                </span>
                </v-row>

                <v-row>
                    <v-col>
                        <span class="display-1 font-weight-medium">
                            You have {{ numRequests }} requests waiting.
                        </span>
                    </v-col>
                </v-row>
            </v-container>

        </v-card-text>
    </v-card>
</template>


<script>
    export default {
        name: "userInformationDashboard",
        data() {
            return {
                numRequests: 29,
                completedProjectsPercentage: 20
            }
        }
    }
</script>

<style scoped>

</style>