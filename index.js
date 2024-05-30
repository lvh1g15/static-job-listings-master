let jsonData;
let filterSet = [];

function loadJSON(callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'data.json', true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && xobj.status == "200") {
        callback(JSON.parse(xobj.responseText));
      }
    };
    xobj.send(null);  
}

loadJSON( async function(json) {
     jsonData = await json
     for (const property in jsonData) {
        addHtmlElements(property);
    }
    let filters = document.getElementById('filters')
    let buttonList = document.getElementById('jobListings')
    let clearButton = document.getElementById('clearAllFilters')
    
    clearButton.addEventListener('click', (event) => {
        filters.innerHTML = '';
        filterSet.length = 0;
        renderFilters(buttonList)
    })

    filters.addEventListener('click', (event) => {
        const isButton = event.target.nodeName === 'BUTTON';
        const isImg = event.target.nodeName === 'IMG'
        if (!isButton && !isImg) {
            return;
        }
        if(!isButton){
            filterSet.splice(event.target.parentNode.parentNode.id, 1)
            event.target.parentNode.parentNode.remove()
        }
        filterSet.splice(event.target.parentNode.id, 1)
        event.target.parentNode.remove()
        renderFilters(buttonList)
    })

    buttonList.addEventListener('click', (event) => {
        const isButton = event.target.nodeName === 'BUTTON';
        if (!isButton) {
          return;
        }
        let innerText = event.target.innerHTML

        if(filterSet.includes(innerText)){   
            return;
        }else{
            let filter = document.createElement("div");
            filter.classList.add("filter")
            let filterText = document.createElement("span");
            let filterButton = document.createElement("button")
            let filterRemove = document.createElement("img")
            filterSet.push(innerText)
            let idIndex = filterSet.indexOf(innerText)
            filter.id = (`${idIndex}`)
            filterRemove.src = "images/icon-remove.svg"
            filterRemove.alt = "remove"
            filterButton.appendChild(filterRemove)
            filterText.innerHTML = `${innerText}`
            filter.appendChild(filterText)
            filter.appendChild(filterButton)
            filters.appendChild(filter)
            renderFilters(buttonList)
        }
      })
});

function renderFilters(jobListings){
    console.log('----------')
    for(let x of Array.from(jobListings.children)) {
        for(let y of Array.from(x.children[2].children[0].children)){
            console.log(y)
            filterSet.forEach(function(entry) {
                console.log(entry);
                console.log('++++++++++++++++')
            });
            if(filterSet.includes(y.innerHTML)){
                console.log("show")
                y.parentNode.parentNode.parentNode
                break;
            }else{
                console.log("noshow")
                y.parentNode.parentNode.parentNode.remove()
            }
        }
    }
}


function addHtmlElements(jsonIndex){
    let jobListings = document.getElementById("jobListings");
    let jobListing = document.createElement("li");
    jobListing.setAttribute("id", `jobListing${jsonIndex}`);
    let img = document.createElement("img")
    img.src = `${jsonData[jsonIndex].logo}`
    jobListing.appendChild(img)
    let startListItems = document.createElement("div");
    startListItems.classList.add("startListingItems")
    let companyAndLabels = document.createElement("div");
    companyAndLabels.classList.add("companyAndLabels")
    let companyName = document.createElement("span");  
    companyName.classList.add("companyName")
    companyName.innerHTML = `${jsonData[jsonIndex].company}`
    let newTag = document.createElement("span");  
    newTag.classList.add("newTag")
    newTag.innerHTML = 'NEW!'
    if(jsonData[jsonIndex].new){
        newTag.style.visibility = "visible"
    }else{
        newTag.style.visibility = "hidden"
    }
    let featuredTag = document.createElement("span");
    featuredTag.classList.add("featuredTag")
    featuredTag.innerHTML = 'FEATURED'
    if(jsonData[jsonIndex].featured){
        featuredTag.style.visibility = "visible"
    }else{
        featuredTag.style.visibility = "hidden"
    }  
    let position = document.createElement("div")
    position.classList.add("position")
    position.innerHTML = `${jsonData[jsonIndex].position}`

    let extraDetails = document.createElement("div")
    extraDetails.classList.add("extraDetails")
    extraDetails.innerHTML = `${jsonData[jsonIndex].postedAt}  •  ${jsonData[jsonIndex].contract}  •  ${jsonData[jsonIndex].location}`
    let endListItems = document.createElement("div");
    let filterButtons = document.createElement("div");
    endListItems.classList.add("endListingItems")
    filterButtons.classList.add("filterButtons")
    filterButtons.setAttribute("id", 'filterButtonsId');

    let roleButton = document.createElement("button");
    let levelButton = document.createElement("button")
    roleButton.innerHTML = `${jsonData[jsonIndex].role}`
    levelButton.innerHTML = `${jsonData[jsonIndex].level}`
    let langArrSize = jsonData[jsonIndex].languages.length
    let langArr = jsonData[jsonIndex].languages
    let toolsArrSize = jsonData[jsonIndex].tools.length
    let toolsArr = jsonData[jsonIndex].tools
    companyAndLabels.appendChild(companyName)
    companyAndLabels.appendChild(newTag)
    companyAndLabels.appendChild(featuredTag)
    startListItems.appendChild(companyAndLabels)
    startListItems.appendChild(position)
    startListItems.appendChild(extraDetails)
    filterButtons.appendChild(roleButton)
    filterButtons.appendChild(levelButton)
    for(let i = 0; i < langArrSize; i++) {
        let obj = langArr[i];
        let langButton = document.createElement("button");
        langButton.innerHTML = obj
        filterButtons.appendChild(langButton)
    }
    for(let i = 0; i < toolsArrSize; i++) {
        let obj = toolsArr[i];
        let toolsButton = document.createElement("button");
        toolsButton.innerHTML = obj
        filterButtons.appendChild(toolsButton)
    }
    endListItems.appendChild(filterButtons)
    jobListing.appendChild(startListItems)

    jobListing.appendChild(endListItems)
    jobListings.appendChild(jobListing)

    
}

function ifNewOrFeatured(type, tagDom){
    
}