<template>
    <div class="register-form mt-3">
        <div v-show="error" class="alert alert-danger">
            {{ errorMsg }}
        </div>
        <div v-show="success" class="alert alert-success">
            {{ successMsg }}
        </div>
      <h2 class="title">Create an Account</h2>
      <form class="form" @submit.prevent="registerUser">
        <div class="input_fields">
          <label for="fullname" class="label">Full Name:</label>
          <input type="text" id="fullname" class="input" v-model="fullname">
        </div>
        <div class="input_fields">
        <label for="gender" class="label">Gender:</label>
        <select id="gender" class="input" v-model="gender">
          <option value="" disabled>Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>
        <div class="input_fields">
          <label for="email" class="label">Email:</label>
          <input type="email" id="email" class="input" v-model="email">
        </div>
        <div class="input_fields">
          <label for="password" class="label">Password:</label>
          <input type="password" id="password" class="input" v-model="password">
        </div>
        <div class="register-form__submit">
          <button class="register-form__button" type="submit">Register</button>
        </div>
      </form>
      <div class="register-form__login-link mt-3">
        Already have an account? 
        <router-link to="login" style="color:blue;">Log in</router-link>
      </div>
    </div>
  </template>

<script setup>
  import { ref } from 'vue';
  import { db } from '../Firebase/index.js';
  import { collection, addDoc } from 'firebase/firestore';
  import { auth } from '../Firebase/index.js';
  import { createUserWithEmailAndPassword } from 'firebase/auth';

  const fullname = ref('');
  const gender = ref('');
  const email = ref('');
  const password = ref('');
  const error = ref(false);
  const errorMsg = ref('');
  const successMsg = ref('');

  const registerUser = async () => {
    if (fullname.value !== '' && email.value !== '' && password.value !== '' && gender.value !== '') {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email.value, password.value);
        
        const authorData = {
          fullname: fullname.value,
          gender: gender.value,
          email: email.value,
          uid: cred.user.uid
        };

        fullname.value = '';
        email.value = '';
        password.value = '';
        gender.value = '';
        successMsg.value = 'Account created successfully.';

        await addDoc(collection(db, 'authors'), authorData);
      } catch (err) {
        error.value = true;
        errorMsg.value = err.message;
      }
    } else {
      error.value = true;
      errorMsg.value = 'Please fill out all the fields';
    }
  };
</script>



<style scoped>
.register-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 1.5rem;
  border: 2px solid #452bd8;
  border-radius: 1.5rem;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
}

.title {
  text-align: center;
  margin-bottom: 1.5rem;
}

.form {
  display: flex;
  flex-direction: column;
}

.input_fields {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.label {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.input {
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
}

.register-form__submit {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.register-form__button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: #fff;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
}

.register-form__login-link {
  text-align: center
}

</style>