<script setup>
  import { onAuthStateChanged, signOut } from '@firebase/auth';
  import { ref, onMounted } from 'vue'
  import { RouterLink, RouterView} from 'vue-router'
  import { auth } from './Firebase/index.js'
  import router from './router'

  const isSignedIn = ref(false)

  onMounted(() => {
    onAuthStateChanged(auth, function (user) {
      if (user) {
        isSignedIn.value = true
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    })
  })

  const logout = () => {
    signOut(auth)
      .then(() => {
        isSignedIn.value = false
      })
  }

</script>
<template>
  <header>
    <nav class="nav-container">
      <div class="nav-left">
      </div>
      <div class="nav-right">
        <ul v-show="!isSignedIn">
          <li><router-link to="/" class="nav-link">Home</router-link></li>
          <li><router-link to="/login" class="nav-link">Login</router-link></li>
        </ul>
        <ul v-show="isSignedIn">
          <li><router-link to="/home" class="nav-link">Home</router-link></li>
          <li><router-link to="/dashboard" class="nav-link">Dashboard</router-link></li>
          <li><a href="/login" class="nav-link" @click="logout">Logout</a></li>
        </ul>
      </div>
    </nav>
  </header>
  <router-view />
</template>

<style scoped>
  header {
    background-color: #39548a;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  }

  .nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .nav-left {
    display: flex;
    align-items: center;
    font-size: 2rem;
    font-weight: bold;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .nav-right {
    display: flex;
    align-items: center;
  }

  nav ul {
    display: flex;
    gap: 1rem;
    margin: 0;
  }

  nav li {
    list-style: none;
  }

  .nav-link {
    color: #fff;
    text-decoration: none;
    padding: 1rem;
    border-radius: 0.5rem;
    transition: all 0.2s ease-in-out;
  }

  .nav-link:hover {
    background-color: #fff;
    color: #1a202c;
  }

  
</style>
