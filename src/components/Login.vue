<template>
  <div class="login-form mt-5">
    <div v-show="error" class="alert alert-danger">
      {{ errorMsg }}
    </div>
    <div v-show="success" class="alert alert-success">
      {{ successMsg }}
    </div>
    <h2 class="title">Login Account</h2>
    <form class="form" @submit.prevent="loginUser">
      <div class="input_field">
        <label for="email" class="label">Email:</label>
        <input type="email" id="email" class="input" v-model="email">
      </div>
      <div class="input_field">
        <label for="password" class="label">Password:</label>
        <input type="password" id="password" class="input" v-model="password">
      </div>
      <div class="login-form__submit">
        <div style="display: flex; flex-direction: column;">
          <button class="login-form__button" type="submit">Login using Email</button>
          <div class="login-form__or" style="text-align: center;">or</div>
          <button class="login-form__button login-form__button--google" type="button" @click.prevent="signInWithGoogle">
            <i class="fab fa-google"></i> Sign in with Google
          </button>
        </div>
      </div>
    </form>
    <div class="login-form__register-link">
      Don't have an account yet?
      <router-link to="register" style="color:blue;">Sign up</router-link>
    </div>
  </div>
</template>


<script setup>
  import { ref } from 'vue'
  import { auth } from '../Firebase/index.js'
  import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup} from '@firebase/auth'
  import router from '../router/index.js'

  const email = ref('')
  const password = ref('')
  const error = ref('')
  const errorMsg = ref('')
  const success = ref('')
  const successMsg = ref('')

  const loginUser = () => {
    if (email.value && password.value) {
      signInWithEmailAndPassword(auth, email.value, password.value)
        .then(() => {
          router.push('/home')
        })
        .catch((err) => {
          error.value = true
          errorMsg.value = err.message
        })
    } else {
      error.value = true
      errorMsg.value = 'Please fill out both email and password fields.'
    }
  }
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    signInWithPopup(auth, provider)
        .then((cred) => {
            router.push('/home')
        })
        .catch((err) => {
            error.value = true
            errorMsg.value = err.message
        })
  }
</script>

<style scoped>
.login-form {
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

.input_field {
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

.login-form__submit {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.login-form__button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: #fff;
  border-radius: 0.5rem;
  border: none;
  font-family: "Product Sans", sans-serif;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  display: block;
  width: 100%;
  margin-bottom: 10px;
}

.login-form__register-link {
  text-align: center;
  margin-top: 1rem;
}
.login-form__button--google {
  background-color: #4285F4;
  color: #FFF;
  border-radius: 5px;
  padding: 10px 20px;
  font-family: "Product Sans", sans-serif;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  display: block;
  width: 100%;
  margin-bottom: 10px;
}

.login-form__button--google i {
  font-size: 24px;
  margin-right: 10px;
}

</style>