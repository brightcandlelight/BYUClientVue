import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

import VueCookies from 'vue-cookies'
Vue.use(VueCookies);
Vue.use(Vuex);

const BACKEND_URL = "https://letsauth.org/api";
//const BACKEND_URL = "http://localhost:8445";

export default new Vuex.Store({
    state: {
        loggedIn: false,
        qrCodeHtml: "",
        imageData: [],
        userInfo: {username:""},
        sortBy: "",
        uploadStatus: "",
        isAdmin: false,
        totalPoints: 0,
        imagePointData: []
    },
    getters: {
        loggedIn: state => state.loggedIn,
        qrCodeHtml: state => state.qrCodeHtml,
        sortBy: (state) => {
            return state.sortBy;
        },
        imageData: state => state.imageData,
        userInfo: state => state.userInfo,
        uploadStatus: state => state.uploadStatus,
        isAdmin: state => state.isAdmin,
        totalPoints: state => state.totalPoints,
        imagePointData: state => state.imagePointData
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
        },
        setIsAdmin(state,status) {
            state.isAdmin = status;
        },
        setTotalPoints(state,status) {
            state.totalPoints = status;
        },
        setImagePointData(state,status) {
            state.imagePointData = status;
        }
    },
    actions: {
        setSortBy(context, status) {
            context.commit('sortBy', status);
        },
        login(context, options) {
            context.commit('setQRCodeHtml', "");
            const onSuccessStrFunc = options ? options.onSuccessStrFunc : undefined;
            return axios.post(BACKEND_URL+"/api/login", options ? options.params : null,{
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

                if ((response.headers.isloggedin === "true" && onSuccessStrFunc) || onSuccessStrFunc === "getFeed") {
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
                    context.commit('isAdmin', data.data.isAdmin || false);
                    context.dispatch('sortImages', {data: data.data});
                }
            });
        },
        sortImages(context, dataObj) {
            let sortBy = this.state.sortBy.toLowerCase();
            let totalPoints = 0;
            const imagePointData = [];
            const data = dataObj.data;
            if (!sortBy) {
                context.commit('sortBy', "Week");
                sortBy = "week";
            }
            let list = {};
            for (let image of data.images || []) {
                image.url = BACKEND_URL+"/"+image.url;
                const key = image[sortBy] !== undefined ? image[sortBy] : "undefined";
                if (!list[key]) {
                    list[key] = [];
                }
                list[key].push(image);
                if (image.points) {
                    totalPoints += image.points || 0;
                    imagePointData.push(image);
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
            context.commit('setImagePointData',imagePointData);
            context.commit('setTotalPoints',totalPoints);
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
                    context.dispatch('sortImages', {data: data.data});
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
        },
        createAccount(context, params) {
            context.commit('setQRCodeHtml', "");
            return axios.post(BACKEND_URL+"/api/createaccount", params,{
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

                // eslint-disable-next-line no-console
                console.log(response.headers.isloggedin === "true");
                context.commit('setLoggedIn', response.headers.isloggedin === "true");
            })
        },
        phoneHack(context, body) {
            return axios.post(BACKEND_URL+"/api/loginFromPhone", body,{
            }).then((data) => {
                // eslint-disable-next-line no-console
                console.log(data);
            });
        },
    }
});
