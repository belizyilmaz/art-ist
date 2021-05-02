let numPages = 0;
let loading = false;
let randomPainting;
let harvardArtistChoice = "";
let chicagoArtistChoice = "";

var harvardApiURL = "https://api.harvardartmuseums.org/object";
var chicagoApiURL = "https://api.artic.edu/api/v1/artworks";

let harvardStringRaw = $.param({
    apikey: "2f6192ac-c482-48b8-b123-eed87d6b5a70",
    size: 100,
    classification: "Paintings",
});
let chicagoStringRaw = $.param({
    page: 1,
    limit: 10,
    offset: 0,
});

$(`#harvardButton`).on("click", {
    str: harvardStringRaw
}, generateRandomHarvardPainting);
$(`#chicagoButton`).on("click", {
    str: chicagoStringRaw
}, generateRandomChicagoPainting);

function main() {
    let harvardString = $.param({
        apikey: "2f6192ac-c482-48b8-b123-eed87d6b5a70",
        size: 10,
        page: numPages+1,
        classification: "Paintings",
    });
    
    let chicagoString = $.param({
        page: numPages+1,
        limit: 10,
        offset: numPages*10,
    });

    $.getJSON(harvardApiURL + "?" + harvardString, function(data) {
        let current = 0;
        for(let i = 0; i < ((data.records.length)/5); i++) {
            $(`#harvardGallery`).append(`<tr id="harvardRow${i+(5*numPages)}">`)
            for(let j = i; j < 5+i; j++) {
                let artists = "";
                if(data.records[current].primaryimageurl !== null) {
                    if('people' in data.records[current]) {
                        for(let k = 0; k < data.records[current].people.length; k++) {
                            artists = artists.concat(data.records[current].people[k].name);
                            if(k === data.records[current].people.length-1) {
                                break;
                            }
                            artists = artists.concat(", ");
                        }
                    }
                    $(`#harvardRow${i+(5*numPages)}`).append(`<td class="subtitle">
                    <img src=${data.records[current].primaryimageurl} width="100" height="100">
                    <br></br>
                    <strong> Title: </strong> ${data.records[current].title}</img>
                    <br></br>
                    <strong> Artists: </strong> ${artists} 
                    </td>`)
                }
                current++;
            }
            $(`#harvardGallery`).append(`</tr><br></br>`)
        }
    });
    
    $.getJSON(chicagoApiURL + "?" + chicagoString, function(result) {
        let idx = 0;
        let iiifUrl = result.config.iiif_url;
        for(let i = 0; i < (result.data.length)/5; i++) {
            $(`#chicagoGallery`).append(`<tr id="chicagoRow${i+(5*numPages)}">`)
            for(let j = i; j < 5+i; j++) {
                let artist = "";
                let imageId = result.data[idx].image_id;
                let newUrl = iiifUrl.concat("/");
                newUrl = newUrl.concat(imageId);
                newUrl = newUrl.concat("/full/843,/0/default.jpg");
                if(newUrl !== null)  {
                    if(result.data[idx].artist_title !== null) {
                        artist = artist.concat(result.data[idx].artist_title);
                    }
                    $(`#chicagoRow${i+(5*numPages)}`).append(`<td class="subtitle">
                    <img src=${newUrl} width="100" height="100">
                    <br></br>
                    <strong> Title: </strong> ${result.data[idx].title}</img>
                    <br></br>
                    <strong> Artists: </strong> ${artist} 
                    </td>`)
                    idx++;
                }  
            }
            $(`#chicagoGallery`).append(`</tr><br></br>`)
        }
    });
}

function generateRandomHarvardPainting(event) {
    $(`#buttons`).replaceWith(`<div id="buttons"></div>`);
    $(`#choices`).append(`
    <div id="1"> <input type="radio" name="choice" value="A" id="id1"> </div>
    <div id="2"> <input type="radio" name="choice" value="B" id="id2"> </div>
    <div id="3"> <input type="radio" name="choice" value="C" id="id3"> </div>
    <div id="4"> <input type="radio" name="choice" value="D" id="id4"> </div>`);
    $(`#buttons`).append(`
    <button class="button is-light" id="previous"> Previous </button>
    <button class="button is-black is-medium" id="submit"> Submit Answer </button>
    <button class="button is-light" id="previous"> Next </button>`);
    $(`#paintingEx`).replaceWith(`<div id="paintingEx"> </div>`);
    $(`#choices`).replaceWith(`<div id="choices">
        <div id="1"> <input type="radio" name="choice" value="A" id="id1"> </div>
        <div id="2"> <input type="radio" name="choice" value="B" id="id2"> </div>
        <div id="3"> <input type="radio" name="choice" value="C" id="id3"> </div>
        <div id="4"> <input type="radio" name="choice" value="D" id="id4"> </div>
    </div> `);
    $.getJSON(harvardApiURL + "?" + event.data.str, function(data) {
        let randomChoice = Math.floor(Math.random() * 4) + 1;
        let randomIndex = Math.floor(Math.random() * data.records.length);
        while(randomIndex < data.records.length) {
            if(data.records[randomIndex].primaryimageurl !== null &&
                'people' in data.records[randomIndex] && 
                'primaryimageurl' in data.records[randomIndex]) {
                randomPainting = data.records[randomIndex].primaryimageurl;
                break;
            } 
            randomIndex = Math.floor(Math.random() * data.records.length);
        }
        if('people' in data.records[randomIndex] && 'primaryimageurl' in data.records[randomIndex] ) {
            $(`#paintingEx`).append(`<img src=${randomPainting} width=200 height=200></img>`)
            for(let i = 0; i < data.records[randomIndex].people.length; i++) {
                harvardArtistChoice = harvardArtistChoice.concat(data.records[randomIndex].people[i].name);
                if(i === data.records[randomIndex].people.length-1) {
                    break;
                }
                harvardArtistChoice = harvardArtistChoice.concat(" and ");
            }
            $(`#${randomChoice.toString(10)}`).append(`<h5 class="subtitle">${harvardArtistChoice}</h5>`);
            document.getElementById(`id${randomChoice.toString(10)}`).value = harvardArtistChoice
        }
    });
    $("#submit").on("click", handleHarvardSubmit);
}

