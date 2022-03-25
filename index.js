const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");
const article = document.querySelector("article");
const noResultMesssage = document.querySelector(".no-result-message");
const loadingIndicator = document.querySelector(".loading-indicator");


const definitionSection = document.querySelector(".definition-section");
const phoneticsSection = document.querySelector(".phonetics-section");

searchBtn.addEventListener("click", async (event)=>{
    event.preventDefault();
    const searchedWord = searchInput.value;
    loadingIndicator.style.display = "flex"
    article.style.display = "none";
    noResultMesssage.style.display = "none";
    if(searchedWord != ""){
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchedWord}`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            if(!response.ok){
                noData("No definitions found.")
            }else{
                loadingIndicator.style.display = "none";
                article.style.display = "block";
                displayData(data);
                
            }
           
            
        }catch (error) {
            noData(error.message+", probably a network error.")
        }
    }else{
        noData("Empty input.")
    }
    
    
})

function noData(message){
    loadingIndicator.style.display = "none";
    article.style.display = "none";
    noResultMesssage.style.display = "block";
    noResultMesssage.textContent = message;
}


function displayData(data){
    article.style.display = "block";
    noResultMesssage.style.display = "none";

    const word = document.querySelector(".searched-word");
    let phoneticsItem = "";
    let meaningsItem = "";
    let definitionItems = "";
    let synonymSection = "";
    let antonymSection = "";
    let synonymsItems = "";
    let antonymsItems = "";
    let title = "";

    //display the searched word
    word.textContent = data[0].word;

    //displaying the phonetics 
    const phonetics = data[0].phonetics;
    //*phonetics - combination of the text and audio of a word's pronunciation

    //checking if a phonetics text and audio is available.
    //Note: Some words contain an array of phonetics but some of its item doesn't conatin a phonetic text/audio
    //      that's why i chose to just display one phonetics only. And if that one misses a phonetic text/audio,
    //      it will navigate to the next item and get its phonetic text/audio.

    function checkPhoneticsText(){
        let phoneticsText = "";
        for(let i=0; i<phonetics.length; i++){
            if(!phonetics[i].text){
                phoneticsText = "(Text pronunciation not available)";
            }else{
                phoneticsText = phonetics[i].text;
                break;
            }
        }
        return phoneticsText;
    }

    function checkPhoneticsAudio(){
        let phoneticsAudio = "";
        for(let i=0; i<phonetics.length; i++){
            if(!phonetics[i].audio){
                phoneticsAudio = "(Audio pronunciation not available)";
            }else{
                const audioFile = phonetics[i].audio;
                phoneticsAudio = `
                            <audio id="phoneticAudio" src="${audioFile}"></audio>
                            <button type="button" onClick="playAudio()"><i class="bi bi-volume-up"></i></button>`;
                break;
            }
            
        }
        return phoneticsAudio
    }
    

    //check if phonetics is totally not available
        if(phonetics.length == 0){
            phoneticsItem = "(Pronunciation not available)"
        }else{
            phoneticsItem += `<div>${checkPhoneticsAudio()}</div>
            <p>${checkPhoneticsText()}</p>
                                `;
        }
        
        phoneticsSection.innerHTML = phoneticsItem;

    

    //displaying the list of meanings BY type of speech available
    const meanings = data[0].meanings;
    for (let i=0; i<meanings.length; i++){
        //displaying the list of definition PER type of speech available
        const definitions = meanings[i].definitions;
        definitionItems = "";
        for(let j=0; j<definitions.length; j++){
            definitionItems += `<li class="the-definition">${j+1}. ${definitions[j].definition}</li>`;
        }
        //displaying the list of synonyms PER type of speech available
        const synonyms = meanings[i].synonyms;
        if(synonyms.length != 0){
            title = "Synonyms";
            synonymsItems = "";
            for (let k=0; k<synonyms.length; k++){
                synonymsItems += `<li>${synonyms[k]},</li>`;
            }
            synonymSection = `<div class="synonym-section">
                                <h3>${title}</h3>
                                <ul>${synonymsItems}</ul>
                              </div>`;

        }

        //displaying the list of antonyms PER type of speech available
        const antonyms = meanings[i].antonyms;
        if(antonyms.length != 0){
            title = "Antonyms";
            antonymsItems = "";
            for (let k=0; k<antonyms.length; k++){
                antonymsItems += `<li>${antonyms[k]},</li>`;
            }
            antonymSection = `<div class="antonym-section">
                                <h3>${title}</h3>
                                <ul>${antonymsItems}</ul>
                              </div>`;

        }

        //finally displaying them all
        meaningsItem += `<li class="definition-by-part-of-speech">
                            <h2 class="part-of-speech">${meanings[i].partOfSpeech}</h2>
                            <ul class="definitions-part">${definitionItems}</ul>
                            ${synonymSection}
                            ${antonymSection}
                            
                          </li>`;
        definitionSection.innerHTML = meaningsItem;
    }
}

//to play phonetic audios
function playAudio(){
    document.getElementById("phoneticAudio").play();
}