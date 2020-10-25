darkkk();

const   links = document.querySelectorAll(".altrnate-style"),
        totalLinks= links.length;
function setActiveStyle(color){
    for(let i=0; i<totalLinks; i++){
        if(color === links[i].getAttribute("title")){
            links[i].removeAttribute("disabled");
        }else{
            links[i].setAttribute("disabled","true");
        }
    }
}
const bodySkin=document.querySelectorAll(".body-skin"),
      totalBodySkin= bodySkin.length;

      for(let k=0;k<totalBodySkin;k++){
          bodySkin[k].addEventListener("change",darkkk)
      }
const opens = document.querySelector(".toggle-style-switcher");

   opens.addEventListener("click",() =>{
    document.querySelector(".style-switcher").classList.toggle("open")
})


function darkkk(){
    if(localStorage.getItem('dark') == 'dark'){
        document.body.className="dark"
        
    }else{
      document.body.className=""
    }
}