function generateRandomChicagoPainting(event) {
    $(`#buttons`).replaceWith(`<div id="buttons"></div>`);
    $(`#choices`).append(`
    <div id="1"> <input type="radio" name="choice" value="A" id="id1"> </div>
    <div id="2"> <input type="radio" name="choice" value="B" id="id2"> </div>
    <div id="3"> <input type="radio" name="choice" value="C" id="id3"> </div>
    <div id="4"> <input type="radio" name="choice" value="D" id="id4"> </div>`);
    $(`#buttons`).append(`
    <button class="button is-light" id="previous"> Previous </button>
    <button class="button is-black is-medium" id="submit"> Submit Answer </button>
    <button class="button is-light" id="previous"> Next </button>`);
    $(`#paintingEx`).replaceWith(`<div id="paintingEx"> </div>`);
    $(`#choices`).replaceWith(`<div id="choices">
        <div id="1"> <input type="radio" name="choice" value="A" id="id1"> </div>
        <div id="2"> <input type="radio" name="choice" value="B" id="id2"> </div>
        <div id="3"> <input type="radio" name="choice" value="C" id="id3"> </div>
        <div id="4"> <input type="radio" name="choice" value="D" id="id4"> </div>
    </div> `);
    $.getJSON(chicagoApiURL + "?" + event.data.str, function(result) {
        let iiifUrl = result.config.iiif_url;
        let newUrl = iiifUrl.concat("/");
        let randomChoice = Math.floor(Math.random() * 4) + 1;
        let randomIndex = Math.floor(Math.random() * result.data.length);
        while(randomIndex < result.data.length) {
            let imageId = result.data[randomIndex].image_id;
            newUrl = newUrl.concat(imageId);
            newUrl = newUrl.concat("/full/843,/0/default.jpg");
            if(newUrl !== null && result.data[randomIndex].artist_title !== null) {
                randomPainting = newUrl;
                break;
            } 
            randomIndex = Math.floor(Math.random() * result.data.length);
        }
        if(newUrl !== null) {
            chicagoArtistChoice = "";
            $(`#paintingEx`).append(`<img src=${randomPainting} width=200 height=200></img>`)
            chicagoArtistChoice = chicagoArtistChoice.concat(result.data[randomIndex].artist_title);            
            $(`#${randomChoice.toString(10)}`).append(`<h5 class="subtitle">${chicagoArtistChoice}</h5>`);
            document.getElementById(`id${randomChoice.toString(10)}`).value = chicagoArtistChoice
        }
    });
    $("#submit").on("click", handleChicagoSubmit);
}

function handleHarvardSubmit(event) {
    event.preventDefault();
    const rbs = document.querySelectorAll('input[name="choice"]');
    let selectedValue;
    for (const rb of rbs) {
        if (rb.checked) {
            selectedValue = rb.value;
            break;
        }
    }    
    console.log(selectedValue);
    console.log(harvardArtistChoice)
    if(selectedValue === harvardArtistChoice) {
        alert("correct!")
    } else {
        alert("try again, or view gallery to practice...")
    }
};

function handleChicagoSubmit(event) {
    event.preventDefault();
    const rbs = document.querySelectorAll('input[name="choice"]');
    let selectedValue;
    for (const rb of rbs) {
        if (rb.checked) {
            selectedValue = rb.value;
            break;
        }
    }    
    console.log(selectedValue);
    console.log(chicagoArtistChoice)
    if(selectedValue === chicagoArtistChoice) {
        alert("correct!")
    } else {
        alert("try again, or view gallery to practice...")
    }
};

main();

$(window).scroll(async function() {
    if ($(window).scrollTop() == $(document).height()-$(window).height() && !loading){
        loading = true;
        numPages++;
        console.log(numPages)
        main();
        loading = false;
    }
})