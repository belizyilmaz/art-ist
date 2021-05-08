import {firebaseConfig} from 'https://belizyilmaz.github.io/art-ist/login.js';

let isDark;

const toggleSwitch = document.querySelector('input[type="checkbox"]');

function switchTheme(e) {
    var userId = firebase.auth().currentUser.uid;
    var users = firebase.database().ref('users');
    var user = users.child(userId);
    if(e.target.checked) {
        darkMode();
    } else {
        lightMode();
    }
    user.update({
        'darkmode': isDark
    });
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var userId = firebase.auth().currentUser.uid;
        var users = firebase.database().ref('users');
        var user = users.child(userId);
        user.on('value', (snapshot) => {
            const data = snapshot.val();
            var currentMode = data.darkmode;
            if(currentMode === true) {
                darkMode();
            } else {
                lightMode();
            }
            if(isDark) {
                toggleSwitch.checked = true;
            }
        });
    } 
});

if(toggleSwitch !== null) {
    toggleSwitch.addEventListener('change', switchTheme, false);
}

function darkMode() {
    isDark = true;
    console.log("toggled");
    document.getElementById("darkmode").innerHTML = "Disable Dark Mode";
    document.getElementById("heroHead").classList.add('is-dark');
    if(document.getElementById("harvardButton") !== null) {
        document.getElementById("harvardButton").classList.add('is-inverted');
    }
    if(document.getElementById("chicagoButton") !== null) {
        document.getElementById("chicagoButton").classList.add('is-inverted');
    }
    if(document.getElementById("section2") !== null) {
        document.getElementById("section2").classList.add('has-background-grey');
    }
    if(document.getElementById("section3") !== null) {
        document.getElementById("section3").classList.add('has-background-dark');
    }
    if(document.getElementById("logout") !== null) {
        document.getElementById("logout").classList.add("is-inverted");
    }
    document.documentElement.setAttribute('data-theme', 'dark');
}

function lightMode() {
    isDark = false;
    console.log("undo");
    document.getElementById("darkmode").innerHTML = "Enable Dark Mode";
    document.getElementById("heroHead").classList.remove('is-dark');
    if(document.getElementById("harvardButton") !== null) {
        document.getElementById("harvardButton").classList.remove('is-inverted');
    }
    if(document.getElementById("chicagoButton") !== null) {
        document.getElementById("chicagoButton").classList.remove('is-inverted');
    }
    if(document.getElementById("section2") !== null) {
        document.getElementById("section2").classList.remove('has-background-grey');
    }
    if(document.getElementById("section3") !== null) {
        document.getElementById("section3").classList.remove('has-background-dark');
    }
    if(document.getElementById("logout") !== null) {
        document.getElementById("logout").classList.remove("is-inverted");
    }
    document.documentElement.setAttribute('data-theme', 'light');
}