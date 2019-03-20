<template>
    <div id="imagefeed" class="page">
        <h3>Create Account</h3>
        <form>
            Username: <input type="text" name="username" v-bind:value="username" required /> <br>
            Registration Code: <input type="text" name="register" v-bind:value="register" required />
            Email: <input type="text" name="email" v-bind:value="email" required />
            <button class="button" v-on:click="createAccount()" type="button">Submit</button>
        </form>
    </div>
</template>

<script>
    export default {
        name: "CreateAccount",
        data () {
            return {
                username: String,
                register: String,
                email: String
            }
        },
        computed: {
            loggedIn: function() {
                return this.$store.getters.loggedIn;
            }
        },
        methods: {
            createAccount: function() {
                //const options = { username: this.data.username, register: this.data.register, email: this.data.email};
            }
        }
    }
</script>

<style scoped>
    .button {
        -webkit-appearance: button;
        -moz-appearance: button;
        appearance: button;

        text-decoration: none;
        color: initial;
        padding: 5px;
    }
    .page {
        padding-bottom: 30px;
    }
</style>