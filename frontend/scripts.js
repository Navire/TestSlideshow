let currentMais = 0; 
let currentOferta = 0;

function getJSON (url, callback, maxProducts) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
        callback(null, xhr.response);
        } else {
        callback(status, xhr.response);
        }
    };
    xhr.send(JSON.stringify({ maxProducts }));
};

function handleMaisImages (button, slide, current, total){
    const fun = {
        proximo: function(){
            clearInterval(intervalo);
            const produtos = document.getElementById(slide).querySelectorAll(".produto");            
            if (current + 1 < total - 3){
                produtos[current].classList.add("hideproduto");
                produtos[current + 4].classList.remove("hideproduto");
                current++;
            } else {
                produtos.forEach((item,index)=>{
                    if(index< 4){                        
                        item.classList.remove("hideproduto");
                    } else{
                        item.classList.add("hideproduto");
                    }
                })
                current = 0;
            }
            intervalo = setInterval(fun.proximo,4000);
        },

        anterior: function(){
            clearInterval(intervalo);
            const produtos = document.getElementById(slide).querySelectorAll(".produto");
            if (current - 1 > -1){
                produtos[current + 3].classList.add("hideproduto");                
                produtos[current - 1].classList.remove("hideproduto");
                current--;
            } else {                
                produtos.forEach((item,index)=>{
                    if(total - 5 < index){                        
                        item.classList.remove("hideproduto");
                    } else{
                        item.classList.add("hideproduto");
                    }
                })
                current = total - 4;                
            }
            intervalo = setInterval(fun.proximo,4000);
        }, 
    }

    let intervalo = setInterval(fun.proximo,4000);

    document.getElementById(`next${button}`).addEventListener("click",fun.proximo,false);
    document.getElementById(`prev${button}`).addEventListener("click",fun.anterior,false);
}


function elementText (className, text, produto) {
    let element = document.createElement("div");
    let paragraph = document.createTextNode(text);
    element.appendChild(paragraph);
    element.className=className;
    produto.appendChild(element);
}


function elementImage (source, produto) {
    let image = document.createElement("img");
    image.className="images";
    image.src=source;
    produto.appendChild(image);
}

function elementDiscount (value, produto) {
    let element = document.createElement("div");
    let paragraph = document.createTextNode('por');
    element.appendChild(paragraph);

    let valueHighlight = document.createElement("div");
    let paragraph2 = document.createTextNode(value);
    valueHighlight.appendChild(paragraph2);
    valueHighlight.className='valor';
    element.appendChild(valueHighlight);

    element.className='desconto';

    produto.appendChild(element);
}

function getImages () {
    
    for(let i = 1; i < 8; i++){
        
        let produto = document.createElement("div");
        produto.className="produto";
        
        if (i > 4){
            produto.classList.add("hideproduto");
        }        
        
        elementText('ranking',`${i}°`,produto);

        elementImage(`image${i}.jpg`, produto);
        
        elementText('nomeProduto','Lorem Ipsun',produto);

        elementText('preco','R$ 100.00',produto);

        elementDiscount('R$ 100.00', produto);

        elementText('prazos','10x R$ 189,50',produto);

        document.getElementById("maisVendidosSlide").appendChild(produto);
    }

    for(let i = 1; i < 8; i++){
        
        let produto = document.createElement("div");
        produto.className="produto";

        if (i > 4){
            produto.classList.add("hideproduto");
        }
        
        elementText('porcentagem','%3',produto);

        elementImage(`image${i}.jpg`, produto);
        
        elementText('nomeProduto','Lorem Ipsun',produto);

        elementText('preco','R$ 100.00',produto);

        elementDiscount('R$ 100.00', produto);
        elementText('prazos','10x R$ 189,50',produto);

        document.getElementById("ofertasSlide").appendChild(produto);
    }

    handleMaisImages('mais','maisVendidosSlide', currentMais, 7);
    handleMaisImages('oferta','ofertasSlide', currentOferta, 7);
}


getJSON('http://127.0.0.1:3000/data',
    function(err, data) {
      if (err !== null) {
        console.log('Something went wrong: ' + err);
      } else {
        console.log('Your query count: ', data);
      }
    }, 10);


window.addEventListener("load",getImages,false);


