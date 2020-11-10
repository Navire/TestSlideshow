const maxProducts = 18;

function percent(valueS1, valueS2) {
    const value1 = parseInt(valueS1);
    const value2 = parseInt(valueS2);

    return (100 * (value2 - value1) / value2).toFixed();
}

function getJSONdata(url, callback, value) {
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
    xhr.send(JSON.stringify({ value }));
};

function handleMaisImages(button, slide) {
    let current = 0;
    const fun = {
        next: function() {
            clearInterval(intervalo);
            const produtos = document.getElementById(slide).querySelectorAll(".produto");
            if (current + 1 < produtos.length - 4) {
                produtos[current].classList.add("hideproduto");
                produtos[current + 4].classList.remove("hideproduto");
                current++;
            } else {
                produtos.forEach((item, index) => {
                    if (index < 4) {
                        item.classList.remove("hideproduto");
                    } else {
                        item.classList.add("hideproduto");
                    }
                })
                current = 0;
            }
            intervalo = setInterval(fun.next, 4000);
        },

        prev: function() {
            clearInterval(intervalo);
            const produtos = document.getElementById(slide).querySelectorAll(".produto");
            if (current - 1 > -1) {
                produtos[current + 3].classList.add("hideproduto");
                produtos[current - 1].classList.remove("hideproduto");
                current--;
            } else {
                produtos.forEach((item, index) => {
                    if (produtos.length - 5 < index) {
                        item.classList.remove("hideproduto");
                    } else {
                        item.classList.add("hideproduto");
                    }
                })
                current = produtos.length - 4;
            }
            intervalo = setInterval(fun.next, 4000);
        },
    }

    let intervalo = setInterval(fun.next, 4000);

    document.getElementById(`next${button}`).addEventListener("click", fun.next, false);
    document.getElementById(`prev${button}`).addEventListener("click", fun.prev, false);
}


function elementText(className, text, produto) {
    let element = document.createElement("div");
    let paragraph = document.createTextNode(text);
    element.appendChild(paragraph);
    element.className = className;
    produto.appendChild(element);
}

function elementImage(source, produto) {
    let image = document.createElement("img");
    image.className = "images";
    image.src = source;
    produto.appendChild(image);
}

function elementDiscount(value, produto) {
    let element = document.createElement("div");
    let paragraph = document.createTextNode('por');
    element.appendChild(paragraph);

    let valueHighlight = document.createElement("div");
    let paragraph2 = document.createTextNode(value);
    valueHighlight.appendChild(paragraph2);
    valueHighlight.className = 'valor';
    element.appendChild(valueHighlight);

    element.className = 'desconto';

    produto.appendChild(element);
}

function getImages(data) {
    data.mostpopular.forEach((item, index) => {
        getJSONdata('/complete', function(err, data) {
            if (err !== null) {
                console.log('Error from server: ' + err);
            }

            let produto = document.createElement("div");
            produto.className = "produto";

            if (index > 4) {
                produto.classList.add("hideproduto");
            }

            elementText('ranking', `${index+1}°`, produto);

            elementImage(data.image, produto);

            elementText('nomeProduto', data.name, produto);

            elementText('preco', `R$ ${parseFloat(data.oldPrice).toFixed(2)}`, produto);

            elementDiscount(`R$ ${parseFloat(data.price).toFixed(2)}`, produto);

            elementText('prazos', `${data.installmentCount}x R$ ${data.installmentPrice}`, produto);

            document.getElementById("maisVendidosSlide").appendChild(produto);

        }, item.recommendedProduct.id)
    })

    data.pricereduction.forEach((item, index) => {
        getJSONdata('/complete', function(err, data) {
            let produto = document.createElement("div");
            produto.className = "produto";

            if (index > 4) {
                console.log('index', index)
                produto.classList.add("hideproduto");
            }

            elementText('porcentagem', `%${percent(data.price, data.oldPrice)}`, produto);

            elementImage(data.image, produto);

            elementText('nomeProduto', data.name, produto);

            elementText('preco', `R$ ${parseFloat(data.oldPrice).toFixed(2)}`, produto);

            elementDiscount(`R$ ${parseFloat(data.price).toFixed(2)}`, produto);

            elementText('prazos', `${data.installmentCount}x R$ ${data.installmentPrice}`, produto);

            document.getElementById("ofertasSlide").appendChild(produto);
        }, item.recommendedProduct.id)
    })

    handleMaisImages('mais', 'maisVendidosSlide');
    handleMaisImages('oferta', 'ofertasSlide');
}


window.addEventListener(
    "load",
    getJSONdata('/data', function(err, data) {
        if (err !== null) {
            console.log('Error from server: ' + err);
        } else {
            getImages(data);
        }
    }, maxProducts), false);