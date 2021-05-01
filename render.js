let numPages = 0;
let loading = false;
let randomPainting;

var harvardApiURL = "https://api.harvardartmuseums.org/object";
var chicagoApiURL = "https://api.artic.edu/api/v1/artworks";

let harvardString = $.param({
    apikey: "2f6192ac-c482-48b8-b123-eed87d6b5a70",
    size: 10,
    page: numPages+1,
    classification: "Paintings",
});

function main() {
    harvardString = $.param({
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
                if(data.records[current].primaryimageurl != null) {
                    $(`#harvardRow${i+(5*numPages)}`).append(`<td class="subtitle">
                    <img src=${data.records[current].primaryimageurl} width="100" height="100">
                    <br></br>
                    ${data.records[current].title}</img>
                    </td>`)
                }
                current++;
            }
            $(`#harvardGallery`).append(`</tr><br></br>`)
        }
        //generateRandomPainting(harvardString);
    });
    
    $.getJSON(chicagoApiURL + "?" + chicagoString, function(result) {
        let idx = 0;
        let iiifUrl = result.config.iiif_url;
        for(let i = 0; i < (result.data.length)/5; i++) {
            $(`#chicagoGallery`).append(`<tr id="chicagoRow${i+(5*numPages)}">`)
            for(let j = i; j < 5+i; j++) {
                let imageId = result.data[idx].image_id;
                let newUrl = iiifUrl.concat("/");
                newUrl = newUrl.concat(imageId);
                newUrl = newUrl.concat("/full/843,/0/default.jpg");
                if(newUrl != null)  {
                    $(`#chicagoRow${i+(5*numPages)}`).append(`<td class="subtitle">
                    <img src=${newUrl} width="100" height="100">
                    <br></br>
                    ${result.data[idx].title}</img>
                    </td>`)
                    idx++;
                }  
            }
            $(`#chicagoGallery`).append(`</tr><br></br>`)
        }
    });
}

function generateRandomPainting(string) {
    let randomIndex = Math.floor(Math.random() * 10);
    $.getJSON(harvardApiURL + "?" + string, function(data) {
        let artist = "";
        while(randomIndex < 10) {
            console.log(randomIndex)
            if(data.records[randomIndex].primaryimageurl !== null) {
                randomPainting = data.records[randomIndex].primaryimageurl;
                break;
            } 
            randomIndex = Math.floor(Math.random() * 10);
        }
        $(`#paintingEx`).append(`<img src=${randomPainting} width=200 height=200></img>`)
        if('people' in data.records[randomIndex]) {
            for(let i = 0; i < data.records[randomIndex].people.length; i++) {
                artist = artist.concat(data.records[randomIndex].people[i].name);
                if(i === data.records[randomIndex].people.length-1) {
                    break;
                }
                artist = artist.concat(" and ");
            }
        }
        console.log(artist);
    });
}

main();
generateRandomPainting(harvardString);

$(window).scroll(async function() {
    if ($(window).scrollTop() == $(document).height()-$(window).height() && !loading){
        loading = true;
        numPages++;
        console.log(numPages)
        main();
        loading = false;
    }
})