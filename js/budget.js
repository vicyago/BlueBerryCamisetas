const Cart = {
    init: function() {
        Cart.setupEventListeners();
    },

    setupEventListeners: function() {
        document.body.addEventListener('click', function(event) {
            Cart.handleBodyClick(event);
        });

        document.querySelector("#popup button").addEventListener("click", closePopup);

        document.querySelector("#mainButton").addEventListener("click", function() {
            Cart.structurePostMessage();
        });
    },

    handleBodyClick: function(event) {
        if (event.target.type === 'checkbox') {
            Cart.onProductSelection(event.target);
            const clickedInput = event.target.closest('#product-list input');
            if (clickedInput) {
                Cart.openCart(clickedInput.name);
            }
        }
    },

    onProductSelection: function(clickedCheckbox) {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = (checkbox === clickedCheckbox);
        });
    },

    openCart: function(product) {
        const dir = "../img/";
        const ext = ".webp";
        const imageUrl = `${dir}${product}${ext}`;

        hideElement(getElementById("footer"));

        const cartOverlay = getElementById("cart-overlay");
        const cartElement = getElementById("cart");

        showElement(cartOverlay);
        showElement(cartElement);

        const cartButtons = document.querySelectorAll("#cart button");
        cartButtons[0].addEventListener("click", Cart.processCustomization);
        cartButtons[1].addEventListener("click", Cart.closeCart);

        Cart.populateCustomizationOptions(product);

        const productInfoContainer = getElementById("product-info");
        productInfoContainer.innerHTML = `
            <p>${product}</p>
            <img src="${imageUrl}" alt="${product}" style="max-width: 100px; height: auto; margin-bottom: 10px;">
        `;

        cartElement.scrollIntoView({
            behavior: "smooth",
        });
    },

    closeCart: function() {
        hideElement(getElementById("cart"));
        hideElement(getElementById("cart-overlay"));
        showElement(getElementById("footer"))
        Cart.onProductSelection();
        scrollToTop();
    },

    processCustomization: function(){
        const productInfoContainer = getElementById("product-info");
        const product = productInfoContainer.querySelector("p").innerText.trim();
        const imageUrl = productInfoContainer.querySelector("img").src;

        const customizationOptions = getElementById("customization-options");
        const selectedOptions = [];

        let productType = "";

        for (const element of customizationOptions.children) {
            if (Cart.isCustomizationOption(element)) {
                const label = element.querySelector("label").innerText;
                const input = element.querySelector("select, input");
                const value = input ? input.value : null;
                productType = element.querySelector(".tipodeproduto").value;

                if (!value) {
                    showPopup(`Por favor selecionar um valor para: "${label}".`);
                    return;
                }

                selectedOptions.push({ label, value, productType });
            }
        }

        const listItem = Cart.createBasketListItem(imageUrl, product, selectedOptions, productType);
        getElementById("basket-list").appendChild(listItem);
        showElement(getElementById("basket"), "flex");
        Cart.closeCart();
        showElement(getElementById("footer"));
    },

    isCustomizationOption: function (element){
        return (
            element.tagName === "DIV" &&
            element.classList.contains("customization-option")
        );
    },

    createBasketListItem : function(imageUrl, product, selectedOptions, productType) {
        const listItem = document.createElement("li");
        listItem.innerHTML = Cart.createListItem(imageUrl, product, selectedOptions, productType);
        return listItem;
    },

    createListItem: function(imageUrl, product, selectedOptions, productType){
        return `
            <div style="display: flex; flex-direction: row; align-items: center;">
              <img src="${imageUrl}" alt="${product}" style="max-width: 50px; height: auto; margin: 0;">
              <ul class="productDetailsList" style="padding: 0; margin: 0; text-align: center; list-style: none;
              display: flex;
              flex-wrap: wrap;
              flex-direction: row;
              justify-content: center;
              ">
                ${selectedOptions
                .map(
                    (option) =>
                        `<li style="border: none;">${option.label} - <span style="color: #3f84c5; font-weight: bold;">${option.value},</li>
                      <input type="hidden" name=${option.label} value=${option.value} tipo=${option.productType}>`
                )
                .join("")}
              </ul>
              <input type="hidden" name="Tipo de Produto" value=${productType}>
              <button style="cursor: pointer; margin: 0; background-color: transparent; scale:50%" onclick="Cart.removeItem(this)">❌</button>
            </div>`
    },

    removeItem: function(button) {
        const listItem = button.closest("li");
        listItem.remove();

        const basketList = getElementById("basket-list");
        if (basketList.children.length === 0) {
            hideElement(getElementById("basket"));

        }
    },

    populateCustomizationOptions: function(item) {
        const customizationOptionsContainer = document.getElementById(
            "customization-options"
        );

        // Clear existing content
        customizationOptionsContainer.innerHTML = "";

        const customizationOptions = {
            camiseta: [
                { label: "Malha", values: ["Algodão", "Poliviscose"], defaultSelected: "Algodão" },
                { label: "Cor", values: ["Preto", "Marrom", "Vermelho", "Laranja", "Amarelo", "Verde", "Azul", "Roxo", "Rosa", "Branco", "Cinza"], defaultSelected: "Preto"},
                { label: "Gola", values: ["Redonda/Careca", "Gola V"], defaultSelected: "Redonda/Careca" },
                { label: "Tamanho", values: ["PP", "P", "M", "G", "GG"], defaultSelected: "M" },
                { label: "Quantidade", inputType: "number", name: "quantidadecamiseta"},
            ],
            polo: [
                { label: "Material", values: ["Algodão Cardada", "Algodão Penteada", "Poliviscose", "Piquet"], defaultSelected: "Algodão Cardada" },
                { label: "Cor", values: ["Preto", "Marrom", "Vermelho", "Laranja", "Amarelo", "Verde", "Azul", "Roxo", "Rosa", "Branco", "Cinza"], defaultSelected: "Preto"},
                { label: "Gola", values: ["Polo"], defaultSelected: "Polo"},
                { label: "Tamanho", values: ["PP", "P", "M", "G", "GG"], defaultSelected: "M"  },
                { label: "Quantidade", inputType: "number", name: "quantidadepolo" },
            ],
            agasalho: [
                { label: "Malha", values: ["Moleton Flanelado"], defaultSelected: "Moleton Flanelado"  },
                { label: "Cor", values: ["Preto", "Marrom", "Vermelho", "Laranja", "Amarelo", "Verde", "Azul", "Roxo", "Rosa", "Branco", "Cinza"], defaultSelected: "Preto" },
                { label: "Design", values: ["Com Capuz", "Sem Capuz", "Com Bolso", "Sem Bolso", "Com Bolso e Capuz"], defaultSelected: "Com Capuz"  },
                { label: "Tamanho", values: ["PP", "P", "M", "G", "GG"], defaultSelected: "M"  },
                { label: "Quantidade", inputType: "number", name: "quantidadeagasalho" },
            ],
            abada: [
                { label: "Malha", values: ["Algodão Cardada", "Algodão Penteada", "Poliviscose", "Dry fit Poliéster", "Dry fit Poliamida"], defaultSelected: "Algodão Cardada" },
                { label: "Cor", values: ["Preto", "Marrom", "Vermelho", "Laranja", "Amarelo", "Verde", "Azul", "Roxo", "Rosa", "Branco", "Cinza"], defaultSelected: "Preto" },
                { label: "Lateral", values: ["Fechado", "Elástico"], defaultSelected: "Fechado" },
                { label: "Tamanho", values: ["PP", "P", "M", "G", "GG"], defaultSelected: "M" },
                { label: "Quantidade", inputType: "number", name: "quantidadeabada" },
            ],
            ecobag: [
                { label: "Malha", values: ["Algodão Cru"], defaultSelected: "Algodão Cru" },
                { label: "Cor", values: ["Algodão Cru"], defaultSelected: "Algodão Cru" },
                { label: "Alça", values: ["Algodao Trançado"], defaultSelected: "Algodão Trançado" },
                { label: "Tamanho", values: ["Unico"],defaultSelected: "Unico" },
                { label: "Quantidade", inputType: "number", name: "quantidadeecobag" },
            ],
            mascara: [
                { label: "Malha", values: ["Algodão Cardada", "Algodão Penteada", "Poliviscose"], defaultSelected: "Algodão Cardada"},
                { label: "Cor", values: ["Preto", "Marrom", "Vermelho", "Laranja", "Amarelo", "Verde", "Azul", "Roxo", "Rosa", "Branco", "Cinza"],  defaultSelected: "Preto" },
                { label: "Forma", values: ["Bico de Pato"], defaultSelected: "Bico de Pato" },
                { label: "Tamanho", values: ["Unico"],  defaultSelected: "Unico" },
                { label: "Quantidade", inputType: "number", name: "quantidademascara" },
            ],
        };

        const selectedOptions = customizationOptions[item];

        if (selectedOptions) {
            selectedOptions.forEach((option) => {
                const { label, values, defaultSelected, inputType } = option;
                const inputElement = inputType === "number" ? Cart.createNumberInput(item, label) : this.createSelectInput(item, label, values, defaultSelected);
                const inputContainer = Cart.createInputContainer(label, inputElement, item);
                customizationOptionsContainer.appendChild(inputContainer);
            });
        }
    },

    createNumberInput: function(item, label) {
        const numberInput = document.createElement("input");
        const minNumberMessage = document.querySelector(".h5budget");

        setupNumberInput(numberInput, item, label);
        addInputEventListener(numberInput);

        return numberInput;

        function setupNumberInput(input, item, label) {
            input.type = "number";
            input.name = `${item}_${label.toLowerCase().replace(/\s+/g, "_")}`;
            input.className = "inputDetalhes required";
            input.min = "30";
        }

        function addInputEventListener(input) {
            input.addEventListener("input", handleInput);

            function handleInput() {
                const inputValue = parseInt(input.value);

                if (isNaN(inputValue) || inputValue < 30) {
                    setValidationStyles("red", "red");
                } else {
                    setValidationStyles("green", "white");
                }
            }

            function setValidationStyles(borderColor, textColor) {
                input.style.border = `0.1rem solid ${borderColor}`;
                minNumberMessage.style.color = textColor;
            }
        }
    },

    createSelectInput: function(item, label, values, defaultSelected) {
        const selectElement = document.createElement("select");
        selectElement.name = `${item}_${label.toLowerCase().replace(/\s+/g, "_")}`;
        selectElement.className = "inputDetalhes required";

        values.forEach((value) => {
            if (value===defaultSelected){
                Cart.addOption(selectElement, value, value, true);
            }
            Cart.addOption(selectElement, value, value);

        });

        return selectElement;
    },

    addOption: function(selectElement, value, text, isSelected = false) {
        const optionElement = document.createElement("option");
        optionElement.value = value;
        optionElement.innerText = text;

        if (isSelected) {
            optionElement.selected = true;
        }

        selectElement.appendChild(optionElement);
    },

    createInputContainer: function(label, inputElement, item) {
        const container = document.createElement("div");

        container.classList.add("customization-option");

        const labelElement = document.createElement("label");
        labelElement.innerText = label;
        container.appendChild(labelElement);

        const itemTypeInput = document.createElement("input")
        itemTypeInput.type="hidden";
        itemTypeInput.name="tipodeproduto";
        itemTypeInput.value = item;
        itemTypeInput.className = "tipodeproduto";


        container.appendChild(inputElement);
        container.appendChild(itemTypeInput)

        return container;
    },

    structurePostMessage: function() {
        const validationStatus = Cart.validateUserInformation();
        if (!validationStatus) {
            return;
        }

        const userInfo = Array.from(document.querySelectorAll(".info"))
            .reduce((acc, info) => {
                acc[info.name] = info.value;
                return acc;
            }, {});

        const userComments = document.querySelector("textarea").value;
        if (userComments !== "") {
            userInfo["Comments"] = userComments;
        }

        const products = document.querySelectorAll(".productDetailsList");
        if (products.length < 1) {
            showPopup("O carrinho está vazio, por favor escolher pelo menos um produto antes de submeter o orçamento.");
        }

        const resultArray = [
            userInfo,
            ...Array.from(products).map((product) => {
                const inputs = Array.from(product.querySelectorAll('input[type="hidden"]'));
                const productType = inputs[0].getAttribute("tipo");

                return {
                    productType,
                    ...inputs.reduce((acc, input) => {
                        acc[input.name] = input.value;
                        return acc;
                    }, {}),
                };
            }),
        ];
        const jsonString = JSON.stringify(resultArray);
        Cart.POSTBudget(jsonString);
    },

    validateUserInformation: function(){
        let form = document.querySelector("#userInfoForm");
        // Check form validity
        if (form.checkValidity()) {
            // Form is valid, you can proceed with submission or other actions
            return true;
            // Perform your form submission logic here
        } else {
            addInvalidClass(form);
            // Form is not valid, you can display custom error messages or take other actions
            showPopup("Formulário inválido. Por favor, confira as informações.");
        }

    },

    POSTBudget: function(jsonResult) {
        fetch('https://blueberrycamisetas.com.br/submit_form.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonResult,
        })

            .then(response => response.json())
            .then(data => {

                // Check the status in the response and display a message accordingly
                if (data.status === 'success') {
                    showPopup(data.message);
                } else {
                    showPopup('Houve algum erro na submissão do orçamento, por favor tente novamente. Caso o erro persista, tentar novamente mais tarde.');
                }
                waitForPopUpAndReload();
            })
            .catch(error => {
                // Handle any errors that occurred during the fetch
                console.error('Error:', error);
            });

    },

};

