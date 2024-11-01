// Defining custom web component
export default class EditSuperAssessmentCard extends HTMLElement {
  constructor() {
    super();
    // Properties of the card, has default values
    this.cardId = this.getAttribute("card-id") || "ID";
    this.cardType = this.getAttribute("card-type") || "TYPE";
    this.cardCategory = this.getAttribute("card-category") || "CATEGORY";
    this.cardName = this.getAttribute("card-name") || "NAME";
    this.cardDescription =
      this.getAttribute("card-description") || "DESCRIPTION";
    this.cardDetailsHeader = "HOW / TIPS / EXAMPLE";
    this.cardDetails = this.getAttribute("card-details") || "DETAILS";
    this.cardTitleShortened = this.cardCategory;
    this.cardIcon = this.getAttribute('card-icon')
    this.selectionStatus = false;
    this.bookmarked = false;
    // Attaching shadow DOM for encapsulation
    this.attachShadow({ mode: "open" });
    // Render the component
    this.render();
  }

  connectedCallback() {
    // Access the card-icon attribute after the element is inserted into the DOM
    this.cardIcon = this.getAttribute("card-icon")
    // Render the component after getting all attribute values
    this.render();
  }

  // Render function, various functionalities
  render() {
    this.shadowRoot.innerHTML = this.getTemplate();
    this.cardStyles();
  }

  // List of attributes to observe, looking for changes
  static get observedAttributes() {
    return [
      "card-name",
      "card-id",
      "card-description",
      "card-details",
      "card-category",
      "card-type"
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
    } else if (name === "card-details") {
      this.cardDetails = newValue;
    } else if (name === "card-category") {
      this.cardCategory = newValue;
    } else if (name === "card-type"){
        this.cardType = newValue
    }

    this.render();
  }

  // Set styles for cards based on category
  cardStyles() {
    if (this.cardCategory == "who is assessed") {
      this.borderCardColor =
        "var(--assessment-who-is-assessed, rgb(43, 105, 141))";
      this.bodyCardColor =
        "var(--assessment-who-is-assessed-secondary, rgb(53, 115, 151))";
      this.cardTitleColor = "white";
      this.categoryIcon = "/public/icons/icon-assessed.png";
      this.cardIconFront = "/public/icons/icon-assessed.png";
      this.cardTitleShortened = this.cardCategory;
    } else if (this.cardCategory == "the assessor") {
      this.borderCardColor = "var(--assessment-the-assessor, rgb(125,94,165))";
      this.bodyCardColor =
        "var(--assessment-the-assessor-secondary, rgb(135,104,175))";
      this.cardTitleColor = "white";
      this.categoryIcon = "/public/icons/icon-assessor.png";
      this.cardIconFront = "/public/icons/icon-assessor.png";
      this.cardTitleShortened = this.cardCategory;
    } else if (this.cardCategory == "assessment artefact") {
      this.borderCardColor = "var(--assessment-artefact, rgb(209,31,68))";
      this.bodyCardColor =
        "var(--assessment-artefact-secondary, rgb(219,41,78))";
      this.cardTitleColor = "white";
      this.cardTitleShortened = "Artefact";
      this.cardIconFront = "/public/icons/icon-artefact.png";
      this.categoryIcon = "/public/icons/icon-artefact.png";
    } else if (this.cardCategory == "context") {
      this.borderCardColor = "var(--assessment-context, rgb(241,114,153))";
      this.bodyCardColor =
        "var(--assessment-context-secondary, rgb(251,124,163))";
      this.cardTitleColor = "black";
      this.cardTitleShortened = this.cardCategory;
      this.categoryIcon = "/public/icons/icon-context.png";
      this.cardIconFront = "/public/icons/icon-context.png";
    } else if (this.cardCategory == "assessment format") {
      this.borderCardColor = "var(--assessment-format, rgb(145,205,144))";
      this.bodyCardColor =
        "var(--assessment-format-secondary, rgb(155,215,154))";
      this.cardTitleColor = "black";
      this.cardTitleShortened = "Format";
      this.categoryIcon = "/public/icons/icon-format.png";
      this.cardIconFront = "/public/icons/icon-format.png";
    } else if (this.cardCategory == "assessment timing") {
      this.borderCardColor = "var(--assessment-timing, rgb(240,134,30))";
      this.bodyCardColor =
        "var(--assessment-timing-secondary, rgb(241,144,40))";
      this.cardTitleColor = "black";
      this.cardTitleShortened = "Timing";
      this.categoryIcon = "/public/icons/icon-timing.png";
      this.cardIconFront = "/public/icons/icon-timing.png";
    } else {
      this.categoryIcon = "../assets/img/icon-assessment.png";
      this.cardIconFront = "../assets/img/icon-assessment.png";
      this.borderCardColor = "rgb(203, 203, 203)";
      this.bodyCardColor = "rgb(213, 213, 213)";
    }
    // Card with ID 4 was too long, making responsiveness issues
    // Fixed with adding a resized style
    if (this.cardId == 4) {
      this.cardNameResizeSmaller = "resizeSmaller";
    } else {
      this.cardNameResizeSmaller = "";
    }

    if (this.cardType == "mission") {
      this.categoryIcon = this.cardIcon
      this.borderCardColor = "var(--mission-card, rgb(253,242,193))";
      this.bodyCardColor = "var(--mission-card-secondary, rgb(245, 221,143))";
    }
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
                  width: 375px;
                  height: 562.5px;
                  background-color: ${this.borderCardColor};
                  perspective: 1000px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  transform-style: preserve-3d;
                  transition: transform 0.3s ease-in-out; 
                  border-radius: 10px;
                  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;/*https://getcssscan.com/css-box-shadow-examples*/
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
                display: none;
                  position: absolute;
                  right: 0;
              }
      
