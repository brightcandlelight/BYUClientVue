<template>
    <div id="useraccount" class="page">
        <div v-if="loggedIn">
            <div v-if="!isAdmin">
                <h2>User Account</h2>
            </div>
            <div v-else>
                <h2>Admin Account</h2>
            </div>
            Username: <input type="text" name="username" v-bind:value="username" @change="saveUserName" /> &nbsp;
            <hr>
            <div><h2>My Photos</h2>
                <router-link :to="{name: 'UploadPhoto'}" class="button">Upload Photo</router-link><br>
                <PictureHolder v-bind:imageList="imageData" v-bind:updateDataFunc="'getUserAccount'"></PictureHolder>
            </div><br>
            <div v-if="!isAdmin">
            <hr>
            <div><h2>My Points</h2>
                <table>
                    <tr>
                        <th width="5px">Date</th>
                        <th>Reason</th>
                        <th>Amount ($)</th>
                    </tr>
                    <tr v-for="item in imagePointData" v-bind:key="item.key">
                        <td>{{item.winnersDate}}</td>
                        <td>{{item.winners}}</td>
                        <td>${{item.points}}</td>
                    </tr>
                    <tr>
                        <td colspan="2"><b>Total:</b></td>
                        <td><b>${{totalPoints}}</b></td>
                    </tr>
                </table>
            </div>
            </div>
            <div v-if="isAdmin">
                <br>
                <hr>
                <h2>All Users and Points</h2>
                <table>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Registration Code</th>
                        <th>Points</th>
                    </tr>
                    <tr v-for="item in adminUserData" v-bind:key="item.certId">
                        <td>{{item.username}}</td>
                        <td>{{item.email}}</td>
                        <td>{{item.register}}</td>
                        <td>${{item.points}}</td>
                    </tr>
                </table>
            </div>
        </div>
        <div v-else>
            <center>
                <div class="black contents">
                    <h2>Scan the QR code to login</h2>
                    <div class="contents" v-html="qrCodeHtml.html" style="zoom:2; margin-bottom:-10px;"></div>
                    <div style="height:0px;font-size:1px;">&nbsp;</div>
                    <a :href="qrCodeHtml.url" style="font-size:10px;" target="_blank">Use Phone Mockup</a><br><br>
                    <a :href="$router.resolve({name: 'UserAccount'}).href" class="button">Continue</a><br><br>
                </div>
            </center>
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
            this.$store.dispatch('login', "");
        },
        computed: {
            qrCodeHtml: function() {
                return this.$store.getters.qrCodeHtml;
            },
            loggedIn: function() {
                return this.$store.getters.loggedIn;
            },
            isAdmin: function() {
                return this.$store.getters.isAdmin;
            },
            imageData: function() {
                return this.$store.getters.imageData;
            },
            imagePointData: function() {
                return this.$store.getters.imagePointData;
            },
            username: function() {
                return this.$store.getters.userInfo ? this.$store.getters.userInfo.username : "";
            },
            totalPoints: function() {
                return this.$store.getters.totalPoints;
            },
            adminUserData: function() {
                return this.$store.getters.adminUserData;
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
    .black {
        border: 1px solid black;
    }
    .contents {
        display: inline-block !important;
        margin: 6px;
    }
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
    table, th, td {
        border: 1px solid black;
    }
</style>