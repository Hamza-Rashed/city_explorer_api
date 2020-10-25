let dark = document.getElementById('dark');
let light = document.getElementById('light');
if(localStorage.getItem('dark') == 'dark'){
dark.setAttribute('checked','true')
}
if(localStorage.getItem('dark') == 'light'){
    light.setAttribute('checked','true')
    }
    


// portfolio Item filter 
const  filterContanier=document.querySelector(".portfolio-filter"),
       filterBtns=filterContanier.children,
       totalFilterBtn=filterBtns.length,
       portfolioItems=document.querySelectorAll(".portfolio-item"),
       totalPortfolioItem=portfolioItems.length;
      
      
       for (let i=0; i<totalFilterBtn; i++)
        {
            filterBtns[i].addEventListener("click", function(){
              filterContanier.querySelector(".active").classList.remove("active");
               this.classList.add("active");
               
               const filterValue=this.getAttribute("data-filter");
               for (let k=0; k<totalPotfolioItem; k++)
                {
                    if(filterValue === portfolioItems[k].getAttribute("data-category")){
                        portfolioItems[k].classList.add("show");
                        portfolioItems[k].classList.remove("hide");  
                    }else{
                        portfolioItems[k].classList.add("hide");
                        portfolioItems[k].classList.remove("show");  
                    }
                    if(filterValue === "all"){
                        portfolioItems[k].classList.add("show");
                        portfolioItems[k].classList.remove("hide");   
                    }
                }

            })
        }
       

        //portfolio lightbox
        const lightbox = document.querySelector(".lightbox"),
              lightboxImg = lightbox.querySelector(".lightbox-img"),
             lightboxClose=lightbox.querySelector(".lightbox-close")
              lightboxText = lightbox.querySelector(".caption-text"),
              lightboxCounter = lightbox.querySelector(".caption-counter");

        let   itemIndex = 0;

              for (let i=0; i<totalPortfolioItem; i++){
                  portfolioItems[i].addEventListener("click",function(){
                      itemIndex=i;
                      changeItem();
                      toggleLightbox();
                  })
              }

              function nextItem(){
                  if(itemIndex=== 0){
                      itemIndex=totalPortfolioItem-1;
                  }else{
                      itemIndex++
                  }
                  changeItem();
              }
              function prevItem(){
                if(itemIndex === totalPortfolioItem+1){
                    itemIndex=0;
                }else{
                    itemIndex--;
                }
                changeItem();
            }
              function toggleLightbox(){
                lightbox.classList.toggle("open");
              }

              function changeItem(){
                  imgSrc = portfolioItems[itemIndex].querySelector(".img img").getAttribute("src");
                  lightboxImg.src=imgSrc;
                  lightboxText.innerHTML=portfolioItems[itemIndex].querySelector(".info").innerHTML;
                  lightboxCounter.innerHTML= (itemIndex+1)+ " of " + totalPortfolioItem;
              }

// close lightbox
  
lightbox.addEventListener("click",function(event){
    if(event.target === lightboxClose || event.target === lightbox){
        toggleLightbox();
    }


})
         

// ///////////////////////////

let design = document.getElementById('design');
let app = document.getElementById('app');
let project = document.getElementById('project');

function ShowDesign() {
    design.style.display = 'block';
    app.style.display = 'none';
    project.style.display = 'none';
}
function ShowApp() {
    app.style.display = 'block';
    design.style.display = 'none';
    project.style.display = 'none';
}
function ShowProject() {
    project.style.display = 'block';
    app.style.display = 'none';
    design.style.display = 'none';
}
function ShowAll() {
    project.style.display = 'none';
    app.style.display = 'block';
    design.style.display = 'block';
}

// /////////////////

function DarkChecked() {
    if (dark.checked) {
        localStorage.setItem('dark' , 'dark')
    }  
}

function LightChecked() {
    if (light.checked) {
        localStorage.setItem('dark' , 'light')
    } 
}
// checked="true"