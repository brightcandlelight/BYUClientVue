<template>
    <div id="useraccount" class="page">
        <div v-if="loggedIn">
            <h2>User Account</h2>
            Username: <input type="text" name="username" v-bind:value="username" @change="saveUserName" /> &nbsp;
            <hr>
            <div><h3>My Photos</h3>
                <router-link :to="{name: 'UploadPhoto'}" class="button">Upload Photo</router-link><br><br>
                <PictureHolder v-bind:imageList="imageData" v-bind:updateDataFunc="'getUserAccount'"></PictureHolder>
            </div>
        </div>
        <div v-else>
            <h3>Scan the QR code to login</h3>
            <div v-html="qrCodeHtml"></div>
            <a :href="$router.resolve({name: 'UserAccount'}).href" class="button">Continue</a>
        </div>
    </div>
</template>

<script>
    import PictureHolder from './PictureHolder.vue'

    export default {
        name: "UserAccount",
        components: {PictureHolder},
        data () {
            return {
            }
        },
        created: function() {
            this.$store.dispatch('login', "getUserAccount");
        },
        computed: {
            qrCodeHtml: function() {
                return this.$store.getters.qrCodeHtml;
            },
            loggedIn: function() {
                return this.$store.getters.loggedIn;
            },
            imageData: function() {
                return this.$store.getters.imageData;
            },
            username: function() {
                return this.$store.getters.userInfo ? this.$store.getters.userInfo.username : "";
            }
        },
        methods: {
            saveUserName: function(e) {
                if (e.currentTarget.value) {
                    this.$store.dispatch('saveUserInfo', {username: e.currentTarget.value});
                }
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