              .bookmark{
                  width: 30px;
                  height: 30px;
                  margin: 2% 2% 0 0;
                  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);/*https://www.htmlcssbuttongenerator.com/CSS-clip-path-community.html*/
                  background: black;
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
                  background-image: url('../../assets/img/flip.png');
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
                  background-image: url(../../assets/img/flip.png);
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
  
              .card_category,
              .card_name,
              .card_description,
              .card_details{
                  padding:3% 5%;
              }
  
              .card_description,
              .card_details,
              .card_number{
                  font-size: smaller;
  
              }
              .card_category{
                  background-color: ${this.bodyCardColor};
                  padding: 0% 5%;
                  color: ${this.cardTitleColor};
                  font-weight:bold;
                  border-radius: 9px 9px 0px 0px;
                  font-size: 25px;
                  display:flex;
                  justify-content: flex-start;
                  align-items: center;
                  gap: 10px;
                  text-transform: uppercase;
              }
  
              .category_icon{
                  width: 20%;
              }
  
              .category_text{
                margin: 7% 0;
                height: 50px;
              }
  
              .card_name{
                  font-weight: bold;
                  font-size: x-large;
                  word-break: break-all; 
              }
  
              .card_name.resizeSmaller,
              .card_category.resizeSmaller{
                font-size: large;
              }
  
              .card_description{
  
              }
  
              .card_details{
                  position:absolute;
                  bottom:135px;
  
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
                  font-size: 15pt;
  
              }
  
  
              img{
                  width:100%;
                  height: 100%;
              }
             
              .card_icon_container{
                position: absolute;
                top: 0;
                display:flex;
                justify-content: center;
                align-items:center;
                // outline: 1px solid red;
                width: 100%;
                height: 50%;
              }
              .card_icon{
                  width: auto;
                  height: 50px;
                  z-index: 1000;
  
              }
  
              .card_title_container{
                  width:100%;
                  margin: 0 auto;
                  text-align:center;
              }
              p.card_title{
                  text-transform: uppercase;
                  font-weight: bold;
                  font-size: x-large;
                  text-align:center;
                  color: ${this.cardTitleColor};
                  position:relative;
                  
                  margin: 0 auto;
                  padding: 0 15%;
                  margin-top: 140px;
              }
  
              .card_logo_container{
                  width:100%;
                  height: 40%;
                  margin: 0 auto;
                  background-color: rgb(252,234,158);
                  position:absolute;
                  bottom: 0;
                  display:flex;
                  justify-content: center;
                  align-items: center;
              }
  
              .card_logo_clip-path{
                  width:50px;
                  height:50px;
                  background: rgb(85,91,152);
                  background: linear-gradient(90deg, rgba(85,91,152,1) 0%, rgba(105,107,161,1) 35%, rgba(116,152,192,1) 100%);
                  clip-path:polygon(31% 97%, 3% 96%, 3% 4%, 96% 4%, 95% 96%, 69% 98%, 71% 95%, 93% 94%, 94% 6%, 6% 6%, 5% 94%, 29% 95%); /*https://www.htmlcssbuttongenerator.com/CSS-clip-path-community.html*/
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
                  clip-path:polygon(23% 1%, 58% 0%, 30% 25%, 54% 25%, 27% 58%, 50% 59%, 0% 98%, 17% 70%, 2% 70%, 22% 39%, 5% 39%); /*https://www.htmlcssbuttongenerator.com/CSS-clip-path-community.html*/
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
                            <div class="card_icon_container">
                              <div class="card_icon">
                                <img src="${this.cardIconFront}" alt="">
                              </div> 
                            </div>
                              
                              <div class="card_title_container"><p class="card_title">${this.cardCategory}</p></div>
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
  
                      <div class="card-face back ${this.cardCategory}">
                          <div class="bookmark_container">
                              <div class="bookmark"></div>
                              <div class= "bookmark_smaller"></div>
                          </div>
                          <div class="content_back">
  
                          <div class="card_category">
                            
                              <div class="category_text">   
                                  
                              </div>
                          </div>
                          <div class="card_name ${this.cardNameResizeSmaller}"></div>
                        
                          <div class= "card_details">
                              <div class="how">${this.cardDetailsHeader}</div>
                             
                          <div class="card_number"></div>
  
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
customElements.define("edit-super-assessment-card", EditSuperAssessmentCard);
