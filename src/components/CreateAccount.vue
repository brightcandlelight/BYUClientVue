<template>
    <div id="imagefeed" class="page">
        <div v-if="loggedIn">
            <h3>Logout to create an account</h3>
        </div>
        <div v-else>
            <h3>Create Account</h3>
            <form>
                Username: <input type="text" class="stepOne" name="username" v-bind:value="username" required @change="saveUserName" /> <br><br>
                Registration Code: <input type="text" class="stepOne" name="register" v-bind:value="register" required @change="saveRegister"/> <br><br>
                Email: <input type="text" class="stepOne" name="email" v-bind:value="email" required @change="saveEmail" /> <br><br>
                <button class="button stepOne" v-on:click="next()" type="button">Next</button><br>
                <div id="next" hidden>
                    Scan QR code with app:
                    <div v-html="qrCodeHtml.html" style="zoom:2;"></div>
                    <div>{{qrCodeHtml.url}}</div>
                    <button class="button" v-on:click="createAccount()" type="button">Submit</button>
                </div>
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
        computed: {
            loggedIn: function() {
                const loggedIn = this.$store.getters.loggedIn;
                if (loggedIn) {
                    this.$router.push({ name: "UserAccount"});
                }
                return loggedIn;
            },
            qrCodeHtml: function() {
                return this.$store.getters.qrCodeHtml;
            }
        },
        methods: {
            createAccount: function() {
                this.$store.dispatch('login');
            },
            next: function() {
                if (this.username && this.register && this.email) {
                    const options = {username: this.username, register: this.register, email: this.email};
                    this.$store.dispatch('createAccount', options);
                    document.getElementById("next").removeAttribute("hidden");
                    const items = document.getElementsByClassName("stepOne");
                    for(let i = 0; i < items.length; i++) {
                        items.item(i).setAttribute("disabled", "true");
                    }
                }
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