<template>
    <v-card
            class="mx-auto"
    >
        <!-- type and status-->
        <v-card-title>
            <v-chip class="ma-2" label>
                {{ document.product }}
            </v-chip>

            <!-- handling the completion -->
            <v-chip
                    v-if="document.status === 'Not Completed'"
                    class="ma-2"
                    color="red"
                    label
                    text-color="white">
                <v-icon left>mdi-label</v-icon>
                {{ document.status }}

            </v-chip>
            <v-chip
                    v-if="document.status === 'Pending'"
                    class="ma-2"
                    color="orange"
                    label
                    text-color="white">
                <v-icon left>mdi-label</v-icon>
                {{ document.status }}

            </v-chip>
            <v-chip
                    v-if="document.status === 'Completed'"
                    class="ma-2"
                    color="green"
                    label
                    text-color="white">
                <v-icon left>mdi-label</v-icon>
                {{ document.status }}

            </v-chip>
        </v-card-title>

        <v-card-subtitle>
            <span class="display-1 font-weight-light">
                {{ document.name }}
            </span>
        </v-card-subtitle>

        <v-card-text>
            <span class="black--text">
                {{ document.text }}
            </span>
        </v-card-text>
    </v-card>
</template>

<script>
    export default {
        name: "request",
        props: {
            document: Object
        },
        data() {
            return {

            }
        }
    }
</script>

<style scoped>

</style>