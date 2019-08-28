window.onload = () => {
    customElements.define('tk-field', TokenField);
    customElements.define('tk-options', TokenOptions, { extends: 'li' });
}

class TokenField extends HTMLElement {
    constructor() {
        super();

        this.value = {};
        let templateContent = document.getElementById('token-template').content;
        this.attachShadow({ mode: "open", delegatesFocus: true }).appendChild(templateContent.cloneNode(true));

        let tokenSuggestions = this.shadowRoot.querySelector('.token-suggestions');
        this.shadowRoot.querySelector('.token-input').setAttribute('tabIndex', 1);

        this.addEventListener('focus', () => {
            tokenSuggestions.classList.add('list-open');
        });

        this.addEventListener('focusout', () => {
            tokenSuggestions.classList.remove('list-open');
        });
    }

    deselectToken(element){
        this.value[element.value] = null;
        element.remove();
    }

    tokenSelected(tokenValue) {
        if(this.value[tokenValue] != null) {
            this.deselectToken(this.value[tokenValue])
            return;
        }
        let selectedTokenElement = document.createElement('span');
        selectedTokenElement.value = tokenValue;
        selectedTokenElement.innerText = tokenValue;
        selectedTokenElement.addEventListener('click',this.deselectToken.bind(this,selectedTokenElement));
        this.value[tokenValue] = selectedTokenElement;
        this.shadowRoot.querySelector('.selected-token').appendChild(selectedTokenElement);
    }
}

class TokenOptions extends HTMLLIElement {
    constructor() {
        super();

        this.addEventListener('click', _ => this.parentElement.tokenSelected(this.value));
    }

    connectedCallback() {
        this.value = this.value || this.innerText;
        this.disabled = this.disabled || false;
    }

    get value() {
        return this.getAttribute('value');
    }

    set value(tokenValue) {
        this.setAttribute('value', tokenValue);
    }

    get disabled(){
        return this.getAttribute('disabled');
    }

    set disabled(value){
        this.setAttribute('disabled',value);
    }
}