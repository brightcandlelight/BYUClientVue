<template>
    <div class="page">
        <p>To upload an image, choose a file from your computer below and click "Upload Image"</p><br>
        <div class="container">
            <!--<div class="ancGrid">
                <div class="ancCol">
                    <input class="button" type="file" name="filename" id="filename" accept=".jpg,.png,.jpeg,.bmp,.ico" required> $event.target.name, $event.target.files, $event,files
                </div>  fileCount = $event.target.files.length
            </div>
            <br>-->
            <!--UPLOAD-->
            <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
                <h1>Upload images</h1>
                <div class="dropbox">
                    <input type="file" multiple v-bind:name="uploadFieldName" v-bind:disabled="isSaving" @change="filesChange()"
                           accept="image/*" class="input-file">
                    <p v-if="isInitial">
                        Drag your file here to begin<br> or click to browse
                    </p>
                    <p v-if="isSaving">
                        Uploading {{ fileCount }} file...
                    </p>
                </div>
            </form>
            <!--SUCCESS-->
            <div v-if="isSuccess">
                <h2>Uploaded {{ uploadedFiles.length }} file successfully.</h2>
                <p>
                    <a href="javascript:void(0)" @click="reset()">Upload again</a>
                </p>
                <ul class="list-unstyled">
                    <li v-for="item in uploadedFiles" v-bind:key="item.url">
                        <img v-bind:src="item.url" class="img-responsive img-thumbnail" v-bind:alt="item.originalName">
                    </li>
                </ul>
            </div>
            <!--FAILED-->
            <div v-if="isFailed">
                <h2>Upload failed.</h2>
                <p>
                    <a href="javascript:void(0)" @click="reset()">Try again</a>
                </p>
                <pre>{{ uploadError }}</pre>
            </div>
            <!--<label>
                <input class="button" type="file" id="file" ref="file" accept=".jpg,.png,.jpeg,.bmp,.ico" v-on:change="handleFileUpload()"/>
            </label>-->
            <!--<div>Collection<br>
                <! --Radio button-- >
            </div>
            <div>-->
            <!--<label for="description">Description</label><br>
                <textarea type="text" name="description" id="description" style="min-width:300px; min-height:100px"></textarea>
            </div>-->
            <br>
            <!--<button class="button" v-on:click="uploadPhoto()">Submit</button><br>-->

            <router-link :to="{name: 'UserAccount'}" class="button">Cancel</router-link>
        </div>

    </div>
</template>

<script>
    const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;

    export default {
        name: "UploadPhoto",
        data() {
            return {
                uploadedFiles: [],
                uploadError: null,
                currentStatus: null,
                uploadFieldName: 'photos'
            }
        },
        computed: {
            isInitial() {
                return this.currentStatus === STATUS_INITIAL;
            },
            isSaving() {
                return this.currentStatus === STATUS_SAVING;
            },
            isSuccess() {
                return this.currentStatus === STATUS_SUCCESS;
            },
            isFailed() {
                return this.currentStatus === STATUS_FAILED;
            }
        },
        methods: {
            reset() {
                // reset form to initial state
                this.currentStatus = STATUS_INITIAL;
                this.uploadedFiles = [];
                this.uploadError = null;
            },
            save(formData) {
                // upload data to the server
                this.currentStatus = STATUS_SAVING;

                this.$store.dispatch('uploadPhoto',formData)
                    .then(x => {
                        // eslint-disable-next-line no-console
                        console.log(x);
                        this.uploadedFiles = [].concat(x);
                        this.currentStatus = STATUS_SUCCESS;
                    })
                    .catch(err => {
                        this.uploadError = err.response;
                        this.currentStatus = STATUS_FAILED;
                    });
            },
            filesChange(e) { //fieldName, fileList, event,event2) {
                // eslint-disable-next-line no-console
                console.log(JSON.stringify(e)+e)
                /*console.log("Files "+fieldName+ JSON.stringify(fileList)+JSON.stringify(event)+"T "+JSON.stringify(event.target)+JSON.stringify(event.state)+JSON.stringify(event2));
                // handle file changes
                const formData = new FormData();

                if (!fileList.length) { return; }

                // append the files to FormData
                Array.from(Array(fileList.length).keys())
                    .map(x => {
                        formData.append(fieldName, fileList[x], fileList[x].name);
                    });

                // save it
                this.save(formData);*/
            }
        },
        mounted() {
            this.reset();
        }
        /*    uploadPhoto: function () {
                let formData = new FormData();
                /*
                    Add the form data we need to submit
                * /
                formData.append('file', this.file);
                this.$store.dispatch('uploadPhoto', formData);
            },
            /*
              Handles a change on the file upload
            * /
            handleFileUpload(){
                this.file = this.$refs.file.files[0];
            }
        }*/
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
    .btn {
        display: block;
        width: 115px;
        height: 25px;
        background: #4E9CAF;
        padding: 10px;
        text-align: center;
        border-radius: 5px;
        color: white;
        font-weight: bold;
    }
    .file {
        height: auto !important;
        opacity: inherit !important;
        position: inherit !important;
        width: auto !important;
    }
    .dropbox {
        outline: 2px dashed grey; /* the dash box */
        outline-offset: -10px;
        background: lightcyan;
        color: dimgray;
        padding: 10px 10px;
        min-height: 200px; /* minimum height */
        position: relative;
        cursor: pointer;
    }

    .input-file {
        opacity: 0; /* invisible but it's there! */
        width: 100%;
        height: 200px;
        position: absolute;
        cursor: pointer;
    }

    .dropbox:hover {
        background: lightblue; /* when mouse over to the drop zone, change color */
    }

    .dropbox p {
        font-size: 1.2em;
        text-align: center;
        padding: 50px 0;
    }
    img {
        width: 30%;
        margin: auto;
        display: block;
        margin-bottom: 10px;
    }
</style>