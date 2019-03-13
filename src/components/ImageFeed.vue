<template>
    <div id="imagefeed" class="page">
        <h3>Image Feed</h3>
        <PictureHolder v-bind:imageList="imageData" v-bind:updateDataFunc="'getFeed'"></PictureHolder>
    </div>
</template>

<script>
    import PictureHolder from './PictureHolder'

    export default {
        name: "ImageFeed",
        components: {PictureHolder},
        data () {
            return {
            }
        },
        created: function() {
            this.$store.dispatch('getFeed');
        },
        computed: {
            loggedIn: function() {
                return this.$store.getters.loggedIn;
            },
            imageData: function() {
                return this.$store.getters.imageData;
            }
        }
    }
</script>

<style scoped>
    .page {
        padding-bottom: 30px;
    }
</style>