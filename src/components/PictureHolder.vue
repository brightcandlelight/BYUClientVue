<template>
    <div>
        Sort By:
        <select v-model="sortBy">
            <option disabled value="">Please select one</option>
            <option v-if="updateDataFunc !== 'getUserAccount'">Username</option>
            <option>Category</option>
            <option>Date</option>
            <option>Week</option>
        </select>
        <br>
        <br>
        <div class="allHolder">
            <div class="outsideHolder" v-for="item in imageList" v-bind:key="item.key">
                <button class="underline collapsible">{{sortByL}} {{item.key}} {{sortByR}}</button>
                <div class="content">
                    <div class="holder">
                        <PictureTemplate v-for="imageList in item.value" v-bind:item="imageList" v-bind:key="imageList.filename" class="padded" v-bind:updateDataFunc="updateDataFunc"></PictureTemplate>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import PictureTemplate from './PictureTemplate.vue'

    export default {
        name: "PictureHolder",
        components: {PictureTemplate},
        props: {
            imageList: Array,
            updateDataFunc: String
        },
        created: function() {
            this.$store.dispatch('login', this.updateDataFunc);
            this.$store.dispatch('setSortBy', "");
        },
        updated() {
            let coll = document.getElementsByClassName("collapsible");
            let i;
            for (i = 0; i < coll.length; i++) {
                coll[i].addEventListener("click", function() {

                    this.classList.toggle("active");
                    let content = this.nextElementSibling;
                    if (content.style.maxHeight){
                        content.style.maxHeight = null;
                    } else {
                        content.style.maxHeight = content.scrollHeight + "px";
                    }
                });
            }
        },
        computed: {
            sortBy: {
                get: function() {
                    let sortBy = this.$store.getters.sortBy;
                    if (this.updateDataFunc === 'getUserAccount' && sortBy === "Username") {
                        sortBy = "";
                    }
                    return sortBy;
                }, set: function(newValue) {
                    // eslint-disable-next-line no-console
                    console.log(newValue);
                    this.$store.commit('sortBy', newValue);
                    this.$store.dispatch(this.updateDataFunc);
                }
            },
            sortByL: function() {
                const sortBy = this.$store.getters.sortBy;
                if (sortBy === "Week") {
                    return sortBy;
                } else {
                    return "";
                }
            },
            sortByR: function() {
                const sortBy = this.$store.getters.sortBy;
                if (sortBy === "Likes") {
                    return sortBy;
                } else {
                    return "";
                }
            }
        }
    }
</script>

<style scoped>
    .underline {
        text-decoration: underline;
    }
    .padded {
        margin: 2px;
    }
    .holder {
        display: flex;
        flex-wrap: wrap;
    }
    .outsideHolder {
        /*border-style: solid;
        border-color: darkblue;
        padding: 3px;*/
    }
    /* Style the button that is used to open and close the collapsible content */
    .collapsible {
        background-color: #eee;
        color: #444;
        cursor: pointer;
        padding: 18px;
        width: 100%;
        border: none;
        text-align: left;
        outline: none;
        font-size: 15px;
    }

    /* Add a background color to the button if it is clicked on (add the .active class with JS), and when you move the mouse over it (hover) */
    .active, .collapsible:hover {
        background-color: #ccc;
    }

    /* Style the collapsible content. Note: hidden by default */
    .content {
        padding: 0 18px;
        overflow: hidden;
        background-color: #f1f1f1;
        transition: max-height 0.2s ease-out;
        max-height: 0;
    }
</style>