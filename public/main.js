const search = document.getElementById('search')
const searchTerm = document.getElementById('search-term')
const list = document.getElementById('condition-list')
search.addEventListener('click', buildList)

// Add event listener to input for "Enter" key
searchTerm.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default form submission behavior
        buildList();
    }
});

//fetch the data from the /api/term endpoint
async function runSearch(e){
    //get the input text
    const term = searchTerm.value
    //await the data from the endpoint, passing in the term
    let res = await fetch(`/api/${term}`)
    //parse the response as json
    res = await res.json()
    //return the array
    return res
}

function buildList(){
    list.textContent = ''
    runSearch(searchTerm)
    .then(data => {
        data.forEach(el => {
            buildListItem(list, el)
        })
    })
}

function buildListItem(parent, data){
    let li = document.createElement('li')
    li.innerHTML = `<span class="icd-code">${data.code}: </span><span>${data.desc}</span>`
    parent.appendChild(li)
}