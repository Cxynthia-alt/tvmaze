"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const res = await axios.get(`https://api.tvmaze.com/search/shows?q=${term}`);
  const shows = res.data;
  // console.log(shows);
  for(let item of shows){
    return [{
      id: `${item.show.id}`,
      name: `${item.show.name}`,
      summary: `${item.show.summary}`,
      image: `${item.show.image.medium}`
  }];
  }

}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image ? show.image : "https://tinyurl.com/tv-missing"}"
              alt="${show.id}"
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-primary btn-sm show-getEpisodes" data-show-id="${show.id}">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);


  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();

});



/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const res =  await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  const episodes = res.data;
  const epiList = [];
  // console.log(episodes);
  for (let item of episodes){
    epiList.push({
      id: `${item.id}`,
      name: `${item.name}`,
      season: `${item.season}`,
      number: `${item.number}`
    });

  }
  return epiList;

 }

/** Write a clear docstring for this function... */
//get ID from the DOM
//call the async function getEpisodesOfShow(id) with the retrieved ID in order to get the episode info
//Add an event listner to the episode button
  //once clicked, add the episode info to episodes-list

function populateEpisodes(episodes) {
  $episodesArea.empty();

  for(let item of episodes){
    const $episode = $(`<li>${item.name}(season: ${item.season}, number: ${item.number})</li>`);
    $episodesArea.append($episode);
  }
 }

//  async function searchForEpisodeAndDisplay(){


//  }

 $('body').on('click', '.show-getEpisodes', async function(e){
    e.stopPropagation();
    const id = $(this).data('show-id');
    const epis = await getEpisodesOfShow(id);

    $episodesArea.show();
    populateEpisodes(epis);
    // await searchForEpisodeAndDisplay();

 })




//img: set up a default img for shows that don't have image in api or an if statement (not preferred)


  // return [
  //   {
  //     id: 1767,
  //     name: "The Bletchley Circle",
  //     summary:
  //       `<p><b>The Bletchley Circle</b> follows the journey of four ordinary
  //          women with extraordinary skills that helped to end World War II.</p>
  //        <p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their
  //          normal lives, modestly setting aside the part they played in
  //          producing crucial intelligence, which helped the Allies to victory
  //          and shortened the war. When Susan discovers a hidden code behind an
  //          unsolved murder she is met by skepticism from the police. She
  //          quickly realises she can only begin to crack the murders and bring
  //          the culprit to justice with her former friends.</p>`,
  //     image:
  //         "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
  //   }
  // ]
