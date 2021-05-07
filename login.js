var firebaseConfig = {
    apiKey: "AIzaSyBXbgKrI6lK1bBUQC75dLVjgplGQk0ZW9s",
    authDomain: "art-ist.firebaseapp.com",
    databaseURL: "https://art-ist-default-rtdb.firebaseio.com",
    projectId: "art-ist",
    storageBucket: "art-ist.appspot.com",
    messagingSenderId: "1005640377141",
    appId: "1:1005640377141:web:06249e7134eb815b83627c",
    measurementId: "G-THFRVF1K0C"
};
firebase.initializeApp(firebaseConfig);  
var rootRef = firebase.database().ref();
var usersRef = rootRef.child("users");

var firstName = "";
var lastName = "";
var email = "";
var password = "";

$(`#login`).on("click", function() {
    displayLogin();
});  

function displayLogin() {
    $(`#loginSection`).replaceWith(`<section class="section" id="loginSection">
    <div class="container">
        <div class="form">
            <div class="field">
                <p class="control has-icons-left has-icons-right">
                    <input class="input loginEmailInput" type="email" placeholder="Email">
                    <span class="icon is-small is-left">
                        <i class="fa fa-envelope"></i>
                    </span>
                </p>
            </div>
            <div class="field">
                <p class="control has-icons-left">
                    <input class="input loginPasswordInput" type="password" placeholder="Password">
                    <span class="icon is-small is-left">
                        <i class="fa fa-lock"></i>
                    </span>
                </p>
            </div>
            <div class="field">
                <p class="control">
                    <button class="button is-success loginSend">Login</button>
                </p>
            </div>
            <div class="field">
                <p class="control">
                    <button class="button is-light" id="backSend"><a href="/index.html">Back</a></button>
                </p>
            </div>
        </div>
    </div>
    </section>`);
    loginRequest();
}

function loginRequest() {
    $(`.loginSend`).on("click", function() {
        email = $(`.loginEmailInput`).val().trim();
        password = $(`.loginPasswordInput`).val().trim();
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            window.location.href = "game.html";
        })
        .catch((error) => {
            var errorMessage = error.message;
            alert(errorMessage);
            console.log(error);
        });

        return false;
    });
}

$(`#signup`).on("click", function() {
    displaySignup();
    $(`.signupSend`).on("click", function() {
        firstName = $(`#firstnameinput`).val().trim();
        email = $(`#emailinput`).val().trim();
        password = $(`#passwordinput`).val().trim();
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            var user = firebase.auth().currentUser;
            user.updateProfile({
                displayName: firstName,
            }).then(function() {
                console.log("name set");
            }).catch(function(error) {
                var errorMessage = error.message;
                alert(errorMessage);
                console.log(error);
            });
            var newUserRef = usersRef.child(user.uid);
            newUserRef.set({
                'user_id': user.uid,
                'darkmode': false,
            });
            console.log(userCredential);
            $(`#messageSection`).replaceWith(`<section class="section has-background-light" id="messageSection">
            <div class="container">
                <h1 class="subtitle is-4">You have successfully signed up. Log in to continue with 
                the website. Now you can play our game and earn ArtPoints.</h1>
            </div>
            </section>`)
            displayLogin();
            console.log("success");
        })
        .catch(function(error) {
            var errorMessage = error.message;
            alert(errorMessage);
            console.log(error);
        });
        return false;
    });
});

$(`.logOutButton`).on("click", function() {
    firebase.auth().signOut().then(() => {
        console.log("logged out");
      }).catch((error) => {
        var errorMessage = error.message;
        alert(errorMessage);
        console.log(error);
      });
});

function displaySignup() {
    $(`#loginSection`).replaceWith(`<section class="section" id="loginSection">
    <div class="container">
        <div class="form">
            <div class="field">
                <p class="control has-icons-left has-icons-right">
                    <input class="input" type="text" placeholder="First Name" id="firstnameinput">
                    <span class="icon is-small is-left">
                        <i class="fa fa-user"></i>
                    </span>
                </p>
            </div>
            <div class="field">
                <p class="control has-icons-left has-icons-right">
                    <input class="input" type="text" placeholder="Last Name" id="lastnameinput">
                    <span class="icon is-small is-left">
                        <i class="fa fa-user"></i>
                    </span>
                </p>
            </div>
            <div class="field">
                <p class="control has-icons-left has-icons-right">
                    <input class="input" type="email" placeholder="Email" id="emailinput">
                    <span class="icon is-small is-left">
                        <i class="fa fa-envelope"></i>
                    </span>
                </p>
            </div>
            <div class="field">
                <p class="control has-icons-left">
                    <input class="input" type="password" placeholder="Password" id="passwordinput">
                    <span class="icon is-small is-left">
                        <i class="fa fa-lock"></i>
                    </span>
                </p>
            </div>
            <div class="field">
                <p class="control">
                    <button class="button is-success signupSend">Sign Up</button>
                </p>
            </div>
            <div class="field">
                <p class="control">
                    <button class="button is-light" id="backSend"><a href="/index.html">Back</a></button>
                </p>
            </div>
        </div>
    </div>
    </section>`);
}