const dropdownHeaders = document.querySelectorAll('.dropdown__header');
const purchaseBlock = document.querySelectorAll('[data-block]');
const loader = '<div class="loader__wrapper"><div class="loader"></div></div>';
const popUp = document.querySelector('.popUp');

let soldArray = localStorage.getItem('soldArray') !== null ? JSON.parse(localStorage.getItem('soldArray')) : {};

dropdownHeaders.forEach(el => {
    el.addEventListener('click', ({currentTarget}) => currentTarget.parentNode.classList.toggle('active'))
})

const getData = async () => {
       return  await fetch('./js/data.json')
                .then(res => res.json())
                .then(data => data)
                .catch(error => console.log(error))
    }

const createContent = async () => {
    let result = await getData();

    purchaseBlock.forEach(el => {
        const dataBlock = el.dataset.block;
        let template = '';
        const box = el.querySelector('.dropdown__purchases');
        const amount = el.querySelector('.dropdown__amount');
        box.innerHTML = loader;

        if(result[dataBlock].length){
            amount.innerText = soldArray[dataBlock] ? result[dataBlock].length - soldArray[dataBlock].length : result[dataBlock].length;
            result[dataBlock].forEach(({id, name, img, price}) => {
                let soldItem = soldArray[dataBlock] ? soldArray[dataBlock].includes(id) : false;
                console.log(soldItem)
                template += `<div class="purchase__item ${soldItem ? 'purchase__item-sold' : ''}" data-id=${id}>
                                <div class="purchse__img">
                                    <img src=${img} alt="${name}">
                                </div>
                                <div class="purchase__info">
                                    <p class="purchase__price">${price}</p>
                                    <button class="purchase__btn" ${soldItem && 'disabled'} onclick="openPopUpForm(${id}, '${dataBlock}', '${name}')">Buy NFT</button>
                                </div>
                            </div>`;
                })
            box.innerHTML = template;
        } else  {
            amount.innerText = "0";
            box.innerHTML = 'The product is not available';
        }
    })        
}

////POP UP
    const disableScroll = () => {
        const widthScroll = window.innerWidth - document.body.offsetWidth;
        document.body.dbScrollY = window.scrollY;
        document.body.style.cssText = `
                position: fixed;
                top: ${-window.scrollY}px;
                left: 0;
                background-color: #0D0D0D;
                width: 100%;
                height: 100vh;
                overflow: hidden;
                padding-right: ${widthScroll}px;
                `
    }

    const enableScroll = () => {
        document.body.style.cssText = '';
        window.scroll({
            top: document.body.dbScrollY,
        })
    }

    const closeWindow = () => {
        popUp.classList.remove('active');
        popUp.innerHTML = '';
        enableScroll();
    }

    const isValidInputs= (inputs) => {
        let status = true;

        const inputEmail = (input) => {
            const reg = /.+@.+\..+/g;
            let result = reg.test(input.value);
            if(!result) {
                input.classList.add("invalidInput"); 
                status = false; 
            }  else {
                input.classList.contains('invalidInput') && input.classList.remove('invalidInput');
                status = true;
                }
            }

        const inputLength = (input) => {
            let count = input.classList.contains('phone') ? 17 : 0;
            if(input.value.length > count){
                if(input.classList.contains('invalidInput')){
                    input.classList.remove('invalidInput');
                    status = true;
                }
            }else{
                input.classList.add('invalidInput')
                status = false;
            }
        input.classList.contains('email') && inputEmail(input);
        }
  
        inputs.forEach( input => {
            input.onkeyup  = (e) => inputLength(input);    
            inputLength(input);
        })
    return status;
    }

    const openPopUpForm = (id, block, name) => {
        let template = `
                <div class="popUp__bg">
                    <div class="popUp__block">
                        <div class="popUp__scroll">
                            <div class="popUp__close" onclick="closeWindow()">&#10006;</div>
                            <div class="popUp__content">
                                <h2 class="popUp__title _title">Ready to purchase?</h2>
                                <p class="popUp__text"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt quam convallis a lacus consequat, ultrices. </p>
                                <form class="popUp__form">
                                    <input type="text" placeholder="First Name" class="popUp__input" required />
                                    <input type="text" placeholder="Last Name" class="popUp__input" required />
                                    <input type="text" placeholder="Email@gmail.com" class="popUp__input email" required />
                                    <input type="text" placeholder="+48 328 4870 09 27" class="popUp__input phone" required />
                                    <div class="popUp__pay">
                                        <div class="pay__maestro">
                                            <img src="./images/maestro.png">
                                        </div>
                                        <div class="pay__visa">
                                            <img src="./images/visa.png">
                                        </div>
                                    </div>
                                    <input type="submit" value="Buy NFT" class="popUp__btn" 
                                    onclick = "thanksPopUp(event, ${id}, '${block}', '${name}')" />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>`;
        popUp.classList.add('active');
        popUp.innerHTML = template;
        disableScroll();

         $(function(){
            $(".phone").mask("+48 999 9999 99 99");
        });
    }

    const thanksPopUp = (event, id, block, name ) => { 
        event.preventDefault();     
            const inputs = document.querySelectorAll('.popUp__input');
            const soldItem = document.querySelector(`[data-id = "${id}"]`);
            const parent = soldItem.closest('.dropdown__item');
            const text = parent.querySelector('.dropdown__amount');

            if(isValidInputs(inputs)){ 
                let data = [];
                inputs.forEach( ({value}) => {
                    data = [...data, value];
                    value = '';
                })
            console.log(data);

            soldArray[block] ? soldArray[block].push(id) : soldArray[block] = [id];

            soldItem.classList.add('purchase__item-sold');
            soldItem.querySelector('.purchase__btn').disabled = true;

            localStorage.setItem('soldArray', JSON.stringify(soldArray));

            text.innerText = soldArray[block] !== "undefined" ? text.innerText - 1 : text.innerText;

            block = block.charAt(0).toUpperCase() + block.slice(1);
            const template = `
                    <div class="popUp__bg">
                            <div class="popUp__block">
                                <div class="popUp__scroll">
                                    <div class="popUp__close" onclick="closeWindow()">&#10006;</div>
                                    <div class="popUp__content">
                                        <h2 class="popUp__title _title">Thanks!</h2>
                                        <p class="popUp__text"> The purchase of <strong>${block} NFT ${name}</strong> has been successfully completed.</p>
                                    </div>
                                    <input type="submit" value="OK" class="popUp__btn popUp__btn-green" onclick="closeWindow()">
                                </div>
                            </div>
                        </div>`
            popUp.classList.add('active');
            popUp.innerHTML = template;
            disableScroll();
            } else console.log('error')
    }
createContent();

const hideSoldPosters = (e) => {
    const parent = e.closest('.dropdown__item');
    const text = parent.querySelector('.dropdawn__filter');
    const items = parent.querySelectorAll('.purchase__item');

     if (e.checked) {
        text.innerText = 'Show sold posters';
        items.forEach(poster => {
            poster.matches('.purchase__item-sold') && (poster.style.display = 'none')})
    } else {
        text.innerText = 'Hide sold posters';
        items.forEach(poster => {
            poster.matches('.purchase__item-sold') && (poster.style.display = 'block')})
    }
}

popUp.addEventListener('click', ({target}) => {
    if(target.matches('.popUp__close') || target.matches('.popUp__bg')) {
        closeWindow();
    }
})

