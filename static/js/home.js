let heroCards = 0;

window.addEventListener("load", function() {
    heroCards = document.querySelectorAll('.hero_card');
    const regionSelect = document.querySelector('#region_select');
    const genderSelect = document.querySelector('#gender_select');

    fillSelect(regionSelect, "region")
    fillSelect(genderSelect, "gender")
})

function fillSelect(element, attribute) {
    let list = [];

    heroCards.forEach((hero) => {
        let temp = hero.getAttribute(attribute)
        if (!list.includes(temp))
            list.push(temp)
    });

    if (list) {
        list.forEach((item) => {
            let option = document.createElement('option')
            option.value = item
            option.innerText = item
            element.appendChild(option)
        })
    }
}

function filterDate() {
    const afterDate = Date.parse(document.querySelector('#after_date').value);
    const beforeDate = Date.parse(document.querySelector('#before_date').value);

    if (isNaN(afterDate)) {
        heroCards.forEach((hero) => {
            let deathDate = Date.parse(hero.getAttribute("deathdate"));

            if (deathDate > beforeDate && !hero.classList.contains('hidden')) {
                hero.classList.add('hidden')
            } else if (deathDate < beforeDate) {
                hero.classList.remove('hidden')
            }
        })
    } else if (isNaN(beforeDate)) {
        heroCards.forEach((hero) => {
            let deathDate = Date.parse(hero.getAttribute("deathdate"));

            if (deathDate < afterDate && !hero.classList.contains('hidden')) {
                hero.classList.add('hidden')
            } else if (deathDate > afterDate) {
                hero.classList.remove('hidden')
            }
        })
    } else {
        console.log("hi")
        heroCards.forEach((hero) => {
            let deathDate = Date.parse(hero.getAttribute("deathdate"));

            if ((deathDate < afterDate ||
             deathDate > beforeDate) &&
              !hero.classList.contains('hidden')) {
                hero.classList.add('hidden')
            } else if (deathDate > afterDate &&
            deathDate < beforeDate &&
             hero.classList.contains('hidden')) {
                hero.classList.remove('hidden')
            }
        })
    }

    console.log(isNaN(beforeDate))
}

function filter(value, attribute) {
    if (attribute == "name")
        value = value.parentNode.querySelector('input').value

    value = value.toLowerCase();
    heroCards.forEach((hero) => {
        if (!hero.getAttribute(attribute).toLowerCase().includes(value) && !hero.classList.contains('hidden')) {
            hero.classList.add('hidden')
        } else if (hero.getAttribute(attribute).toLowerCase().includes(value) || value == "all") {
            hero.classList.remove('hidden')
        }
    })
}