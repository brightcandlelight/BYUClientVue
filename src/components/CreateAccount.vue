<template>
    <div id="createAccount" class="page">
        <div v-if="loggedIn">
            <h3>Logout to create an account</h3>
        </div>
        <div v-else>
            <div style="color:red;">{{error}}</div>
            <form>
                <table>
                    <tr>
                        <td>
                            <h3>Create Account</h3>
                        </td>
                    </tr>
                    <tr>
                        <td>Username:</td>
                        <td><input type="text" class="stepOne" name="username" v-bind:value="username" required @change="saveUserName" /> <br></td>
                    </tr>
                    <tr>
                        <td>Registration Code:</td>
                        <td><input type="text" class="stepOne" name="register" v-bind:value="register" required @change="saveRegister"/> <br></td>
                    </tr>
                    <tr>
                        <td>Email:</td>
                        <td><input type="text" class="stepOne" name="email" v-bind:value="email" required @change="saveEmail" /> <br></td>
                    </tr>
                    <tr></tr>
                    <tr>
                        <td colspan="2">
                            <button class="button stepOne" v-on:click="next()" type="button">Next</button><br>
                            <div id="next" hidden>
                                <br>
                                Scan QR code with app:
                                <div v-html="qrCodeHtml.html" style="zoom:2;"></div>
                                <a :href="qrCodeHtml.url" style="font-size:10px;" target="_blank">Use Phone Mockup</a><br><br>
                                <button class="button" v-on:click="createAccount()" type="button">Submit</button>
                            </div>
                        </td>
                    </tr>
                </table><br>
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
            },
            error: function() {
                const error = this.$store.getters.error;
                if (error) {
                    document.getElementById("next").setAttribute("hidden", "true");
                    const items = document.getElementsByClassName("stepOne");
                    for(let i = 0; i < items.length; i++) {
                        items.item(i).removeAttribute("disabled");
                    }
                }
                return this.$store.getters.error;
            }
        },
        methods: {
            createAccount: function() {
                this.$store.dispatch('login');
            },
            next: function() {
                if (this.username && this.register && this.email) {
                    this.$store.commit('setError', "");
                    const options = {username: this.username, register: this.register, email: this.email};
                    this.$store.dispatch('createAccount', options);
                    document.getElementById("next").removeAttribute("hidden");
                    const items = document.getElementsByClassName("stepOne");
                    for(let i = 0; i < items.length; i++) {
                        items.item(i).setAttribute("disabled", "true");
                    }
                } else {
                    this.$store.commit('setError', "Fill in required fields");
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
    table {
        border: 1px solid black;
    }
    table, th, td {
        padding: 3px;
    }
</style>