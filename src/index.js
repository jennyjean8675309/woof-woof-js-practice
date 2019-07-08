const dogsURL = 'http://localhost:3000/pups'

let filterOn = false

document.addEventListener('DOMContentLoaded', function() {
    fetchPups()
    showFilterButton()
    getFilterButton().addEventListener('click', filterDogs)
})

function showFilterButton() {
    if (filterOn === false) {
        getFilterButton().innerText = 'Filter good dogs: OFF'
    } else if (filterOn === true) {
        getFilterButton().innerText = 'Filter good dogs: ON'
    }
}

function filterDogs(event) {
    console.log('filtering the dogs...')
    filterOn = !filterOn
    showFilterButton()

    if (filterOn) {
    getDogBar().innerHTML = ''
    fetch(dogsURL)
        .then(response => response.json())
        .then(dogs => {
            let goodDogs = dogs.filter(dog => dog.isGoodDog === true)
            goodDogs.forEach(dog => showDog(dog))
        })
        .then(response => response.json())
        .then(res => console.log(res))
    } else {
        getDogBar().innerHTML = ''
        fetchPups()
    }
}

function fetchPups() {
    fetch(dogsURL)
        .then(response => response.json())
        .then(dogs => dogs.forEach(dog => showDog(dog)))
}

function showDog(dog) {
    let dogSpan = document.createElement('span')
    dogSpan.innerText = dog.name
    dogSpan.addEventListener('click', () => showDogDetail(dog))
    getDogBar().append(dogSpan)
}

function showDogDetail(dog) {
    getDogInfoDiv().innerHTML = ''

    let dogImage = document.createElement('img')
    dogImage.src = dog.image
    let dogHeader = document.createElement('h2')
    dogHeader.innerText = dog.name
    let dogButton = document.createElement('button')
    dogButton.id = `dog-${dog.id}`
    dogButton.dataset.isGood = dog.isGoodDog
    dogButton.addEventListener('click', toggleDogStatus)

    if (dog.isGoodDog === true) {
        dogButton.innerText = 'Good Dog!'
    } else {
        dogButton.innerText = 'Bad Dog!'
    }

    getDogInfoDiv().append(dogImage, dogHeader, dogButton)
}

function toggleDogStatus(event) {
    let dogId = event.target.id.split('-')[1]
    let currentDogStatus = event.target.dataset.isGood
    
    if (currentDogStatus === "false") {
        updatedDogStatus = true
    } else {
        updatedDogStatus = false
    }

    fetch(`${dogsURL}/${dogId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ isGoodDog: updatedDogStatus })
    })
    .then(response => response.json())
    .then(updatedDog => showDogDetail(updatedDog))
}

///// functions to return nodes /////

function getDogBar() {
    return document.querySelector('#dog-bar')
}

function getDogInfoDiv() {
    return document.querySelector('#dog-info')
}

function getFilterButton() {
    return document.querySelector('#good-dog-filter')
}