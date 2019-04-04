<template>
    <div id="app" class="page" v-if="loggedIn">
        <!--UPLOAD-->
        <form enctype="multipart/form-data">
            <div class="black contents">
            <div class="contents" v-if="uploadStatus">{{uploadStatus}}<br></div>
                <h2>Select an image</h2>
                <div class="contents" v-if="!image">
                <input style="margin-left:70px;" type="file" @change="onFileChange">
            </div>
            <div class="contents" v-else>
                <img :src="image"/><br>
                <button @click="removeImage">Remove image</button>
            </div>
            <br>
            <div class="contents">
                <br>
                <div class="contents">Note: If you have already uploaded a photo today, <br>this one will replace your current photo for today.</div><br>
                <button class="button" v-on:click="uploadPhoto()" type="button">Submit</button>
                <!-- Type=button removes the refresh -->
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<router-link :to="{name: 'UserAccount'}" class="button">Back</router-link>
            </div>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        name: "try2",
        data() { return {
            image: '',
            file: {}
        }},
        beforeCreate: function() {
            let loggedIn = this.$store.getters.loggedIn;
            if (!loggedIn) {
                location.href = "/useraccount";
            }
        },
        methods: {
            onFileChange(e) {
                let files = e.target.files || e.dataTransfer.files;

                if (!files.length)
                    return;
                this.createImage(files[0]);
            },
            createImage(file) {
                //let image = new Image();
                let reader = new FileReader();
                let vm = this;

                reader.onload = (e) => {
                    vm.image = e.target.result;
                };
                reader.readAsDataURL(file);

                this.file = file;

            },
            removeImage: function () {
                this.image = '';
                this.file = {};
            },
            uploadPhoto: function () {
                this.$store.dispatch('uploadPhoto', {image: this.image, file: this.file});
                this.removeImage();
            },
        },
        computed: {
            uploadStatus: function() {
                let status = this.$store.getters.uploadStatus;
                if (status === "Success") {
                    location.href = "/useraccount";
                }
                return status;
            },
            loggedIn: function() {
                let loggedIn = this.$store.getters.loggedIn;
                if (!loggedIn) {
                    location.href = "/useraccount";
                }
                return loggedIn;
            },
            imageData: function() {
                return this.$store.getters.imageData;
            }
        }
    }
</script>

<style scoped>
    .contents {
        display: inline-block !important;
        margin: 6px;
    }
    .black {
        border: 1px solid black;
    }
    .button {
        -webkit-appearance: button;
        -moz-appearance: button;
        appearance: button;

        text-decoration: none;
        color: initial;
        padding: 5px;
    }
    #app {
        text-align: center;
    }
    img {
        max-height: 190px;
        max-width: 225px;
        margin: auto;
        display: block;
        height:auto;
        width: auto;
        object-fit: contain;
    }
    button {
    }
    .page {
        padding-bottom: 30px;
    }
</style>