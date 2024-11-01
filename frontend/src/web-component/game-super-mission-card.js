// Defining custom web component 
export default class GameSuperMissionCard extends HTMLElement {
  constructor() {
    super();
    // Attaching shadow DOM for encapsulation
    this.attachShadow({ mode: "open" });
    // Properties of the card, has default values
    this.cardId = this.getAttribute("card-id") || "ID";
    this.cardType = this.getAttribute("card-type") || "TYPE";
    this.cardName = this.getAttribute("card-name") || "NAME";
    this.cardDescription = this.getAttribute("card-description") || "DESCRIPTION";
    this.cardIcon = ""
    this.bookmarked = false;
    this.selectionStatus = false;
    // Render the component
    this.render();
  }


  // Render function, various functionalities
  render() {
    this.shadowRoot.innerHTML = this.getTemplate();
    this.bookmarkAsFavorite();
    this.flipFunctionality();
    this.handleBookmarkEvent();
    this.cardStyles();
  }
  // Set styles for cards based on id
  cardStyles(){
      this.borderCardColor = "var(--mission-card, rgb(253,242,193))"
      this.bodyCardColor = "var(--mission-card-secondary, rgb(245, 221,143))";
  }
  // List of attributes to observe, looking for changes
  static get observedAttributes() {
    return [
      "card-name",
      "card-id",
      "card-description",
      "card-type",
      "card-category",
    ];
  }
  // If attribute of list from above changes
  attributeChangedCallback(name, oldValue, newValue) {
    // Do nothing if old and new values are the same
    if (oldValue === newValue) return;
    // Update values based on card properties
    if (name === "card-name") {
      this.cardName = newValue;
    } else if (name === "card-id") {
      this.cardId = newValue;
    } else if (name === "card-description") {
      this.cardDescription = newValue;
    } else if (name === "card-type") {
      this.cardType = newValue;
    }

    this.render();
  }


  connectedCallback() {
    // Access the card-icon attribute after the element is inserted into the DOM
    this.cardIcon = this.getAttribute("card-icon") || "/public/icons/icon-mission.png";
    // Render the component after getting all attribute values
    this.render();
  }

  // Function to flip card
  flipFunctionality() {
    const flip = this.shadowRoot.querySelector(".flip");
    const flip2 = this.shadowRoot.querySelector(".flip2");
    const card = this.shadowRoot.querySelector(".card_blueprint");

    flip.addEventListener("click", () => {
      card.style.transform = "rotateY(180deg)";
    });
    flip2.addEventListener("click", () => {
      card.style.transform = "rotateY(0deg)";
    });
  }

  // Toggle function to bookmark component, star icon changes color
  bookmarkAsFavorite() {
    const bookmark = this.shadowRoot.querySelector(".bookmark_smaller");
    bookmark.addEventListener("click", () => {
      this.bookmarked = !this.bookmarked;

      if (this.bookmarked) {
        bookmark.style.backgroundColor = "gold";
        this.selectionStatus = true;
        this.handleBookmarkEvent("bookmarked");
      } else {
        bookmark.style.backgroundColor = "white";
        this.selectionStatus = false;
        this.handleBookmarkEvent("unbookmarked");
      }
    });
  }

