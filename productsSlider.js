(function () {
    var this_script = $('script[src*=productsSlider]');
    var url = this_script.attr('data-url');
    var root = getRoot(url);
    var target = document.querySelector('.target');

    if (typeof url === undefined) {
        target.innerHTML = "Localhost is undefined";
    } else {
        renderSlider(url);
    }

    function renderSlider(localhostURL) {
        $.getJSON(localhostURL)
            .done(function (data) {
                render(data);
            })
            .always(function () {
                $('.target').slick({
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    autoplay: true,
                    autoplaySpeed: 2000,
                    nextArrow: `<img class="arrow arrow_right" 
                        src="${root}/ima/arrow-1.svg">`,
                    prevArrow: `<img class="arrow arrow_left" 
                        src="${root}/ima/arrow-2.svg">`,
                    responsive: [{
                            breakpoint: 900,
                            settings: {
                                slidesToShow: 3,
                                centerMode: true,
                            }
                        },
                        {
                            breakpoint: 768,
                            settings: {
                                slidesToShow: 2,
                                arrows: false
                            }
                        },
                        {
                            breakpoint: 480,
                            settings: {
                                slidesToShow: 1,
                                arrows: false
                            }
                        }
                    ]
                });
            })
    }

    function getRoot(localhostURL){
        let index = localhostURL.lastIndexOf('/');
        if ( index != -1 ){
            return localhostURL.slice(0, index);
        }
        return localhostURL;
    }

    function render(data) {
        let resultHTML = '';
        for (let i = 0, products = data.products; i < products.length; i++) {
            let item =
                `<div class="product-item">
                <div class="product-item__content">
                    <div class="product-item__content__image" 
                        style="background-image:url(${getImgUrl(products[i].img)})"></div>
                    <div class="product-item__content__title">${products[i].title}</div>
                    <div class="product-item__content__rating">
                        <img class="rating__stars" src="${root}/ima/star-fill.svg">
                    </div>
                    ${renderPrice(products[i].price, data.saleText)}
                    <div class="btn__add">${data.buttonText}</div>`;
            resultHTML += item;
            if (isActionProduct(products[i].actions)) {
                resultHTML += renderActions(products[i].actions);
            }
            resultHTML += `</div>
            </div>`;
        }
        target.innerHTML = resultHTML;
    };

    function getImgUrl(img) {
        return `${root}/ima/products/${img}`;
    }

    function renderActions(actions) {
        if (actions.bestsellers) {
            return `<img class="product-item__content__action"
             src="${root}/ima/action/bestsellers.png">`;
        } else if (actions.eco) {
            return `<img class="product-item__content__action"
             src="${root}/ima/action/eco.png">`;
        } else if (actions.new) {
            return `<img class="product-item__content__action"
             src="${root}/ima/action/new.png">`;
        }
    }

    function isActionProduct(actions) {
        return actions.bestsellers || actions.eco || actions.new;
    }

    function renderPrice(price, saleText) {
        let priceContainer = '';
        if (getDifference(price) === 0) {
            priceContainer = `<div class="product-item__content__price_new">
                ${price.finalPrice} usd.</div>`;
        } else {
            priceContainer =
                `<div class="product-item__content__discount">
                    ${saleText} ${getDiscount(price)} %</div>
                <div class="product-item__content__price_old">
                    ${price.oldPrice} usd.</div>\
                <div class="product-item__content__price_new">
                    ${price.finalPrice} usd.</div>`;
        }
        return priceContainer;
    }

    function getDifference(price) {
        return price.oldPrice - price.finalPrice;
    }

    function getDiscount(price) {
        let difference = getDifference(price);
        return Math.round((difference / price.oldPrice) * 100);
    }
})();