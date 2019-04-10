<template>
    <body background="android1.png" style="height:300px; max-width:300px; background-size:100%">
    <br><br>
    <center>
    <div style="color: white;">
        <form>
            <div v-if="error" style="">{{error}}<br></div>
            <h2>Login</h2>
            <input type="text" name="username" v-bind:value="info" required @change="saveInfo" hidden />
            <input type="text" name="register" v-bind:value="id" required @change="saveId" hidden/>

            Login with:
            <select v-model="loginWith">
                <option disabled value="">Please select one</option>
                <option>New Account</option>
                <option>Admin 1</option>
                <option>User 1</option>
            </select><br><br>

            <button class="button" v-on:click="login()" type="button">Login</button>
        </form>
    </div>
    </center>
    </body>
</template>

<script>
    export default {
        name: "Phone",
        props: {
            info: String
        },
        data () {
            return {
                id: "",
                loginWith: ""
            }
        },
        computed: {
            error: function() {
                return this.$store.getters.error;
            }
        },
        methods: {
            login: function() {
                const body = JSON.parse(this.info);
                let id = this.id;
                // Hard coded for demo purposes
                if (this.loginWith === "Admin 1") {
                    id = "C90edba1c9d0bb14ec514a96ca800a95448adb82f1adced02b66c15b4091777d2";
                } else if (this.loginWith === "User 1") {
                    id = "C90edba1c9d0bb14ec514a96ca800a95448adb82f1adced02b66c15b4091777d2";
                }

                if (id) {
                    body.certId = id;
                }
                this.$store.dispatch('phoneHack', body);
            },
            saveInfo: function(e) {
                this.info = e.currentTarget.value;
            },
            saveId: function(e) {
                this.id = e.currentTarget.value;
            }
        }
    }
</script>

<style scoped>

</style>