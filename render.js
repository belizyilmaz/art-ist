let numPages = 0;
let loading = false;
let randomPainting;
let harvardArtistChoice = "";
let chicagoArtistChoice = "";
let score = 0;
let randomArtists = [];

let harvards = [];
let chicagos = [];

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

var firstName = "";
var lastName = "";
var email = "";
var password = "";

async function getHarvard(pages) {
    const result = await axios({
        method: 'get',
        url: "https://api.harvardartmuseums.org/object",
        params: {
            "apikey": "2f6192ac-c482-48b8-b123-eed87d6b5a70",
            "size": 12,
            "classification": "Paintings",
            "page": pages+1,
        },
    });
    return result;
};

async function getChicago(pages) {
    const result = await axios({
        method: 'get',
        url: "https://api.artic.edu/api/v1/artworks",
        params: {
            "page": pages+1,
            "limit": 10,
            "offset": pages*10,
        },
    });
    return result;
}

$(`#harvardButton`).on("click", generateRandomHarvardPainting);
$(`#chicagoButton`).on("click", generateRandomChicagoPainting);

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
            window.location.href = "/game.html";
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
            console.log(userCredential);
            $(`#messageSection`).replaceWith(`<section class="section has-background-light" id="messageSection">
            <div class="container">
                <h1 class="subtitle is-4">You have successfully signed up. Log in to continue with 
                the website. Now you can play our game and earn ArtPoints.</h1>
            </div>
            </section>`)
            displayLogin();
            console.log("success")
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

async function loadHarvard() {
    harvards = await getHarvard(numPages);
    let current = 0;
    for(let i = 0; i < ((harvards.data.records.length)/5); i++) {
        $(`#harvardGallery`).append(`<tr id="harvardRow${i+(3*numPages)}">`);
        console.log(i+(3*numPages));
        for(let j = i; j < 5+i; j++) {
            let artists = "";
            while(current < 12) {
                if('primaryimageurl' in harvards.data.records[current] &&
                    harvards.data.records[current].primaryimageurl !== null) {
                    if('people' in harvards.data.records[current]) {
                        for(let k = 0; k < harvards.data.records[current].people.length; k++) {
                            artists = artists.concat(harvards.data.records[current].people[k].name);
                            if(k === harvards.data.records[current].people.length-1) {
                                break;
                            }
                            artists = artists.concat(", ");
                        }
                    }
                    $(`#harvardRow${i+(3*numPages)}`).append(`<td class="sentence subtitle">
                    <img src=${harvards.data.records[current].primaryimageurl} width="100" height="100">
                    <br></br>
                    <strong> <div class="sentence"> Title: </div></strong> ${harvards.data.records[current].title}</img>
                    <br></br>
                    <strong> <div class="sentence">Artist: </div></strong> ${artists} 
                    </td>`)
                    current++;
                    break;
                } else  {
                    current++;
                }
            }
            if(current === 12) {
                harvards = await getHarvard(numPages+1);
                current = 0;
            }
        }
        $(`#harvardGallery`).append(`</tr><br></br>`)
    }
}

async function loadChicago() {
    chicagos = await getChicago(numPages);
    let idx = 0;
    let iiifUrl = chicagos.data.config.iiif_url;
    for(let i = 0; i < (chicagos.data.data.length)/5; i++) {
        $(`#chicagoGallery`).append(`<tr id="chicagoRow${i+(2*numPages)}">`)
        for(let j = i; j < 5+i; j++) {
            let artist = "";
            while(idx < chicagos.data.data.length) {
                if(chicagos.data.data[idx] !== null) {
                    if('image_id' in chicagos.data.data[idx] && chicagos.data.data[idx].image_id !== null) {
                        let imageId = chicagos.data.data[idx].image_id;
                        let newUrl = iiifUrl.concat("/");
                        newUrl = newUrl.concat(imageId);
                        newUrl = newUrl.concat("/full/843,/0/default.jpg");
                        if(chicagos.data.data[idx].artist_title !== null) {
                            artist = artist.concat(chicagos.data.data[idx].artist_title);
                        }
                        $(`#chicagoRow${i+(2*numPages)}`).append(`<td class="sentence subtitle">
                        <img src=${newUrl} width="100" height="100"></img>
                        <br></br>
                        <strong> <div class="sentence">Title: </div></strong> ${chicagos.data.data[idx].title}
                        <br></br>
                        <strong> <div class="sentence">Artist: </div></strong> ${artist} 
                        </td>`);
                        idx++;
                        break;
                    } 
                } 
                idx++;
                
            }  
            if(idx === 10) {
                chicagos = await getChicago(numPages+1);
                idx = 0;
            }    
        }
        $(`#chicagoGallery`).append(`</tr><br></br>`)
    }
}

async function main() {
    loadHarvard();
    loadChicago();
}

async function generateRandomHarvardPainting(event) {
    var username = firebase.auth().currentUser.displayName;
    $(`#buttons`).replaceWith(`<div id="buttons"></div>`);
    $(`#question`).replaceWith(`<div class="subtitle sentence is-3" id="question">Who is the artist?</div>`);
    $(`.score`).replaceWith(`<h4 class="score title">Score: ${score}</h4>`);
    $(`#buttons`).append(`
    <button class="button is-black is-medium" id="submit"> Submit Answer </button>
    <button class="button is-black is-outlined is-medium" id="next"> Next </button>`);
    $(`#paintingEx`).replaceWith(`<div id="paintingEx"> </div>`);
    $(`#choices`).replaceWith(`<div id="choices">
        <div id="1"> <input type="radio" name="choice" value="A" id="id1"> </div>
        <div id="2"> <input type="radio" name="choice" value="B" id="id2"> </div>
        <div id="3"> <input type="radio" name="choice" value="C" id="id3"> </div>
        <div id="4"> <input type="radio" name="choice" value="D" id="id4"> </div>
    </div> `);
    harvards = await getHarvard(0);
    let randomChoice = Math.floor(Math.random() * 4) + 1;
    let randomIndex = Math.floor(Math.random() * harvards.data.records.length);
    console.log(harvards.data.records.length);
    while(randomIndex < harvards.data.records.length) {
        console.log(randomIndex);
        if(harvards.data.records[randomIndex].primaryimageurl !== null &&
            'people' in harvards.data.records[randomIndex] && 
            'primaryimageurl' in harvards.data.records[randomIndex]) {
            randomPainting = harvards.data.records[randomIndex].primaryimageurl;
                break;
        } 
        randomIndex = Math.floor(Math.random() * harvards.data.records.length);
    }
    if('people' in harvards.data.records[randomIndex] && 'primaryimageurl' in harvards.data.records[randomIndex]) {
        harvardArtistChoice = "";
        $(`#paintingEx`).append(`<img src=${randomPainting} width=200 height=200></img>`)
        for(let i = 0; i < harvards.data.records[randomIndex].people.length; i++) {
            harvardArtistChoice = harvardArtistChoice.concat(harvards.data.records[randomIndex].people[i].name);
            if(i === harvards.data.records[randomIndex].people.length-1) {
                break;
            }
            harvardArtistChoice = harvardArtistChoice.concat(" and ");
        }
        $(`#${randomChoice.toString(10)}`).append(`<h5 class="sentence subtitle">${harvardArtistChoice}</h5>`);
        document.getElementById(`id${randomChoice.toString(10)}`).value = harvardArtistChoice;
        putChoicesRandomly(randomChoice);
        console.log(harvardArtistChoice);
    }
    $("#submit").on("click", handleHarvardSubmit);
    $("#next").on("click", generateRandomHarvardPainting);
}

async function generateRandomChicagoPainting(event) {
    $(`#buttons`).replaceWith(`<div id="buttons"></div>`);
    $(`.score`).replaceWith(`<h4 class="score title">Score: ${score}</h4>`);
    $(`#question`).replaceWith(`<div class="subtitle sentence is-3" id="question">Who is the artist?</div>`);
    $(`#buttons`).append(`
    <button class="button is-black is-medium" id="submit"> Submit Answer </button>
    <button class="button is-black is-outlined is-medium" id="next"> Next </button>`);
    $(`#paintingEx`).replaceWith(`<div id="paintingEx"> </div>`);
    $(`#choices`).replaceWith(`<div id="choices">
        <div id="1"> <input type="radio" name="choice" value="A" id="id1"> </div>
        <div id="2"> <input type="radio" name="choice" value="B" id="id2"> </div>
        <div id="3"> <input type="radio" name="choice" value="C" id="id3"> </div>
        <div id="4"> <input type="radio" name="choice" value="D" id="id4"> </div>
    </div> `);
    chicagos = await getChicago(0);
    let iiifUrl = chicagos.data.config.iiif_url;
    let newUrl = iiifUrl.concat("/");
    let randomChoice = Math.floor(Math.random() * 4) + 1;
    let randomIndex = Math.floor(Math.random() * (chicagos.data.data.length));
    console.log(chicagos.data.data[3]);
    while(randomIndex < chicagos.data.data.length) {
        console.log(randomIndex);
        if('image_id' in chicagos.data.data[randomIndex] && chicagos.data.data[randomIndex].image_id !== null) {
            let imageId = chicagos.data.data[randomIndex].image_id;
            newUrl = newUrl.concat(imageId);
            newUrl = newUrl.concat("/full/843,/0/default.jpg");
            if(newUrl !== null && chicagos.data.data[randomIndex].artist_title !== null) {
                randomPainting = newUrl;
                break;
            } 
        }
        randomIndex = Math.floor(Math.random() * chicagos.data.data.length);
    }
    chicagoArtistChoice = "";
    $(`#paintingEx`).append(`<img src=${randomPainting} width=200 height=200></img>`)
    chicagoArtistChoice = chicagoArtistChoice.concat(chicagos.data.data[randomIndex].artist_title);            
    $(`#${randomChoice.toString(10)}`).append(`<h5 class="sentence subtitle">${chicagoArtistChoice}</h5>`);
    document.getElementById(`id${randomChoice.toString(10)}`).value = chicagoArtistChoice
    putChoicesRandomly(randomChoice);
    console.log(chicagoArtistChoice);
    $("#submit").on("click", handleChicagoSubmit);
    $("#next").on("click", generateRandomChicagoPainting);
}

function putChoicesRandomly(answer) {
    generateRandomChoices();
    let randomChoice2 = Math.floor(Math.random() * 4) + 1;
    while(randomChoice2 < 5) {
        if(answer !== randomChoice2) {
            $(`#${randomChoice2.toString(10)}`).append(`<h5 class="sentence subtitle">${randomArtists[0]}</h5>`);
            document.getElementById(`id${randomChoice2.toString(10)}`).value = randomArtists[0]
            break;
        }
        randomChoice2 = Math.floor(Math.random() * 4) + 1;
    }
    let randomChoice3 = Math.floor(Math.random() * 4) + 1;
    while(randomChoice3 < 5) {
        if(answer !== randomChoice3 && randomChoice2 !== randomChoice3) {
            $(`#${randomChoice3.toString(10)}`).append(`<h5 class="sentence subtitle">${randomArtists[1]}</h5>`);
            document.getElementById(`id${randomChoice3.toString(10)}`).value = randomArtists[1]
            break;
        }
        randomChoice3 = Math.floor(Math.random() * 4) + 1;
    }
    let randomChoice4 = Math.floor(Math.random() * 4) + 1;
    while(randomChoice4 < 5) {
        if(answer !== randomChoice4 && randomChoice2 !== randomChoice4 &&
            randomChoice3 !== randomChoice4) {
            $(`#${randomChoice4.toString(10)}`).append(`<h5 class="sentence subtitle">${randomArtists[2]}</h5>`);
            document.getElementById(`id${randomChoice4.toString(10)}`).value = randomArtists[2]
            break;
        }
        randomChoice4 = Math.floor(Math.random() * 4) + 1;
    } 
}

function generateRandomChoices() {
    let randomIndex;
    let harvardOrChicago;
    randomArtists = [];
    while(randomArtists.length < 3) {
        harvardOrChicago = Math.floor(Math.random() * 2) + 1;
        if(harvardOrChicago === 1){
            randomIndex = Math.floor(Math.random() * chicagos.data.data.length);
            while(randomIndex < chicagos.data.data.length) {
                if(chicagos.data.data[randomIndex].artist_title !== null) {
                    if(!randomArtists.includes(chicagos.data.data[randomIndex].artist_title) &&
                    chicagos.data.data[randomIndex].artist_title !== chicagoArtistChoice) {
                        randomArtists.push(chicagos.data.data[randomIndex].artist_title);
                        break;
                    }
                } 
                randomIndex = Math.floor(Math.random() * chicagos.data.data.length);
            }
        } else if (harvardOrChicago === 2) {
            randomIndex = Math.floor(Math.random() * harvards.data.records.length);
            while(randomIndex < harvards.data.records.length) {
                if('people' in harvards.data.records[randomIndex]) {
                    if(!randomArtists.includes(harvards.data.records[randomIndex].people[0].name) &&
                    harvards.data.records[randomIndex].people[0].name !== harvardArtistChoice){
                        randomArtists.push(harvards.data.records[randomIndex].people[0].name);
                        break;
                    }
                }
                randomIndex = Math.floor(Math.random() * harvards.data.records.length);
            }
        }
    }
    console.log(randomArtists);
}

function handleHarvardSubmit(event) {
    event.preventDefault();
    const choices = document.querySelectorAll('input[name="choice"]');
    let selectedValue;
    for (const choice of choices) {
        if (choice.checked) {
            selectedValue = choice.value;
            break;
        }
    }    
    if(selectedValue === harvardArtistChoice) {
        score = score+5;
        alert("correct!");
        generateRandomHarvardPainting();
    } else {
        alert("try again, or view gallery to practice...");
    }
};

function handleChicagoSubmit(event) {
    event.preventDefault();
    const choices = document.querySelectorAll('input[name="choice"]');
    let selectedValue;
    for (const choice of choices) {
        if (choice.checked) {
            selectedValue = choice.value;
            break;
        }
    }    
    if(selectedValue === chicagoArtistChoice) {
        score = score+5;
        alert("correct!");
        generateRandomChicagoPainting();
    } else {
        alert("try again, or view gallery to practice...")
    }
};

main();

$(window).scroll(async function() {
    if ($(window).scrollTop() == $(document).height()-$(window).height() && !loading){
        loading = true;
        numPages++;
        main();
        loading = false;
    }
})

const toggleSwitch = document.querySelector('input[type="checkbox"]');
function switchTheme(e) {
    if(e.target.checked) {
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
    } else {
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
}
if(toggleSwitch !== null) {
    toggleSwitch.addEventListener('change', switchTheme, true);
}
