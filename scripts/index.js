const profileEditBtn = document.querySelector(".profile__edit-btn");
const profileModal = document.querySelector("#edit-profile-modal");
// const profileSubmitBtn = profileModal.querySelector(".modal__submit-btn");
console.log("test");
const profileCloseBtn = profileModal.querySelector(".modal__close-btn");
const newPostBtn = document.querySelector(".profile__add-btn");
const postModal = document.querySelector("#new-post-modal");
const postSubmitBtn = postModal.querySelector(".modal__submit-btn");
const postCloseBtn = postModal.querySelector(".modal__close-btn");

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
});

profileCloseBtn.addEventListener("click", function () {
  closeModal(profileModal);
});

// Posts

newPostBtn.addEventListener("click", function () {
  openModal(postModal);
});

postCloseBtn.addEventListener("click", function () {
  closeModal(postModal);
});
