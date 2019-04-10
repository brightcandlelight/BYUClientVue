<template>
    <div class="item">
        <a v-bind:href="item.url">
            <img v-bind:src="item.url" class="image" v-bind:alt="item.url">
        </a>
        <br>
        <!--<div v-if="item.username">
            User: {{item.username}}<br>
        </div>-->
        Date: {{item.date}}<br>
        <span v-if="loggedIn && isAdmin">

            <span v-if="item.nominated">
                <button type="submit" class="btn liked" v-on:click="toggleNominate(item)">Remove nomination: "{{item.nominated}}"</button>
            </span>
            <span v-else>Nominate:
                <input type="text" helptext="topic" v-bind:value="item.nominate" @change="toggleNominate(item,$event)">
            </span>

            <span v-if="item.winners">
                <button type="submit" class="btn liked" v-on:click="toggleWinners(item)">Remove award: "{{item.winners}}"</button>
            </span>
            <span v-else><br><center>Award:
                <input type="text" helptext="topic" v-bind:value="item.winners" @change="toggleWinners(item,$event)">
                </center>
            </span>
            <br>
        </span>
        <span v-else>
            <span v-if="item.winners">
                <b>Award: {{item.winners}}&nbsp;&nbsp;</b>
            </span>
        </span>
        {{item.likes}} Like<span v-if="item.likes !== 1">s</span> &nbsp;
        <span v-if="loggedIn && item.isCurrentWeek">
            <span v-if="item.likedByUser">
                <button type="submit" class="btn liked" v-on:click="toggleLike(item)">Unlike</button>
            </span>
            <span v-else>
                <button type="submit" class="btn unliked" v-on:click="toggleLike(item)">Like</button>
            </span>
        </span>

        <button v-on:click="downloadWithAxios(item.url, item.filename)">Download</button>
    </div>
</template>

<script>
    import moment from 'moment';
    import Vue from 'vue';
    import axios from 'axios';
    import VueCookies from 'vue-cookies'
    Vue.use(VueCookies);

    export default {
        name: "pictureTemplate",
        props: {
            item: Object,
            updateDataFunc: String
        },
        computed: {
            loggedIn: function() {
                return this.$store.getters.loggedIn;
            },
            isAdmin: function() {
                return this.$store.getters.isAdmin;
            }
        },
        methods: {
            updateCategories(e) {
                const categories = e.currentTarget.value.split(" ");
                this.saveImageInfo({filename: this.item.filename, categories}, this.item);
            },
            forceFileDownload(response, filename) {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', filename); //or any other extension
                document.body.appendChild(link);
                link.click();
            },
            downloadWithAxios(url,filename) {
                axios({
                    method: 'get',
                    url: url,
                    responseType: 'arraybuffer'
                }).then(response => {
                    this.forceFileDownload(response, filename);
                }).catch(() => {
                    // eslint-disable-next-line no-console
                    console.log('error occured');
                })
            },
            toggleLike: function(item) {
                if(item.likedByUser) {
                    this.unlikePhoto(item)
                } else {
                    this.likePhoto(item)
                }
            },
            toggleNominate: function(item,e) {
                if(item.nominated) {
                    item.nominated = "";
                } else {
                    this.saveImageInfo({filename: item.filename, nominated: e.currentTarget.value, nominatedDate: moment().format("YYYY/MM/DD")}, item);
                }
                this.$forceUpdate();
            },
            toggleWinners: function(item,e) {
                if(item.winners) {
                    item.winners = "";
                } else {
                    this.saveImageInfo({filename: item.filename, winners: e.currentTarget.value, winnersDate: moment().format("YYYY/MM/DD")}, item);
                }
            },
            likePhoto: function(item) {
                this.saveImageInfo({filename: item.filename, likedByUser: true}, item);
            },
            unlikePhoto: function(item) {
                this.saveImageInfo({filename: item.filename, likedByUser: false}, item);
            },
            saveImageInfo: function(imageInfo, item) {
                // eslint-disable-next-line no-console
                console.log(imageInfo);

                const BACKEND_URL = "http://localhost:3000";
                //const BACKEND_URL = "http://localhost:8445";
                return axios.put(BACKEND_URL+"/api/saveimage", imageInfo, {
                    headers: {
                        id: VueCookies.get("id")
                    }
                }).then((res) => {
                    //context.dispatch('setUserInfo',data.data);
                    // eslint-disable-next-line no-console
                    console.log(res.data);
                    item.likedByUser = res.data.likedByUser;
                    item.likes = res.data.likes;
                    item.nominated = res.data.nominated || "";
                    item.winners = res.data.winners || "";
                    this.$forceUpdate();
                });
            }
        },

    }
</script>

<style scoped>
    .image {
        height:auto;
        width: auto;
        max-height: 190px;
        max-width: 225px;
        object-fit: contain;
        margin: auto;
        display: block;
    }

    .item {
        border-style: solid;
        border-color: darkblue;
        padding: 10px;
    }
    .button {
        -webkit-appearance: button;
        -moz-appearance: button;
        appearance: button;

        text-decoration: none;
        color: initial;
        padding: 5px;
    }
</style>