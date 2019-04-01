<template>
    <div id="imagefeed" class="page">
        <div v-if="loggedIn">
            <h3>Logout to create an account</h3>
        </div>
        <div v-else>
            <h3>Create Account</h3>
            <form>
                Username: <input type="text" name="username" v-bind:value="username" required @change="saveUserName" /> <br><br>
                Registration Code: <input type="text" name="register" v-bind:value="register" required @change="saveRegister"/> <br><br>
                Email: <input type="text" name="email" v-bind:value="email" required @change="saveEmail" /> <br><br>
                Scan QR code with app:
                <div v-html="qrCodeHtml.html" style="zoom:2;"></div>
                <div><a v-bind:href="qrCodeHtml.url" target="_blank">Bypass</a></div>
                <button class="button" v-on:click="createAccount()" type="button">Submit</button>
            </form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CreateAccount",
        data() {
            return {
                username: "",
                register: "",
                email: ""
            }
        },
        created: function() {
            this.$store.dispatch('login', "");
        },
        computed: {
            loggedIn: function() {
                return this.$store.getters.loggedIn;
            },
            qrCodeHtml: function() {
                return this.$store.getters.qrCodeHtml;
            }
        },
        methods: {
            createAccount: function() {
                const options = { username: this.username, register: this.register, email: this.email};
                this.$store.dispatch('createAccount', options);
            },
            saveUserName: function(e) {
                this.username = e.currentTarget.value;
            },
            saveRegister: function(e) {
                this.register = e.currentTarget.value;
            },
            saveEmail: function(e) {
                this.email = e.currentTarget.value;
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