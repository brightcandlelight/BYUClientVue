import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

import VueCookies from 'vue-cookies'
Vue.use(VueCookies);


Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        loggedIn: false,
        qrCodeHtml: "",
        imageData: {},
        userInfo: {username:""},
        sortBy: "",
        uploadStatus: ""
    },
    getters: {
        loggedIn: state => state.loggedIn,
        qrCodeHtml: state => state.qrCodeHtml,
        sortBy: (state) => {
            return state.sortBy;
        },
        imageData: state => state.imageData,
        userInfo: state => state.userInfo,
        uploadStatus: state => state.uploadStatus
    },
    mutations: {
        setLoggedIn (state, status) {
            state.loggedIn = status;
        },
        setQRCodeHtml (state, status) {
            state.qrCodeHtml = status;
        },
        sortBy (state, status) {
            if (status) {
                VueCookies.config('7d');
                VueCookies.set('sortBy', status);
            }
            state.sortBy = status;
        },
        setImageData (state, status) {
            state.imageData = status;
        },
        setUploadStatus(state, status) {
            state.uploadStatus = status;
        },
        setUserInfo(state,status) {
            state.userInfo = status;
        }
    },
    actions: {
        login(context, onSuccessStrFunc) {
            context.commit('setQRCodeHtml', "");
            return axios.post("http://localhost:3000/api/login", null,{
                headers: { id: VueCookies.get("id") }
            }).then((response) =>{
                // set default config
                if (response.headers.id) {
                    VueCookies.config('7d');
                    VueCookies.set('id', response.headers.id);
                }
                if (response.data) {
                    context.commit('setQRCodeHtml', response.data);
                }

                if (response.headers.isloggedin === "true" && onSuccessStrFunc) {
                    context.dispatch(onSuccessStrFunc);
                }
                // eslint-disable-next-line no-console
                console.log(response.headers.isloggedin === "true");
                context.commit('setLoggedIn', response.headers.isloggedin === "true");
            })
        },
        getUserAccount(context) {
            return axios.get("http://localhost:3000/api/getuseraccount", {
                headers: {id: VueCookies.get("id")}
            }).then((data) => {
                if (!data) {
                    context.dispatch('login');
                } else {
                    context.dispatch('sortImages',data.data);
                }
            });
        },
        sortImages(context, data) {
            let sortBy = this.state.sortBy.toLowerCase();
            if (!sortBy) {
                const cookie = VueCookies.get("sortBy");
                sortBy = cookie ? cookie.toLowerCase() : "";
                context.commit('sortBy', cookie);
            }
            let list = {};
            for (let image of data.images || []) {
                image.url = "http://localhost:3000/"+image.url;
                const key = image[sortBy] !== undefined ? image[sortBy] : "undefined";
                if (sortBy.indexOf("category") === 0) {
                    for (const key1 of image.categories || []) {
                        if (!list[key1]) {
                            list[key1] = [];
                        }
                        list[key1].push(image);
                    }
                } else {
                    if (!list[key]) {
                        list[key] = [];
                    }
                    list[key].push(image);
                }
            }
            data.images = list;
            context.commit('setImageData',data.images);
            context.commit('setUserInfo',data.userInfo);
        },
        getFeed(context) {
            return axios.get("http://localhost:3000/api/getfeed", {
                headers: {id: VueCookies.get("id")}
            }).then((data) => {
                if (!data) {
                    context.commit('setImageData',{});
                } else {
                    context.dispatch('sortImages', data.data);
                }
            });
        },
        uploadPhoto(context, fileObj) {
            // eslint-disable-next-line no-console
            console.log(fileObj.file.name);

            return axios.post("http://localhost:3000/api/uploadphoto", fileObj.image, {
                headers: {
                    id: VueCookies.get("id"),
                    'Content-Type': 'multipart/form-data',
                    filename: fileObj.file.name
                }
            }).then((status) => {
                context.commit('setUploadStatus',status.data);
            });
        },
        saveUserInfo(context, userInfo) {
            // eslint-disable-next-line no-console
            console.log(userInfo);

            return axios.put("http://localhost:3000/api/saveuserinfo", userInfo, {
                headers: {
                    id: VueCookies.get("id")
                }
            }).then((data) => {
                //context.dispatch('setUserInfo',data.data);
                // eslint-disable-next-line no-console
                console.log(data);
            });
        },
        logout(context) {
            return axios.post("http://localhost:3000/api/logout", null, {
                headers: {id: VueCookies.get("id") }
            }).then(() => {
                // Clear the cookies and set loggedIn to false
                VueCookies.config('7d');
                VueCookies.set('id', "");
                context.commit('setLoggedIn',false);
                // eslint-disable-next-line no-console
                console.log("clear cookies");
                context.dispatch('login');
            });
        }
    }
});