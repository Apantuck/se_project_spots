const profileEditBtn = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__name");
const profileDesc = document.querySelector(".profile__description");
const profileModal = document.querySelector("#edit-profile-modal");
const profileModalForm = profileModal.querySelector(".modal__form");
const profileModalCloseBtn = profileModal.querySelector(".modal__close-btn");
const profileModalNameInput = profileModalForm.querySelector(
  "#profile-name-input"
);
const profileModalDescInput = profileModalForm.querySelector(
  "#profile-description-input"
);

const postNewBtn = document.querySelector(".profile__add-btn");
const postModal = document.querySelector("#new-post-modal");
const postModalForm = postModal.querySelector(".modal__form");
const postModalCloseBtn = postModal.querySelector(".modal__close-btn");
const postModalLinkInput = postModalForm.querySelector("#post-link-input");
const postModalCaptionInput = postModalForm.querySelector(
  "#post-caption-input"
);

const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

// Helper functions

function openModal(modal) {
  modal.classList.add("modal_is-opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
}

// Profile

profileEditBtn.addEventListener("click", function () {
  openModal(profileModal);
  profileModalNameInput.value = profileName.textContent;
  profileModalDescInput.value = profileDesc.textContent;
});

profileModalCloseBtn.addEventListener("click", function () {
  closeModal(profileModal);
});

profileModalForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  profileName.textContent = profileModalNameInput.value;
  profileDesc.textContent = profileModalDescInput.value;
  closeModal(profileModal);
});

// Posts

postNewBtn.addEventListener("click", function () {
  openModal(postModal);
});

postModalCloseBtn.addEventListener("click", function () {
  closeModal(postModal);
});

postModalForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  console.log(postModalLinkInput.value);
  console.log(postModalCaptionInput.value);
  closeModal(postModal);
  postModalForm.reset();
});

initialCards.forEach(function (card) {
  console.log(card.name);
});
