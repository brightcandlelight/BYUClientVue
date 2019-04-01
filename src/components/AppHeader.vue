<template>
    <div id="AppHeader" class="page">
        <nav>
            <ul id="menu">
                <li><router-link to="/">Home</router-link></li>
                <li><router-link :to="{name: 'UserAccount'}">User Account</router-link></li>
                <li v-if="loggedIn"><a v-on:click="logout" style="" href="/">Logout</a></li>
                <ul v-else>
                    <li><router-link :to="{name: 'UserAccount'}">Login</router-link></li>
                    <li><router-link :to="{name: 'CreateAccount'}">Create Account</router-link></li>
                </ul>
            </ul>
        </nav>
    </div>
</template>

<script>
    export default {
        name: "AppHeader",
        computed: {
            loggedIn: function() {
                return this.$store.getters.loggedIn;
            }
        },
        methods: {
            logout: function () {
                this.$store.dispatch('logout');
            }
        }
    }
</script>

<style scoped>
    /* Strip the ul of padding and list styling */
    nav {
        display: grid;
        margin-bottom: 20px;
    }
    ul {
        list-style-type:none;
        margin:0;
        padding:0;
    }
    /* Create a horizontal list with spacing */
    li {
        display:inline-block;
        float: left;
        margin-right: 20px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        color: #666;
    }
    /*Active color*/
    li a.active {
    }
    /*Hover state for top level links*/
    li:hover a {
        color: red;
    }
    input {
        height: 0.5em;
    }
    .search {
        margin-left: 5px;
    }
    .right {
        float: right;
    }
    .errorPlace {
        height: 20px;
    }
    img {
        width: 50px;
    }
    #menu {
        background-color: lightgrey;
        padding: 10px;
    }
</style>