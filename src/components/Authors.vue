<template>
  <div class="w-1/2 mx-auto mt-5 p-4 h-auto">
    <h1 class="text-2xl text-white">All Authors ({{ authors.length }})</h1>
    <hr class="mt-3 mb-5">
    <div>
      <div v-if="isLoading">
        <p class="text-white">Loading...</p>
      </div>
      <div v-else class="grid grid-cols-3 gap-4">
        <div
          v-for="(author, index) in authors"
          :key="index"
          class="rounded-md h-[200px] bg-[blue] flex flex-col justify-between"
          :style="{ backgroundColor: author.gender === 'Female' ? 'pink' : 'blue' }"
          @click="viewAuthor(author.id)"
          style="cursor: pointer;"
        >
          <div>
            <p class="text-left text-white pl-2 pt-2">
              <span v-if="author.postCount > 1">Total Posts: {{ author.postCount }}</span>
              <span v-else>Total Post: {{ author.postCount }}</span>
            </p>
            <div class="relative flex items-center justify-center w-full h-[70%]">
              <i
                v-if="author.gender === 'Female'"
                class="fas fa-female text-9xl text-white"
              ></i>
              <i v-else class="fas fa-male text-9xl text-white"></i>
            </div>
          </div>
          <div class="flex justify-center mb-4">
            <router-link
              :to="`/authorPosts/${author.id}`"
              class="text-sm hover:text-blue-400 text-base text-center text-dark"
            >
              {{ author.fullname }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { db } from '../Firebase/index.js';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const authors = ref([]);
    const isLoading = ref(true); 
    const router = useRouter();

    onMounted(async () => {
      await fetchAuthors();
    });

    async function fetchAuthors() {
      const authorsCollection = collection(db, 'authors');
      const q = query(authorsCollection);

      try {
        const querySnapshot = await getDocs(q);
        const fetchedAuthors = [];

        for (const doc of querySnapshot.docs) {
          const authorData = doc.data();

          const postsCollection = collection(db, 'posts');
          const authorPostsQuery = query(postsCollection, where('author', '==', authorData.fullname));
          const authorPostsSnapshot = await getDocs(authorPostsQuery);
          const postCount = authorPostsSnapshot.size;

          const author = {
            id: doc.id,
            fullname: authorData.fullname,
            gender: authorData.gender,
            postCount: postCount
          };
          fetchedAuthors.push(author);
        }

        authors.value = fetchedAuthors;
        isLoading.value = false; 
      } catch (error) {
        console.log('Error getting authors:', error);
      }
    }

    function viewAuthor(authorId) {
      router.push(`/authorPosts/${authorId}`);
    }

    return {
      authors,
      isLoading, 
      viewAuthor
    };
  }
};
</script>

  <style>
  .container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20px;
    max-width: 900px;
    margin: 0 auto;
  }
  
  .box {
    width: 400px;
    margin-top: 20px;
    background-color: #f1f1f1;
    border-radius: 10px;
    text-align: center;
    line-height: 400px;
    border: 1px solid #ccc;
  }
  
  .FeMale {
    background-color: pink;
  }
  
  .Male {
    background-color: blue;
  }
  </style>