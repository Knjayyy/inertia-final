<template>
  <header>
    <nav class="nav-container">
      <div class="nav-left"></div>
      <div class="nav-right">
        <ul v-show="!isSignedIn">
          <li><router-link to="/login" class="nav-link">Login</router-link></li>
          <li><router-link to="/register" class="nav-link">Register</router-link></li>
        </ul>
        <ul v-show="isSignedIn">
          <li><router-link to="/posts" class="nav-link">Posts</router-link></li>
          <li><router-link to="/" class="nav-link">Authors</router-link></li>
          <li class="nav-item dropdown" v-show="isSignedIn" @click="toggleUserMenu">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              {{ fullname ? fullname : 'User' }}
            </a>
            <div class="dropdown-menu dropdown-menu-end" aria-labelledby="user-menu-button" ref="userDropdown">
              <router-link to="/create" class="dropdown-item">Create Post</router-link>
              <router-link to="/authPost" class="dropdown-item">My Posts</router-link>
              <a href="#" @click="logOut" class="dropdown-item">Sign out</a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  </header>
  <router-view />
</template>

<script setup>
import { onAuthStateChanged, signOut } from '@firebase/auth';
import { ref, onMounted, watch } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { auth, db } from './Firebase/index.js';
import { collection, query, where, getDocs } from 'firebase/firestore';
import router from './router';

const isSignedIn = ref(false);
const fullname = ref('');
const gender = ref('');
const email = ref('');
const userDropdown = ref(null); 
onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      isSignedIn.value = true;
      router.push('/');

      const q = query(collection(db, 'authors'), where('uid', '==', user.uid));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        fullname.value = doc.data().fullname;
        gender.value = doc.data().gender;
        email.value = doc.data().email;
      });
    } else {
      router.push('/login');
    }
  });
});

const toggleUserMenu = () => {
  userDropdown.value.classList.toggle('hidden');
};

const logOut = () => {
  signOut(auth).then(() => {
    isSignedIn.value = false;
  });
};
</script>






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
