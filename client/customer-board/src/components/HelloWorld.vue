<template>
  <v-container>
    <!--will need to refractor so it works in 2.x vuetify and can vertically center-->
    <v-container fill-height grid-list-md text-xs-center fluid>
      <v-layout row wrap align-center>
        <v-flex class="text-center placeholder">

        </v-flex>
        <v-flex class="text-center">
          <v-layout column>

            <v-flex v-if="$vuetify.breakpoint.xsOnly">
                        <span>
                            <p class="display-2 font-weight-light white--text shadow" > Jazzia Customer Serivce </p>
                        </span>
            </v-flex>
            <v-flex v-else>
                        <span>
                            <p class="display-3 white--text shadow"> Jazzia Customer Serivce </p>
                        </span>
            </v-flex>
            <v-flex>
                        <span class="white--text">
                            Welcome! Jazzia is a customer service software that acts aims <br>to make the professional lives
                          of creators that much easier!
                        </span>
            </v-flex>
            <v-flex>
                        <span class="white--text font-weight-light">
                            This application is currently in development.
                        </span>
            </v-flex>
            <v-flex>
              <v-btn x-large color="purple darken-3" dark @click="submit">Fetch Customer Requests</v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex class="text-center placeholder">

        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: "HelloWorld",

  data() {
    return {
      example: "home page"
    }
  },
  methods: {
    submit: function () {
      this.$router.push('dashboard'); // this should go to the dashboard page
    }
  }
};
</script>
