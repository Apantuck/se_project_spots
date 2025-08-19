export default class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  getAppInfo() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()]);
  }

  getUserInfo() {
    return this._getData("users/me");
  }

  getInitialCards() {
    return this._getData("cards");
  }

  editUserInfo(data) {
    return this._editData("users/me", "PATCH", data);
  }

  editUserAvatar(data) {
    return this._editData("users/me/avatar", "PATCH", data);
  }

  addNewCard(data) {
    return this._editData("cards", "POST", data);
  }

  deleteCard(cardId) {
    return this._editData(`cards/${cardId}`, "DELETE");
  }

  likeCard(cardId) {
    return this._editData(`cards/${cardId}/likes`, "PUT");
  }

  unlikeCard(cardId) {
    return this._editData(`cards/${cardId}/likes`, "DELETE");
  }

  _getData = (route) => {
    return fetch(`${this._baseUrl}/${route}`, {
      method: "GET",
      headers: this._headers,
    }).then(this._checkResponse);
  };

  _editData = (route, requestMethod, data) => {
    return fetch(`${this._baseUrl}/${route}`, {
      method: requestMethod,
      headers: this._headers,
      body: JSON.stringify(data),
    }).then(this._checkResponse);
  };

  _checkResponse = (res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  };
}
