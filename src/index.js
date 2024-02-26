document.addEventListener("DOMContentLoaded", () => {
    let goodDogFilter = false
    getAllDogs()

    document.getElementById("good-dog-filter").addEventListener("click", e => {
        document.getElementById("dog-bar").innerHTML = ""
        goodDogFilter = !goodDogFilter
        if (goodDogFilter){
            e.target.textContent = `Filter good dogs: ON`
            fetch("http://localhost:3000/pups")
            .then(res=>res.json())
            .then(pupData => pupData.forEach(pup => {
                if(pup.isGoodDog){
                    renderPups(pup)
                }
            }))
        } else {
            e.target.textContent = `Filter good dogs: OFF`
            getAllDogs()
        }
    })

})

function getAllDogs(){
    fetch("http://localhost:3000/pups")
    .then(res=>res.json())
    .then(pupData => pupData.forEach(pup => renderPups(pup)))
    }

function renderPups(pup) {
        let pupSelector = document.createElement("span")
        pupSelector.id = pup.id
        pupSelector.textContent = `${pup.name}`
        pupSelector.addEventListener("click", e => {
            document.getElementById("dog-info").innerHTML = ""
            displayPupper(pup)
        })
        document.getElementById("dog-bar").appendChild(pupSelector)
    }

function displayPupper(pup) {
    fetch(`http://localhost:3000/pups/${pup.id}`)
    .then(res=>res.json())
    .then(pupDetails => {
        goodOrBad = pup.isGoodDog ? `Good dog!` : `Bad dog`
        let pupCard = document.createElement("div")
        pupCard.innerHTML = `
            <img src=${pupDetails.image}>
            <h2>${pupDetails.name}</h2>
            <button>${goodOrBad}</button>
        `
        document.getElementById("dog-info").appendChild(pupCard)

        pupCard.querySelector("button").addEventListener("click", e => {
            updateDog(pup)
            if (e.target.textContent === `Good dog!`){
                e.target.textContent = `Bad dog`
            } else {
                e.target.textContent = `Good dog!`
            }
            })
        })
    }

    function updateDog(pup){
        pup.isGoodDog = !pup.isGoodDog
        fetch(`http://localhost:3000/pups/${pup.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type":"application/json",
                Accept:"application/json"
            },
            body: JSON.stringify(pup)
        })
        .then(res=>res.json())
        .then(newPup=> console.log(newPup))
    }
