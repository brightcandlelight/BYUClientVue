<template>
    <form>
        Info: <input type="text" name="username" v-bind:value="info" required @change="saveInfo" /> <br><br>
        Id: <input type="text" name="register" v-bind:value="id" required @change="saveId"/> <br><br>

        <button class="button" v-on:click="login()" type="button">Login</button>
    </form>
</template>

<script>
    export default {
        name: "Phone",
        data () {
            return {
                info: "{}",
                id: ""
            }
        },
        methods: {
            login: function() {
                const body = JSON.parse(this.info);
                if (this.id) {
                    body.certId = this.id;
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