let jsonData = [];
let filterSet = [];
let filterJsonData = []

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

loadJSON(async function (json) {
    jsonData = await json
    filterJsonData = jsonData;

    renderJobListings(filterJsonData)

    let filters = document.getElementById('filters')
    let buttonList = document.getElementById('jobListings')
    let clearButton = document.getElementById('clearAllFilters')

    clearButton.addEventListener('click', (event) => {
        filters.innerHTML = '';
        filterSet = [];
        renderJobListings(jsonData)
    })

    // filters.addEventListener('click', (event) => {
    // const isButton = event.target.nodeName === 'BUTTON';
    // const isImg = event.target.nodeName === 'IMG'
    // if (!isButton && !isImg) {
    //     return;
    // }
    // if (!isButton) {
    //     filterSet.splice(event.target.parentNode.parentNode.id, 1)
    //     event.target.parentNode.parentNode.remove()
    // }
    // filterSet.splice(event.target.parentNode.id, 1)
    // event.target.parentNode.remove()
    // console.log(event.target.innerText);
    // renderJobListings(filterJsonData)
    // })

    buttonList.addEventListener('click', (event) => {
        const isButton = event.target.nodeName === 'BUTTON';
        if (!isButton) {
            return;
        }
        let innerText = event.target.innerHTML

        if (filterSet.includes(innerText)) {
            return;
        } else {
            let filter = document.createElement("div");
            filter.classList.add("filter")
            let filterText = document.createElement("span");
            let filterButton = document.createElement("button")
            let filterRemove = document.createElement("img")
            filterSet.push(innerText)
            // let idIndex = filterSet.indexOf(innerText)
            // filter.id = (`${idIndex}`)
            filter.id = innerText;
            filterRemove.src = "images/icon-remove.svg"
            filterRemove.alt = "remove"
            filterButton.appendChild(filterRemove)
            filterText.innerHTML = `${innerText}`
            filter.appendChild(filterText)
            filter.appendChild(filterButton)
            filters.appendChild(filter)
            filter.addEventListener('click', (event) => {
                // remove the filter if clicked on X
                const filter = event.target.parentNode.parentNode.innerText
                let indexToRemove = filterSet.indexOf(filter);
                filterSet.splice(indexToRemove, 1);
                console.log(filter)
                document.getElementById(filter).remove();
                
                // you need to pass in the original data here of it's 
                // use the filterData which doesn't contain the old filters

                renderJobListings(jsonData)
            })
            renderJobListings(filterJsonData)
        }
    })
});

function renderJobListings(data) {
    console.log("re-render", filterSet);
    document.getElementById("jobListings").innerHTML = '';

    const filteredListing = filterJobs(data, filterSet);

    filterJsonData = filteredListing;
    console.log(filterJsonData);
    for (const property in filteredListing) {
        addHtmlElements(property);
    }
}

function filterJobs(jobs, filters) {
    return jobs.filter(job => {

        if(filters.length == 0){
            return true;
        }

        let comboArray = []
        comboArray = comboArray.concat(job.languages);
        comboArray.push(job.role);
        comboArray.push(job.level);
        
        // console.log(comboArray);
        
        //combo = ["python", "javascript", "frontend"]
        
        //filters = ["python", "HTML", "ruby"]

        const allFiltersExist = filters.every(filter => comboArray.includes(filter));

        return allFiltersExist;
    });
}


function addHtmlElements(jsonIndex) {
    let jobListings = document.getElementById("jobListings");
    let jobListing = document.createElement("li");
    jobListing.setAttribute("id", `jobListing${jsonIndex}`);
    let img = document.createElement("img")
    img.src = `${filterJsonData[jsonIndex].logo}`
    jobListing.appendChild(img)
    let startListItems = document.createElement("div");
    startListItems.classList.add("startListingItems")
    let companyAndLabels = document.createElement("div");
    companyAndLabels.classList.add("companyAndLabels")
    let companyName = document.createElement("span");
    companyName.classList.add("companyName")
    companyName.innerHTML = `${filterJsonData[jsonIndex].company}`
    let newTag = document.createElement("span");
    newTag.classList.add("newTag")
    newTag.innerHTML = 'NEW!'
    if (filterJsonData[jsonIndex].new) {
        newTag.style.visibility = "visible"
    } else {
        newTag.style.visibility = "hidden"
    }
    let featuredTag = document.createElement("span");
    featuredTag.classList.add("featuredTag")
    featuredTag.innerHTML = 'FEATURED'
    if (filterJsonData[jsonIndex].featured) {
        featuredTag.style.visibility = "visible"
    } else {
        featuredTag.style.visibility = "hidden"
    }
    let position = document.createElement("div")
    position.classList.add("position")
    position.innerHTML = `${filterJsonData[jsonIndex].position}`

    let extraDetails = document.createElement("div")
    extraDetails.classList.add("extraDetails")
    extraDetails.innerHTML = `${filterJsonData[jsonIndex].postedAt}  •  ${filterJsonData[jsonIndex].contract}  •  ${filterJsonData[jsonIndex].location}`
    let endListItems = document.createElement("div");
    let filterButtons = document.createElement("div");
    endListItems.classList.add("endListingItems")
    filterButtons.classList.add("filterButtons")
    filterButtons.setAttribute("id", 'filterButtonsId');

    let roleButton = document.createElement("button");
    let levelButton = document.createElement("button")
    roleButton.innerHTML = `${filterJsonData[jsonIndex].role}`
    levelButton.innerHTML = `${filterJsonData[jsonIndex].level}`
    let langArrSize = filterJsonData[jsonIndex].languages.length
    let langArr = filterJsonData[jsonIndex].languages
    let toolsArrSize = filterJsonData[jsonIndex].tools.length
    let toolsArr = filterJsonData[jsonIndex].tools
    companyAndLabels.appendChild(companyName)
    companyAndLabels.appendChild(newTag)
    companyAndLabels.appendChild(featuredTag)
    startListItems.appendChild(companyAndLabels)
    startListItems.appendChild(position)
    startListItems.appendChild(extraDetails)
    filterButtons.appendChild(roleButton)
    filterButtons.appendChild(levelButton)
    for (let i = 0; i < langArrSize; i++) {
        let obj = langArr[i];
        let langButton = document.createElement("button");
        langButton.innerHTML = obj
        filterButtons.appendChild(langButton)
    }
    for (let i = 0; i < toolsArrSize; i++) {
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

function ifNewOrFeatured(type, tagDom) {

}