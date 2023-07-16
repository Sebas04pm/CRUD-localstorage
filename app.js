// Obtener referencias a los elementos del DOM
const userForm = document.getElementById('user-form');
const nameInput = document.getElementById('name-input');
const lastnameInput = document.getElementById('lastname-input');
const phoneInput = document.getElementById('phone-input');
const emailInput = document.getElementById('email-input');
const userTableBody = document.querySelector('#user-table tbody');

// Escuchar el evento submit del formulario para agregar usuarios
userForm.addEventListener('submit', addUser);

// Cargar usuarios existentes al cargar la página
window.addEventListener('load', loadUsers);

function addUser(event) {
  event.preventDefault();

  // Obtener los valores del formulario
  const name = nameInput.value.trim();
  const lastname = lastnameInput.value.trim();
  const phone = phoneInput.value.trim();
  const email = emailInput.value.trim();

  if (name && lastname && phone && email) {
    // Crear un nuevo objeto de usuario
    const user = {
      id: Date.now(),
      name: name,
      lastname: lastname,
      phone: phone,
      email: email
    };

    // Obtener los usuarios existentes desde localStorage
    const users = getUsersFromStorage();

    // Agregar el nuevo usuario al arreglo
    users.push(user);

    // Guardar el arreglo de usuarios en localStorage
    saveUsersToStorage(users);

    // Limpiar el formulario
    nameInput.value = '';
    lastnameInput.value = '';
    phoneInput.value = '';
    emailInput.value = '';

    // Recargar la tabla de usuarios
    loadUsers();
  }
}

function loadUsers() {
  // Limpiar la tabla antes de cargar los usuarios
  userTableBody.innerHTML = '';

  // Obtener los usuarios existentes desde localStorage
  const users = getUsersFromStorage();

  // Crear las filas de la tabla para cada usuario
  users.forEach(function(user) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.lastname}</td>
      <td>${user.phone}</td>
      <td>${user.email}</td>
      <td class="actions">
        <button data-id="${user.id}" class="edit-button">Editar</button>
        <button data-id="${user.id}" class="delete-button">Eliminar</button>
      </td>
    `;
    userTableBody.appendChild(row);
  });

  // Escuchar los eventos de editar y eliminar usuarios
  const editButtons = document.querySelectorAll('.edit-button');
  editButtons.forEach(function(button) {
    button.addEventListener('click', editUser);
  });

  const deleteButtons = document.querySelectorAll('.delete-button');
  deleteButtons.forEach(function(button) {
    button.addEventListener('click', deleteUser);
  });
}

function editUser(event) {
  const userId = parseInt(event.target.dataset.id);

  // Obtener los usuarios existentes desde localStorage
  const users = getUsersFromStorage();

  // Buscar el usuario por su id
  const user = users.find(function(user) {
    return user.id === userId;
  });

  if (user) {
    // Llenar el formulario con los datos del usuario
    nameInput.value = user.name;
    lastnameInput.value = user.lastname;
    phoneInput.value = user.phone;
    emailInput.value = user.email;

    // Eliminar el usuario del arreglo
    const updatedUsers = users.filter(function(user) {
      return user.id !== userId;
    });

    // Guardar el arreglo actualizado en localStorage
    saveUsersToStorage(updatedUsers);

    // Recargar la tabla de usuarios
    loadUsers();
  }
}

function deleteUser(event) {
  const userId = parseInt(event.target.dataset.id);

  // Obtener los usuarios existentes desde localStorage
  const users = getUsersFromStorage();

  // Filtrar el arreglo para eliminar el usuario por su id
  const updatedUsers = users.filter(function(user) {
    return user.id !== userId;
  });

  // Guardar el arreglo actualizado en localStorage
  saveUsersToStorage(updatedUsers);

  // Recargar la tabla de usuarios
  loadUsers();
}

function getUsersFromStorage() {
  const usersJSON = localStorage.getItem('users');
  return usersJSON ? JSON.parse(usersJSON) : [];
}

function saveUsersToStorage(users) {
  localStorage.setItem('users', JSON.stringify(users));
}
