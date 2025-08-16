import {
  enableValidation,
  resetValidation,
  disableButton,
  settings as validationConfig,
} from "../scripts/validation.js";
import "./index.css";
import Api from "../utils/Api.js";

const profileEditBtn = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__name");
const profileDesc = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__avatar");
const profileModal = document.querySelector("#edit-profile-modal");
const profileModalForm = document.forms["edit-profile-form"];
const profileModalNameInput = profileModalForm.querySelector(
  "#profile-name-input"
);
const profileModalDescInput = profileModalForm.querySelector(
  "#profile-description-input"
);

const postNewBtn = document.querySelector(".profile__add-btn");
const postModal = document.querySelector("#new-post-modal");
const postModalForm = document.forms["new-post-form"];
const postModalLinkInput = postModalForm.querySelector("#post-link-input");
const postModalCaptionInput = postModalForm.querySelector(
  "#post-caption-input"
);

// const initialCards = [
//   {
//     name: "Wide view",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
//   },
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
// ];

const cardContainer = document.querySelector(".cards__list");
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "b8331ccb-ac4d-48c9-aa51-9e649e648b96",
    "Content-Type": "application/json",
  },
});

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

// Modal closing functionality

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

profileModalForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  api
    .editUserInfo({
      name: profileModalNameInput.value,
      about: profileModalDescInput.value,
      // todo: avatar
    })
    .then((userData) => {
      profileName.textContent = userData.name;
      profileDesc.textContent = userData.about;
      // todo: avatar
    })
    .catch((err) => {
      console.error(`Error updating user info: ${err}`);
    })
    .finally(() => closeModal(profileModal));
});

// Posts

postNewBtn.addEventListener("click", function () {
  openModal(postModal);
});

postModalForm.addEventListener("submit", function (evt) {
  evt.preventDefault();

  api
    .addNewCard(getCardData())
    .then((card) => {
      const newCard = getCardElement(card);
      cardContainer.prepend(newCard);
    })
    .catch((err) => {
      console.error(`Error adding new card: ${err}`);
    })
    .finally(() => {
      closeModal(postModal);
      postModalForm.reset();
      disableButton(postModalForm.querySelector(".modal__submit-btn"));
      resetValidation(postModalForm);
    });
});

// cards

function getCardData() {
  return {
    link: postModalLinkInput.value,
    name: postModalCaptionInput.value,
    isLiked: false,
    // todo: id, owner, createdAt
  };
}

function getCardElement(data) {
  const cardElement = cardTemplate.content.cloneNode(true);
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
  const cardTitle = cardElement.querySelector(".card__title");
  cardTitle.textContent = data.name;
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  cardLikeBtn.classList.toggle("card__like-btn_liked", data.isLiked);
  cardLikeBtn.addEventListener("click", () =>
    cardLikeBtn.classList.toggle("card__like-btn_liked")
  );
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");
  cardDeleteBtn.addEventListener("click", (evt) =>
    evt.target.closest(".card").remove()
  );
  return cardElement;
}

enableValidation(validationConfig);
