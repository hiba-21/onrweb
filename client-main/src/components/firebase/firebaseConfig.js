// firebaseConfig.js
// firebase.js
// firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyATwJ6zcEHktp43x5RuGuayJXYlbg68_Zo",
    authDomain: "onrtech.firebaseapp.com",
    projectId: "onrtech",
    storageBucket: "onrtech.appspot.com",
    messagingSenderId: "297377586108",
    appId: "1:297377586108:web:0a6d390d867a807dd929b9",
    measurementId: "G-S89DQDMJCD"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };



