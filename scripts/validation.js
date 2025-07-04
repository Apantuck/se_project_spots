const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitBtnSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__btn_disabled",
  inputErrorClass: "modal__input_invalid",
  errorClass: "modal__error_active",
};

const showInputError = (config, formElement, inputElement, errorMsg) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(config.inputErrorClass);
  errorElement.textContent = errorMsg;
  errorElement.classList.add(config.errorClass);
};

const hideInputError = (config, formElement, inputElement) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(config.inputErrorClass);
  errorElement.textContent = "";
  errorElement.classList.remove(config.errorClass);
};

const checkInputValidity = (config, formElement, inputElement) => {
  if (!inputElement.validity.valid) {
    showInputError(
      config,
      formElement,
      inputElement,
      inputElement.validationMessage
    );
  } else {
    hideInputError(config, formElement, inputElement);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

const toggleButtonState = (config, inputList, btnElement) => {
  if (hasInvalidInput(inputList)) {
    btnElement.classList.add(config.inactiveButtonClass);
    btnElement.disabled = true;
  } else {
    btnElement.classList.remove(config.inactiveButtonClass);
    btnElement.disabled = false;
  }
};

// "public" button disable function for index.js
const disableButton = (btnElement) => {
  btnElement.classList.add(settings.inactiveButtonClass);
  btnElement.disabled = true;
  console.log("Button disabled");
};

const resetValidation = (formElement) => {
  hideInputError(
    settings,
    formElement,
    formElement.querySelector(settings.inputSelector)
  );
};

const setEventListeners = (config, formElement) => {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const btnElement = formElement.querySelector(config.submitBtnSelector);

  toggleButtonState(config, inputList, btnElement);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(config, formElement, inputElement);
      toggleButtonState(config, inputList, btnElement);
    });
  });
};

const enableValidation = (config) => {
  const formList = document.querySelectorAll(config.formSelector);

  formList.forEach((formElement) => {
    setEventListeners(settings, formElement);
  });
};

enableValidation(settings);