// Initialize the application
Cart.init();
function scrollToTop(){
    let basket = document.getElementById("basket");
    let top = 0;
    if (basket.style.display==="flex"){
            top =  basket.parentElement.offsetTop;
    }
    window.scrollTo({
        top: top,
            behavior: 'smooth'
    });
}
function showPopup(message) {
    getElementById('popupMessage').innerText = message;
    showElement(getElementById('popup'));
    let overlay = getElementById("cart-overlay");
    if(overlay.style.display !== "block"){
        showElement(overlay);
    }

}
function closePopup() {
    hideElement(getElementById('popup'));
    let customPopUp = getElementById("cart");
    if(customPopUp.style.display !== "block"){
        hideElement(getElementById("cart-overlay"));
        scrollToTop();
    }
}
function isPopUpHidden() {
    let myDiv = getElementById('popup');
    return window.getComputedStyle(myDiv).display === 'none';
}
function waitForPopUpAndReload() {
    if (isPopUpHidden()) {
        location.reload();
    } else {
        setTimeout(waitForPopUpAndReload, 100); // Adjust the time interval as needed
    }
}
function addInvalidClass(form) {
    let formControls = form.elements;
    for (let i = 0; i < formControls.length; i++) {
        if (!formControls[i].checkValidity()) {
            formControls[i].classList.add('infoInvalid');
        } else {
            formControls[i].classList.remove('infoInvalid');
        }
    }
}
function getElementById(id) {
    return document.getElementById(id);
}
function hideElement(element) {
    if (element) {
        element.style.display = "none";
    }
}
function showElement(element, displayStyle = "block") {
    if (element) {
        element.style.display = displayStyle;
    }
}