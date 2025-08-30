import {
  enableValidation,
  resetValidation,
  disableButton,
  settings as validationConfig,
} from "../scripts/validation.js";
import "./index.css";
import Api from "../utils/Api.js";

// profile elements
const profileEditBtn = document.querySelector(".profile__edit-btn");
const profileAvatarBtn = document.querySelector(".profile__avatar-btn");
const profileName = document.querySelector(".profile__name");
const profileDesc = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__avatar");
const profileAvatarModal = document.querySelector("#edit-avatar-modal");
const profileAvatarModalForm = document.forms["new-avatar-form"];
const profileModal = document.querySelector("#edit-profile-modal");
const profileModalForm = document.forms["edit-profile-form"];
const profileModalNameInput = profileModalForm.querySelector(
  "#profile-name-input"
);
const profileModalDescInput = profileModalForm.querySelector(
  "#profile-description-input"
);

// post elements
const postNewBtn = document.querySelector(".profile__add-btn");
const postDeleteModal = document.querySelector("#delete-modal");
const postDeleteModalForm = document.forms["delete-form"];
postDeleteModal
  .querySelector(".modal__close-btn")
  .addEventListener("click", function () {
    closeModal(postDeleteModal);
  });
postDeleteModal
  .querySelector(".modal__btn_cancel")
  .addEventListener("click", function () {
    closeModal(postDeleteModal);
  });
const postModal = document.querySelector("#new-post-modal");
const postModalForm = document.forms["new-post-form"];
const postModalLinkInput = postModalForm.querySelector("#post-link-input");
const postModalCaptionInput = postModalForm.querySelector(
  "#post-caption-input"
);

const cardContainer = document.querySelector(".cards__list");

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "b8331ccb-ac4d-48c9-aa51-9e649e648b96",
    "Content-Type": "application/json",
  },
});

// Fetch initial data and render cards
api
  .getAppInfo()
  .then(([userData, cards]) => {
    profileName.textContent = userData.name;
    profileDesc.textContent = userData.about;
    profileAvatar.setAttribute("src", userData.avatar);

    cards.forEach((card) => {
      const newCard = getCardElement(card);
      cardContainer.prepend(newCard);
    });
  })
  .catch((err) => {
    console.error(`Error fetching app info: ${err}`);
  });

const cardTemplate = document.querySelector("#card_template");

const previewModal = document.querySelector("#post-preview-modal");
const previewModalImg = previewModal.querySelector(".modal__img");
const previewModalCaption = previewModal.querySelector(".modal__caption");
previewModal
  .querySelector(".modal__close-btn")
  .addEventListener("click", function () {
    closeModal(previewModal);
  });

// Modal closing functionality:
// by button
const closeButtons = document.querySelectorAll(".modal__close-btn");
closeButtons.forEach((btn) => {
  btn.addEventListener("click", function (evt) {
    const modal = evt.target.closest(".modal");
    closeModal(modal);
  });
});
// by clicking outside the modal content
const modals = document.querySelectorAll(".modal");
modals.forEach((modal) => {
  modal.addEventListener("click", function (evt) {
    if (evt.target === modal) {
      closeModal(modal);
    }
  });
});
// by pressing Escape key
const closeOnEscapeCallback = (evt) => {
  if (evt.key === "Escape") {
    const modal = document.querySelector(".modal_is-opened");
    closeModal(modal);
  }
};

// Helper functions

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", closeOnEscapeCallback);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", closeOnEscapeCallback);
}

// Profile

profileEditBtn.addEventListener("click", function () {
  resetValidation(profileModalForm);
  openModal(profileModal);
  profileModalNameInput.value = profileName.textContent;
  profileModalDescInput.value = profileDesc.textContent;
});

profileAvatarBtn.addEventListener("click", function () {
  resetValidation(profileAvatarModalForm);
  openModal(profileAvatarModal);
});

profileModalForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  const submitBtn = profileModal.querySelector(".modal__btn_submit");
  submitBtn.textContent = "Saving...";
  api
    .editUserInfo({
      name: profileModalNameInput.value,
      about: profileModalDescInput.value,
    })
    .then((userData) => {
      profileName.textContent = userData.name;
      profileDesc.textContent = userData.about;
      closeModal(profileModal);
    })
    .catch((err) => {
      console.error(`Error updating user info: ${err}`);
    })
    .finally(() => {
      submitBtn.textContent = "Save";
    });
});

profileAvatarModalForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  const avatarBtn = profileAvatarModal.querySelector(".modal__btn_submit");
  avatarBtn.textContent = "Saving...";
  api
    .editUserAvatar({
      avatar: profileAvatarModalForm.avatar.value,
    })
    .then((userData) => {
      profileAvatar.setAttribute("src", userData.avatar);
      closeModal(profileAvatarModal);
    })
    .catch((err) => {
      console.error(`Error updating user avatar: ${err}`);
    })
    .finally(() => {
      avatarBtn.textContent = "Save";
    });
});

// Posts

postNewBtn.addEventListener("click", function () {
  openModal(postModal);
});

postModalForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  const submitBtn = postModal.querySelector(".modal__btn_submit");
  submitBtn.textContent = "Saving...";
  api
    .addNewCard(getCardData())
    .then((card) => {
      const newCard = getCardElement(card);
      cardContainer.prepend(newCard);
      closeModal(postModal);
      postModalForm.reset();
      disableButton(postModalForm.querySelector(".modal__btn_submit"));
      resetValidation(postModalForm);
    })
    .catch((err) => {
      console.error(`Error adding new card: ${err}`);
    })
    .finally(() => {
      submitBtn.textContent = "Submit";
    });
});

// cards

let selectedCard;
let selectedCardId;

function getCardData() {
  return {
    link: postModalLinkInput.value,
    name: postModalCaptionInput.value,
    isLiked: false,
    // todo: id, owner, createdAt
  };
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .cloneNode(true)
    .querySelector(".card");
  // image
  const cardImg = cardElement.querySelector(".card__img");
  const metaURL = new URL(data.link, import.meta.url);
  cardImg.setAttribute("src", metaURL);
  cardImg.setAttribute("alt", data.name);
  cardImg.addEventListener("click", () => {
    previewModalImg.setAttribute("src", metaURL);
    previewModalImg.setAttribute("alt", data.name);
    previewModalCaption.textContent = data.name;
    openModal(previewModal);
  });
  // title
  const cardTitle = cardElement.querySelector(".card__title");
  cardTitle.textContent = data.name;
  // Like button
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  cardLikeBtn.classList.toggle("card__like-btn_liked", data.isLiked);
  cardLikeBtn.addEventListener("click", () =>
    handleLikeCard(cardElement, data._id)
  );
  // Delete button
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");
  cardDeleteBtn.addEventListener("click", (evt) =>
    handleDeleteCard(cardElement, data._id)
  );
  return cardElement;
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(postDeleteModal);
}

function handleLikeCard(cardElement, cardId) {
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const isLiked = cardLikeBtn.classList.contains("card__like-btn_liked");
  const action = isLiked ? api.unlikeCard(cardId) : api.likeCard(cardId);

  action
    .then((updatedCard) => {
      cardLikeBtn.classList.toggle("card__like-btn_liked", updatedCard.isLiked);
    })
    .catch((err) => {
      console.error(`Error liking/unliking card: ${err}`);
    });
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = postDeleteModal.querySelector(".modal__btn_delete");
  submitBtn.textContent = "Deleting...";
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
    })
    .catch((err) => {
      console.error(`Error deleting card: ${err}`);
    })
    .finally(() => {
      closeModal(postDeleteModal);
      submitBtn.textContent = "Delete";
    });
}

postDeleteModalForm.addEventListener("submit", handleDeleteSubmit);

enableValidation(validationConfig);
