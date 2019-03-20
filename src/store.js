import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

import VueCookies from 'vue-cookies'
Vue.use(VueCookies);
Vue.use(Vuex);

const BACKEND_URL = "https://letsauth.org/api";

export default new Vuex.Store({
    state: {
        loggedIn: false,
        qrCodeHtml: "",
        imageData: [],
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
        setSortBy(context, status) {
            context.commit('sortBy', status);
        },
        login(context, onSuccessStrFunc) {
            context.commit('setQRCodeHtml', "");
            // eslint-disable-next-line no-console
            console.log(BACKEND_URL+"/api/login");
            return axios.post(BACKEND_URL+"/api/login", null,{
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
            return axios.get(BACKEND_URL+"/api/getuseraccount", {
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
                context.commit('sortBy', "Date");
                return;
            }
            let list = {};
            for (let image of data.images || []) {
                image.url = BACKEND_URL+"/"+image.url;
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
            // Ok, now change the object into an array so we can sort it
            const arrayList = [];
            for (const key of Object.keys(list)) {
                list[key] = list[key].sort(function(a, b) {
                    return a.fulldate > b.fulldate ? -1 : (a.fulldate < b.fulldate ? 1 : 0);
                });

                arrayList.push({key, value:list[key]});
            }

            // If result is
            if (sortBy !== "category") {
                arrayList.sort((a, b) => {
                    return a.key > b.key ? -1 : 1;
                });
            } else {
                arrayList.sort((a, b) => {
                    return a.key > b.key ? 1 : -1;
                });
            }

            data.images = arrayList;
            context.commit('setImageData',data.images);
            context.commit('setUserInfo',data.userInfo);
        },
        getFeed(context) {
            return axios.get(BACKEND_URL+"/api/getfeed", {
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

            return axios.post(BACKEND_URL+"/api/uploadphoto", fileObj.image, {
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

            return axios.put(BACKEND_URL+"/api/saveuserinfo", userInfo, {
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
            return axios.post(BACKEND_URL+"/api/logout", null, {
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
