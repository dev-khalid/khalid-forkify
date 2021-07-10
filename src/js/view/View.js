import icons from 'url:../../img/icons.svg';
export default class View {
  _data;
  render(data) { 
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parrentElement.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup); //virtual dom object 
    const newElements = Array.from(newDom.querySelectorAll('*'));//selecting all elements from virtual dom -> converting them to array 
    // console.log(newElements); 
    const curElements = Array.from(this._parrentElement.querySelectorAll('*')); //selecting all elements from currentElement and converting them to array (object to array)
    // console.log(newElements); 
    newElements.forEach((newEl,i)=> { 
      const curEl = curElements[i]; 
      
      if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !=='') {
        curEl.textContent = newEl.textContent; 
      }
      if(!newEl.isEqualNode(curEl)) { 
        Array.from(newEl.attributes).forEach(attr=>{
          curEl.setAttribute(attr.name,attr.value); 
        })
      }
    }) 
  }
  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div> 
  `;
    this._clear();
    this._parrentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(message = this._errorMessage) {
    const markup = ` 
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parrentElement.insertAdjacentHTML('afterbegin', markup);
  }
  _clear() {
    this._parrentElement.innerHTML = '';
  }
  renderMessage(message = this._message) {
    const markup = `<div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;
    this._clear();
    this._parrentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
