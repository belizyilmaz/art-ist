let numPages = 0;
let loading = false;
let randomPainting;
let harvardArtistChoice = "";
let chicagoArtistChoice = "";
let score = 0;
let highest = 0;
let randomArtists = [];

let harvards = [];
let chicagos = [];


async function getHarvard(pages, size) {
    const result = await axios({
        method: 'get',
        url: "https://api.harvardartmuseums.org/object",
        params: {
            "apikey": "2f6192ac-c482-48b8-b123-eed87d6b5a70",
            "size": size,
            "classification": "Paintings",
            "page": pages+1,
        },
    });
    return result;
};

async function getChicago(pages, limit) {
    const result = await axios({
        method: 'get',
        url: "https://api.artic.edu/api/v1/artworks",
        params: {
            "page": pages+1,
            "limit": limit,
            "offset": pages*10,
        },
    });
    return result;
}

$(`#harvardButton`).on("click", generateRandomHarvardPainting);
$(`#chicagoButton`).on("click", generateRandomChicagoPainting);

async function loadHarvard() {
    harvards = await getHarvard(numPages, 12);
    let current = 0;
    for(let i = 0; i < ((harvards.data.records.length)/5); i++) {
        $(`#harvardGallery`).append(`<tr id="harvardRow${i+(3*numPages)}">`);
        for(let j = i; j < 5+i; j++) {
            let artists = "";
            while(current < harvards.data.records.length) {
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
            if(current === harvards.data.records.length) {
                harvards = await getHarvard(numPages+1, 12);
                current = 0;
            }
        }
        $(`#harvardGallery`).append(`</tr><br></br>`)
    }
}

async function loadChicago() {
    chicagos = await getChicago(numPages, 10);
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
            if(idx === chicagos.data.data.length) {
                chicagos = await getChicago(numPages+1, 10);
                idx = 0;
            }    
        }
        $(`#chicagoGallery`).append(`</tr><br></br>`)
    }
}

async function loadGallery() {
    loadHarvard();
    loadChicago();
}

loadGallery();

async function generateRandomHarvardPainting(event) {
    $(`#buttons`).replaceWith(`<div id="buttons"></div>`);
    $(`#question`).replaceWith(`<div class="subtitle sentence is-3" id="question">Who is the artist?</div>`);
    $(`#scoreTitle`).replaceWith(`<h4 class="score title" id="scoreTitle">Score: </h4>`);
    $(`#highestScore`).replaceWith(`<h4 class="score subtitle is-4" id="highestScore">Your highest score is ${highest} </h4>`);
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
    harvards = await getHarvard(0, 100);
    let randomChoice = Math.floor(Math.random() * 4) + 1;
    let randomIndex = Math.floor(Math.random() * harvards.data.records.length);
    while(randomIndex < harvards.data.records.length) {
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
    $(`#scoreTitle`).replaceWith(`<h4 class="score title" id="scoreTitle">Score: </h4>`);
    $(`#highestScore`).replaceWith(`<h4 class="score subtitle is-4" id="highestScore">Your highest score is ${highest}</h4>`);
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
    chicagos = await getChicago(0, 100);
    let iiifUrl = chicagos.data.config.iiif_url;
    let newUrl = iiifUrl.concat("/");
    let randomChoice = Math.floor(Math.random() * 4) + 1;
    let randomIndex = Math.floor(Math.random() * (chicagos.data.data.length));
    while(randomIndex < chicagos.data.data.length) {
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

$(window).scroll(async function() {
    if ($(window).scrollTop() == $(document).height()-$(window).height() && !loading){
        loading = true;
        numPages++;
        loadGallery();
        loading = false;
    }
})