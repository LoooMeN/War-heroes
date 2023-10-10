let heroCards = 0;

window.addEventListener('load', () => {
    gofilter()
})

window.addEventListener("load", function() {
    heroCards = document.querySelectorAll('.hero_card');
    const regionSelect = document.querySelector('#region_select');
    const genderSelect = document.querySelector('#gender_select');

    fillSelect(regionSelect, "region")
    fillSelect(genderSelect, "gender")
})

function gofilter() {
    const genderSelect = document.querySelector('#hero_name_filter');

    genderSelect.addEventListener('keydown', (event) => {
        if (event.key == "Enter")
            filter1()
    })
}

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

function filter1() {
    let inputs = document.querySelectorAll('[filtrable="true"]')
    let values = {}

    inputs.forEach(elem => {
        values[elem.name] = elem.value
    })

    console.log(values)

    heroCards.forEach((hero) => {
        if (checkAcceptability(hero, filter(hero, values['name'], 'name')) == false)
            return;
        if (checkAcceptability(hero, filter(hero, values['region'], 'region')) == false)
            return;
        if (checkAcceptability(hero, filter(hero, values['gender'], 'gender')) == false)
            return;
        if (checkAcceptability(hero, filterDate(hero)) == false)
            return;
    })
}

function checkAcceptability(hero, value) {
    if (!value) {
        if (!hero.classList.contains('hidden'))
            hero.classList.add('hidden')
        return false
    } else if (value) {
        hero.classList.remove('hidden')
        return true
    }
}

function filterDate(hero) {
    const afterDate = Date.parse(document.querySelector('#after_date').value);
    const beforeDate = Date.parse(document.querySelector('#before_date').value);
    let deathDate = Date.parse(hero.getAttribute("deathdate"));

    if (isNaN(afterDate) && isNaN(beforeDate)) {
        return true
    } else if (isNaN(afterDate)) {
        if (deathDate > beforeDate && !hero.classList.contains('hidden')) {
            return false
        } else if (deathDate < beforeDate) {
            return true
        }
    } else if (isNaN(beforeDate)) {
        if (deathDate < afterDate && !hero.classList.contains('hidden')) {
            return false
        } else if (deathDate > afterDate) {
            return true
        }
    } else {
        return (deathDate >= afterDate && deathDate <= beforeDate)
    }
}

function filter(hero, value, attribute) {
    value = value.toLowerCase();
    if (value == "all" || value == "")
        return true;

    if (attribute == 'name')
        return hero.getAttribute(attribute).toLowerCase().includes(value);
    else
        return hero.getAttribute(attribute).toLowerCase() == value;
}