  // Handle bookmark event, dispatching custom event with card details
  handleBookmarkEvent(event) {
    // Formatted date and time string 
    this.formattedDate = new Date().toLocaleString("en-uk", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    // Relevant card details
    this.dispatchEvent(
      new CustomEvent(event, {
        detail: {
          formattedDate: this.formattedDate,
          cardId: this.cardId,
          cardType: this.cardType,
          cardName: this.cardName,
          cardDescription: this.cardDescription,
          selectionStatus: this.selectionStatus,
        },
      })
    );
  }

  // Get HTML with CSS template
  getTemplate() {
    return `
           

            <style>

            *{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                sans-serif;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            
            }

            /*flip card feature/structure from https://www.w3schools.com/howto/howto_css_flip_card.asp*/

            .card_blueprint {
                width: 250px;
                height: 375px;
                perspective: 1000px;
                background-color: ${this.borderCardColor};
                display: flex;
                justify-content: center;
                align-items: center;
                transform-style: preserve-3d;
                transition: transform 0.3s ease-in-out; 
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
    
            .card {
                width: 90%;
                height: 90%;
                transform-style: preserve-3d;
                transition: transform 0.5s ease; 
                border-radius: 10px;
            }
    
            .card-face {
                width: 100%;
                height: 100%;
                position: absolute;
                backface-visibility: hidden;
                border-radius: 10px;
            }
    
            .front {
                background-color: ${this.bodyCardColor};      
                transform: rotateY(180deg);
            }
    
            .back {

                background-color: white;         
            }
            .bookmark_container{
                position: absolute;
                right: 0;
                display: none;
            }
    
            .bookmark{
                width: 30px;
                height: 30px;
                margin: 2% 2% 0 0;
                clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);/*https://www.htmlcssbuttongenerator.com/CSS-clip-path-community.html*/
                
                background-color: black;
                transition: background-color 0.1s ease-in-out;
                
            }

            .bookmark_smaller{
                position:absolute;
                width: 20px;
                height: 20px;
                top: 0;
                right: 0;
                clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);/*https://www.htmlcssbuttongenerator.com/CSS-clip-path-community.html*/
                background-color: white;
                transition: background-color 0.1s ease-in-out;
                transform: translate(-5px, 5.7px);

            }
    
           .bookmark_smaller:hover{
                cursor: pointer;
            }
    
            .flip{
                position: absolute;
                right: 0;
                bottom: 4px;
                width: 40px;
                height: 36px;
                background-image: url(../../assets/img/flip-grey.png);
                background-size: cover;
                margin: 0 3% -5% 0;
                z-index:1000;
                display:none;
                backface-visibility: hidden;
            }
            .flip2{
                position: absolute;
                right: -10px;
                bottom: -15px;
                width: 40px;
                height: 35px;
                background-image: url(../../assets/img/flip-grey.png);
                background-size: cover;
                margin: 0 3% -5% 0;
                z-index:1000;
                display:none;
     
            }

            .flip:hover,
            .flip2:hover{
                cursor: pointer;
            }

            .card_blueprint:hover .flip,
            .card_blueprint:hover .flip2{
                display:block;
            }

            .content_front,.content_back{
                width: 100%;
                height: 100%;
            }

            .card_type,
            .card_name,
            .card_description_header,
            .card_description,
            .card_details{
                padding:3% 5%;
            }

            .card_description,
            .card_details,
            .card_number{
                font-size: smaller;

            }
            .card_type{
                padding: 7% 5%;
                color: black;
                font-weight:bold;
                border-radius: 9px 9px 0px 0px;
                font-size: large;
            }

            .card_name_container{
              width: 100%;
              display:flex;
              justify-content: space-between;
            }

            // *{
            //   outline: 1px solid red;
            // }
            .card_name{
                font-weight: bold;
                font-size: x-large;
                word-break: break-all;
            }

            .card_icon{
              width: 20%;
              height: 5%;
              margin-right: 5%;

            }

            .card_description_header{
                font-weight: bold;
                margin-top: 10%;
            }

            .card_description{

            }
            .card_details{
                position:absolute;
                bottom:15px;

            }

            .card_number{
                position:absolute;
                bottom:0;
                right: 0;
                margin-right:3%;
            }

            .card_details div.how{
                color:gray;
                font-weight: bold;
                text-transform: uppercase;

            }

            img{
                width:100%;
                height: 100%;
            }
            .card_title_container{
                width:100%;
                margin: 0 auto;
            }
            p.card_title{
                text-transform: uppercase;
                font-weight: bold;
                font-size: x-large;
                text-align:center;
                color: rgb(83, 143,201);
                margin-top:35%;
            }

            .card_logo_container{
                width:100%;
                height: 40%;
                margin: 0 auto;
                background-color: rgb(252,234,158);
                position:absolute;
                bottom: 10px;
                display:flex;
                justify-content: center;
                align-items: center;
            }

            .card_logo_clip-path{
                width:50px;
                height:50px;
                background: rgb(85,91,152);
                background: linear-gradient(90deg, rgba(85,91,152,1) 0%, rgba(105,107,161,1) 35%, rgba(116,152,192,1) 100%);
                // clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
                // clip-path: polygon(evenodd, 25% 25%, 50% 25%, 75% 50%, 50% 75%, 25% 50%, 37.5% 37.5%, 37.5% 62.5%, 62.5% 62.5%, 62.5% 37.5%, 50% 37.5%, 62.5% 50%, 50% 62.5%, 37.5% 50%, 43.75% 43.75%, 50% 43.75%, 56.25% 50%, 50% 56.25%, 43.75% 50%, 46.88% 46.88%, 53.13% 46.88%, 53.13% 53.13%, 46.88% 53.13%, 46.88% 46.88%, 50% 43.75%, 56.25% 43.75%, 56.25% 56.25%, 43.75% 56.25%, 43.75% 43.75%, 50% 37.5%, 37.5% 37.5%, 50% 25%, 75% 25%, 75% 75%, 25% 75%, 0% 50%, 50% 0%, 100% 50%, 50% 100%, 25% 75%);

                // clip-path:polygon(48% 10%, 83% 20%, 79% 59%, 48% 86%, 18% 60%, 14% 20%);
                clip-path:polygon(31% 97%, 3% 96%, 3% 4%, 96% 4%, 95% 96%, 69% 98%, 71% 95%, 93% 94%, 94% 6%, 6% 6%, 5% 94%, 29% 95%);
                margin: 0 auto;
                margin-bottom: 10%;
            }

            .card_logo_clip-path_2{
                position:absolute;
                top: 0;
                margin: 30px 0 0 34px;
                width:25px;
                height:25px;
                // background: white;
                background: rgb(85,91,152);
                clip-path:polygon(23% 1%, 58% 0%, 30% 25%, 54% 25%, 27% 58%, 50% 59%, 0% 98%, 17% 70%, 2% 70%, 22% 39%, 5% 39%);
                

            }


            .card_logo_super{
                text-transform: uppercase;
                font-weight: bold;
                font-size: x-large;
                text-align:center;
                color: rgb(105, 107,161);
            }

            .card_logo_assessor{
                text-transform: uppercase;
                font-size: medium;
                text-align:center;
                color: rgb(116, 152,192);
            }

            </style>
            <div class="card_blueprint">
                
                <div class="card">
                    <div class="card-face front">

                   

                        <div class="content_front">
                        <div class="card_title_container"><p class="card_title">Mission</p></div>
                        <div class="card_logo_container">
                        <div class="card_logo">
                            <div class="card_logo_clip-path"></div>
                            <div class="card_logo_clip-path_2"></div>
                            <div class="card_logo_super">SUPER</div>
                            <div class="card_logo_assessor">Assessor</div>
                        </div>
                        </div>
                        </div>
                    </div>
                    <div class="card-face back">
                    <div class="bookmark_container">
                    <div class="bookmark"></div>
                    <div class= "bookmark_smaller"></div>
                </div>
                    <div class="content_back">
                    <div class="card_type">${this.cardType}</div>
                            <div class="card_name_container">
                              <div class="card_name">${this.cardName}</div>
                              <img class="card_icon" src="${this.cardIcon}">
                            </div>
                            <div class="card_description_header">Your mission is</div>
                            <div class="card_description">${this.cardDescription}</div>
                            <div class="card_number">${this.cardId}</div>
                      
                        <div class="flip2"></div>
                    </div>
                    </div>
                    
                </div>
                <div class="flip"></div>
            </div>
        
        `;
  }
}
// Defining custom element attached to class
customElements.define("game-super-mission-card", GameSuperMissionCard);
