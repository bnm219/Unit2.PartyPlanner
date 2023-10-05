const EVENTS_API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2309-FSA-ET-WEB-FT-SF/events`

const state = {
  parties: []
}

const partiesForm = document.querySelector('#newPartyForm')
const partiesList = document.querySelector('#partyList')

partiesForm.addEventListener('submit', addParty)

async function getPartyInfo(){
  try{
    const response = await fetch(EVENTS_API_URL);
    const json = await response.json();
    state.parties = json.data;
  } catch(err){
    console.log(err)
  }
}

async function createParty(name, description, date, location) {
    const response = await fetch(EVENTS_API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          name,
          description,
          date,
          location
        })
      })
      const json = await response.json()
      if (json.error){
        console.log(json.message)
      }
      render()
    }

async function deleteParty(id){
  try {
    const response = await fetch(`${EVENTS_API_URL}/${id}`, {method: "DELETE"})
    if (!response.ok){
      throw new Error("oops!")
    }
    render();
  } catch (err){
    console.log(err)
  }
}


function renderAllParties() {
  if (!state.parties.length){
    // update the list to say there aren't any
    partiesList.innerHTML = `<li>No parties! Why don't you throw one?</li>`;
    return;
  }
  const elements = state.parties.map(renderSingleParty)
  partiesList.replaceChildren(...elements)
}

async function render() {
  await getPartyInfo();
  renderAllParties();
}

render();

function renderSingleParty(party){
  const partyCard = document.createElement('section')
  partyCard.classList.add("party-card")
  partyCard.innerHTML = `
  <h2>${party.name}</h2>
  <p>${party.date}</p>
  <p>${party.location}</p>
  <p>${party.description}</p>
  `
  const deleteButton = document.createElement('button')
  deleteButton.textContent = "Delete"
  deleteButton.addEventListener('click', () => deleteParty(party.id))
  partyCard.append(deleteButton)

  return partyCard
}