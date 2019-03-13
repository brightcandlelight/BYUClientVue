import Vue from 'vue'
import Router from 'vue-router'
import UserAccount from '@/components/UserAccount'
import ImageFeed from '@/components/ImageFeed'
import CreateAccount from '@/components/CreateAccount'
//import UploadPhotoOld from '@/components/UploadPhotoOld'
import UploadPhoto from '@/components/UploadPhoto'

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/useraccount',
            name: 'UserAccount',
            component: UserAccount
        },
        {
            path: '/createaccount',
            name: 'CreateAccount',
            component: CreateAccount
        },
        {
            path: '/feed',
            name: 'Feed',
            component: ImageFeed
        },
        {
            path: '/',
            name: 'Home',
            component: ImageFeed
        },
        {
            path: '/uploadphoto',
            name: 'UploadPhoto',
            component: UploadPhoto
        },
        {
            path: '/logout',
            name: 'Logout',
            component: UploadPhoto
        },
        {
            path: '/createaccount',
            name: 'CreateAccount',
            component: UploadPhoto
        }
    ]
})
