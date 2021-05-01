let numPages = 0;
let loading = false;
let randomPainting;

var harvardApiURL = "https://api.harvardartmuseums.org/object";
var chicagoApiURL = "https://api.artic.edu/api/v1/artworks";

let harvardStringRaw = $.param({
    apikey: "2f6192ac-c482-48b8-b123-eed87d6b5a70",
    size: 100,
    classification: "Paintings",
});

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
                        console.log(result.data[idx].artist_title)
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

function generateRandomPainting(harvardString) {
    let randomChoice = Math.floor(Math.random() * 4) + 1;
    $.getJSON(harvardApiURL + "?" + harvardString, function(data) {
        let randomIndex = Math.floor(Math.random() * data.records.length);
        console.log("rando index is " + randomIndex)
        let artist = "";
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
            console.log("we in")
            $(`#paintingEx`).append(`<img src=${randomPainting} width=200 height=200></img>`)
            for(let i = 0; i < data.records[randomIndex].people.length; i++) {
                artist = artist.concat(data.records[randomIndex].people[i].name);
                if(i === data.records[randomIndex].people.length-1) {
                    break;
                }
                artist = artist.concat(" and ");
            }
            console.log(artist);
            $(`#${randomChoice.toString(10)}`).append(artist);
        }
    });
}

main();

generateRandomPainting(harvardStringRaw);

$(window).scroll(async function() {
    if ($(window).scrollTop() == $(document).height()-$(window).height() && !loading){
        loading = true;
        numPages++;
        console.log(numPages)
        main();
        loading = false;
    }
})