<template>
    <div id="imagefeed" class="page">
        <h3>Create Account</h3>

    </div>
</template>

<script>
    export default {
        name: "CreateAccount",
        data () {
            return {
            }
        },
        computed: {
            loggedIn: function() {
                return this.$store.getters.loggedIn;
            }
        }
    }
</script>

<style scoped>
    .page {
        padding-bottom: 30px;
    }
</style>